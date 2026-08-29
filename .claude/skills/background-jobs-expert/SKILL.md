---
name: background-jobs-expert
description: Background jobs and queue guardrail. Triggers: Celery, BullMQ, Sidekiq, Cloud Tasks, SQS, job queue, worker, async task, dead-letter.
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Background Jobs Guardrail

> verified: 2026-08-09. stability=stable. Re-verify quarterly via `cckit verify-skills`.

## Use when
- Designing or reviewing a job/queue system (Celery, BullMQ, Sidekiq, Cloud Tasks, SQS, RQ, Arq).
- Diagnosing duplicate execution, stuck jobs, or DLQ buildup.
- Setting retry, timeout, or autoscaling policy for workers.

## Anti-patterns to refuse
- Do NOT enqueue tasks without an idempotency key (or a side-effect-deduplication mechanism inside the task). At-least-once delivery is the universal default — your task WILL run twice eventually.
- Do NOT ship a task without an explicit retry policy AND exponential backoff. Infinite immediate retries DOS your downstream; no retry loses transient failures.
- Do NOT run long-running work (>1 second, anything I/O-bound on an external system) inside an HTTP request handler — the handler ties up a worker, blows past load-balancer timeouts, and gives the user no progress feedback. Enqueue and return 202.
- Do NOT call blocking I/O (`requests.get`, sync DB drivers) inside an async worker (Arq, BullMQ, asyncio Celery) — one slow request starves the entire event loop. Use the async client or a sync worker pool.
- Do NOT operate a queue without a dead-letter queue (DLQ) + an alarm on DLQ depth. Without it, poison messages either retry forever (bill explosion) or vanish silently (data loss).
- Do NOT use task arguments that include large payloads (file contents, images) — store in S3/blob and pass a reference. Large payloads bloat the broker, slow serialization, and break broker limits (SQS 256 KB).

## Common pitfalls
- At-least-once vs at-most-once: SQS standard, Celery, BullMQ, Sidekiq are all at-least-once by default. SQS FIFO and Cloud Tasks offer exactly-once-ish guarantees but with throughput/cost limits. Assume duplicates; design idempotent.
- Dead-letter handling: a DLQ that no one reads is just slower data loss. Schedule a recurring DLQ triage; build a replay tool; alarm on depth >0 sustained.
- Schedule vs queue: cron-style "run every 5 min" needs a scheduler (Celery Beat, BullMQ repeat, Cloud Scheduler → Cloud Tasks). Using a queue alone with `sleep` inside a task wastes a worker and breaks on restart.
- Worker autoscaling: scaling on CPU misses I/O-bound workloads. Scale on queue depth (SQS `ApproximateNumberOfMessagesVisible`, Redis `LLEN`). Set a sensible max — runaway autoscaling can hammer a downstream API into a 429 spiral.
- Task timeouts: every task needs a soft timeout (graceful) AND a hard timeout (SIGKILL). Without them, a stuck task pins a worker forever. Celery: `time_limit` + `soft_time_limit`; BullMQ: `timeout`.
- Visibility timeout (SQS) / ack window: if the task takes longer than the visibility timeout, the broker re-delivers it WHILE the original is still running → duplicate execution. Match timeout to p99 task duration with margin.
- Ordering: most queues do NOT guarantee order across workers. If order matters (per-user event stream), use a FIFO queue with a message group key, or shard by key into separate queues.

## When in doubt
> Read official docs FIRST (links below). Queue semantics (delivery guarantees, retry, DLQ) differ significantly between systems — never assume parity.

## Authoritative references
- https://docs.celeryq.dev
- https://docs.bullmq.io
- https://aws.amazon.com/sqs/
- https://cloud.google.com/tasks/docs

## cross-sns-audience-flow-analyzer project notes
- Celery on Redis (broker + result backend), beat for scheduled metric syncs per platform quota.
- Job families: `sync.<platform>` (pull metrics into TimescaleDB), `analyze.recalculate`
  (flow recomputation), `fetch.url-metadata` (OG/oEmbed, 5s timeout, Redis-cached 24h).
- Recalculation triggers (spec §10.4) are debounced — canvas edits enqueue one coalesced job,
  not one per drag event. UI shows lightweight progress; results transition smoothly.
- Jobs must be idempotent and safe to retry; a failed sync marks affected nodes stale rather
  than corrupting the graph (fail-closed, see `specs/03_failure_policy.md`).
