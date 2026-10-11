import { lstat, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync } from "fflate";

// ZIP entries are written as regular files; archive symlinks are never created.
export async function extractResources(archive, destination) {
  const root = path.resolve(destination);
  const entries = Object.entries(unzipSync(archive));
  for (const [name] of entries) {
    if (
      !name ||
      name.includes("\\") ||
      name.includes("\0") ||
      path.posix.isAbsolute(name) ||
      /^[a-z]:/i.test(name) ||
      name.split("/").includes("..")
    ) {
      throw new Error(`Unsafe ZIP entry: ${name}`);
    }
    // Refuse existing symlinks at the destination and any entry's ancestors.
    const target = path.resolve(root, name);
    for (let current = target; ; current = path.dirname(current)) {
      const stat = await lstat(current).catch(error => {
        if (error.code !== "ENOENT") throw error;
      });
      if (stat?.isSymbolicLink())
        throw new Error(`Symlink in output path: ${current}`);
      if (current === root) break;
    }
  }
  for (const [name, content] of entries) {
    const target = path.resolve(root, name);
    if (name.endsWith("/")) {
      await mkdir(target, { recursive: true });
    } else {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, content);
    }
  }
}

export async function downloadResources() {
  const headers = {
    "User-Agent": "blog.junkato.jp",
    Accept: "application/vnd.github+json"
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(
    "https://api.github.com/repos/arcatdmz/arcatdmz.github.io/releases/latest",
    {
      headers,
      signal: AbortSignal.timeout(60_000)
    }
  );
  if (!response.ok)
    throw new Error(`GitHub release request failed: ${response.status}`);
  const release = await response.json();
  const assets = release.assets.filter(asset =>
    /^stylesheets-.*\.zip$/.test(asset.name)
  );
  if (assets.length !== 1)
    throw new Error("Expected one stylesheets ZIP release asset");
  console.log(`Downloading arcatdmz/arcatdmz.github.io@${release.tag_name}...`);
  const asset = await fetch(assets[0].browser_download_url, {
    signal: AbortSignal.timeout(60_000)
  });
  if (!asset.ok) throw new Error(`Release download failed: ${asset.status}`);
  const destination = fileURLToPath(new URL("../public/", import.meta.url));
  await extractResources(
    new Uint8Array(await asset.arrayBuffer()),
    destination
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await downloadResources();
}
