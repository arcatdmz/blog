import { createHash } from "node:crypto";
import { GitHub } from "../worker/github";

const hash = (value: string) => createHash("sha1").update(value).digest("hex");
export const blobHash = (value: string) =>
  hash(`blob ${Buffer.byteLength(value)}\0${value}`);

export class RepositoryFixture {
  head: string;
  trees = new Map<string, Record<string, string>>();
  commits = new Map<
    string,
    { tree: { sha: string }; message: string; parents: string[] }
  >();
  blobs = new Map<string, string>();
  requests: { path: string; method: string; body: any }[] = [];
  race = false;
  failTrees = false;
  failTexts = false;
  constructor(files: Record<string, string>) {
    const tree = Object.fromEntries(
      Object.entries(files).map(([path, content]) => {
        const sha = blobHash(content);
        this.blobs.set(sha, content);
        return [path, sha];
      })
    );
    const treeSha = hash(JSON.stringify(tree));
    this.trees.set(treeSha, tree);
    this.head = hash("initial");
    this.commits.set(this.head, {
      tree: { sha: treeSha },
      message: "initial",
      parents: []
    });
  }
  files() {
    return this.trees.get(this.commits.get(this.head)!.tree.sha)!;
  }
  github() {
    return new GitHub("test-token", this.fetch as typeof fetch);
  }
  fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    const route = url.pathname.replace("/repos/arcatdmz/blog", "");
    const method = init?.method || "GET";
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    this.requests.push({ path: route, method, body });
    const json = (data: any, status = 200) => Response.json(data, { status });
    if (route === "/git/ref/heads/main")
      return json({ object: { sha: this.head } });
    if (route === "/commits")
      return json(
        [...this.commits.entries()]
          .reverse()
          .map(([sha, commit]) => ({ sha, commit }))
      );
    if (route.startsWith("/git/commits/") && method === "GET")
      return json(this.commits.get(route.split("/").pop()!));
    if (route.startsWith("/git/trees/") && method === "GET")
      return json({
        truncated: false,
        tree: Object.entries(this.trees.get(route.split("/").pop()!)!).map(
          ([path, sha]) => ({ path, sha, type: "blob", mode: "100644" })
        )
      });
    if (route === "/git/blobs" && method === "POST") {
      const text =
        body.encoding === "base64"
          ? Buffer.from(body.content, "base64").toString()
          : body.content;
      const sha = blobHash(text);
      this.blobs.set(sha, text);
      return json({ sha });
    }
    if (route === "/git/trees" && method === "POST") {
      if (this.failTrees) return json({ error: "failure" }, 500);
      const tree = { ...this.trees.get(body.base_tree) };
      for (const entry of body.tree) {
        if (entry.sha === null) delete tree[entry.path];
        else tree[entry.path] = entry.sha;
      }
      const sha = hash(JSON.stringify(tree));
      this.trees.set(sha, tree);
      return json({ sha });
    }
    if (route === "/git/commits" && method === "POST") {
      const sha = hash(JSON.stringify(body));
      this.commits.set(sha, { ...body, tree: { sha: body.tree } });
      return json({ sha });
    }
    if (route === "/git/refs/heads/main" && method === "PATCH") {
      if (this.race || this.commits.get(body.sha)!.parents[0] !== this.head)
        return json({}, 422);
      this.head = body.sha;
      return json({ object: { sha: this.head } });
    }
    if (route === "/graphql") {
      if (this.failTexts) return json({ errors: [{ message: "unavailable" }] });
      const repository: Record<string, any> = {};
      for (const match of body.query.matchAll(
        /(p\d+): object\(oid: "([a-f0-9]+)"\)/g
      ))
        repository[match[1]] = {
          text: this.blobs.get(match[2]),
          isBinary: false
        };
      return json({ data: { repository } });
    }
    throw new Error(`Unexpected GitHub request: ${method} ${route}`);
  };
}
