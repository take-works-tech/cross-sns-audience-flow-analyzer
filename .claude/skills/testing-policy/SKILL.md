---
name: testing-policy
description: "cross-sns-audience-flow-analyzer test policy: test-first, coverage, failures. Triggers: write a test, pytest, test failure, coverage, test-first, CI red."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Testing Policy — cross-sns-audience-flow-analyzer

- **Test-first**: write tests before implementation; confirm RED before GREEN.
- Never adjust expected values to match output. Never relax tolerances. Never skip tests.
- Layers: unit (logic) / integration (boundaries) / E2E (operation→result flow, no API mocking).
- Coverage targets: core logic high (90%+), API 80%+, utils 70%+, UI 60%+ (project defines final values).
  CI enforces the target as a gate (fail under threshold); never let coverage silently drop.
- E2E must assert state/values, not only existence (`toBeVisible`-only is forbidden).
- Run scope (avoid suite bloat): dev = only changed-area tests via the project's test runner
  (e.g. `pytest <path> -x`, `vitest run <path>`, `dart test <path>`); CI = full suite; heavy/slow
  suites (full E2E, large export jobs) = PR-only. New behavior = ONE
  authoritative test; prune duplicate/overlapping tests instead of accumulating them.
- Failure protocol: report → root-cause analysis → fix implementation (not the test).
- Exploratory findings → add a regression test after the fix (make it permanent).
