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

test("interface language persists independently of the post language", async ({
  page
}) => {
  await mockRepository(page);
  await openEnglish(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "日本語", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.getByLabel("記事の言語", { exact: true })).toHaveValue(
    "default"
  );
  await expect(
    page.getByRole("tab", { name: "本文", exact: true })
  ).toBeVisible();
  await page.getByRole("tab", { name: "プレビュー", exact: true }).click();
  await expect(
    page
      .getByRole("button", { name: "画像レイアウトを編集", exact: true })
      .first()
  ).toBeVisible();
  await page.getByLabel("記事の言語", { exact: true }).selectOption("ja");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.getByLabel("Post language", { exact: true })).toHaveValue(
    "ja"
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "日本語", exact: true }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(
    page
      .getByRole("group", { name: "表示言語", exact: true })
      .getByRole("button", { name: "日本語", exact: true })
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "新規記事", exact: true })
  ).toBeVisible();
});

test("interface language preserves unsaved Markdown and native undo", async ({
  page
}) => {
  const repository = await mockRepository(page);
  await openEnglish(page);
  const body = page.locator(".writing-area");
  const original = await body.inputValue();
  const editor = await body.elementHandle();
  await body.focus();
  await body.evaluate((element: HTMLTextAreaElement) =>
    element.setSelectionRange(element.value.length, element.value.length)
  );
  await page.keyboard.insertText("\nUnsaved words · 未保存の文章\n");
  await page.getByRole("button", { name: "日本語", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Markdown 本文" })
  ).toHaveValue(original + "\nUnsaved words · 未保存の文章\n");
  expect(await editor!.evaluate(element => element.isConnected)).toBe(true);
  await expect(
    page.getByRole("button", { name: "変更を保存", exact: true })
  ).toBeEnabled();
  await expect(page.locator(".document-heading .filename")).toHaveText(
    englishPath
  );
  await page.getByRole("button", { name: "元に戻す", exact: true }).click();
  await expect(body).toHaveValue(original);
  expect(repository.saves).toHaveLength(0);
});

test("Zen mode keeps the editor, selection, undo and preview intact", async ({
  page
}) => {
  await mockRepository(page);
  await openEnglish(page);
  const shell = page.locator(".app-shell");
  const body = page.getByRole("textbox", { name: "Markdown body" });
  const editor = await body.elementHandle();
  const original = await body.inputValue();
  const title = await page.locator(".document-heading h1").textContent();
  const addition = "\nWords to keep while focusing.\n";
  await body.focus();
  await body.evaluate((element: HTMLTextAreaElement) =>
    element.setSelectionRange(element.value.length, element.value.length)
  );
  await page.keyboard.insertText(addition);
  await body.evaluate(
    (element: HTMLTextAreaElement, start) =>
      element.setSelectionRange(start, element.value.length, "backward"),
    original.length
  );
  await page.getByRole("button", { name: "Zen mode", exact: true }).click();
  await expect(shell).toHaveClass(/zen-mode/);
  await expect(
    page.getByRole("button", { name: "Exit Zen mode", exact: true })
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".document-heading h1")).toHaveText(title!);
  for (const selector of [
    ".app-header",
    ".sidebar",
    ".demo-banner",
    ".document-heading .eyebrow",
    ".document-heading .filename",
    ".save-badge",
    ".recovery-status",
    ".metadata",
    ".document-footer"
  ])
    await expect(page.locator(selector)).toBeHidden();
  expect(await editor!.evaluate(element => element.isConnected)).toBe(true);
  await expect(body).toHaveValue(original + addition);
  expect(
    await body.evaluate((element: HTMLTextAreaElement) => [
      element.selectionStart,
      element.selectionEnd,
      element.selectionDirection
    ])
  ).toEqual([original.length, original.length + addition.length, "backward"]);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(body).toHaveValue(original);
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await page
    .getByRole("button", { name: "Edit image layout", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(shell).toHaveClass(/zen-mode/);
  await page.getByRole("tab", { name: "Write", exact: true }).click();
  await expect(body).toHaveValue(original);
  await page
    .getByRole("button", { name: "Exit Zen mode", exact: true })
    .click();
  await expect(shell).not.toHaveClass(/zen-mode/);
  await expect(page.locator(".app-header")).toBeVisible();
  await expect(page.locator(".metadata")).toBeVisible();
  expect(await editor!.evaluate(element => element.isConnected)).toBe(true);
});

test("Zen mode keeps saving available and ignores Escape during composition", async ({
  page
}) => {
  const repository = await mockRepository(page);
  await openEnglish(page);
  const body = page.getByRole("textbox", { name: "Markdown body" });
  const shell = page.locator(".app-shell");
  await page.getByRole("button", { name: "Zen mode", exact: true }).click();
  await body.focus();
  await body.dispatchEvent("compositionstart", { data: "に" });
  await body.fill("\n日本語の編集中\n");
  await body.dispatchEvent("keydown", {
    key: "Escape",
    code: "Escape",
    isComposing: true
  });
  await expect(shell).toHaveClass(/zen-mode/);
  await page.keyboard.press("Escape");
  await expect(shell).toHaveClass(/zen-mode/);
  await body.dispatchEvent("compositionend", { data: "日本語の編集中" });
  await page.keyboard.press("Control+s");
  await expect.poll(() => repository.saves.length).toBe(1);
  expect(repository.saves[0].post.content).toContain("日本語の編集中");
  await expect(page.getByRole("status")).toBeHidden();
  await body.fill("\nSaved from the Zen toolbar.\n");
  await page
    .locator(".document-actions")
    .getByRole("button", { name: "Save changes", exact: true })
    .click();
  await expect.poll(() => repository.saves.length).toBe(2);
  expect(repository.saves[1].post.content).toContain(
    "Saved from the Zen toolbar."
  );
  await expect(shell).toHaveClass(/zen-mode/);
  await body.focus();
  await page.keyboard.press("Escape");
  await expect(shell).not.toHaveClass(/zen-mode/);
  await expect(body).toHaveValue("\nSaved from the Zen toolbar.\n");
});

test("Japanese Zen mode fits small screens and keeps save errors visible", async ({
  page
}) => {
  await mockRepository(page, { saveStatus: 401 });
  await openEnglish(page);
  await page.getByRole("button", { name: "日本語", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Zenモード", exact: true }).click();
  const exit = page.getByRole("button", {
    name: "Zenモードを終了",
    exact: true
  });
  const body = page.getByRole("textbox", { name: "Markdown 本文" });
  await body.fill("\n集中して書いた文章を保つ。\n");
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(exit).toBeInViewport();
    await expect(page.locator(".document-heading h1")).toBeVisible();
    await expect(body).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth
        )
      )
      .toBeLessThanOrEqual(1);
  }
  await page
    .locator(".document-actions")
    .getByRole("button", { name: "変更を保存", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Session expired");
  await expect(page.locator(".app-shell")).toHaveClass(/zen-mode/);
  await expect(body).toHaveValue("\n集中して書いた文章を保つ。\n");
  await exit.click();
  await expect(page.locator(".app-shell")).not.toHaveClass(/zen-mode/);
  await expect(page.locator(".app-header")).toBeVisible();
});

test("Japanese interface fits desktop, tablet, and mobile widths", async ({
  page
}) => {
  await mockRepository(page);
  await openEnglish(page);
  const unsaved = "画面幅が変わっても、書きかけの文章を大切に。\n";
  const body = page.locator(".writing-area");
  await body.fill(unsaved);
  await page.getByRole("searchbox", { name: "Search posts" }).fill("lights");
  await page.getByRole("button", { name: "日本語", exact: true }).click();
  const heading = page.locator(".posts-heading");
  const toggle = heading.getByRole("button");
  const posts = page.locator("#posts-list-panel");
  const search = page.getByRole("searchbox", { name: "記事を検索" });
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 834, height: 1194 },
    { width: 390, height: 844 }
  ]) {
    await page.setViewportSize(viewport);
    if (viewport.width <= 700) {
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toHaveAttribute("aria-controls", "posts-list-panel");
      await expect(posts).toBeHidden();
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(posts).toBeVisible();
      await page.getByRole("button", { name: "English", exact: true }).click();
      await page.getByRole("button", { name: "日本語", exact: true }).click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(posts).toBeVisible();
      await expect(search).toHaveValue("lights");
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(posts).toBeHidden();
    } else {
      await expect(toggle).toHaveCount(0);
      await expect(page.locator(".posts-panel summary")).toHaveCount(0);
      await expect(posts).toBeVisible();
      await heading.click();
      await expect(posts).toBeVisible();
      await expect(search).toHaveValue("lights");
      await expect(
        page.getByRole("navigation", { name: "記事" })
      ).toBeVisible();
    }
    await expect(body).toBeVisible();
    await expect(body).toHaveValue(unsaved);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth
        )
      )
      .toBeLessThanOrEqual(1);
    await page.getByRole("button", { name: "画像", exact: true }).click();
    const dialog = page.getByRole("dialog", {
      name: "画像ライブラリ",
      exact: true
    });
    await expect(dialog).toBeVisible();
    await expect
      .poll(() =>
        dialog.evaluate(element => element.scrollWidth - element.clientWidth)
      )
      .toBeLessThanOrEqual(1);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth
        )
      )
      .toBeLessThanOrEqual(1);
    await dialog
      .getByRole("button", { name: "ダイアログを閉じる", exact: true })
      .click();
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(toggle).toHaveCount(0);
  await expect(posts).toBeVisible();
  await expect(search).toHaveValue("lights");
  await expect(body).toHaveValue(unsaved);
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

test("theme follows OS, remembers overrides, and returns to OS with dark preview", async ({
  page
}) => {
  await mockRepository(page);
  await page.emulateMedia({ colorScheme: "dark" });
  await openEnglish(page);
  const theme = page.getByLabel("Color theme");
  await expect(theme).toHaveValue("system");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  const article = page.locator(".preview article");
  await expect(article).toHaveCSS("color", "rgb(229, 231, 233)");
  await expect(page.locator(".preview figcaption").first()).toHaveCSS(
    "background-color",
    "rgb(36, 41, 46)"
  );
  await page.screenshot({
    path: test.info().outputPath("dark-preview.png"),
    fullPage: true
  });
  await theme.selectOption("light");
  await expect(article).toHaveCSS("color", "rgb(34, 36, 38)");
  await page.reload();
  await expect(theme).toHaveValue("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await theme.selectOption("system");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("URL restores post, preview, images and search; history preserves textarea", async ({
  page
}) => {
  await mockRepository(page);
  await openEnglish(page);
  const body = page.getByRole("textbox", { name: "Markdown body" });
  await body.fill("\nURL recovery 日本語\n");
  const editor = await body.elementHandle();
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await expect(page).toHaveURL(/view=preview/);
  await page.goBack();
  await expect(body).toBeVisible();
  expect(await editor!.evaluate(element => element.isConnected)).toBe(true);
  await page.goForward();
  await expect(page.locator(".preview article")).toContainText(
    "URL recovery 日本語"
  );
  await page.getByRole("button", { name: "Images", exact: true }).click();
  const search = page.getByRole("searchbox", { name: "Search images" });
  await search.fill("unused");
  await page.reload();
  await expect(
    page.getByRole("dialog", { name: "Image library", exact: true })
  ).toBeVisible();
  await expect(search).toHaveValue("unused");
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(page.locator(".preview article")).toContainText(
    "URL recovery 日本語"
  );
  await page.getByRole("tab", { name: "Write", exact: true }).click();
  await expect(body).toHaveValue("\nURL recovery 日本語\n");
});

test("new post form and locally created draft survive reload via URL", async ({
  page
}) => {
  const repository = await mockRepository(page);
  await page.goto("/?dialog=new");
  const dialog = page.getByRole("dialog", { name: "New post", exact: true });
  await dialog.getByLabel("Title", { exact: true }).fill("Draft to keep");
  await dialog.getByLabel("ASCII slug", { exact: true }).fill("draft-to-keep");
  await page.reload();
  await expect(dialog.getByLabel("Title", { exact: true })).toHaveValue(
    "Draft to keep"
  );
  await expect(dialog.getByLabel("ASCII slug", { exact: true })).toHaveValue(
    "draft-to-keep"
  );
  await dialog.getByRole("button", { name: "Create local draft" }).click();
  await expect(page).toHaveURL(/post=src%2Fja%2F.*draft-to-keep.md/);
  const body = page.getByRole("textbox", { name: "Markdown body" });
  await body.fill("\nNew draft body\n");
  await expect(
    page.getByText("Recovery saved on this device", { exact: true })
  ).toBeVisible();
  await page.reload();
  await expect(body).toHaveValue("\nNew draft body\n");
  expect(repository.saves).toHaveLength(0);
});

test("image workspace opens directly and restores pending image bytes", async ({
  page
}) => {
  await mockRepository(page);
  await page.goto("/?post=%40media&dialog=images");
  await expect(
    page.getByRole("dialog", { name: "Image library", exact: true })
  ).toBeVisible();
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await stageImage(page);
  await page.reload();
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

test("reload immediately after typing recovers without a manual recovery click", async ({
  page
}) => {
  await mockRepository(page);
  await openEnglish(page);
  const body = page.getByRole("textbox", { name: "Markdown body" });
  await body.fill("\nLast keystroke before reload\n");
  await page.reload();
  await expect(body).toHaveValue("\nLast keystroke before reload\n");
});

test("OS changes respect overrides and theme changes synchronize between tabs", async ({
  page,
  context
}) => {
  await mockRepository(page);
  await openEnglish(page);
  const other = await context.newPage();
  await mockRepository(other);
  await other.goto("/");
  await page.getByLabel("Color theme").selectOption("dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(other.getByLabel("Color theme")).toHaveValue("dark");
  await expect(other.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByLabel("Color theme").selectOption("system");
  await expect(other.getByLabel("Color theme")).toHaveValue("system");
  await other.close();
});

test("back during a slow post request keeps the destination and local text", async ({
  page
}) => {
  await mockRepository(page);
  await openEnglish(page);
  const body = page.getByRole("textbox", { name: "Markdown body" });
  await body.fill("\nKeep the original workspace\n");
  let release!: () => void;
  const waiting = new Promise<void>(resolve => {
    release = resolve;
  });
  let started = false;
  await page.route("**/api/post?**", async route => {
    if (
      new URL(route.request().url()).searchParams.get("path") !==
      "src/ja/slow.md"
    )
      return route.fallback();
    started = true;
    await waiting;
    await route.fulfill({
      json: { path: "src/ja/slow.md", content: english, sha: "slow" }
    });
  });
  await page.evaluate(() => {
    history.pushState(null, "", "/?post=src%2Fja%2Fslow.md");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect.poll(() => started).toBe(true);
  await page.goBack();
  await expect(body).toHaveValue("\nKeep the original workspace\n");
  release();
  await expect(page.locator(".document-heading .filename")).toHaveText(
    englishPath
  );
  await expect(body).toHaveValue("\nKeep the original workspace\n");
});

test("failed deep link stays retryable without changing its URL", async ({
  page
}) => {
  await mockRepository(page);
  let fail = true;
  await page.route("**/api/post?**", route =>
    fail
      ? route.fulfill({ status: 503, json: { error: "Temporary failure" } })
      : route.fallback()
  );
  await page.goto(`/?post=${encodeURIComponent(englishPath)}&view=preview`);
  await expect(page.getByRole("alert")).toContainText("Temporary failure");
  fail = false;
  await page.getByRole("button", { name: "Retry opening" }).click();
  await expect(page.locator(".preview article")).toBeVisible();
  await expect(page).toHaveURL(/view=preview/);
  await expect(page.locator(".document-heading .filename")).toHaveText(
    englishPath
  );
});
