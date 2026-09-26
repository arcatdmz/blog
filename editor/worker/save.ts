import { SignJWT, jwtVerify } from "jose";
import { splitDocument, validateDocument } from "../shared/document";
import { referencedMedia } from "../shared/references";
import {
  BRANCH,
  REPOSITORY,
  WORKFLOW_URL,
  MAX_CHANGES,
  isPostPath,
  isReferencePostPath,
  isMediaPath,
  type SaveRequest,
  type SaveResult,
  type PostChange,
  type Upload
} from "../shared/model";
import { GitHub, HttpError, type Snapshot } from "./github";

const shaPattern = /^[a-f0-9]{40}$/;
const idPattern = /^[a-f0-9-]{36}$/;
const key = (token: string) => new TextEncoder().encode(token);
export async function uploadReceipt(token: string, path: string, sha: string) {
  return new SignJWT({ path, sha })
    .setProtectedHeader({ alg: "HS256" })
    .setAudience(`${REPOSITORY}:upload`)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key(token));
}
async function verifyUpload(token: string, upload: Upload) {
  try {
    const { payload } = await jwtVerify(upload.receipt, key(token), {
      algorithms: ["HS256"],
      audience: `${REPOSITORY}:upload`
    });
    if (payload.path !== upload.path || payload.sha !== upload.sha)
      throw new Error();
  } catch {
    throw new HttpError(
      422,
      "An upload expired or is invalid. Save again to re-upload the original local file."
    );
  }
}
export function validateSave(data: any): asserts data is SaveRequest {
  if (
    !data ||
    !idPattern.test(data.id) ||
    !shaPattern.test(data.baseHead) ||
    !Array.isArray(data.uploads) ||
    !Array.isArray(data.deletions)
  )
    throw new HttpError(400, "Invalid save request.");
  if (data.uploads.length + data.deletions.length > MAX_CHANGES)
    throw new HttpError(
      400,
      `Save at most ${MAX_CHANGES} media changes at a time.`
    );
  const paths = new Set<string>();
  if (data.post !== undefined) {
    const post = data.post;
    if (
      !post ||
      !isPostPath(post.path) ||
      !(post.expectedSha === null || shaPattern.test(post.expectedSha)) ||
      typeof post.content !== "string"
    )
      throw new HttpError(400, "Invalid post change.");
    try {
      validateDocument(post.content);
    } catch (error) {
      throw new HttpError(422, (error as Error).message);
    }
    if (post.expectedSha === null) {
      const date =
        /^src\/(default|ja)\/(\d{4}-\d{2}-\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.exec(
          post.path
        )?.[2];
      if (!date || splitDocument(post.content).data.date !== date)
        throw new HttpError(
          422,
          "New filenames must use YYYY-MM-DD-ascii-slug.md and match the post date."
        );
    }
    paths.add(post.path);
  }
  for (const upload of data.uploads) {
    if (
      !upload ||
      !isMediaPath(upload.path) ||
      !shaPattern.test(upload.sha) ||
      typeof upload.receipt !== "string" ||
      paths.has(upload.path)
    )
      throw new HttpError(400, "Invalid or duplicate upload path.");
    paths.add(upload.path);
  }
  for (const deletion of data.deletions) {
    if (
      !deletion ||
      !isMediaPath(deletion.path) ||
      !shaPattern.test(deletion.expectedSha) ||
      paths.has(deletion.path)
    )
      throw new HttpError(400, "Invalid or duplicate deletion path.");
    paths.add(deletion.path);
  }
}
export async function references(
  github: GitHub,
  snapshot: Snapshot,
  paths: string[],
  post?: PostChange
) {
  const entries = snapshot.entries.filter(
    e => isReferencePostPath(e.path) && e.path !== post?.path
  );
  const texts = await github.texts(entries);
  if (post) texts.set(post.path, post.content);
  const result: Record<string, string[]> = Object.fromEntries(
    paths.map(path => [path, []])
  );
  for (const [path, content] of texts) {
    let refs: Set<string>;
    try {
      refs = referencedMedia(content);
    } catch {
      throw new HttpError(
        422,
        `Cannot safely check references in ${path}. Fix its frontmatter before deleting images.`
      );
    }
    for (const target of paths) if (refs.has(target)) result[target].push(path);
  }
  return result;
}

export async function savedOperation(
  github: GitHub,
  id: string
): Promise<SaveResult | null> {
  if (!idPattern.test(id)) throw new HttpError(400, "Invalid save identifier.");
  const commits = await github.request(`/commits?sha=${BRANCH}&per_page=100`);
  const match = commits.find((c: any) =>
    c.commit.message.endsWith(`\n\nBlog-Editor-Save: ${id}`)
  );
  return match ? { commit: match.sha, workflow: WORKFLOW_URL } : null;
}

export async function save(
  github: GitHub,
  token: string,
  data: SaveRequest
): Promise<SaveResult> {
  validateSave(data);
  // A lost HTTP response must not create a duplicate commit on retry.
  const alreadySaved = await savedOperation(github, data.id);
  if (alreadySaved) return alreadySaved;
  for (const upload of data.uploads) await verifyUpload(token, upload);
  const snapshot = await github.snapshot();
  const byPath = new Map(snapshot.entries.map(e => [e.path, e]));
  if (
    data.post &&
    (byPath.get(data.post.path)?.sha ?? null) !== data.post.expectedSha
  )
    throw new HttpError(
      409,
      "This post changed on GitHub. Your local version has been kept. Load the remote version to compare before saving."
    );
  for (const upload of data.uploads)
    if (byPath.has(upload.path))
      throw new HttpError(
        409,
        `${upload.path} already exists. Choose a new image filename.`
      );
  for (const deletion of data.deletions)
    if (byPath.get(deletion.path)?.sha !== deletion.expectedSha)
      throw new HttpError(
        409,
        `${deletion.path} changed or was deleted on GitHub. Refresh the media library.`
      );
  if (data.deletions.length) {
    const refs = await references(
      github,
      snapshot,
      data.deletions.map(d => d.path),
      data.post
    );
    if (Object.values(refs).some(posts => posts.length))
      throw new HttpError(
        422,
        "Some images are still referenced by posts. Remove those references before deleting them.",
        refs
      );
  }
  const tree: {
    path: string;
    mode: string;
    type: string;
    sha: string | null;
  }[] = data.uploads.map(u => ({
    path: u.path,
    mode: "100644",
    type: "blob",
    sha: u.sha
  }));
  let postSha: string | undefined;
  if (data.post) {
    const blob = await github.request("/git/blobs", "POST", {
      content: data.post.content,
      encoding: "utf-8"
    });
    postSha = blob.sha;
    if (postSha !== data.post.expectedSha)
      tree.push({
        path: data.post.path,
        mode: "100644",
        type: "blob",
        sha: blob.sha
      });
  }
  tree.push(
    ...data.deletions.map(d => ({
      path: d.path,
      mode: "100644",
      type: "blob",
      sha: null
    }))
  );
  if (!tree.length)
    return {
      commit: snapshot.head,
      workflow: WORKFLOW_URL,
      postSha,
      unchanged: true
    };
  const newTree = await github.request("/git/trees", "POST", {
    base_tree: snapshot.tree,
    tree
  });
  const commit = await github.request("/git/commits", "POST", {
    message: `Update blog content${data.post ? `: ${data.post.path.split("/").pop()}` : ""}\n\nBlog-Editor-Save: ${data.id}`,
    tree: newTree.sha,
    parents: [snapshot.head]
  });
  // This is the ONLY operation that changes the branch. A concurrent commit
  // causes a non-fast-forward rejection; no file is partially published.
  await github.request(`/git/refs/heads/${BRANCH}`, "PATCH", {
    sha: commit.sha,
    force: false
  });
  return { commit: commit.sha, workflow: WORKFLOW_URL, postSha };
}
