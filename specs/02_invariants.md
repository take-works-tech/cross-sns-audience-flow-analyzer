---
status: active
updated: 2026-08-29
---

# Invariants

What must always be true, written so that a machine or a mechanical review pass can judge it.
An invariant with no `checked_by` is on its way to being false: write the check with the invariant,
and prove the check can fail before trusting it.

### INV-001 - Tokens only encrypted at rest
- statement: @Platform access tokens are stored only encrypted (AES-256-GCM, key from environment) and never appear in logs, error messages, or client payloads
- checked_by: planned: services/engine/tests/test_connections.py::test_oauth_callback_stores_encrypted_token, plus a log-scrub assertion on error paths
- decidedness: Fixed
- basis: E-017 (T1)

### INV-002 - Complete edge shape
- statement: every flow @Edge carries source @Node, target @Node, @Period, type (Observed|Estimated), and @Confidence; no @Edge exists without all five (the CT-002 shape)
- checked_by: planned: services/engine/tests/test_flows.py::test_flow_key_is_source_target_period, plus CT-002 schema validation on every engine response
- decidedness: Bounded

### INV-003 - Estimation never color-only
- statement: @Estimated flow is always distinguished from @Observed flow by at least two non-color channels (dash pattern and text label); color is never the only encoding anywhere in the UI
- checked_by: planned: apps/web/tests/unit/edge-encoding.test.ts::estimated_edges_dashed_and_desaturated
- decidedness: Bounded

### INV-004 - Per-user data isolation
- statement: a user's @Project, @Connection, and @Metric series data are never readable or writable by another user; a cross-user reference answers with not-found semantics
- checked_by: planned: services/engine/tests/test_authz.py::test_owner_scoping_on_all_resources
- decidedness: Bounded

### INV-005 - Failure never empties the canvas
- statement: external @Platform API failure never empties the @Canvas: the last computed graph stays rendered with a stale marker and a stated reason (v1.0 §14.4)
- checked_by: planned: services/engine/tests/test_recalc.py::test_failure_keeps_last_results_and_reason
- decidedness: Bounded

### INV-006 - Pinned edges survive automation
- statement: @Recalculation and automatic filtering never hide or delete a @Pinned edge
- checked_by: planned: services/engine/tests/test_edges.py::test_pinned_edges_never_auto_hidden
- decidedness: Bounded

### INV-007 - Idempotent recalculation
- statement: @Recalculation is idempotent: identical inputs (nodes, edges, @Period, thresholds, series) produce identical flow results
- checked_by: planned: services/engine/tests/test_recalc.py::test_identical_inputs_identical_results
- decidedness: Bounded

### INV-008 - One home per numeric bound
- statement: every numeric bound lives in [05_limits.md](05_limits.md) and, once implemented, in exactly one code location named as its `source_of_truth`
- checked_by: validate/check_specs.py (checks 7 and 19)
- decidedness: Bounded

### INV-009 - Frozen contract only
- statement: the frontend consumes only the frozen OpenAPI contract (CT-008) through the generated TypeScript client; no hand-written request paths
- checked_by: planned: apps/web ESLint no-restricted-imports rule permitting network access only via the generated client
- decidedness: Bounded

### INV-010 - Transport and OAuth hygiene
- statement: all traffic is HTTPS; every OAuth flow validates state, and PKCE where the @Platform supports it
- checked_by: planned: services/engine/tests/test_connections.py::test_callback_rejects_missing_or_bad_state, plus deployment TLS configuration review
- decidedness: Bounded
