import { readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Keep the directories themselves so this also works with Docker volume mounts.
for (const name of [".next", "out"]) {
  const directory = fileURLToPath(new URL(`../${name}/`, import.meta.url));
  const entries = await readdir(directory).catch(error => {
    if (error.code !== "ENOENT") throw error;
    return [];
  });
  await Promise.all(
    entries.map(entry =>
      rm(path.join(directory, entry), { recursive: true, force: true })
    )
  );
}
