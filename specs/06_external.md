---
status: active
updated: 2026-08-29
---

# External systems

Services this project depends on but does not control. Each entry records the interface actually
targeted, auth mode, quota, flow capability (@Observed flow vs @Estimated flow only), failure modes
with required responses, and degradation. Governing rule INV-005: external failure never empties the
@Canvas — the last computed graph stays rendered with a stale marker and a stated reason. Default
failure semantics and the `domain.reason` message-ID convention live in specs/03_failure_policy.md.

### EXT-001 - YouTube Data API v3 + YouTube Analytics API
- interface: REST; Data API v3 for channel and video metadata, Analytics API v2 reports with the traffic-source dimension (insightTrafficSourceType) per E-002
- version: Data API v3; Analytics API v2
- owned_by: Google; documentation per E-002 and E-003
- auth: server-side OAuth 2.0, read-only scopes, state + PKCE validated (INV-010); tokens encrypted at rest per INV-001
- capability: @Observed flow — traffic-source rows attribute views to referrers (E-002); series also feed @Metric series for @Estimated flow
- quota: LIM-011 units/day Data API default (E-003); search endpoints carry a separate small daily call cap, so the sync planner reads channel and video lists without search; fetches paced by LIM-010 and never closer than LIM-012
- degradation: on any failure the last graph stays rendered, stale-and-stated (INV-005); exhausted quota defers fetches to the next window (sns-connection/AC-006); expired auth badges the affected nodes and prompts re-auth (sns-connection/AC-005)
- decidedness: Fixed
- basis: E-002 (T1), E-003 (T1)

| Failure mode | How it is detected | Required response | Message ID |
|---|---|---|---|
| timeout | HTTP client timeout on a report request | retry with backoff inside the same sync run; if still failing, mark the sync incomplete and keep the last @Metric series | `sync.timeout` |
| auth expired or revoked | authorization-failure response on fetch | mark the @Connection expired, badge its nodes on the @Canvas, prompt re-auth, stop fetches until re-auth completes | `sync.auth_expired` |
| daily quota exhausted | quotaExceeded error before LIM-011 is replenished | defer remaining fetches to the next quota window and record the deferral | `sync.quota_deferred` |
| rate limited | rateLimitExceeded or userRateLimitExceeded error | back off; do not retry sooner than LIM-012 | `sync.rate_limited` |
| partial or truncated report | fewer rows than the requested range, or a broken page token | persist only complete rows, flag the @Metric series gap, lower @Confidence via the data-completeness input | `sync.partial_response` |
| version or schema drift | unknown dimension or metric name, response shape mismatch | halt ingestion for the affected report, keep prior data, raise an operator alert | `sync.schema_drift` |

### EXT-002 - Instagram API with Instagram Login
- interface: REST Graph endpoints for professional-account profile, media, and insights
- version: Instagram Platform API with instagram_business_* scopes (post-2025-01 scope model per E-004)
- owned_by: Meta; documentation per E-004
- auth: server-side OAuth 2.0 Instagram Login; requires a professional (business or creator) account (E-004); tokens per INV-001
- capability: @Estimated flow only in r1 — insights expose engagement metrics, not referral @Traffic source rows
- quota: Meta per-app and per-user rate limits reported via usage headers; fetches paced by LIM-010 and never closer than LIM-012
- degradation: stale-and-stated per INV-005; expired login badges nodes and prompts re-auth (sns-connection/AC-005)
- decidedness: Fixed
- basis: E-004 (T1)

Timeout, rate limit, partial response, and schema drift behave as in EXT-001, same message IDs.
Platform-specific modes:

| Failure mode | How it is detected | Required response | Message ID |
|---|---|---|---|
| personal (non-professional) account | OAuth callback lacks a professional account | refuse the @Connection and state the professional-account requirement | `connect.professional_account_required` |
| deprecated scope rejected | scope error at token exchange or refresh | halt fetches, keep prior data, raise an operator alert to migrate scopes | `sync.schema_drift` |

### EXT-003 - TikTok Display API
- interface: REST; user.info.basic and video.list scopes return profile and video metadata only (E-005)
- version: Display API v2
- owned_by: TikTok; documentation per E-005
- auth: server-side OAuth 2.0; tokens per INV-001
- capability: @Estimated flow only — no @Traffic source report exists (E-005); which fields yield a historical @Metric series, and at what granularity, is tracked as OPEN-006
- quota: per-client daily request quotas on Display API endpoints; fetches paced by LIM-010 and never closer than LIM-012
- degradation: stale-and-stated per INV-005; if no historical series is obtainable, edges from TikTok nodes rest on point-in-time snapshots and their @Confidence reflects the thinner data
- decidedness: Fixed
- basis: E-005 (T1)

Timeout, auth expiry, rate limit, partial response, and schema drift behave as in EXT-001, same
message IDs. Additional mode:

| Failure mode | How it is detected | Required response | Message ID |
|---|---|---|---|
| video list without usable series | response fields carry no time-dimensioned metrics | store snapshots, record the estimation-input gap for the detail panel, leave OPEN-006 open | `sync.partial_response` |

### EXT-004 - X API v2
- interface: REST v2 endpoints for posts, users, and public metrics; no traffic-source analytics exists (E-006)
- version: API v2
- owned_by: X Corp; documentation per E-006
- auth: server-side OAuth 2.0 with PKCE (INV-010); tokens per INV-001
- capability: @Estimated flow only (E-006)
- quota: credit-based pay-per-usage pricing (E-006); the supported access tier at launch is undecided — the read budget, and whether X ships in r1 at all, depend on OPEN-001; LIM-012 still floors re-sync spacing
- degradation: stale-and-stated per INV-005; when the purchased read budget is exhausted, fetches defer exactly like quota exhaustion in EXT-001
- decidedness: Open
- open: OPEN-001

Timeout, auth expiry, rate limit, partial response, and schema drift behave as in EXT-001, same
message IDs. Additional mode:

| Failure mode | How it is detected | Required response | Message ID |
|---|---|---|---|
| read budget exhausted | usage-cap error from the credit model | defer fetches to the next budget window, record the deferral, surface remaining-budget state on the @Connection | `sync.quota_deferred` |

### EXT-005 - Arbitrary web servers (Metadata fetch targets)
- interface: anonymous HTTPS GET of the submitted URL; parse OpenGraph tags, fall back to oEmbed discovery, then to the title tag and domain
- version: Open Graph protocol and oEmbed as published; no server version is ever assumed — every response is untrusted input
- owned_by: each target site's operator; no contract exists
- auth: none; robots.txt honored, an identifying user agent sent
- quota: self-imposed — timeout LIM-006 per fetch, cache TTL LIM-007 per normalized URL, low per-host concurrency
- degradation: failure or timeout yields a provisional @Node marked title-pending with manual retry (url-nodes/AC-005); repeat requests inside LIM-007 are served from cache without contacting the site (url-nodes/AC-006)
- decidedness: Bounded

| Failure mode | How it is detected | Required response | Message ID |
|---|---|---|---|
| timeout | no complete response within LIM-006 | create the provisional @Node, offer retry | `metadata.timeout` |
| non-success status or unreachable host | error status, DNS or TLS failure | create the provisional @Node with the stated reason | `metadata.fetch_failed` |
| robots.txt disallows the path | robots check before fetch | skip the fetch, create the provisional @Node stating the robots refusal | `metadata.robots_denied` |
| oversized or non-HTML body | content type or read cap exceeded mid-download | stop reading, fall back to kind icon and domain label | `metadata.unsupported_content` |
| hostile target (redirect to private or loopback address) | resolved address checked before and after each redirect | block the request, cap redirect depth, sanitize every parsed field | `metadata.blocked_target` |

### EXT-006 - Google OAuth and magic-link email (app login)
- interface: Auth.js v5 providers — Google OAuth/OIDC for social login, an email provider for magic links; distinct from platform @Connection auth
- version: next-auth v5 (Auth.js); Google OAuth 2.0/OIDC
- owned_by: Google (identity) and the chosen email delivery service; the choice is recorded in specs/08_decisions.md
- auth: sessions in secure HttpOnly cookies; policy in specs/07_cross_cutting.md; state validated per INV-010
- quota: email provider send limits; r1 login volume sits far below them
- degradation: if Google OAuth is unavailable, magic-link login still works, and vice versa; existing sessions keep working through either outage
- decidedness: Bounded

| Failure mode | How it is detected | Required response | Message ID |
|---|---|---|---|
| provider error or user denial | error in the OAuth callback | show the provider's reason, create no session | `auth.provider_error` |
| state or PKCE mismatch | callback parameters fail validation | reject the login attempt (INV-010), log the event without tokens or PII | `auth.state_mismatch` |
| magic-link email not delivered | provider send error or bounce | state the delivery failure, offer resend and the Google OAuth path | `auth.email_failed` |

### EXT-007 - Managed PostgreSQL + TimescaleDB and Redis
- interface: PostgreSQL wire protocol via SQLAlchemy 2; TimescaleDB hypertables hold every @Metric series; Redis backs the metadata cache, the Celery broker, and debounce state
- version: PostgreSQL 16 with TimescaleDB; Redis 7.2 (licence pin recorded in specs/09_technology.md)
- owned_by: the cloud provider's managed services; provider selection is decided in specs/10_delivery.md
- auth: TLS connections; credentials from environment secrets, never in code or logs
- quota: managed-tier connection and memory limits; pool sizes set in delivery configuration
- degradation: Redis loss degrades — @Metadata fetch runs uncached and scheduled jobs pause until the broker returns, while the API and saved @Project data keep serving; Postgres loss stops the API — the client keeps the loaded graph rendered read-only with a stale marker (INV-005)
- decidedness: Bounded

| Failure mode | How it is detected | Required response | Message ID |
|---|---|---|---|
| connection refused or timeout | health endpoint check and driver error | retry with backoff, report degraded status on the health endpoint | `datastore.unavailable` |
| Redis eviction or flush | cache miss where an entry was expected | treat as cache miss and refetch; re-enqueue scheduled jobs from Postgres state | `datastore.cache_lost` |
| failover or restart mid-write | transaction error on commit | roll back; autosave keeps changes in memory and retries (projects/AC-006) | `datastore.write_failed` |
| storage capacity exhausted | managed-tier capacity alert or write refusal | refuse further writes before corruption, alert the operator | `datastore.capacity` |
