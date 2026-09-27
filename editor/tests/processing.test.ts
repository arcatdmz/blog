import { describe, expect, it } from "vitest";
import { processPost } from "../shared/processing";
import { splitDocument } from "../shared/document";
import { generateSummary } from "../shared/summary.mjs";
import { datedImageName, renameMediaReferences } from "../shared/mediaNames";

describe("post processing", () => {
  it("formats Markdown, keeps custom metadata and manual summaries, and is idempotent", async () => {
    const source =
      "---\ntitle: Test\ndate: '2024-01-01'\nsummary: Hand written\ncustom: keep\n---\n\nIntro **bold**.\n\n## Heading\n\n-   One\n-   Two\n";
    const result = await processPost(source, "src/default/test.md");
    expect(splitDocument(result).data).toMatchObject({
      summary: "Hand written",
      custom: "keep",
      summary_generated: "Intro bold."
    });
    expect(result).toContain("- One\n- Two");
    expect(await processPost(result, "src/default/test.md")).toBe(result);
  });
  it("uses the existing language-specific length limits", () => {
    expect(generateSummary("あ".repeat(200), "ja")).toBe(
      "あ".repeat(137) + "..."
    );
    expect(generateSummary("x".repeat(300), "default")).toBe(
      "x".repeat(197) + "..."
    );
    expect(generateSummary("Intro\n\n## Heading\n\nLater", "default")).toBe(
      "Intro"
    );
  });
  it("formats embedded JavaScript and TypeScript like the CLI", async () => {
    const result = await processPost(
      "---\ntitle: Test\ndate: '2024-01-01'\n---\n\n```typescript\nconst x:number=1\n```\n",
      "src/default/test.md"
    );
    expect(result).toContain("const x: number = 1;");
  });
});

describe("dated image names", () => {
  it("replaces a date prefix instead of stacking prefixes", () => {
    expect(datedImageName("photo.jpg", "2024-01-01")).toBe(
      "2024-01-01-photo.jpg"
    );
    expect(datedImageName("2024-01-01-photo.jpg", "2024-02-02")).toBe(
      "2024-02-02-photo.jpg"
    );
  });
  it("updates Markdown, HTML, cover and srcset URLs without changing external images", () => {
    const renames = new Map([
      ["public/images/old.jpg", "public/images/2024-01-01-old.jpg"]
    ]);
    const source =
      'coverImage: /images/old.jpg\n![](/images/old.jpg)\n[ref]: https://blog.junkato.jp/images/old.jpg?x=1#photo\n<img src="/images/old.jpg" srcset="/images/old.jpg 1x, /images/old.jpg 2x">\n![](https://example.com/images/old.jpg)';
    const result = renameMediaReferences(source, renames);
    expect(result).toContain(
      "https://blog.junkato.jp/images/2024-01-01-old.jpg?x=1#photo"
    );
    expect(result).toContain(
      'srcset="/images/2024-01-01-old.jpg 1x, /images/2024-01-01-old.jpg 2x"'
    );
    expect(result).toContain("https://example.com/images/old.jpg");
    expect(result.match(/2024-01-01-old.jpg/g)).toHaveLength(6);
  });
});
