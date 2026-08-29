---
status: active
updated: 2026-08-29
---

# Feature: detail and analysis panel

## Users and purpose

- intended user: a creator who has selected a @Node or @Edge on the @Canvas and wants to know why its numbers are what they are
- job to be done: understand each displayed value — where it came from, over which @Period, and with what @Confidence
- success condition: every displayed value names its source, period, and confidence, and every gap names its cause

## Out of scope

- editing metrics from the panel
- data export (report generation is projects/REQ-004)
- cross-project comparison

## Files and interfaces involved

- planned: apps/web right-pane detail panel components and time-series chart
- planned: services/engine node and edge detail endpoints
- CT-002 FlowEdge (change reason, @Lag), CT-005 MetricPoint (@Metric series rows)

## Requirements

### REQ-001 - Node details
- priority: MUST
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-001: When a @Node is selected, the system shall show name, @Node kind, URL, @Platform, thumbnail, key metrics, total inflow, total outflow, top connected nodes, and last-updated time
  - AC-002: If a metric is missing for the selected @Period, then the system shall name the missing metric and its cause (not connected, not yet fetched, or out of range)

### REQ-002 - Edge details
- priority: MUST
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-003: When an @Edge is selected, the system shall show source, target, count, rate, @Confidence, flow type, metrics used, and @Lag
  - AC-004: When @Recalculation changes a selected @Edge, the system shall show the change reason in the panel

### REQ-003 - Time-series charts
- priority: SHOULD
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-005: When a @Node or @Edge is selected, the system shall render its @Metric series for the selected @Period as a chart with tabular numerals
  - AC-006: If the series has no data in the selected @Period, then the system shall show a designed empty state naming the gap

## End-to-end verification

In the seeded project, select a node and confirm every REQ-001 field renders with a last-updated time;
select an edge and confirm count, rate, confidence, flow type, metrics used, and lag; trigger a
recalculation that changes that edge and confirm the change reason appears; narrow the period to a
range with no data and confirm the empty state names the gap instead of showing a blank chart.
