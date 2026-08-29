---
status: active
updated: 2026-08-29
---

# Feature: SNS account connection

## Users and purpose

- intended user: a creator who runs accounts on several platforms (YouTube, Instagram, TikTok, X) and owns every account they connect
- job to be done: authorize the app to read account data so flow analysis has metrics to work with, without ever handling raw tokens
- success condition: the connection is listed as active with its data capability (@Observed flow or @Estimated flow only) visible before any analysis runs

## Out of scope

- publishing or posting to any platform
- ads/campaign APIs and paid attribution
- scraping HTML for metrics beyond official APIs
- analytics for accounts the user does not own

## Files and interfaces involved

- planned: services/engine/app/routers/connections.py (OAuth start/callback, connection list, disconnect)
- planned: services/engine/app/workers/sync.py (scheduled ingestion tasks)
- CT-004, the client-visible connection contract; tokens never appear in it (INV-001)
- CT-005, the ingested unit of every @Metric series
- specs/06_external.md, per-platform quotas, failure modes, and capability labels

Capability labels follow platform reality: YouTube reports @Traffic source data (E-002 (T1)); Instagram requires a professional account (E-004 (T1)) and the reachable insights depth is tracked as OPEN-002; TikTok's Display API exposes profile and video metadata only (E-005 (T1)), with series granularity tracked as OPEN-006; X v2 exposes no traffic-source analytics (E-006 (T1)), with the supported access tier tracked as OPEN-001.

## Requirements

### REQ-001 - Connect a platform account via server-side OAuth
- priority: MUST
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-001: When the user completes a @Platform OAuth flow, the system shall store the access token encrypted at rest and mark the @Connection active
  - AC-002: If the OAuth callback returns an error or denial, then the system shall show the platform's error reason and record no @Connection
  - AC-003: The system shall list each @Connection with its @Platform, account name, and data capability (@Observed flow or @Estimated flow only)

Bound: the flow runs entirely server-side; every flow validates state and uses PKCE where the platform supports it (INV-010), and tokens are stored per INV-001.

### REQ-002 - Scheduled metric ingestion
- priority: MUST
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-004: While a @Connection is active, the system shall fetch its @Metric series on the schedule in LIM-010 and never more often than LIM-012
  - AC-005: If a platform API responds with an authorization failure, then the system shall mark the @Connection expired, badge its nodes on the @Canvas, and prompt re-authentication
  - AC-006: If the daily budget LIM-011 is exhausted, then the system shall defer remaining YouTube fetches to the next quota window and record the deferral

Bound: ingestion runs on Celery beat (E-013 (T2)); LIM-010 trades freshness against platform quotas, and the YouTube daily budget is platform-set (E-003 (T1)).

### REQ-003 - Disconnect and token lifecycle
- priority: SHOULD
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-007: When the user disconnects a @Connection, the system shall delete its stored tokens and stop scheduled fetches
  - AC-008: The system shall retain already ingested @Metric series after disconnect until the user deletes them

Bound: retention keeps historical analysis working after disconnect; deleting the series is a separate, explicit user action.

### REQ-004 - EC platform connections (Shopify, BASE, Etsy)
- priority: COULD
- phase: later
- decidedness: Delegated
- acceptance:
  - AC-009: Where an EC platform connection is configured, the system shall create product-page nodes from the store catalog
  - AC-010: If an EC platform API is unavailable, then the system shall keep existing EC nodes rendered and show the failure reason

Delegated: platform choice, API surface, and sync cadence are decided at implementation time; the acceptance above bounds only the user-visible outcome.

## End-to-end verification

Connect a sandbox YouTube account and observe an active @Connection labeled @Observed flow; cancel the consent screen on a second attempt and observe the platform's stated reason with no @Connection recorded. Let the schedule run and observe @Metric series rows arriving per LIM-010, never inside the LIM-012 gap. Revoke the token at the platform, observe the expired badge on the @Canvas and the re-authentication prompt; then disconnect and confirm tokens are deleted while ingested series remain.
