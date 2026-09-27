import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import HTML from "html-parse-stringify";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";

const root = process.cwd();
const imageDir = path.join(root, "public/images");
const files = await fs.readdir(imageDir);
const posts = [];
for (const language of ["default", "ja"]) {
  for (const name of await fs.readdir(path.join(root, "src", language))) {
    if (!/\.(md|mdx)$/.test(name)) continue;
    const file = `src/${language}/${name}`;
    const content = await fs.readFile(path.join(root, file), "utf8");
    const value = matter(content).data.date;
    const date = (
      value instanceof Date ? value.toISOString() : String(value)
    ).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      throw new Error(`Invalid date: ${file}`);
    posts.push({ file, content, date });
  }
}
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
if (process.argv.includes("--check")) {
  const missing = [];
  for (const post of posts) {
    const { data, content } = matter(post.content);
    const check = value => {
      if (typeof value !== "string" || value.startsWith("#")) return;
      const url = new URL(value, "https://blog.junkato.jp/images/");
      if (
        url.origin !== "https://blog.junkato.jp" ||
        !url.pathname.startsWith("/images/")
      )
        return;
      const name = decodeURIComponent(url.pathname.slice("/images/".length));
      if (!files.includes(name)) missing.push(`${post.file}: ${value}`);
    };
    check(data.coverImage);
    const visit = node => {
      for (const key of ["src", "href", "poster", "data"])
        check(node.attrs?.[key]);
      for (const item of node.attrs?.srcset?.split(",") || [])
        check(item.trim().split(/\s+/)[0]);
      node.children?.forEach(visit);
    };
    HTML.parse(
      micromark(content, {
        allowDangerousHtml: true,
        extensions: [gfm()],
        htmlExtensions: [gfmHtml()]
      })
    ).forEach(visit);
  }
  const undated = files.filter(name => !/^\d{4}-\d{2}-\d{2}-/.test(name));
  if (missing.length || undated.length)
    throw new Error(JSON.stringify({ missing, undated }, null, 2));
  console.log(
    `Verified ${files.length} dated images and references in ${posts.length} posts.`
  );
  process.exit(0);
}
const pattern = name =>
  new RegExp(`/images/${escape(name)}(?=[\\s"'<>?#)\\]]|$)`, "g");
const dates = new Map(
  files.map(name => [
    name,
    posts
      .filter(post => pattern(name).test(post.content))
      .map(post => post.date)
      .sort()
  ])
);
const family = name => name.replace(/-\d+x\d+(?=\.[^.]+$)/, "");
const renames = new Map();
for (const name of files) {
  if (/^\d{4}-\d{2}-\d{2}-/.test(name)) continue;
  // Shared images use the earliest referring post; resized variants use their family.
  let date = dates.get(name)[0];
  if (!date)
    date = files
      .filter(other => family(other) === family(name))
      .flatMap(other => dates.get(other))
      .sort()[0];
  if (!date) {
    const history = execFileSync(
      "git",
      ["log", "--follow", "--format=%aI", "--", `public/images/${name}`],
      { cwd: root, encoding: "utf8" }
    )
      .trim()
      .split("\n")
      .filter(Boolean);
    date = history.at(-1)?.slice(0, 10);
  }
  if (!date) throw new Error(`Cannot determine a date for ${name}`);
  const target = `${date}-${name}`;
  if (files.includes(target) || [...renames.values()].includes(target))
    throw new Error(`Collision: ${target}`);
  renames.set(name, target);
}
console.log(JSON.stringify(Object.fromEntries(renames), null, 2));
console.log(
  `${renames.size} image renames${
    process.argv.includes("--write")
      ? " (applying)"
      : " (preview; pass --write to apply)"
  }`
);
if (process.argv.includes("--write")) {
  // Resolve every target first, before touching files.
  for (const [name, target] of renames)
    await fs.rename(path.join(imageDir, name), path.join(imageDir, target));
  for (const post of posts) {
    let updated = post.content;
    for (const [name, target] of renames)
      updated = updated.replace(pattern(name), `/images/${target}`);
    // Some legacy full-size links point to files absent from the archive.
    // Keep the clickable image useful by linking to its existing displayed file.
    const available = new Set(files.map(name => renames.get(name) || name));
    updated = updated.replace(
      /(<a\s+href=")\/images\/([^"?#]+)("[^>]*>\s*<img\s+src=")(\/images\/[^"?#]+)(")/g,
      (match, before, target, middle, src, after) =>
        !available.has(target) && available.has(src.slice("/images/".length))
          ? `${before}${src}${middle}${src}${after}`
          : match
    );
    if (updated !== post.content)
      await fs.writeFile(path.join(root, post.file), updated);
  }
}
