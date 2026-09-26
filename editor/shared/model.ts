export const REPOSITORY = "arcatdmz/blog";
export const BRANCH = "main";
export const WORKFLOW_URL = `https://github.com/${REPOSITORY}/actions/workflows/publish.yml`;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_POST_BYTES = 512 * 1024;
export const MAX_CHANGES = 30;

export interface Entry {
  path: string;
  sha: string;
  size?: number;
}
export interface Index {
  head: string;
  posts: Entry[];
  media: Entry[];
  demo?: boolean;
}
export interface Post {
  path: string;
  sha: string | null;
  content: string;
}
export interface PendingImage {
  path: string;
  blob: Blob;
}
export interface Upload {
  path: string;
  sha: string;
  receipt: string;
}
export interface PostChange {
  path: string;
  expectedSha: string | null;
  content: string;
}
export interface Deletion {
  path: string;
  expectedSha: string;
}
export interface SaveRequest {
  id: string;
  baseHead: string;
  post?: PostChange;
  uploads: Upload[];
  deletions: Deletion[];
}
export interface SaveResult {
  commit: string;
  workflow: string;
  postSha?: string;
  unchanged?: boolean;
}
export interface Recovery {
  version: 1;
  post: Post;
  baseHead: string;
  original: string;
  images: PendingImage[];
  deletions: Deletion[];
  updatedAt: number;
  saveId?: string;
}

export function isPostPath(path: string): boolean {
  return (
    typeof path === "string" &&
    /^src\/(default|ja)\/[A-Za-z0-9][A-Za-z0-9._-]*\.md$/.test(path) &&
    !path.includes("..")
  );
}
/** Include source-only/legacy filenames in deletion checks even if not editable. */
export function isReferencePostPath(path: string): boolean {
  return (
    typeof path === "string" &&
    /^src\/(default|ja)\/[^/]+\.(md|mdx)$/.test(path)
  );
}
export function isMediaPath(path: string): boolean {
  return (
    typeof path === "string" &&
    /^public\/images\/[A-Za-z0-9][A-Za-z0-9._-]*\.(jpe?g|png|webp|gif)$/i.test(
      path
    ) &&
    !path.includes("..")
  );
}
export function imageUrl(path: string) {
  return path.replace(/^public/, "");
}
export function mediaPath(value: string): string | null {
  try {
    const url = new URL(value, "https://blog.junkato.jp/images/");
    if (url.origin !== "https://blog.junkato.jp") return null;
    const path = `public${decodeURIComponent(url.pathname)}`;
    return isMediaPath(path) ? path : null;
  } catch {
    return null;
  }
}
export function safeImageName(name: string): string {
  const dot = name.lastIndexOf(".");
  const extension = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  const stem =
    (dot >= 0 ? name.slice(0, dot) : name)
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || "image";
  return `${stem}${extension}`;
}
export function imageMime(bytes: Uint8Array): string | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "image/jpeg";
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => bytes[i] === n))
    return "image/png";
  const ascii = new TextDecoder().decode(bytes.slice(0, 12));
  if (ascii.startsWith("GIF87a") || ascii.startsWith("GIF89a"))
    return "image/gif";
  if (ascii.startsWith("RIFF") && ascii.slice(8) === "WEBP")
    return "image/webp";
  return null;
}
export function mimeMatchesPath(mime: string, path: string) {
  return (
    {
      "image/jpeg": /\.jpe?g$/i,
      "image/png": /\.png$/i,
      "image/webp": /\.webp$/i,
      "image/gif": /\.gif$/i
    }[mime]?.test(path) ?? false
  );
}
