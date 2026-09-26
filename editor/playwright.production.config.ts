import { defineConfig } from "@playwright/test";
import browserConfig from "./playwright.config";
export default defineConfig({
  ...browserConfig,
  testDir: "tests/production",
  use: { ...browserConfig.use, baseURL: "http://127.0.0.1:5174" },
  webServer: {
    command: "node tests/production/server.mjs",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: false
  }
});
