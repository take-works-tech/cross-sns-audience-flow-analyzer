---
name: coding-standards
description: "cross-sns-audience-flow-analyzer coding standards: types, errors, naming. Triggers: coding style, type hints, error handling, lint, PEP 8, refactor."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Coding Standards — cross-sns-audience-flow-analyzer

- Type hints / static types on all public functions. Avoid `any`/untyped escapes.
- **No silent fallback**: failures propagate (explicit error / sentinel), never swallowed.
- No exception swallowing (`except: pass` etc.). catch must terminate control flow (return/raise/exit).
- Early returns over deep nesting (max ~3). Functions small (~20 lines guideline).
- Constants/defaults in ONE shared SSoT module (e.g. `constants`/`config`/`defaults`). Never redefine the
  same number or default literal across files — import it. Inline magic numbers forbidden. Clear names over comments.
- Imports ordered: stdlib / third-party / local. No function-level imports (except tests).
- Resources released in finally. Validate inputs at boundaries.
- No suppression of lint/type errors (`disable`/`ignore`) — fix the cause.
