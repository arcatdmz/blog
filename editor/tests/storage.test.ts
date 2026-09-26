import "fake-indexeddb/auto";
import { expect, it } from "vitest";
import {
  listRecovery,
  putRecovery,
  deleteRecovery,
  cachePost,
  getCachedPost
} from "../src/storage";
import type { Recovery } from "../shared/model";

it("stores text, binary uploads, deletion revisions and pending operation IDs together", async () => {
  const recovery: Recovery = {
    version: 1,
    post: { path: "src/ja/test.md", sha: "old", content: "Japanese 日本語" },
    original: "original",
    baseHead: "head",
    images: [
      {
        path: "public/images/a.jpg",
        blob: new Blob([new Uint8Array([255, 216, 255, 1])], {
          type: "image/jpeg"
        })
      }
    ],
    deletions: [{ path: "public/images/b.jpg", expectedSha: "old-image" }],
    updatedAt: 123,
    saveId: "save-id"
  };
  await putRecovery(recovery);
  const restored = (await listRecovery()).find(
    r => r.post.path === recovery.post.path
  )!;
  expect(restored.post.content).toBe(recovery.post.content);
  expect(restored.deletions).toEqual(recovery.deletions);
  expect(restored.saveId).toBe("save-id");
  expect(restored.images[0].blob.type).toBe("image/jpeg");
  expect([
    ...new Uint8Array(await restored.images[0].blob.arrayBuffer())
  ]).toEqual([255, 216, 255, 1]);
  await deleteRecovery(recovery.post.path);
  expect(
    (await listRecovery()).find(r => r.post.path === recovery.post.path)
  ).toBeUndefined();
});
it("does not resurrect recovery when deleted during asynchronous image serialization", async () => {
  let finish!: (value: ArrayBuffer) => void;
  const blob = new Blob(["image"], { type: "image/png" });
  blob.arrayBuffer = () => new Promise(resolve => { finish = resolve; });
  const recovery: Recovery = {
    version: 1,
    post: { path: "src/ja/queued.md", sha: null, content: "pending" },
    original: "", baseHead: "head", updatedAt: 1,
    images: [{ path: "public/images/queued.png", blob }], deletions: []
  };
  const write = putRecovery(recovery);
  await Promise.resolve();
  const remove = deleteRecovery(recovery.post.path);
  finish(new ArrayBuffer(5));
  await Promise.all([write, remove]);
  expect((await listRecovery()).some(r => r.post.path === recovery.post.path)).toBe(false);
});
it("keys cached post bodies by Git revision", async () => {
  await cachePost({ path: "src/ja/test.md", sha: "one", content: "first" });
  await cachePost({ path: "src/ja/test.md", sha: "two", content: "second" });
  expect((await getCachedPost("one"))?.content).toBe("first");
  expect((await getCachedPost("two"))?.content).toBe("second");
});
