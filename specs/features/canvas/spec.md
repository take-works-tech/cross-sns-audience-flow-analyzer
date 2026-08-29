---
status: active
updated: 2026-08-29
---

# Feature: Network canvas and node presentation

## Users and purpose

- intended user: a creator arranging their cross-SNS network of accounts, posts, and pages
- job to be done: arrange nodes on the central @Canvas and read the whole network at a glance
- success condition: drag-and-drop placement, kind-distinct node styles, and pan/zoom that stays responsive at spec scale (LIM-001 nodes, LIM-002 edges)

## Out of scope

- 3D or WebGL scene rendering
- free-form drawing and annotations
- offline editing
- automatic subgraph decomposition (v1.0 §20)

## Files and interfaces involved

- apps/web/src/features/canvas/ (planned) — React Flow (`@xyflow/react` v12) canvas with one custom component per @Node kind (E-009)
- apps/web/src/features/canvas/fps-governor.ts (planned) — frame-rate monitor and quality stepper shared with the flow-animation feature
- packages/contracts/src/limits.ts (planned) — frontend home of LIM-001, LIM-002, LIM-003, LIM-004, LIM-005, LIM-019
- CT-001 Node and CT-003 ProjectDocument — node payloads and saved canvas positions

## Requirements

### REQ-001 - Drag-and-drop placement and layout
- priority: MUST
- phase: r1
- decidedness: Bounded
- intent: placement is direct manipulation; the automatic layout algorithm (dagre vs elkjs vs d3-force) is tracked by OPEN-004
- acceptance:
  - AC-001: When the user drags a @Node from the @Unplaced node list onto the @Canvas, the system shall place it at the drop position and include it in @Recalculation
  - AC-002: The system shall let the user toggle between automatic and manual layout, and automatic layout shall avoid node overlap
  - AC-003: When a @Node moves, the system shall redraw its connected @Edge paths in the same frame

### REQ-002 - Node-kind visual styles with dual encoding
- priority: MUST
- phase: r1
- decidedness: Bounded
- intent: kind must survive color loss (INV-003 dual-channel rule); brand color is identity only, never the sole signal
- acceptance:
  - AC-004: The system shall render each @Node kind with its own component so that kind is distinguishable by icon, shape, and label without relying on color
  - AC-005: The system shall use platform brand color only as node identity and shall keep all text contrast at or above LIM-017
  - AC-006: If a thumbnail is missing, then the system shall render the node with its kind icon and domain label in place of the image

### REQ-003 - Navigation and interaction performance
- priority: MUST
- phase: r1
- decidedness: Fixed
- basis: E-001 (T1)
- acceptance:
  - AC-007: The system shall support pan, zoom, and multi-select on graphs up to LIM-001 nodes and LIM-002 edges at the frame-rate target LIM-003
  - AC-008: If the measured frame rate falls below LIM-004, then the system shall reduce @Flow animation quality in the order defined in flow-animation/REQ-002 before reducing interaction handling
  - AC-009: When a saved project opens, the system shall render the interactive @Canvas within LIM-005

### REQ-004 - Node filters and congestion aids
- priority: SHOULD
- phase: later
- decidedness: Bounded
- intent: keep the graph readable past LIM-001 by filtering, neighborhood dimming, and group badges rather than shrinking nodes
- acceptance:
  - AC-010: When the user sets a node filter, the system shall show only nodes of the selected @Platform or @Node kind and hide edges whose endpoint is hidden
  - AC-011: When the user selects a @Node, the system shall dim all nodes and edges outside its direct neighborhood
  - AC-012: If the visible node count exceeds LIM-001, then the system shall aggregate small nodes into group badges until the visible count is within LIM-001

### REQ-005 - Touch interaction on tablets
- priority: COULD
- phase: later
- decidedness: Delegated
- intent: touch gesture ergonomics are delegated to implementation; the pane-collapse breakpoint is bound by LIM-019
- acceptance:
  - AC-013: Where a touch device is used, the system shall support pinch zoom, pan, and node drag
  - AC-014: If the viewport is narrower than LIM-019, then the system shall collapse the side panes into drawers

## End-to-end verification

Open the seeded project at LIM-001/LIM-002 scale. Drag a node from the unplaced list onto the canvas
and observe placement plus a triggered recalculation; toggle automatic layout and confirm no
overlapping nodes; pan, zoom, and drag while measuring frame rate against LIM-003; throttle the CPU
until the rate falls below LIM-004 and observe animation quality stepping down before interaction
handling; reload the project and confirm the first interactive canvas render within LIM-005.
