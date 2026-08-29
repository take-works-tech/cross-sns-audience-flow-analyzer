---
name: observability-expert
description: Observability guardrail. Triggers: OpenTelemetry, OTel, Prometheus, Sentry, structured logging, tracing, metrics, span, exporter.
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Observability Guardrail

> verified: 2026-08-09. stability=stable. Re-verify quarterly via `cckit verify-skills`.

## Use when
- Instrumenting a service with OpenTelemetry (traces, metrics, logs).
- Adding Prometheus metrics or Sentry error reporting.
- Designing structured-logging conventions or trace-correlation strategy.

## Anti-patterns to refuse
- Do NOT log or attach as span attributes: emails, full names, tokens, passwords, API keys, raw auth headers, full request bodies — these get indexed and replicated to every backend (Datadog, Splunk, Sentry) and become a GDPR / SOC2 incident on breach.
- Do NOT emit traces without a correlation ID propagated to logs (`trace_id` / `span_id` fields) — orphan traces and orphan logs are nearly useless for incident response.
- Do NOT define custom Prometheus metrics with unbounded label values (`user_id`, `request_id`, `path` with IDs, raw error message). Each unique combination is a new time series; cardinality explosions kill Prometheus and bill explosions kill SaaS budgets.
- Do NOT log entire request/response bodies "for debugging" in production — use sampling, redaction, or a separate debug-only sink with strict retention.
- Do NOT invent metric names ad-hoc per service (`req_count`, `requests_total`, `http_requests`) — adopt OTel semantic conventions (`http.server.request.duration`, etc.) so dashboards compose across services.

## Common pitfalls
- High-cardinality labels: `path="/users/12345/orders/678"` produces one series per user. Always template paths (`/users/{id}/orders/{id}`) before they reach the metric label.
- Sampling vs full traces: head-based sampling drops traces before they're interesting (error traces lost). Prefer tail-based sampling (collector decides after seeing the full trace) for error visibility, but it requires the OTel Collector with sufficient memory.
- Span attribute naming: follow OTel semantic conventions (`http.request.method`, `db.system`, `messaging.system`). Custom names break out-of-the-box dashboards in Datadog/Honeycomb/Jaeger.
- Log volume cost: every `INFO` log in a hot loop is real money. Budget log volume per-endpoint; demote to `DEBUG` (off in prod) or sample (`if random() < 0.01: log.info(...)`).
- Async context propagation: Python `asyncio`, Node async hooks, and goroutines each have their own propagation story. Trace IDs silently drop across `asyncio.create_task` without an instrumented runtime. Test trace continuity, do not assume.
- Sentry: PII scrubbing is opt-in for some SDKs and post-hoc — wrong-by-default. Configure `send_default_pii=False`, `before_send` filter, and verify in staging.

## When in doubt
> Read official docs FIRST (links below). OTel SDK APIs have changed between 1.x lines — verify the current version's spec before relying on examples.

## Authoritative references
- https://opentelemetry.io/docs/
- https://opentelemetry.io/docs/specs/semconv/
- https://prometheus.io/docs/
- https://docs.sentry.io

## cross-sns-audience-flow-analyzer project notes
- Structured JSON logs in the engine; log platform API quota consumption per sync job.
- PII minimization is a spec requirement (`specs/07_cross_cutting.md`): no tokens, no follower
  handles, no URLs with query strings in logs — use node/connection ids.
- Key metrics: sync job success rate per platform, recalculation latency, API quota headroom,
  canvas FPS degradation events (frontend beacon).
- Every degraded state shown to the user (stale node, failed sync) must trace to one log line.
