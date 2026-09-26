// @vitest-environment jsdom
import { beforeEach, expect, it } from "vitest";
import {
  checkpointText,
  clearTextCheckpoint,
  restoreText
} from "../src/textCheckpoint";
import type { Recovery } from "../shared/model";
const recovery: Recovery = {
  version: 1,
  post: { path: "src/ja/test.md", sha: "sha", content: "old" },
  original: "remote",
  baseHead: "head",
  images: [],
  deletions: [],
  updatedAt: 1
};
beforeEach(() => sessionStorage.clear());
it("recovers the last keystroke while retaining persisted image changes", () => {
  const newer = {
    ...recovery,
    post: { ...recovery.post, content: "latest 日本語" },
    updatedAt: 2
  };
  checkpointText(newer);
  const stored = {
    ...recovery,
    deletions: [{ path: "public/images/old.png", expectedSha: "image" }]
  };
  expect(restoreText(recovery.post.path, stored)).toEqual({
    ...stored,
    ...newer,
    deletions: stored.deletions
  });
  expect(restoreText(recovery.post.path)?.post.content).toBe("latest 日本語");
  clearTextCheckpoint(recovery);
  expect(restoreText(recovery.post.path)?.post.content).toBe("latest 日本語");
  clearTextCheckpoint(newer);
  expect(restoreText(recovery.post.path)).toBeUndefined();
});
it("does not replace a newer IndexedDB recovery with an older checkpoint", () => {
  checkpointText(recovery);
  const stored = {
    ...recovery,
    updatedAt: 3,
    post: { ...recovery.post, content: "newer" }
  };
  expect(restoreText(recovery.post.path, stored)).toEqual(stored);
});
