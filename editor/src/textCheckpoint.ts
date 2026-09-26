import type { Recovery } from "../shared/model";

const prefix = "blog-editor:text:";
type TextCheckpoint = Pick<
  Recovery,
  "post" | "original" | "baseHead" | "updatedAt" | "saveId"
>;
// Synchronous text-only backup covers reload before the IndexedDB idle timer runs.
// Image bytes remain in IndexedDB, never in the URL or session storage.
export function checkpointText(work: Recovery) {
  const { post, original, baseHead, updatedAt, saveId } = work;
  try {
    sessionStorage.setItem(
      prefix + post.path,
      JSON.stringify({ post, original, baseHead, updatedAt, saveId })
    );
  } catch {
    /* IndexedDB recovery still runs and reports its own failures. */
  }
}
export function restoreText(
  path: string,
  recovery?: Recovery
): Recovery | undefined {
  try {
    const saved = JSON.parse(
      sessionStorage.getItem(prefix + path) || "null"
    ) as TextCheckpoint | null;
    if (
      saved?.post.path === path &&
      typeof saved.post.content === "string" &&
      typeof saved.original === "string" &&
      typeof saved.baseHead === "string" &&
      typeof saved.updatedAt === "number" &&
      (!recovery || saved.updatedAt >= recovery.updatedAt)
    ) {
      return { version: 1, images: [], deletions: [], ...recovery, ...saved };
    }
  } catch {
    /* Ignore unavailable or corrupt optional checkpoints. */
  }
  return recovery;
}
export function clearTextCheckpoint(work: Recovery) {
  try {
    const key = prefix + work.post.path;
    const saved = JSON.parse(
      sessionStorage.getItem(key) || "null"
    ) as TextCheckpoint | null;
    // A completed async write must not clear a more recent keystroke.
    if (
      saved &&
      saved.post.content === work.post.content &&
      saved.updatedAt <= work.updatedAt
    )
      sessionStorage.removeItem(key);
  } catch {
    /* Optional backup. */
  }
}
