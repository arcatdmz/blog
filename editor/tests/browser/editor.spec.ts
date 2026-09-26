import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const englishPath = "src/default/2023-06-20-lights-animation-interaction.md";
const english = fs.readFileSync(
  path.resolve(import.meta.dirname, `../../..`, englishPath),
  "utf8"
);
const pixel = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j9S8AAAAASUVORK5CYII=",
  "base64"
);
async function mockRepository(
  page: Page,
  options: { saveStatus?: number; uploadStatus?: number } = {}
) {
  let content = english;
  let head = "0".repeat(40);
  const saves: any[] = [];
  const uploaded: any[] = [];
  await page.route("**/api/**", async route => {
    const request = route.request();
    const url = new URL(request.url());
    const json = (data: unknown, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(data)
      });
    if (url.pathname === "/api/index")
      return json({
        head,
        posts: [{ path: englishPath, sha: head }],
        media: [
          { path: "public/images/unused.png", sha: "3".repeat(40) },
          ...uploaded.map(u => ({ path: u.path, sha: "4".repeat(40) }))
        ]
      });
    if (url.pathname === "/api/post")
      return json({ path: englishPath, sha: head, content });
    if (url.pathname === "/api/media")
      return route.fulfill({ contentType: "image/png", body: pixel });
    if (url.pathname === "/api/upload") {
      if (options.uploadStatus)
        return json(
          { error: "Upload interrupted. Local work is safe." },
          options.uploadStatus
        );
      const upload = {
        path: url.searchParams.get("path"),
        sha: "4".repeat(40),
        receipt: "test-receipt"
      };
      uploaded.push(upload);
      return json(upload);
    }
    if (url.pathname === "/api/save") {
      if (options.saveStatus)
        return json(
          { error: "Session expired. Sign in again; local work is safe." },
          options.saveStatus
        );
      const data = request.postDataJSON();
      saves.push(data);
      content = data.post?.content || content;
      head = "5".repeat(40);
      return json({
        commit: head,
        workflow: "https://github.com/arcatdmz/blog/actions",
        postSha: head
      });
    }
    if (url.pathname === "/api/save-status") return json(null);
    if (url.pathname === "/api/references")
      return json(
        Object.fromEntries(
          request.postDataJSON().paths.map((p: string) => [p, []])
        )
      );
    return json({ error: "Unknown operation" }, 404);
  });
  return { saves, uploaded };
}
async function openEnglish(page: Page) {
  await page.goto("/");
  await page.getByLabel("Post language").selectOption("default");
  await page
    .getByRole("navigation", { name: "Posts" })
    .getByRole("button")
    .first()
    .click();
  await expect(
    page.getByRole("textbox", { name: "Markdown body" })
  ).toBeVisible();
}
async function stageImage(page: Page, name = "new-image.png") {
  await page.getByRole("button", { name: "Images", exact: true }).click();
  await page
    .locator('input[type="file"]')
    .setInputFiles({ name, mimeType: "image/png", buffer: pixel });
  await page.getByRole("button", { name: "Add to pending uploads" }).click();
  await expect(
    page.locator(".media-card").filter({ hasText: name })
  ).toBeVisible();
}

test("local Worker demo opens the longest Japanese post and preserves text across preview", async ({
  page
}) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByText("Local demo · real posts", { exact: false })
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Posts" })
    .getByRole("button")
    .first()
    .click();
  const body = page.getByRole("textbox", { name: "Markdown body" });
  await expect(body).toBeVisible();
  expect((await body.inputValue()).length).toBeGreaterThan(12000);
  const original = await body.inputValue();
  await body.focus();
  await body.evaluate((element: HTMLTextAreaElement) =>
    element.setSelectionRange(element.value.length, element.value.length)
  );
  await page.keyboard.insertText("\n日本語の入力テスト");
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await expect(page.locator(".preview")).toContainText("日本語の入力テスト", {
    timeout: 15000
  });
  await page.getByRole("tab", { name: "Write", exact: true }).click();
  expect(await body.inputValue()).toBe(original + "\n日本語の入力テスト");
  await expect(
    page.getByText("Recovery saved on this device", { exact: true })
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/writing-room.png",
    fullPage: true
  });
  expect(errors).toEqual([]);
});

test("formatting uses the native undo stack and preserves selection", async ({
  page
}) => {
  await mockRepository(page);
  await openEnglish(page);
  const body = page.getByRole("textbox", { name: "Markdown body" });
  const original = await body.inputValue();
  await body.focus();
  await body.evaluate((element: HTMLTextAreaElement) =>
    element.setSelectionRange(2, 10)
  );
  await page.getByRole("button", { name: "Bold", exact: true }).click();
  await expect(body).toHaveValue(
    original.slice(0, 2) +
      "**" +
      original.slice(2, 10) +
      "**" +
      original.slice(10)
  );
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(body).toHaveValue(original);
});

test("local text recovers after reload and a rejected save", async ({
  page
}) => {
  await mockRepository(page, { saveStatus: 401 });
  await openEnglish(page);
  const body = page.getByRole("textbox", { name: "Markdown body" });
  await body.fill("\nA recovered draft 日本語\n");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("alert")).toContainText("Session expired");
  await page.reload();
  await page.locator(".recovery-list button").first().click();
  await expect(body).toHaveValue("\nA recovered draft 日本語\n");
  await expect(
    page.getByRole("button", { name: "Save changes" })
  ).toBeEnabled();
});

test("pending image bytes survive interrupted upload and reload", async ({
  page
}) => {
  await mockRepository(page, { uploadStatus: 503 });
  await openEnglish(page);
  await stageImage(page);
  await page
    .locator(".media-card")
    .filter({ hasText: "new-image.png" })
    .getByRole("button", { name: "Insert", exact: true })
    .click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("alert")).toContainText("Upload interrupted");
  await page.reload();
  await page.locator(".recovery-list button").first().click();
  await expect(
    page.getByRole("textbox", { name: "Markdown body" })
  ).toContainText("![](/images/new-image.png)");
  await page.getByRole("button", { name: "Images", exact: true }).click();
  const card = page.locator(".media-card").filter({ hasText: "new-image.png" });
  await expect(card).toContainText("Pending upload");
  await expect
    .poll(() =>
      card
        .locator("img")
        .evaluate((image: HTMLImageElement) => image.naturalWidth)
    )
    .toBe(1);
});

test("edits a figure through preview without rewriting surrounding source", async ({
  page
}) => {
  await mockRepository(page);
  await openEnglish(page);
  const body = page.getByRole("textbox", { name: "Markdown body" });
  const before = await body.inputValue();
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await page
    .getByRole("button", { name: "Edit image layout", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Apply layout", exact: true }).click();
  await page.getByRole("tab", { name: "Write", exact: true }).click();
  await expect(body).toHaveValue(before);
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await page
    .getByRole("button", { name: "Edit image layout", exact: true })
    .first()
    .click();
  await page
    .getByRole("combobox", { name: "Placement", exact: true })
    .selectOption("left");
  await page.getByLabel("Alt text", { exact: true }).fill("A new description");
  await page.getByRole("button", { name: "Apply layout", exact: true }).click();
  await expect(body).toHaveValue(/alt="A new description"/);
  const after = await body.inputValue();
  expect(after.slice(0, after.indexOf("<figure"))).toBe(
    before.slice(0, before.indexOf("<figure"))
  );
  expect(after.slice(after.indexOf("</figure>") + 9)).toBe(
    before.slice(before.indexOf("</figure>") + 9)
  );
  expect(after).toContain('class="left"');
  expect(after).toContain('alt="A new description"');
});

test("one save includes Markdown, upload and deletion and clears recovery", async ({
  page
}) => {
  const repository = await mockRepository(page);
  await openEnglish(page);
  await stageImage(page);
  page.on("dialog", dialog => dialog.accept());
  await page
    .locator(".media-card")
    .filter({ hasText: "unused.png" })
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Undo deletion" })
  ).toBeVisible();
  await page
    .locator(".media-card")
    .filter({ hasText: "new-image.png" })
    .getByRole("button", { name: "Insert", exact: true })
    .click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Committed to GitHub");
  expect(repository.saves).toHaveLength(1);
  expect(repository.saves[0].post.content).toContain("/images/new-image.png");
  expect(repository.saves[0].uploads).toHaveLength(1);
  expect(repository.saves[0].deletions).toHaveLength(1);
  await expect(page.locator(".recovery-list")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Check publication" })
  ).toBeVisible();
});

test("composition defers saving until Japanese input is committed", async ({
  page
}) => {
  const repository = await mockRepository(page);
  await openEnglish(page);
  const body = page.getByRole("textbox", { name: "Markdown body" });
  await body.dispatchEvent("compositionstart", { data: "に" });
  await body.fill("\n日本語の編集中\n");
  await page.getByRole("button", { name: "Save changes" }).click();
  expect(repository.saves).toHaveLength(0);
  await body.dispatchEvent("compositionend", { data: "日本語の編集中" });
  await expect(
    page.getByText("Recovery saved on this device", { exact: true })
  ).toBeVisible();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Committed to GitHub");
  expect(repository.saves[0].post.content).toContain("日本語の編集中");
});

test("a failed preview download does not discard the active editor", async ({
  page
}) => {
  await mockRepository(page);
  await page.route("**/src/Preview.tsx*", route => route.abort());
  await openEnglish(page);
  const body = page.getByRole("textbox", { name: "Markdown body" });
  await body.fill("\nKeep this text when the connection fails.\n");
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "This view could not load",
    { timeout: 15000 }
  );
  await page.getByRole("tab", { name: "Write", exact: true }).click();
  await expect(body).toHaveValue(
    "\nKeep this text when the connection fails.\n"
  );
  await expect(
    page.getByText("Recovery saved on this device", { exact: true })
  ).toBeVisible();
});
