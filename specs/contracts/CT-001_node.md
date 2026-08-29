---
status: active
updated: 2026-08-29
---

# Contract: Node

### CT-001 - Node
- purpose: the @Node resource the engine API serves and the web app renders — identity, classification, metadata state, placement, and a metrics summary for one element of one @Project
- schema: schema/CT-001.json
- version: 1.0.0
- strictness: unknown fields rejected at the API boundary; client and server are generated from the same frozen surface (CT-008), so an unknown field is a defect, not an extension
- compatibility: client and server never skew — both ship from one openapi.yaml version, so a reader may assume the exact shape of its own build and nothing older
- migration: none at runtime; stored rows migrate via Alembic forward-only migrations and re-serialize into the current shape
- decidedness: Bounded

Semantics the schema cannot carry:

- `kind` is the @Node kind; it selects the node component, visual style, and metadata fields
- `platform` is null exactly when no @Platform pattern matched and the node is a generic URL node
- `thumbnail.state` mirrors the @Metadata fetch result; `pending` and `failed` render the kind icon and domain label in place of the image
- `placement.placed=false` marks an @Unplaced node: listed in the left pane, excluded from @Recalculation; `position` is null until placed
- `metrics_summary` is a read shortcut for node cards and the detail panel; the authoritative @Metric series is CT-005 rows
