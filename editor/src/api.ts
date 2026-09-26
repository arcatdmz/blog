import type {
  Index,
  Post,
  SaveRequest,
  SaveResult,
  Upload,
  PostChange
} from "../shared/model";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: Record<string, string[]>
  ) {
    super(message);
  }
}
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/${path}`, {
      ...init,
      credentials: "same-origin",
      redirect: "error"
    });
  } catch {
    throw new ApiError(
      "Connection or sign-in failed. Your work is kept locally. Open Sign in again in a new tab, then retry.",
      0
    );
  }
  if (!response.headers.get("Content-Type")?.includes("application/json"))
    throw new ApiError(
      "Sign in again through Cloudflare Access, then retry. Your local work is safe.",
      401
    );
  const data = await response.json();
  if (!response.ok)
    throw new ApiError(
      data.error || "Request failed",
      response.status,
      data.details
    );
  return data as T;
}
export const getIndex = () => request<Index>("index");
export const getPost = (path: string, ref?: string) =>
  request<Post>(
    `post?path=${encodeURIComponent(path)}${ref ? `&ref=${ref}` : ""}`
  );
export const commitChanges = (changes: SaveRequest) =>
  request<SaveResult>("save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes)
  });
export const checkSave = (id: string) =>
  request<SaveResult | null>(`save-status?id=${id}`);
export const uploadImage = (path: string, blob: Blob) =>
  request<Upload>(`upload?path=${encodeURIComponent(path)}`, {
    method: "POST",
    headers: { "Content-Type": blob.type || "application/octet-stream" },
    body: blob
  });
export const checkReferences = (paths: string[], post?: PostChange) =>
  request<Record<string, string[]>>("references", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paths, post })
  });
export const remoteImage = (path: string, head: string) =>
  `/api/media?path=${encodeURIComponent(path)}&ref=${head}`;
