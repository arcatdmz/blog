import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  newDocument,
  splitDocument,
  updateMetadata,
  validateDocument
} from "../shared/document";
import { referencedMedia } from "../shared/references";
import { isMediaPath, isPostPath, mediaPath } from "../shared/model";

const root = path.resolve(import.meta.dirname, "../../src");
const posts = ["default", "ja"].flatMap(language =>
  fs
    .readdirSync(path.join(root, language))
    .filter(name => name.endsWith(".md"))
    .map(name => ({
      name: `${language}/${name}`,
      source: fs.readFileSync(path.join(root, language, name), "utf8")
    }))
);

describe("existing blog compatibility", () => {
  for (const post of posts)
    it(`preserves ${post.name}`, () => {
      const parsed = splitDocument(post.source);
      expect(parsed.header + parsed.body).toBe(post.source);
      expect(updateMetadata(post.source, parsed.data)).toBe(post.source);
      expect(() => validateDocument(post.source)).not.toThrow();
      expect(() => referencedMedia(post.source)).not.toThrow();
    });
  it("preserves unknown metadata, comments, and the exact body when editing metadata", () => {
    const source =
      '---\n# Keep me\ntitle: Original\ndate: \'2024-01-01\'\nsummary_generated: Generated\ncustom:\n  value: 4\n---\n\n<figure style="width:12%"><img src="/images/a.jpg" /></figure>\n';
    const edited = updateMetadata(source, { title: "New", draft: true });
    expect(edited).toContain("# Keep me");
    expect(splitDocument(edited).data).toMatchObject({
      summary_generated: "Generated",
      custom: { value: 4 },
      draft: true
    });
    expect(splitDocument(edited).body).toBe(splitDocument(source).body);
  });
  it("retains CRLF and does not treat body delimiters as frontmatter", () => {
    const source =
      newDocument("A", "2024-01-01").replace(/\n/g, "\r\n") + "---\r\nbody";
    expect(updateMetadata(source, { title: "A" })).toBe(source);
    expect(updateMetadata(source, { title: "B" })).not.toMatch(/(?<!\r)\n/);
    expect(() => splitDocument("intro\n---\ntitle: Wrong\n---\n")).toThrow();
  });
  it("rejects duplicate YAML keys, invalid dates and non-string tags", () => {
    expect(() => splitDocument("---\ntitle: One\ntitle: Two\n---\n")).toThrow();
    expect(() => validateDocument(newDocument("A", "2024-02-30"))).toThrow();
    expect(() =>
      validateDocument(
        updateMetadata(newDocument("A", "2024-01-01"), { tags: [3] })
      )
    ).toThrow();
  });
});

describe("media references", () => {
  it("finds Markdown, reference links, raw HTML, srcset, and legacy cover paths", () => {
    const source = newDocument("A", "2024-01-01");
    const content =
      updateMetadata(source, { coverImage: "cover.jpg" }) +
      '[![Photo][image]](/images/full.jpg)\n\n[image]: /images/photo%2Ejpg\n\n<figure><a href="https://blog.junkato.jp/images/full.jpg?x=1&amp;y=2"><img src="/images/small.jpg" srcset="/images/a.jpg 1x, /images/b.jpg 2x" /></a></figure>\n\n```html\n<img src="/images/unused.jpg">\n```\n';
    expect([...referencedMedia(content)].sort()).toEqual(
      ["a.jpg", "b.jpg", "cover.jpg", "full.jpg", "photo.jpg", "small.jpg"]
        .map(name => `public/images/${name}`)
        .sort()
    );
  });
  it("does not confuse external images with local assets", () => {
    expect(mediaPath("https://example.com/images/a.jpg")).toBeNull();
    expect(mediaPath("//evil.test/images/a.jpg")).toBeNull();
    expect(mediaPath("https://blog.junkato.jp/images/a.jpg?raw=1")).toBe(
      "public/images/a.jpg"
    );
  });
  it("limits editable paths", () => {
    for (const value of [
      "src/ja/../default/x.md",
      "src/ja/%2e%2e/x.md",
      ".github/workflows/publish.yml",
      "src/ja/x.mdx"
    ])
      expect(isPostPath(value)).toBe(false);
    for (const value of [
      "public/images/x.svg",
      "public/images/../secret.jpg",
      "public/images/x.jpg/other",
      "public/images/a..jpg"
    ])
      expect(isMediaPath(value)).toBe(false);
  });
});
