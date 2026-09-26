// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { findFigures, parseFigure, serializeFigure } from "../src/figures";
import { splitDocument } from "../shared/document";
import { previewHtml } from "../src/Preview";

const posts = ["default", "ja"].flatMap(language =>
  fs
    .readdirSync(path.resolve(import.meta.dirname, `../../src/${language}`))
    .filter(name => name.endsWith(".md"))
    .map(name =>
      fs.readFileSync(
        path.resolve(import.meta.dirname, `../../src/${language}/${name}`),
        "utf8"
      )
    )
);

describe("figure layouts", () => {
  it("recognizes ordinary existing figures without changing source ranges", () => {
    let recognized = 0;
    for (const source of posts) {
      const { body } = splitDocument(source);
      for (const range of findFigures(body)) {
        expect(body.slice(range.start, range.end)).toBe(range.source);
        const figure = parseFigure(range.source);
        if (!figure) continue;
        recognized++;
        const parsed = parseFigure(serializeFigure(figure));
        expect(parsed?.images).toEqual(figure.images);
        expect(parsed?.columns).toBe(figure.columns);
        expect(parsed?.placement).toBe(figure.placement);
        expect(parsed?.sharedLink).toBe(figure.sharedLink);
      }
    }
    expect(recognized).toBeGreaterThan(125);
  });
  it("edits linked column groups, captions, and image order", () => {
    const body =
      'Before\n\n<figure class="center"><div class="three columns"><a href="/images/a.jpg"><img src="/images/a.jpg" alt="One" /></a><img src="/images/b.jpg" alt="Two" /></div><figcaption><a href="https://example.com">Caption</a> &amp; more</figcaption></figure>\n\nAfter';
    const range = findFigures(body)[0];
    const figure = parseFigure(range.source)!;
    figure.images.reverse();
    figure.placement = "right";
    figure.small = true;
    figure.fixed = true;
    const updated =
      body.slice(0, range.start) +
      serializeFigure(figure) +
      body.slice(range.end);
    expect(updated.startsWith("Before\n\n")).toBe(true);
    expect(updated.endsWith("\n\nAfter")).toBe(true);
    expect(updated).toContain('class="small fixed-size right"');
    expect(updated).toContain(
      '<figcaption><a href="https://example.com">Caption</a> &amp; more</figcaption>'
    );
    expect(updated.indexOf('alt="Two"')).toBeLessThan(
      updated.indexOf('alt="One"')
    );
    figure.caption = "A [new caption](https://example.org)";
    expect(serializeFigure(figure)).toContain(
      '<a href="https://example.org">new caption</a>'
    );
  });
  it("supports shared links and refuses unsupported markup", () => {
    const shared = parseFigure(
      '<figure class="center"><a class="three columns" href="https://example.com"><img src="/images/a.jpg" alt="" /><img src="/images/b.jpg" alt="" /></a></figure>'
    )!;
    expect(shared.sharedLink).toBe("https://example.com");
    expect(parseFigure(serializeFigure(shared))?.sharedLink).toBe(
      shared.sharedLink
    );
    for (const html of [
      '<figure style="width:40%"><img src="/images/a.jpg"></figure>',
      '<figure><custom-widget></custom-widget><img src="/images/a.jpg"></figure>',
      '<figure><img src="/images/a.jpg" onerror="alert(1)"></figure>'
    ])
      expect(parseFigure(html)).toBeNull();
    expect(
      findFigures('```html\n<figure><img src="/images/a.jpg"></figure>\n```')
    ).toEqual([]);
  });
});

describe("safe preview", () => {
  it("removes executable content, forms, event handlers, and unsafe URLs", async () => {
    const body =
      '<script>alert(1)</script>\n\n<iframe src="https://example.com"></iframe>\n\n<img src="/images/a.jpg" onerror="alert(1)" />\n\n<a href="javascript:alert(1)">bad</a>\n\n<form><input autofocus /><button formaction="https://evil.test">Submit</button></form>\n';
    const preview = await previewHtml(
      body,
      path => `blob:https://editor.example/${path}`
    );
    const document = new DOMParser().parseFromString(preview.html, "text/html");
    expect(
      document.querySelector("script,iframe,form,input,button")
    ).toBeNull();
    expect(preview.html).not.toMatch(/onerror|javascript:|autofocus/);
    expect(preview.html).toContain("Embedded content");
    expect(document.querySelector("img")?.getAttribute("src")).toBe(
      "blob:https://editor.example/public/images/a.jpg"
    );
  });
  it("renders GFM, code, and figure classes without rewriting input", async () => {
    const source =
      '| A | B |\n| - | - |\n| 1 | 2 |\n\n```js\nconst a = 1;\n```\n\n<figure class="right"><img src="/images/a.jpg" /></figure>';
    const { html } = await previewHtml(
      source,
      path => `/api/media?path=${path}`
    );
    expect(html).toContain("<table>");
    expect(html).toContain('class="right"');
    expect(html).toContain("hljs");
  });
});
