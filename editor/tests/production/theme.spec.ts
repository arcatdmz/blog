import { expect, test } from "@playwright/test";

for (const preference of ["system", "light", "dark"] as const) {
  test(`production CSP permits ${preference} theme before React loads`, async ({
    page
  }) => {
    await page.emulateMedia({
      colorScheme: preference === "dark" ? "light" : "dark"
    });
    await page.addInitScript(preference => {
      if (preference !== "system") localStorage.setItem("theme", preference);
    }, preference);
    // Leave the synchronous theme script intact, but keep the React app unloaded.
    await page.route("**/assets/*.js", route => route.abort());
    const response = await page.goto("/");
    expect(response!.headers()["content-security-policy"]).toContain(
      "script-src 'self';"
    );
    await expect(page.locator("#root")).toBeEmpty();
    const resolved = preference === "system" ? "dark" : preference;
    await expect(page.locator("html")).toHaveAttribute("data-theme", resolved);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      resolved === "dark" ? "rgb(27, 30, 33)" : "rgb(255, 255, 255)"
    );
  });
}

test("built app switches themes and restores a preview URL under production CSP", async ({
  page
}) => {
  const path = "src/ja/2026-09-26-production-test.md";
  await page.route("**/api/**", route => {
    const url = new URL(route.request().url());
    return route.fulfill({
      json:
        url.pathname === "/api/index"
          ? {
              head: "a".repeat(40),
              posts: [{ path, sha: "b".repeat(40) }],
              media: []
            }
          : {
              path,
              sha: "b".repeat(40),
              content:
                "---\ntitle: Production test\ndate: 2026-09-26\n---\nProduction preview 日本語\n"
            }
    });
  });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(`/?post=${encodeURIComponent(path)}&view=preview`);
  await expect(page.locator(".preview article")).toContainText(
    "Production preview 日本語"
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByLabel("Color theme").selectOption("light");
  await page.reload();
  await expect(page.locator(".preview article")).toContainText(
    "Production preview 日本語"
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByLabel("Color theme")).toHaveValue("light");
});
