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
