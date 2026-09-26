import {
  BRANCH,
  REPOSITORY,
  isMediaPath,
  isReferencePostPath,
  type Entry
} from "../shared/model";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}
export interface Snapshot {
  head: string;
  tree: string;
  entries: Entry[];
}

export class GitHub {
  constructor(
    private token: string,
    private fetcher: typeof fetch = fetch
  ) {}
  async request<T = any>(
    path: string,
    method = "GET",
    body?: unknown
  ): Promise<T> {
    // Workers' native fetch rejects a GitHub instance as its `this` receiver.
    const response = await this.fetcher.call(globalThis,
      `https://api.github.com${path === "/graphql" ? path : `/repos/${REPOSITORY}${path}`}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "junkato-blog-editor",
          ...(body === undefined ? {} : { "Content-Type": "application/json" })
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) })
      }
    );
    if (!response.ok) {
      if (response.status === 409 || response.status === 422)
        throw new HttpError(
          409,
          "GitHub changed during this operation. Your local work is safe; reload the remote version to compare."
        );
      if (response.status === 404)
        throw new HttpError(
          404,
          "The requested file or repository was not found."
        );
      if (response.status === 403 || response.status === 429)
        throw new HttpError(
          503,
          "GitHub access was refused or rate limited. Check the repository token or try again later."
        );
      throw new HttpError(
        502,
        "GitHub could not complete the request. Your local work is safe."
      );
    }
    return response.json() as Promise<T>;
  }
  async snapshot(ref?: string): Promise<Snapshot> {
    const head =
      ref ?? (await this.request(`/git/ref/heads/${BRANCH}`)).object.sha;
    const commit = await this.request(`/git/commits/${head}`);
    const result = await this.request(
      `/git/trees/${commit.tree.sha}?recursive=1`
    );
    if (result.truncated)
      throw new HttpError(
        503,
        "The repository tree is too large to read completely. No changes were made."
      );
    const entries = result.tree.filter(
      (e: any) => isReferencePostPath(e.path) || isMediaPath(e.path)
    );
    if (
      entries.some(
        (e: any) => e.type !== "blob" || !["100644", "100755"].includes(e.mode)
      )
    )
      throw new HttpError(
        422,
        "Content paths must be regular files, not symlinks or directories."
      );
    return { head, tree: commit.tree.sha, entries };
  }
  async post(path: string, ref = BRANCH) {
    const data = await this.request(
      `/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(ref)}`
    );
    if (data.type !== "file" || data.encoding !== "base64")
      throw new HttpError(422, "Cannot read this file as a Markdown document.");
    return {
      path,
      sha: data.sha as string,
      content: new TextDecoder().decode(fromBase64(data.content))
    };
  }
  async texts(entries: Entry[]): Promise<Map<string, string>> {
    const texts = new Map<string, string>();
    // Batched queries avoid one REST subrequest per post during deletion checks.
    for (let offset = 0; offset < entries.length; offset += 20) {
      const batch = entries.slice(offset, offset + 20);
      const fields = batch
        .map(
          (e, i) =>
            `p${i}: object(oid: ${JSON.stringify(e.sha)}) { ... on Blob { text isBinary } }`
        )
        .join("\n");
      const result = await this.request("/graphql", "POST", {
        query: `query { repository(owner: "arcatdmz", name: "blog") { ${fields} } }`
      });
      if (result.errors || !result.data?.repository)
        throw new HttpError(
          503,
          "Could not check every post for image references. Deletion is blocked until the check succeeds."
        );
      batch.forEach((entry, i) => {
        const blob = result.data.repository[`p${i}`];
        if (!blob || blob.isBinary || typeof blob.text !== "string")
          throw new HttpError(503, `Could not inspect ${entry.path}.`);
        texts.set(entry.path, blob.text);
      });
    }
    return texts;
  }
}

export function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value.replace(/\s/g, "")), c => c.charCodeAt(0));
}
export function toBase64(bytes: Uint8Array): string {
  let result = "";
  for (let i = 0; i < bytes.length; i += 8192)
    result += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(result);
}
