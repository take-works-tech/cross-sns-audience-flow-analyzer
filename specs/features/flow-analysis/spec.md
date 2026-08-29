---
status: active
updated: 2026-08-29
---

# Feature: Flow analysis engine

## Users and purpose

- intended user: the analysis engine, acting for a creator who runs accounts on several platforms
- job to be done: turn connected-platform data and URL events into @Observed flow and @Estimated flow with honest @Confidence
- success condition: every @Edge value can name its data source, method, and @Confidence

## Out of scope

- causal-inference guarantees (results are reported as estimation, never causation)
- cross-user data pooling
- model training on user data
- ad-attribution integrations

## Files and interfaces involved

- services/engine/app/analysis/ (planned) — lag cross-correlation and @Confidence scoring, MOD-004
- services/engine/app/limits.py (planned) — engine-facing limits LIM-009, LIM-014, LIM-015
- CT-002 FlowEdge and CT-006 RecalcJob in specs/contracts/ — the output and job shapes
- CT-005 MetricPoint — the @Metric series input read from the hypertable

## Requirements

### REQ-001 - Observed flow from platform traffic sources
- priority: MUST
- phase: r1
- decidedness: Fixed
- basis: E-002 (T1)
- acceptance:
  - AC-001: When YouTube Analytics traffic-source rows attribute views to a connected source, the system shall record an @Observed flow for that source, target, and @Period with the reported count
  - AC-002: If a @Platform exposes no @Traffic source report (TikTok, X), then the system shall produce @Estimated flow only for edges from that platform and label them Estimated
  - AC-003: The system shall store every flow result keyed by source @Node, target @Node, and @Period

### REQ-002 - Estimated flow and confidence scoring

Design intent: prefer no edge over a fabricated one; every emitted value names its method and inputs.
Whether correlation strength converts to an absolute person count or stays rate-only is undecided (OPEN-005).

- priority: MUST
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-004: When two placed nodes have overlapping @Metric series of at least LIM-014 points, the system shall compute lag cross-correlation within the window LIM-015, aligned with posting-time events, to produce an @Estimated flow
  - AC-005: The system shall compute @Confidence in the range 0 to 1 from data completeness, correlation strength, and @Lag plausibility, and attach it to every @Edge
  - AC-006: If overlapping data is below LIM-014 points, then the system shall produce no automatic @Edge and record the reason for display in the detail panel

### REQ-003 - Recalculation triggers with debounce

Design intent: immediate response over exact computation — the v1.0 §10.4 triggers coalesce into one
job, and the previous result stays visible until the new one lands.

- priority: MUST
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-007: When any trigger fires (node placed, edge created, edge removed, node deleted, @Period change, threshold change, filter change, @Connection data update), the system shall enqueue one @Recalculation after the debounce LIM-009
  - AC-008: While a @Recalculation runs, the system shall show a progress indicator and keep the previous edges rendered
  - AC-009: If a @Recalculation job fails, then the system shall keep the last computed edges, mark the results stale, and surface the failure reason

### REQ-004 - Anomaly detection and period comparison

Delegated: the expected-range model and the comparison presentation are implementation decisions.

- priority: SHOULD
- phase: later
- decidedness: Delegated
- acceptance:
  - AC-010: When a @Metric series deviates beyond its modeled range, the system shall flag the @Node and list the anomaly in the detail panel
  - AC-011: When the user selects two @Period ranges, the system shall show the flow delta per @Edge between the ranges

### REQ-005 - Anomaly notifications

Delegated: channel set and retry policy follow the defaults in specs/03_failure_policy.md.

- priority: COULD
- phase: later
- decidedness: Delegated
- acceptance:
  - AC-012: Where notifications are enabled, the system shall deliver anomaly flags to the user's chosen channel
  - AC-013: If notification delivery fails, then the system shall keep the anomaly visible in-app and retry per the failure policy

## End-to-end verification

Seed a project with a connected YouTube account whose Analytics report attributes views to a placed
post URL, plus two nodes whose @Metric series overlap by at least LIM-014 points and one pair below
that floor. Run @Recalculation: the YouTube edge appears as @Observed flow carrying the reported
count; the correlated pair appears as @Estimated flow labeled Estimated with @Confidence between 0
and 1 and a stated @Lag; the under-floor pair yields no edge and the detail panel names the reason;
killing the worker mid-job leaves the previous edges rendered with a stale marker and reason.
