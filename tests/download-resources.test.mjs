import assert from "node:assert/strict";
import {
  lstat,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { strToU8, zipSync } from "fflate";
import { extractResources } from "../scripts/download-resources.mjs";

async function temporary(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "blog-resources-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test("extracts stylesheet directories and replaces regular files", async t => {
  const directory = await temporary(t);
  const archive = zipSync({
    "stylesheets/main.css": strToU8("body { color: red; }")
  });
  await extractResources(archive, directory);
  await extractResources(archive, directory);
  assert.equal(
    await readFile(path.join(directory, "stylesheets/main.css"), "utf8"),
    "body { color: red; }"
  );
});

test("rejects ZIP path traversal and absolute paths", async t => {
  const directory = await temporary(t);
  for (const name of [
    "../outside",
    "/absolute",
    "C:/absolute",
    "nested/../../outside",
    "..\\outside"
  ]) {
    await assert.rejects(
      extractResources(zipSync({ [name]: strToU8("unsafe") }), directory),
      /Unsafe ZIP entry/
    );
  }
});

test("refuses existing symlinks in output files and directories", async t => {
  const directory = await temporary(t);
  const outside = await temporary(t);
  await writeFile(path.join(outside, "keep.css"), "unchanged");
  await symlink(outside, path.join(directory, "linked"));
  await symlink(
    path.join(outside, "keep.css"),
    path.join(directory, "keep.css")
  );
  for (const name of ["linked/keep.css", "keep.css"]) {
    await assert.rejects(
      extractResources(zipSync({ [name]: strToU8("changed") }), directory),
      /Symlink/
    );
  }
  assert.equal(
    await readFile(path.join(outside, "keep.css"), "utf8"),
    "unchanged"
  );
});

test("archive symlink attributes cannot create filesystem symlinks", async t => {
  const directory = await temporary(t);
  const archive = zipSync({
    link: [strToU8("../outside"), { os: 3, attrs: 0o120777 << 16 }]
  });
  await extractResources(archive, directory);
  assert.equal(
    (await lstat(path.join(directory, "link"))).isSymbolicLink(),
    false
  );
});
