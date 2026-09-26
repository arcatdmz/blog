import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/browser",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:5173", trace: "retain-on-failure" },
  webServer: {
    command: "npm run dev -- --port 5173",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          executablePath: process.env.BROWSER_EXECUTABLE,
          args: process.env.BROWSER_EXECUTABLE
            ? ["--no-sandbox", "--disable-dev-shm-usage"]
            : []
        }
      }
    },
    {
      name: "tablet-chromium",
      use: {
        ...devices["iPad Pro 11"],
        browserName: "chromium",
        launchOptions: {
          executablePath: process.env.BROWSER_EXECUTABLE,
          args: process.env.BROWSER_EXECUTABLE
            ? ["--no-sandbox", "--disable-dev-shm-usage"]
            : []
        }
      }
    },
    {
      name: "webkit",
      use: { ...devices["iPad Pro 11"], browserName: "webkit" }
    }
  ]
});
