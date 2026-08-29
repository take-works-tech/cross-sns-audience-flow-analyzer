---
name: design-principles
description: "UI design rules: 4px grid, a11y, contrast 4.5:1, i18n. Triggers: UI, GUI, frontend, React, component, screen, dashboard, design, CSS, HTML."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Design Principles — cross-sns-audience-flow-analyzer

Precise, minimal, consistent UI (Linear/Stripe-grade). Every pixel matters.

- Spacing on a consistent grid (e.g. 4px). Align to a type scale; limit font sizes/weights.
- Accessibility: contrast ≥ 4.5:1 for text; labels/roles on interactive elements; keyboard reachable.
- No hardcoded user-facing strings — go through i18n.
- States: loading / empty / error / success all designed (no dead ends).
- Confirm destructive actions; default focus on the safe choice.
- Prefer system consistency over novelty; reuse components.
