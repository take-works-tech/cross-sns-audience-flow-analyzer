---
status: active
updated: 2026-08-29
---

# Sources

### E-001 - Product spec v1.0 (internal, authoritative) §14 performance, §19 MVP definition
- tier: T1
- url: D:/dev/264SF/Cross-SNS Audience Flow Analyzer 仕様書 v1.0.md
- verified: 2026-08-29
- says: the internal authoritative spec; §14 非機能要件 (14.1 パフォーマンス, 14.2 視認性, 14.3 アクセシビリティ, 14.4 信頼性, 14.5 セキュリティ, lines 470-501) states the performance and reliability bounds, and §19 MVP完成定義 (line 622) states the MVP completion definition behind priority and phase assignments
- justifies: LIM-001, LIM-002, LIM-003, LIM-005, canvas/REQ-003, flow-animation/REQ-002

### E-002 - YouTube Analytics API — traffic source dimensions (insightTrafficSourceType)
- tier: T1
- url: https://developers.google.com/youtube/analytics/dimensions#insightTrafficSourceType
- verified: 2026-08-29
- says: official Google docs; the insightTrafficSourceType dimension reports values including EXT_URL, SUBSCRIBER, YT_SEARCH, RELATED_VIDEO and PLAYLIST, so platform-reported @Traffic source rows exist for YouTube and @Observed flow is possible there, never inferred
- justifies: GL-005, GL-008, flow-analysis/REQ-001, EXT-001

### E-003 - YouTube Data API v3 — default quota 10,000 units/day
- tier: T1
- url: https://developers.google.com/youtube/v3/getting-started#quota
- verified: 2026-08-29
- says: official Google docs; the default quota is 100 search.list calls, 100 videos.insert calls, and 10,000 units/day combined for all other endpoints (not a flat 10,000 for everything), so sync planning must respect the per-endpoint carve-outs inside LIM-011
- justifies: LIM-011, EXT-001, sns-connection/REQ-002

### E-004 - Instagram API with Instagram Login (professional account required)
- tier: T1
- url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
- verified: 2026-08-29
- says: official Meta docs; the API serves Instagram professional accounts (business and creator) with no linked Facebook Page required and covers insights, media, comments and messaging; legacy scopes were deprecated 2025-01-27 in favour of `instagram_business_*`
- justifies: EXT-002, OPEN-002

### E-005 - TikTok Display API — scope and available fields
- tier: T1
- url: https://developers.tiktok.com/doc/display-api-get-started
- verified: 2026-08-29
- says: official TikTok developer docs; scopes user.info.basic and video.list expose profile and video metadata only, with no referral or traffic-source report, so TikTok carries @Estimated flow only
- justifies: EXT-003, flow-analysis/REQ-001, OPEN-006

### E-006 - X API v2 — endpoints and access tiers
- tier: T1
- url: https://docs.x.com/x-api/introduction
- verified: 2026-08-29
- says: official X docs; v2 covers posts, users, Spaces, lists, DMs and trends with no traffic-source analytics (so X carries @Estimated flow only); access is now priced as pay-per-usage credits rather than named Free/Basic/Pro tiers (detail at https://docs.x.com/x-api/getting-started/pricing), so the launch-tier decision remains OPEN-001
- justifies: EXT-004, flow-analysis/REQ-001, OPEN-001

### E-007 - WCAG 2.2 — SC 1.4.3 contrast minimum, SC 1.4.1 use of color
- tier: T1
- url: https://www.w3.org/TR/WCAG22/
- verified: 2026-08-29
- says: official W3C Recommendation (2024-12-12 revision); SC 1.4.3 Contrast (Minimum) requires a 4.5:1 ratio for text and SC 1.4.1 Use of Color forbids color as the only visual means of conveying information
- justifies: LIM-017, canvas/REQ-002, INV-003

### E-008 - Media Queries Level 5 — prefers-reduced-motion
- tier: T1
- url: https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
- verified: 2026-08-29
- says: W3C Media Queries Level 5 (Working Draft, 2026-02-19, not yet a Recommendation but the canonical reference) defines the prefers-reduced-motion media feature with values no-preference and reduce
- justifies: flow-animation/REQ-003

### E-009 - React Flow (`@xyflow/react`) v12 — custom nodes, edge paths API
- tier: T2
- url: https://reactflow.dev/api-reference
- verified: 2026-08-29
- says: official xyflow-team docs; the v12 API reference covers custom node types and edge path utilities (getBezierPath, getSimpleBezierPath, getSmoothStepPath, getStraightPath), supporting kind-specific node components and a particle overlay that follows edge bezier paths
- justifies: canvas/REQ-002, flow-animation/REQ-001, specs/08_decisions.md graph-library decision

### E-010 - Next.js App Router documentation
- tier: T2
- url: https://nextjs.org/docs
- verified: 2026-08-29
- says: official Next.js (Vercel) docs covering the App Router with Getting Started, Guides and API Reference; current version shown 16.3.3
- justifies: specs/09_technology.md frontend stack row, specs/08_decisions.md app-framework decision

### E-011 - FastAPI documentation (OpenAPI generation)
- tier: T2
- url: https://fastapi.tiangolo.com/
- verified: 2026-08-29
- says: official FastAPI docs; the framework is based on the OpenAPI standard and generates the schema and interactive docs (Swagger UI at /docs, ReDoc at /redoc) automatically, which enables the frozen-contract workflow
- justifies: CT-008, INV-009

### E-012 - TimescaleDB — hypertables for time-series
- tier: T2
- url: https://www.tigerdata.com/docs/use-timescale/latest/hypertables
- verified: 2026-08-29
- says: official hypertables doc (docs.timescale.com 301-redirects here after the Timescale to TigerData rebrand); hypertables are PostgreSQL tables that automatically partition time-series rows by time into chunks with auto-created time indexes, backing @Metric series storage
- justifies: CT-005, GL-019

### E-013 - Celery — periodic tasks (beat)
- tier: T2
- url: https://docs.celeryq.dev/en/stable/userguide/periodic-tasks.html
- verified: 2026-08-29
- says: official Celery stable docs (5.6.3); celery beat schedules recurring tasks via intervals, crontab and solar schedules, the mechanism behind the LIM-010 metric sync schedule
- justifies: sns-connection/REQ-002, LIM-010

### E-014 - Auth.js v5 — OAuth and email (magic link) providers
- tier: T2
- url: https://authjs.dev/getting-started
- verified: 2026-08-29
- says: official Auth.js docs covering `next-auth@5.0.0-beta` and later; lists OAuth providers (Google among them) and magic-link sign-in via email providers
- justifies: specs/08_decisions.md app-login decision, specs/07_cross_cutting.md session security

### E-015 - The Open Graph protocol
- tier: T1
- url: https://ogp.me/
- verified: 2026-08-29
- says: official Open Graph protocol spec; defines required og:title, og:type, og:image and og:url plus optional og:description, og:site_name and og:locale and structured image/video/audio properties — the primary field set for a @Metadata fetch
- justifies: url-nodes/REQ-002, CT-007

### E-016 - oEmbed specification
- tier: T1
- url: https://oembed.com/
- verified: 2026-08-29
- says: official oEmbed spec; a consumer issues an HTTP GET to a provider endpoint and receives JSON or XML with type, dimensions, embed code and author/provider metadata, discoverable via link tags — the fallback path when OpenGraph data is absent
- justifies: url-nodes/REQ-002, CT-007

### E-017 - NIST SP 800-38D — AES-GCM mode
- tier: T1
- url: https://csrc.nist.gov/pubs/sp/800/38/d/final
- verified: 2026-08-29
- says: official NIST CSRC publication (2007-11, Dworkin); specifies GCM authenticated encryption with associated data and GMAC; NIST announced a planned revision in March 2024 and the published text remains current
- justifies: INV-001

### E-018 - OWASP ASVS
- tier: T1
- url: https://owasp.org/www-project-application-security-verification-standard/
- verified: 2026-08-29
- says: official OWASP project page; ASVS is a standard of application security verification requirements usable as an assessment yardstick and as a requirements baseline
- justifies: specs/07_cross_cutting.md security baseline

### E-019 - Tailwind CSS v4 documentation (CSS-variable design tokens)
- tier: T2
- url: https://tailwindcss.com/docs
- verified: 2026-08-29
- says: official Tailwind CSS v4 docs (v4.3 badge); the `@theme` directive defines design tokens as CSS variables that generate utilities — the token-architecture claim rests on https://tailwindcss.com/docs/theme, since the /docs landing page itself is the installation guide
- justifies: specs/11_ui.md token architecture, specs/09_technology.md styling row
