// Playwright config for cross-sns-audience-flow-analyzer — end-to-end smoke tests.
// AI-driven exploration is handled separately by the Playwright MCP server (.mcp.json).
import { defineConfig, devices } from "@playwright/test";

// A dedicated port, not the framework default. On 3000 the runner will happily
// attach to whatever unrelated dev server already holds the port and test that
// instead, which fails in a way that looks like the app is broken.
const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

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
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Target the workspace directly: `--` forwards the port to `next dev`.
    command: `npm run dev --workspace apps/web -- --port ${PORT}`,
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
