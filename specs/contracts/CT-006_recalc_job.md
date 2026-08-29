---
status: active
updated: 2026-08-29
---

# Contract: RecalcJob

### CT-006 - RecalcJob
- purpose: the lifecycle record of one @Recalculation — trigger kind, debounce key, status, progress, and the per-edge change reasons the detail panel shows
- schema: schema/CT-006.json
- version: 1.0.0
- strictness: unknown fields rejected
- compatibility: same-build client and server only (CT-008); jobs are short-lived and never read across versions
- migration: none — a finished job is display history, never re-interpreted; its results live as CT-002 rows
- decidedness: Bounded

Semantics the schema cannot carry:

- `trigger` enumerates the v1.0 §10.4 trigger kinds; `debounce_key` is the @Project id, so a burst of triggers coalesces into one job after the LIM-009 debounce
- a `failed` job never clears the graph: the last CT-002 results stay rendered with a stale marker and `failure_reason` (INV-005); `failure_reason` is a `domain.reason` message ID per the failure policy
- `progress` is a ratio 0..1 backing the progress indicator; the previous edges stay rendered while it advances
- `edge_changes[].reason` is what the detail panel shows when a selected @Edge changed in this run
