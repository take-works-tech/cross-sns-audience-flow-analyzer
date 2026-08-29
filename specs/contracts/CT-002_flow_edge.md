---
status: active
updated: 2026-08-29
---

# Contract: FlowEdge

### CT-002 - FlowEdge
- purpose: one computed or manual flow result the engine emits and the @Canvas renders — the @Edge payload keyed by source @Node, target @Node, and @Period
- schema: schema/CT-002.json
- version: 1.0.0
- strictness: unknown fields rejected; this shape is INV-002 made machine-readable, so a missing member is a validation error, never a default
- compatibility: same-build client and server only (CT-008); no cross-version readers exist
- migration: flow results are recomputed, not migrated — @Recalculation regenerates every automatic edge from its inputs (INV-007); manual edge definitions persist in CT-003
- decidedness: Bounded

Semantics the schema cannot carry:

- `type` is `observed` for @Observed flow and `estimated` for @Estimated flow; renderers must keep the two apart by dash pattern and text label, never color alone (INV-003)
- `confidence` is the @Confidence ratio 0..1 required by INV-002; the default display cutoff is LIM-013
- `count` is nullable for estimated results while OPEN-005 (rate-only display vs modeled absolute count) is unresolved; `rate` is always present
- `lag_hours` reports the @Lag the estimator selected, inside the LIM-015 window; null for observed results
- `origin` separates engine output (`auto`) from an @Analysis-assist edge (`assist`) and a @Pinned edge (`pinned`); pinned edges are exempt from automatic hiding and removal (INV-006)
- `change_reason` is what the detail panel shows after @Recalculation changes a selected edge
