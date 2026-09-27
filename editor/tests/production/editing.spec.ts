import { expect, test } from "@playwright/test";
import { splitDocument } from "../../shared/document";

test("built editor formats posts and edits tags under production CSP", async ({
  page
}) => {
  const path = "src/ja/2024-01-01-production-test.md";
  const source =
    "---\ntitle: Test\ndate: '2024-01-01'\ntags: [research, programming]\n---\n\nIntro **bold**.\n\n## Heading\n\n-   One\n";
  const violations: string[] = [];
  page.on("console", message => {
    if (/Content Security Policy/i.test(message.text()))
      violations.push(message.text());
  });
  await page.route("**/api/**", route =>
    route.fulfill({
      json:
        new URL(route.request().url()).pathname === "/api/index"
          ? {
              head: "a".repeat(40),
              posts: [{ path, sha: "b".repeat(40) }],
              media: []
            }
          : { path, sha: "b".repeat(40), content: source }
    })
  );
  await page.goto(`/?post=${encodeURIComponent(path)}`);
  await expect(
    page.getByRole("textbox", { name: "Markdown body" })
  ).toBeVisible();
  await page.locator(".metadata summary").click();
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  const tags = page.getByRole("dialog", { name: "Edit tags" });
  await tags.getByLabel("Search tags").fill("program");
  await expect(tags.getByRole("checkbox")).toHaveCount(1);
  await tags
    .getByRole("checkbox", { name: "programming", exact: true })
    .uncheck();
  await page.screenshot({ path: "test-results/tag-dialog.png" });
  await tags.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByLabel("Tags (comma-separated)")).toHaveValue(
    "research"
  );
  await page.screenshot({
    path: "test-results/post-details.png",
    fullPage: true
  });
  await page.getByRole("button", { name: "Format & update summary" }).click();
  await expect(
    page.getByRole("textbox", { name: "Markdown body" })
  ).toHaveValue("\nIntro **bold**.\n\n## Heading\n\n- One\n");
  await page.getByRole("button", { name: "Edit frontmatter source" }).click();
  const header = await page
    .getByRole("textbox", { name: "Frontmatter source" })
    .inputValue();
  expect(splitDocument(header).data.summary_generated).toBe("Intro bold.");
  expect(violations).toEqual([]);
});

test("built editor reviews a Japanese summary candidate under production CSP", async ({
  page
}) => {
  const path = "src/ja/2024-01-01-summary-test.md";
  const violations: string[] = [];
  page.on("console", message => {
    if (/Content Security Policy/i.test(message.text()))
      violations.push(message.text());
  });
  const requests: any[] = [];
  await page.route("**/api/**", route => {
    const endpoint = new URL(route.request().url()).pathname;
    if (endpoint === "/api/index")
      return route.fulfill({
        json: {
          head: "a".repeat(40),
          posts: [{ path, sha: "b".repeat(40) }],
          media: []
        }
      });
    if (endpoint === "/api/summary/config")
      return route.fulfill({ json: { configured: true, model: "test-model" } });
    if (endpoint === "/api/summary") {
      requests.push(route.request().postDataJSON());
      return route.fulfill({
        json: { model: "test-model", summary: "生成した候補です。" }
      });
    }
    return route.fulfill({
      json: {
        path,
        sha: "b".repeat(40),
        content:
          "---\ntitle: 概要のテスト\ndate: '2024-01-01'\nsummary: 元の概要\nsummary_generated: 自動概要\n---\n\n本文です。\n"
      }
    });
  });
  await page.goto(`/?post=${encodeURIComponent(path)}`);
  await expect(
    page.getByRole("textbox", { name: "Markdown body" })
  ).toBeVisible();
  await page.getByRole("button", { name: "日本語", exact: true }).click();
  await page.locator(".metadata summary").click();
  await page.getByRole("button", { name: "自動生成", exact: true }).click();
  const dialog = page.getByRole("dialog", {
    name: "概要の自動生成",
    exact: true
  });
  await expect(dialog.getByLabel("プロンプト", { exact: true })).toHaveValue(
    /日本語/
  );
  await dialog
    .getByLabel("プロンプト", { exact: true })
    .fill("140字程度で日本語の概要を書いてください。");
  await dialog.getByRole("button", { name: "候補を生成", exact: true }).click();
  await expect(dialog.getByLabel("概要の候補", { exact: true })).toHaveValue(
    "生成した候補です。"
  );
  await expect(page.getByLabel("概要", { exact: true })).toHaveValue(
    "元の概要"
  );
  await page.screenshot({ path: "test-results/summary-dialog.png" });
  await dialog.getByRole("button", { name: "概要に反映", exact: true }).click();
  await expect(page.getByLabel("概要", { exact: true })).toHaveValue(
    "生成した候補です。"
  );
  expect(requests[0]).toMatchObject({
    title: "概要のテスト",
    body: expect.stringContaining("本文です。"),
    prompt: "140字程度で日本語の概要を書いてください。"
  });
  await page
    .getByRole("button", { name: "フロントマターを編集", exact: true })
    .click();
  const header = await page
    .getByRole("textbox", { name: "フロントマターのソース" })
    .inputValue();
  expect(splitDocument(header).data.summary_generated).toBe("自動概要");
  expect(violations).toEqual([]);
});
