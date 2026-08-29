---
status: active
updated: 2026-08-29
---

# Feature: projects, save and restore

## Users and purpose

- intended user: a creator running several separate analyses (main SNS, product funnel, campaign) under one account
- job to be done: keep each analysis as its own @Project and never lose a layout
- success condition: autosave with visible save state, and exact restoration of the graph on reload

The sample-data onboarding project (v1.0 §16.1) is undecided; tracked as OPEN-003 in specs/08_decisions.md.

## Out of scope

- realtime co-editing
- comments (v1.0 §20)
- project version branching
- team workspaces

## Files and interfaces involved

- planned: apps/web project list, autosave store, save-state indicator
- planned: services/engine project CRUD, owner scoping, share links
- CT-003 ProjectDocument (the autosave payload reload restores); LIM-008 in specs/05_limits.md
- INV-004 (owner isolation) is enforced here

## Requirements

### REQ-001 - Project management and isolation
- priority: MUST
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-001: When the user creates a project, the system shall open an empty @Canvas scoped to that @Project
  - AC-002: The system shall keep every @Project, @Connection, and @Metric series readable only by its owning user
  - AC-003: If a request references another user's @Project, then the system shall refuse with not-found semantics and log no content

### REQ-002 - Save and restore
- priority: MUST
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-004: When the user changes nodes, positions, edges, filters, @Period, or pinned state, the system shall autosave after the debounce LIM-008 and show the save state
  - AC-005: When the user reopens a @Project, the system shall restore node positions, edges, thresholds, filters, and @Period exactly as saved
  - AC-006: If autosave fails, then the system shall show an unsaved indicator, keep the changes in memory, and retry on the next change or manual save

### REQ-003 - Project sharing
- priority: SHOULD
- phase: later
- decidedness: Bounded
- acceptance:
  - AC-007: When the owner shares a @Project, the system shall issue a read-only link that shows the graph without exposing any @Connection credential
  - AC-008: If a share link is revoked, then the system shall refuse access to it from that moment

### REQ-004 - Report export
- priority: COULD
- phase: later
- decidedness: Delegated
- acceptance:
  - AC-009: When the user requests a report, the system shall export the current view and its key flows for the selected @Period as a document
  - AC-010: If report generation fails, then the system shall keep the on-screen state unchanged and show the failure reason

## End-to-end verification

Create a project, place nodes and edges, change thresholds and the period, and watch the save state
flip to saved after the LIM-008 debounce; reload and confirm positions, edges, thresholds, filters,
and period match exactly. Request the same project as a second user and observe not-found. Cut the
network, edit, and confirm the unsaved indicator persists until a retry succeeds.
