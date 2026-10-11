import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import matter from "../lib/frontmatter.mjs";

test("parses CRLF, BOM, timestamps, multiline text and preserves Markdown", () => {
  const content = "\r\n# 本文\r\n---\r\n";
  const source =
    "\uFEFF---\r\ntitle: 日本語\r\ndate: 2026-10-11\r\ndraft: false\r\ntags: [one, two]\r\nsummary: |\r\n  first\r\n  second\r\n---\r\n" +
    content;
  const parsed = matter(source);
  assert.equal(parsed.content, content);
  assert.equal(parsed.data.title, "日本語");
  assert.equal(parsed.data.date.toISOString(), "2026-10-11T00:00:00.000Z");
  assert.equal(parsed.data.draft, false);
  assert.deepEqual(parsed.data.tags, ["one", "two"]);
  assert.equal(parsed.data.summary, "first\nsecond\n");
  assert.deepEqual(matter(matter.stringify(content, parsed.data)), parsed);
});

test("handles absent or empty frontmatter and rejects malformed metadata", () => {
  assert.deepEqual(matter("# Plain Markdown\n---\n"), {
    data: {},
    content: "# Plain Markdown\n---\n"
  });
  assert.deepEqual(matter("---\n---\nBody"), { data: {}, content: "Body" });
  assert.throws(() => matter("---\ntitle: unfinished"), /Unclosed/);
  assert.throws(() => matter("---\n- not a mapping\n---\n"), /mapping/);
  assert.throws(() => matter("---\ntitle: one\ntitle: two\n---\n"));
});

test("all existing articles round-trip without changing metadata or content", async () => {
  for (const language of ["default", "ja"]) {
    const directory = new URL(`../src/${language}/`, import.meta.url);
    for (const file of await readdir(directory)) {
      const original = matter(await readFile(new URL(file, directory), "utf8"));
      assert.deepEqual(
        matter(matter.stringify(original.content, original.data)),
        original,
        `${language}/${file}`
      );
    }
  }
});
