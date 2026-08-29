# cross-sns-audience-flow-analyzer

<!-- Canonical cross-tool instructions: Codex reads this file, Claude Code imports it. One rule, one home. -->

## Non-negotiable — never skip
- **Test-first**: write/confirm a failing test before implementing.
- **Fail-closed / no silent fallback**: invalid or uncertain → raise or stop (no `return 0`, no `except: pass`).
- **Never push to the default branch**; the agent enqueues only (the forge performs the merge). A3 auto-enqueue **ON** (CI green + Review BP only); GOVERNANCE human-only.
- **Never change billing mode** (OAuth only; enforced by `billing_mode_guard.py`).
- **Fix the cause, not the symptom.** If the clean fix is out of scope, say so and stop — do not offer a
  patch-over as the recommendation. Duplicated definitions get one owner, not a second copy.

## Gate
- Merge only when **Critical = High = Medium = 0** and CI is green.

## This project
- Source: src / coverage: core logic 90% / API/boundary 80% / utilities 70% / UI/presentation 60%
- Tests: dev = changed scope (`pytest <path> -x`); CI = full; heavy/E2E PR-only.
- Available beyond the usual: `ast-grep`, `jq`, `yq`, `gh`.

Specifications live in specs/. Read specs/README.md before changing behaviour: it indexes the
glossary, limits, contracts, invariants and the per-feature specs.
