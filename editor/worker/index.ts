import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  isPostPath,
  isMediaPath,
  MAX_IMAGE_BYTES,
  MAX_POST_BYTES,
  imageMime,
  mimeMatchesPath
} from "../shared/model";
import { GitHub, HttpError, fromBase64, toBase64 } from "./github";
import {
  references,
  save,
  savedOperation,
  uploadReceipt,
  validateSave
} from "./save";

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  ACCESS_TEAM_DOMAIN: string;
  ACCESS_AUD: string;
  ALLOWED_EMAIL: string;
  GITHUB_TOKEN: string;
  LOCAL_DEMO?: string;
}
const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
const shaPattern = /^[a-f0-9]{40}$/;

export async function authenticate(request: Request, env: Env) {
  if (
    !/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(
      env.ACCESS_TEAM_DOMAIN || ""
    ) ||
    !env.ACCESS_AUD ||
    !env.ALLOWED_EMAIL
  )
    throw new HttpError(
      503,
      "Cloudflare Access is not configured. See the editor setup guide."
    );
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token)
    throw new HttpError(
      401,
      "Sign in through Cloudflare Access, then retry. Local edits have been kept."
    );
  try {
    let keys = keySets.get(env.ACCESS_TEAM_DOMAIN);
    if (!keys) {
      keys = createRemoteJWKSet(
        new URL(`${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`)
      );
      keySets.set(env.ACCESS_TEAM_DOMAIN, keys);
    }
    const { payload } = await jwtVerify(token, keys, {
      issuer: env.ACCESS_TEAM_DOMAIN,
      audience: env.ACCESS_AUD,
      algorithms: ["RS256"]
    });
    if (
      typeof payload.email !== "string" ||
      payload.email.toLowerCase() !== env.ALLOWED_EMAIL.toLowerCase()
    )
      throw new Error();
  } catch {
    throw new HttpError(
      401,
      "Your Access session is missing, expired, or not allowed. Sign in again; local edits have been kept."
    );
  }
}

async function readBytes(request: Request, limit: number): Promise<Uint8Array> {
  if (Number(request.headers.get("Content-Length")) > limit)
    throw new HttpError(
      413,
      "The upload is too large. Optimize the image or select a smaller file."
    );
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "A request body is required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new HttpError(
        413,
        "Request too large. Images must be at most 10 MiB."
      );
    }
    chunks.push(value);
  }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
async function readJson(request: Request): Promise<any> {
  if (!request.headers.get("Content-Type")?.startsWith("application/json"))
    throw new HttpError(415, "Expected a JSON request.");
  try {
    return JSON.parse(
      new TextDecoder().decode(await readBytes(request, MAX_POST_BYTES * 2))
    );
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "Invalid JSON request.");
  }
}

export async function api(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (!env.GITHUB_TOKEN)
    throw new HttpError(
      503,
      "The GitHub token is not configured on the Worker."
    );
  const github = new GitHub(env.GITHUB_TOKEN);
  if (request.method === "GET" && url.pathname === "/api/index") {
    const snapshot = await github.snapshot();
    return Response.json({
      head: snapshot.head,
      posts: snapshot.entries.filter(e => isPostPath(e.path)),
      media: snapshot.entries.filter(e => isMediaPath(e.path))
    });
  }
  if (request.method === "GET" && url.pathname === "/api/post") {
    const path = url.searchParams.get("path") || "";
    const ref = url.searchParams.get("ref");
    if (!isPostPath(path) || (ref !== null && !shaPattern.test(ref)))
      throw new HttpError(400, "Invalid post path or revision.");
    return Response.json(await github.post(path, ref ?? undefined));
  }
  if (request.method === "GET" && url.pathname === "/api/media") {
    const path = url.searchParams.get("path") || "";
    const ref = url.searchParams.get("ref");
    if (!isMediaPath(path) || !ref || !shaPattern.test(ref))
      throw new HttpError(400, "Invalid image path or revision.");
    const file = await github.request(
      `/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${ref}`
    );
    if (file.type !== "file" || file.size > MAX_IMAGE_BYTES)
      throw new HttpError(
        413,
        "This image cannot be previewed (10 MiB limit)."
      );
    // Contents responses omit base64 data for files larger than 1 MiB.
    const blob =
      file.encoding === "base64" && file.content
        ? file
        : await github.request(`/git/blobs/${file.sha}`);
    const bytes = fromBase64(blob.content);
    const mime = imageMime(bytes);
    if (!mime) throw new HttpError(415, "Unsupported image format.");
    return new Response(bytes as BodyInit, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "private, max-age=86400",
        "X-Content-Type-Options": "nosniff"
      }
    });
  }
  if (request.method === "GET" && url.pathname === "/api/save-status")
    return Response.json(
      await savedOperation(github, url.searchParams.get("id") || "")
    );
  if (request.method === "POST" && url.pathname === "/api/upload") {
    const path = url.searchParams.get("path") || "";
    if (!isMediaPath(path))
      throw new HttpError(400, "Use a safe JPEG, PNG, WebP, or GIF filename.");
    const bytes = await readBytes(request, MAX_IMAGE_BYTES);
    const mime = imageMime(bytes);
    if (!mime || !mimeMatchesPath(mime, path))
      throw new HttpError(
        415,
        "The image contents do not match its filename. Select or convert a valid image."
      );
    const result = await github.request("/git/blobs", "POST", {
      content: toBase64(bytes),
      encoding: "base64"
    });
    return Response.json({
      path,
      sha: result.sha,
      receipt: await uploadReceipt(env.GITHUB_TOKEN, path, result.sha)
    });
  }
  if (request.method === "POST" && url.pathname === "/api/references") {
    const data = await readJson(request);
    if (
      !Array.isArray(data.paths) ||
      data.paths.length > 30 ||
      !data.paths.every((p: unknown) => typeof p === "string" && isMediaPath(p))
    )
      throw new HttpError(400, "Invalid reference-check request.");
    if (data.post)
      validateSave({
        id: "00000000-0000-0000-0000-000000000000",
        baseHead: "0".repeat(40),
        post: data.post,
        uploads: [],
        deletions: []
      });
    return Response.json(
      await references(github, await github.snapshot(), data.paths, data.post)
    );
  }
  if (request.method === "POST" && url.pathname === "/api/save")
    return Response.json(
      await save(github, env.GITHUB_TOKEN, await readJson(request))
    );
  throw new HttpError(404, "Unknown editor API operation.");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const local =
      import.meta.env.DEV &&
      env.LOCAL_DEMO === "true" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    let response: Response;
    try {
      if (!local) await authenticate(request, env);
      if (
        !["GET", "HEAD"].includes(request.method) &&
        request.headers.get("Origin") !== url.origin
      )
        throw new HttpError(403, "Cross-origin changes are not allowed.");
      if (url.pathname.startsWith("/api/")) {
        if (local) response = await (await import("./demo")).demo(request);
        else response = await api(request, env);
      } else if (!["GET", "HEAD"].includes(request.method))
        throw new HttpError(405, "Method not allowed.");
      else response = await env.ASSETS.fetch(request);
    } catch (error) {
      const known = error instanceof HttpError;
      response = Response.json(
        {
          error: known
            ? error.message
            : "The operation failed. Your local work is safe; please retry.",
          ...(known && error.details ? { details: error.details } : {})
        },
        { status: known ? error.status : 500 }
      );
    }
    const headers = new Headers(response.headers);
    if (!headers.has("Cache-Control")) headers.set("Cache-Control", "no-store");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "no-referrer");
    headers.set("X-Frame-Options", "DENY");
    headers.set(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self'${import.meta.env.DEV ? " 'unsafe-inline'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; connect-src 'self'${import.meta.env.DEV ? " ws: wss:" : ""}; font-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'`
    );
    return new Response(response.body, { status: response.status, headers });
  }
};
