---
status: active
updated: 2026-08-29
---

# Contract: ProjectDocument

### CT-003 - ProjectDocument
- purpose: the saved state of one @Project — what autosave writes after the LIM-008 debounce and what reload restores exactly: node placements, manual edges with per-edge settings, thresholds, filters, @Period, pinned state, and node groups
- schema: schema/CT-003.json
- version: 1.0.0
- strictness: unknown fields rejected at save; a typo in a field name must fail loudly, not silently drop a piece of layout that reload can never restore
- compatibility: a reader may load any version at or below its own, gated by the `version` field; a document newer than the reader is refused with a stated reason, never partially parsed
- migration: the engine API upgrades older documents in place on first open, forward-only, matching the Alembic migration stance; a document that fails to upgrade is left unmodified and the project opens read-only with the failure reason stated
- decidedness: Bounded

Semantics the schema cannot carry:

- `nodes[].position` is the layout of record; automatic-layout results are persisted here too, so reload never re-runs layout
- `manual_edges[].kind` is `assist` (an @Analysis-assist edge, included in @Recalculation) or `pinned` (a @Pinned edge, always displayed — INV-006); per-edge `thresholds` and `period` override the project-level values
- `thresholds.min_confidence` is seeded from LIM-013 at project creation; the stored value is the user's setting, not the default
- the document is owned by exactly one user (INV-004) and never embeds any @Connection credential; connections are referenced from CT-001 nodes, not stored here
