// Example visual regression spec for cross-sns-audience-flow-analyzer.
// Run: npx playwright test --update-snapshots   # accept new baseline
//      npx playwright test                       # diff against baseline (CI mode)
//
// AI-driven interactive verification (game / canvas / hard-to-script flows) is done via
// the Playwright MCP server during development — see .mcp.json + .claude/skills/webapp-testing/SKILL.md.
import { test, expect } from "@playwright/test";

test.describe("smoke — landing page", () => {
  test.beforeEach(async ({ page }) => {
    page.on("pageerror", (e) => {
      throw new Error(`uncaught page error: ${e.message}`);
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("renders without error", async ({ page }) => {
    await expect(page).toHaveScreenshot("landing.png", { fullPage: true });
  });

  test("primary nav is accessible", async ({ page }) => {
    const nav = page.getByRole("navigation").first();
    await expect(nav).toBeVisible();
  });
});

// Canvas / WebGL pattern: assert via internal state in addition to (not instead of) screenshot.
// Adapt the route + debug-bridge name to your app (window.__appState / window.__game / etc.).
// test("canvas state updates", async ({ page }) => {
//   await page.goto("/canvas-route");
//   const value = await page.evaluate(() => (window as any).__appState?.value);
//   expect(value).toBeGreaterThanOrEqual(0);
// });
