// End-to-end smoke tests for cross-sns-audience-flow-analyzer.
//
// These assert structure and behaviour, not pixels. The main canvas animates
// continuously (flow particles), so a full-page screenshot diff would be
// non-deterministic; pixel baselines, if added later, belong on a static screen
// and must be generated on the CI platform (`npx playwright test -u` in CI).
//
// AI-driven interactive verification is done via the Playwright MCP server
// during development — see .mcp.json + .claude/skills/webapp-testing/SKILL.md.
import { test, expect, type Page } from "@playwright/test";

/** Fail the test on any uncaught page error rather than passing silently. */
function failOnPageError(page: Page) {
  page.on("pageerror", (error) => {
    throw new Error(`uncaught page error: ${error.message}`);
  });
}

test.describe("login", () => {
  test("renders the sign-in card", async ({ page }) => {
    failOnPageError(page);
    await page.goto("/login");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "ログインリンクを送信" }),
    ).toBeVisible();
  });
});

test.describe("main analysis screen", () => {
  test.beforeEach(async ({ page }) => {
    failOnPageError(page);
    await page.goto("/p/main");
    await page.waitForLoadState("networkidle");
  });

  test("root redirects here", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/p\/main$/);
  });

  test("renders the three panes", async ({ page }) => {
    await expect(page.getByText("SNS連携")).toBeVisible();
    await expect(page.getByLabel("流入ネットワーク図")).toBeVisible();
    await expect(page.getByText("流入ランキング")).toBeVisible();
  });

  test("draws nodes and edges on the canvas", async ({ page }) => {
    const canvas = page.getByLabel("流入ネットワーク図");
    await expect(canvas.locator(".react-flow__node").first()).toBeVisible();
    expect(await canvas.locator(".react-flow__edge").count()).toBeGreaterThan(0);
  });

  test("selecting a ranking row opens the node detail panel", async ({
    page,
  }) => {
    // Scope to the right pane: the same node also has a row in the left pane.
    const rankingPane = page.locator("aside", { hasText: "流入ランキング" });
    await rankingPane.getByRole("button", { name: /Vlog #42 京都/ }).click();

    // A post node reports where its audience goes next.
    await expect(page.getByText("主な接続先")).toBeVisible();
    await expect(page.getByText("流入総量")).toBeVisible();
  });

  test("the filter drawer opens and exposes the thresholds", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "EC導線のみ" }).click();

    await expect(
      page.getByRole("heading", { name: "表示フィルタ" }),
    ).toBeVisible();
    await expect(page.getByLabel("流入人数しきい値")).toBeVisible();
    await expect(page.getByLabel("信頼度しきい値")).toBeVisible();
  });
});
