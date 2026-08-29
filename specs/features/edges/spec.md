---
status: active
updated: 2026-08-29
---

# Feature: Edges: automatic display and manual editing

## Users and purpose

- intended user: a creator reading and shaping the flow relations between their placed nodes
- job to be done: see flow relations appear as edges, tune thresholds, and connect, disconnect, or re-route edges by direct manipulation
- success condition: every visible edge is explainable and every manual edit triggers recalculation

## Out of scope

- user-defined edge colors
- edges between different projects
- edge bundling (tracked under canvas/REQ-004 congestion aids)
- undirected edges

## Files and interfaces involved

- apps/web/src/features/edges/ (planned) — edge components, encoding, threshold and filter controls
- services/engine/app/edges.py (planned) — manual edge CRUD, duplicate refusal, edge-kind persistence
- packages/contracts/src/limits.ts (planned) — frontend home of LIM-013, the default @Confidence threshold
- CT-002 FlowEdge and CT-003 ProjectDocument — edge payloads and saved per-edge settings

## Requirements

### REQ-001 - Automatic edge display with thresholds and filters
- priority: MUST
- phase: r1
- decidedness: Bounded
- intent: automatic edges come only from @Recalculation results; thresholds default to LIM-013 and are user-adjustable per @Project
- acceptance:
  - AC-001: When @Recalculation completes, the system shall display an @Edge for every flow meeting the user's thresholds for count, rate, and @Confidence (default LIM-013)
  - AC-002: When the user changes a threshold or display filter (@Observed flow only, @Estimated flow only, @Period, @Node kind), the system shall update the visible edges without a page reload
  - AC-003: If no flow meets the thresholds, then the system shall keep all nodes rendered and state that no edges meet the current thresholds

### REQ-002 - Manual connect, disconnect, reconnect
- priority: MUST
- phase: r1
- decidedness: Bounded
- intent: edge editing mirrors node editing as direct manipulation; an @Edge is unique per source, target, and @Period (INV-002 key)
- acceptance:
  - AC-004: When the user drags from one @Node to another, the system shall create a manual @Edge and open its settings
  - AC-005: When the user deletes a selected @Edge via the Delete key or context menu, the system shall remove it and trigger @Recalculation
  - AC-006: When the user drags an @Edge endpoint onto a different @Node, the system shall re-attach the edge and trigger @Recalculation
  - AC-007: If a new @Edge would duplicate an existing edge with the same source, target, and @Period, then the system shall refuse creation and highlight the existing edge

### REQ-003 - Edge kinds and per-edge settings
- priority: SHOULD
- phase: r1
- decidedness: Bounded
- intent: two manual kinds only — @Analysis-assist edge feeds @Recalculation, @Pinned edge is display-stable under INV-006
- acceptance:
  - AC-008: The system shall record each manual @Edge as either an @Analysis-assist edge (included in @Recalculation) or a @Pinned edge (always displayed)
  - AC-009: When creating an @Edge, the system shall offer per-edge thresholds, @Period, auto-update flag, and edge kind
  - AC-010: While automatic hiding is active, the system shall never hide a @Pinned edge

### REQ-004 - Edge visual encoding and labels
- priority: MUST
- phase: r1
- decidedness: Bounded
- intent: volume, @Confidence, and direction each get one visual channel; @Estimated flow is separated from @Observed flow by non-color channels per INV-003
- acceptance:
  - AC-011: The system shall encode flow volume as edge thickness, @Confidence as edge opacity, and direction as an arrowhead
  - AC-012: The system shall render @Estimated flow edges dashed and desaturated, distinguishable from @Observed flow without relying on color
  - AC-013: When an @Edge is hovered or selected, the system shall show count, rate, @Confidence, flow type, and @Period

## End-to-end verification

On a recalculated project, raise the @Confidence threshold and watch automatic edges drop out while
every pinned edge stays; drag between two nodes, set the new edge as analysis-assist, and observe a
recalculation; delete it with the Delete key and observe another recalculation; attempt to create a
duplicate of an existing edge and observe refusal with the existing edge highlighted; hover an
estimated edge and confirm dashed, desaturated rendering plus count, rate, @Confidence, flow type,
and @Period.
