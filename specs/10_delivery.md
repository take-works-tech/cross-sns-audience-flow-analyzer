---
status: active
updated: 2026-08-29
---

# Delivery and operation

How the software reaches its users and how it is kept running. The product ships as a hosted service
built from container images (docs/development-stack.md); the one delivery question still open is which
cloud provider runs them (OPEN-007). Each item below states what holds regardless of provider and names
what waits on that decision.

### XC-050 - Distribution
- form: hosted web service; three container images — web frontend (MOD-001), engine API (MOD-002), engine workers (MOD-003) — plus managed Postgres+TimescaleDB and Redis (MOD-006)
- target platforms and versions: current and previous major release of Chrome, Edge, Firefox, and Safari on desktop; viewports narrower than LIM-019 get the collapsed-pane tablet mode, phones are out of scope for r1
- images: built in CI, tagged with the git SHA, pushed to the provider registry; deploys reference immutable tags, never a moving tag
- user data: lives only in managed Postgres and Redis (MOD-006), never inside a container
- provider: TBD — cloud provider and managed-service split, tracked as OPEN-007; registry choice and image signing mechanism follow it
- decidedness: Open
- open: OPEN-007

### XC-051 - Update and rollback
- update mechanism: rolling deploy of a new image tag; frontend and engine deploy from one tagged release so the frozen OpenAPI contract (CT-008) and its generated client never diverge in production
- migrations: Alembic, forward-only; every migration must run before the new images serve traffic and must remain compatible with the previous release's images
- rollback: redeploy the previous image tag; the schema stays — a change the previous release cannot run against is split into an expand migration now and a contract migration one release later
- data written by a bad release: kept; derived flow results are rebuilt by @Recalculation from stored @Metric series (INV-007), so no derived data needs restoring
- decidedness: Bounded

**A release you cannot roll back is a release you cannot ship on a Friday.** Forward-only migrations
plus one-release schema compatibility are what make the previous image tag a complete withdrawal path.

### XC-052 - Environments
- environments: dev, stage, prod
- dev: docker-compose — Postgres 16 with the TimescaleDB extension, Redis 7, engine API with auto-reload, one Celery worker plus beat, web dev server; seeded with the sample @Project (OPEN-003)
- stage: provider-hosted at minimal size, same topology as prod; @Platform OAuth apps in test mode; migration rehearsal and restore drills run here, never in prod
- prod: provider-hosted managed Postgres and Redis (OPEN-007); HTTPS only (INV-010)
- configuration: environment variables with one schema across all three environments; the engine refuses to start and names the variable when a required one is missing
- secrets: token encryption key (INV-001), @Platform OAuth client secrets, session secret, database and Redis URLs — from a git-ignored env file in dev and the provider secret store in stage and prod; never baked into images, never logged
- decidedness: Bounded

### XC-053 - Monitoring
- what is monitored: liveness and readiness endpoints on the engine API (MOD-002); Celery queue depth, beat schedule lag, and worker heartbeat (MOD-003); per-@Connection sync outcomes — authorization failures, quota deferrals against LIM-011, time since last successful fetch versus LIM-010; @Recalculation failure rate and duration; @Metadata fetch timeout rate against LIM-006
- client telemetry: frame-rate distribution from the FPS governor, opt-in only, anonymised, carrying no @Project content and no URLs
- what alerts, and to whom: readiness failure, worker heartbeat loss, a sync-failure streak on any @Platform, and a failed backup page the operating developer — a single-operator project, so the rota is one named person; everything else is dashboard-only
- decidedness: Bounded

An alert with no named recipient is a log line. Until there is a team, the recipient is the operator;
the alert list above is the handover document when that changes.

### XC-054 - Backup and restore
- what is backed up, and how often: Postgres — @Project documents, @Connection records with encrypted tokens (INV-001), and the @Metric series hypertable — daily provider snapshot plus point-in-time recovery where the managed service offers it, encrypted at rest
- what is not: Redis — it holds only the metadata cache (LIM-007) and debounce and queue state, all rebuilt by the next @Metadata fetch and @Recalculation, so its loss costs recomputation, never data
- restore procedure: provision a fresh database from the snapshot, point a stage stack at it, verify the Alembic revision matches the deployed release, spot-check one @Project restore on the @Canvas, then switch prod connection strings
- last exercised: not yet — a restore drill on stage gates the first production deploy and repeats quarterly; a restore that has never been tried is a hypothesis
- decidedness: Bounded
