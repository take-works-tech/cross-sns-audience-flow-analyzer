---
name: webapp-testing
description: "Real-browser web app testing. Triggers: browser test, E2E, Playwright, page.goto, screenshot regression, flaky UI test, headless."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Web App Testing — cross-sns-audience-flow-analyzer

Source: https://github.com/anthropics/skills/tree/main/webapp-testing

Use Playwright (real browser) — not API mocks — to assert what the user actually sees.

## Core rules
- One browser per run; reuse `context` across specs only when state is intentional.
- Always `await page.waitForLoadState('networkidle')` before first assertion on dynamic pages.
- Assert on visible DOM (`expect(locator).toBeVisible()`), not on selectors that exist but are hidden.
- Screenshots at every key state (`page.screenshot({ path, fullPage: true })`); commit to `tests/__screenshots__/`.
- Console + pageerror listeners attached at `beforeEach`; fail the test if uncaught errors fire.
- No `page.waitForTimeout(n)` as a primary wait — use `locator.waitFor`, `expect.poll`, or event-based waits.
- Wait for preconditions only: setup finished, the stimulus landed. **Never wait for the thing you are
  about to assert** — polling until a value changes and then asserting it changed passes by construction,
  so the rewrite that removed the flake also removed the test.
- Polling a *transient* state cuts both ways: `expect.poll` evaluates once immediately, so waiting for
  "settled" can pass before the work starts, while waiting for "in flight" can miss a cycle faster than
  the interval. Wait on an event (a response, a request) rather than trying to catch a flag mid-flight.
- An event wait can catch a **late reply to an earlier request**. If something before the action under
  test can also fire that event, discriminate — match on a sequence number or a request issued after the
  action — or the assertion passes on the wrong response.
- When the action cannot be delivered (a drag that never lands), say so: report the missing stimulus
  rather than the missing result, or infrastructure failures get filed as product regressions.
- Tests must be independent: each spec resets storage (`context.clearCookies()`, `localStorage.clear()`).

## Locator priority
1. `getByRole` (accessible name) — survives refactors.
2. `getByLabel` / `getByPlaceholder` — for forms.
3. `getByTestId` — last resort, requires `data-testid`.
4. CSS / XPath — forbidden except for third-party widgets.

## Flake protocol
- Failure -> re-run once locally. Second failure -> root-cause (race, animation, network), never `test.fixme`.
- `trace: 'retain-on-failure'`; open with `npx playwright show-trace` before changing the test.

## Canvas / WebGL / game UI
- Assert via `page.evaluate(() => canvas.toDataURL())` hash diff against a golden, or via overlay DOM siblings.
- Never assert by pixel-reading the screenshot inline — store golden + use Playwright `toHaveScreenshot`.
- **Animated / stochastic content**: pixel-diff is fragile. Combine `page.evaluate()` to read internal game state (`window.__game.state.score`, etc.) with screenshot at a deterministic frame (`requestAnimationFrame` step OR fixed seed). Both assertions in one test.
- **Game-state escape hatch**: expose a debug bridge from the app (`window.__debug = { state, seed, ... }`) gated by `NODE_ENV !== 'production'`. Tests read internal truth, not pixel-guesses.

## Known anti-patterns when AI drives a browser

- **Screenshot-not-read false positive**: Playwright MCP returns the screenshot as a file path in `/tmp` by default. The model can claim "the UI looks correct" without ever reading the file. Always invoke `Read` on the returned path before stating any visual verdict, OR configure the MCP to return the screenshot as an image result. (Tracked: `anthropics/claude-code#3597`.)
- **Canvas/WebGL content unaddressable**: by default, only the canvas DOM node is in the accessibility tree — game objects, three.js meshes, etc. are invisible to the MCP. Add `--caps=vision` to the server args to enable coordinate-based mouse interaction needed for Canvas UIs. (See `microsoft/playwright-mcp#1148`.)
- **Token efficiency**: Microsoft's own README recommends CLI+SKILLS over MCP for coding agents because MCP loads large tool schemas and verbose accessibility trees into context. Reach for MCP when you genuinely need persistent browser state and iterative reasoning; otherwise prefer scripted Playwright invocations.
- **Alternative — Claude-in-Chrome**: Boris (Claude Code lead) at times recommends the Claude-in-Chrome extension over Playwright/Chromium MCP for end-to-end browser verification when greater power / token efficiency is needed. Consider as a fallback when Playwright MCP feels heavy.

## CI vs MCP — two distinct lanes (do not conflate)

| Lane | What runs | When | Decides verdict |
|---|---|---|---|
| **CI**: `playwright.config.ts` + `tests/visual/*.spec.ts` + `.github/workflows/visual.yml` | Headless Playwright, pure script, screenshot diff vs golden | Every PR / push to main | **Deterministic** PASS/FAIL — no LLM involved |
| **MCP**: `.mcp.json` Playwright server | Claude drives a real browser interactively at dev time | When CI fails and you need to debug, or for exploratory testing of hard-to-script flows (games, complex animations) | Advisory — AI's narration, never CI |

**Never put MCP into CI**. CI has no interactive LLM; MCP servers without a client are dead processes. CI cost should be predictable; AI in CI is not.

**MCP dev-time workflow**:
1. `npm run dev` (or your dev server) in one terminal.
2. In Claude Code, ask: "navigate to /game, press space 10 times, screenshot after each, describe what you see".
3. Claude drives the browser via the MCP server, returns prose + screenshots. You read its narration.
4. If a regression is found, encode a deterministic `*.spec.ts` for CI to catch next time. (MCP narration is not a CI substitute — it's a step toward writing one.)

## CI
- Run headless with `--reporter=github`; upload `playwright-report/` and traces as artifacts.
- Shard with `--shard=i/N` only after the suite is deterministic.

## Reference
- Playwright docs: https://playwright.dev/docs/intro
- Anthropic webapp-testing skill: https://github.com/anthropics/skills/tree/main/webapp-testing
