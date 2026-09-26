import { describe, expect, it } from "vitest";
import { newDocument } from "../shared/document";
import { type SaveRequest } from "../shared/model";
import { references, save, uploadReceipt, validateSave } from "../worker/save";
import { blobHash, RepositoryFixture } from "./github-fixture";

const postPath = "src/ja/2024-01-01-test.md";
const original = newDocument("Test", "2024-01-01");
function fixture() {
  return new RepositoryFixture({
    [postPath]: original,
    "README.md": "untouched",
    "public/images/old.jpg": "old-image"
  });
}
function request(repository: RepositoryFixture): SaveRequest {
  return {
    id: crypto.randomUUID(),
    baseHead: repository.head,
    post: {
      path: postPath,
      expectedSha: blobHash(original),
      content: original + "New text\n"
    },
    uploads: [],
    deletions: []
  };
}

describe("atomic GitHub saves", () => {
  it("commits post, upload and deletion in one branch update while preserving other files", async () => {
    const repository = fixture();
    const before = repository.head;
    const data = request(repository);
    const sha = blobHash("new-image");
    repository.blobs.set(sha, "new-image");
    data.uploads = [
      {
        path: "public/images/new.jpg",
        sha,
        receipt: await uploadReceipt("test-token", "public/images/new.jpg", sha)
      }
    ];
    data.deletions = [
      { path: "public/images/old.jpg", expectedSha: blobHash("old-image") }
    ];
    const result = await save(repository.github(), "test-token", data);
    expect(result.commit).not.toBe(before);
    expect(repository.files()[postPath]).toBe(blobHash(data.post!.content));
    expect(repository.files()["public/images/new.jpg"]).toBe(sha);
    expect(repository.files()["public/images/old.jpg"]).toBeUndefined();
    expect(repository.files()["README.md"]).toBe(blobHash("untouched"));
    expect(repository.requests.filter(r => r.method === "PATCH")).toHaveLength(
      1
    );
    expect(
      repository.requests.find(r => r.method === "PATCH")?.body.force
    ).toBe(false);
  });
  it("leaves the branch unchanged on an interrupted save", async () => {
    const repository = fixture();
    const before = repository.head;
    repository.failTrees = true;
    await expect(
      save(repository.github(), "test-token", request(repository))
    ).rejects.toMatchObject({ status: 502 });
    expect(repository.head).toBe(before);
    expect(repository.requests.some(r => r.method === "PATCH")).toBe(false);
  });
  it("rejects a stale post and a concurrent branch update", async () => {
    const repository = fixture();
    const before = repository.head;
    const data = request(repository);
    data.post!.expectedSha = "a".repeat(40);
    await expect(
      save(repository.github(), "test-token", data)
    ).rejects.toMatchObject({ status: 409 });
    repository.race = true;
    await expect(
      save(repository.github(), "test-token", request(repository))
    ).rejects.toMatchObject({ status: 409 });
    expect(repository.head).toBe(before);
  });
  it("does not repeat a committed operation when its response was lost", async () => {
    const repository = fixture();
    const data = request(repository);
    const first = await save(repository.github(), "test-token", data);
    const second = await save(repository.github(), "test-token", data);
    expect(second.commit).toBe(first.commit);
    expect(repository.requests.filter(r => r.method === "PATCH")).toHaveLength(
      1
    );
  });
  it("does not create a commit for unchanged content", async () => {
    const repository = fixture();
    const data = request(repository);
    data.post!.content = original;
    const result = await save(repository.github(), "test-token", data);
    expect(result.unchanged).toBe(true);
    expect(repository.requests.some(r => r.method === "PATCH")).toBe(false);
  });
  it("blocks duplicate filenames and forged upload receipts", async () => {
    const repository = fixture();
    const data = request(repository);
    const sha = "b".repeat(40);
    data.uploads = [
      {
        path: "public/images/old.jpg",
        sha,
        receipt: await uploadReceipt("test-token", "public/images/old.jpg", sha)
      }
    ];
    await expect(
      save(repository.github(), "test-token", data)
    ).rejects.toMatchObject({ status: 409 });
    data.uploads[0].path = "public/images/new.jpg";
    await expect(
      save(repository.github(), "test-token", data)
    ).rejects.toMatchObject({ status: 422 });
    expect(repository.requests.some(r => r.method === "PATCH")).toBe(false);
  });
  it("checks references across languages and incorporates pending post edits", async () => {
    const otherPath = "src/default/2024-01-01-other.md";
    const repository = new RepositoryFixture({
      [postPath]: original + "![](/images/old.jpg)\n",
      [otherPath]: original + '<figure><img src="/images/old.jpg" /></figure>',
      "public/images/old.jpg": "old-image"
    });
    const data = request(repository);
    data.post!.expectedSha = repository.files()[postPath];
    data.deletions = [
      { path: "public/images/old.jpg", expectedSha: blobHash("old-image") }
    ];
    await expect(
      save(repository.github(), "test-token", data)
    ).rejects.toMatchObject({
      status: 422,
      details: { "public/images/old.jpg": [otherPath] }
    });
    const refs = await references(
      repository.github(),
      await repository.github().snapshot(),
      ["public/images/old.jpg"],
      data.post
    );
    expect(refs["public/images/old.jpg"]).toEqual([otherPath]);
    repository.failTexts = true;
    await expect(
      save(repository.github(), "test-token", data)
    ).rejects.toMatchObject({ status: 503 });
  });
  it("allows removing the final reference and deleting its image in the same commit", async () => {
    const content = original + "![](/images/old.jpg)\n";
    const repository = new RepositoryFixture({
      [postPath]: content,
      "public/images/old.jpg": "old-image"
    });
    const data = request(repository);
    data.post!.expectedSha = blobHash(content);
    data.post!.content = original;
    data.deletions = [
      { path: "public/images/old.jpg", expectedSha: blobHash("old-image") }
    ];
    await save(repository.github(), "test-token", data);
    expect(repository.files()["public/images/old.jpg"]).toBeUndefined();
  });
  it("also checks legacy Unicode and mdx source filenames before deletion", async () => {
    const repository = new RepositoryFixture({
      [postPath]: original,
      "src/ja/旧記事.mdx": original + "![](/images/old.jpg)",
      "public/images/old.jpg": "old-image"
    });
    const data = request(repository);
    data.deletions = [
      { path: "public/images/old.jpg", expectedSha: blobHash("old-image") }
    ];
    await expect(
      save(repository.github(), "test-token", data)
    ).rejects.toMatchObject({
      status: 422,
      details: { "public/images/old.jpg": ["src/ja/旧記事.mdx"] }
    });
  });
  it("validates new filenames and never accepts paths outside the content directories", () => {
    const data = request(fixture());
    data.post!.path = ".github/workflows/publish.yml";
    expect(() => validateSave(data)).toThrow();
    data.post!.path = "src/ja/2025-01-01-new.md";
    data.post!.expectedSha = null;
    expect(() => validateSave(data)).toThrow(/match/);
    data.post!.path = "src/ja/2024-01-01-new.md";
    expect(() => validateSave(data)).not.toThrow();
  });
});
