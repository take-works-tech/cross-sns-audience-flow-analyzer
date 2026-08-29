// Playwright config for cross-sns-audience-flow-analyzer — deterministic visual regression in CI.
// AI-driven exploration is handled separately by the Playwright MCP server (.mcp.json).
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  // Small tolerance absorbs font hinting + sub-pixel AA across runners.
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.005, threshold: 0.2 } },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
