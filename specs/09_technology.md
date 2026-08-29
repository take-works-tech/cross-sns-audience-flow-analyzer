---
status: active
updated: 2026-08-29
---

# Technology

What this is built on, and why each piece was chosen over the alternatives. Selection order, applied
in this sequence and not by preference:

1. **An existing system that can be reused** rather than rebuilt - the cheapest component is the one
   already running, already understood and already maintained by somebody else.
2. **Broad adoption in production inside companies** - a dependency in wide commercial use has its
   failure modes documented by other people's incidents rather than by yours.
3. **A credible support horizon** - release cadence, number of maintainers, governance, and whether a
   long-term-support line exists.
4. **Fit for the requirement.**

**Novelty is not a criterion.** Being new is a reason to wait, not a reason to adopt: the failure modes
have not been found yet, and the migration path away from it does not exist.

### XC-040 - Stack
- language: TypeScript (strict) in apps/web and packages/contracts; Python 3.12 in services/engine
- framework: Next.js 15 App Router on React 19 for the web (E-010 (T2)); FastAPI with SQLAlchemy 2 and Alembic for the engine (E-011 (T2)); stack confirmed in docs/development-stack.md
- data store: PostgreSQL 16 with TimescaleDB hypertables for every @Metric series (XC-073); Redis 7.2 for cache, Celery broker, and the LIM-007 metadata cache
- build and packaging: pnpm workspaces (XC-070); one Docker image per service; Alembic forward-only migrations (10_delivery.md)
- reused rather than built: React Flow interaction model (XC-071), celery beat scheduling (XC-074), Auth.js login (XC-075), shadcn/ui and Radix primitives, openapi-typescript client generation from CT-008 (INV-009)
- decidedness: Fixed
- basis: E-010 (T2), E-011 (T2)

## Dependencies

Every row must carry a licence, evidence of adoption, and a support horizon. A blank cell is not a
formality - it is the question nobody asked before taking on the dependency (check 20).

| Dependency | Purpose | Licence | Adoption evidence | Support horizon | Alternative rejected |
|---|---|---|---|---|---|
| Next.js 15 | web app framework, routing, SSR shell (MOD-001) | MIT | Vercel-maintained; powers vercel.com; the most-downloaded React framework on npm; E-010 (T2) | active major plus security backports on the prior major | Vite SPA — loses App Router conventions and the deploy path |
| React 19 | UI runtime | MIT | Meta-maintained; runs facebook.com and instagram.com | multi-year majors; core team at Meta and Vercel | Vue, Svelte — React Flow requires React |
| TypeScript 5 | types across web and contracts; strict mode on | Apache-2.0 | Microsoft-maintained; default typed language of the npm ecosystem | quarterly minors since 2012 | untyped JS — CT-008 client types would be unchecked |
| `@xyflow/react` v12 | graph @Canvas: custom nodes, edges, viewport (XC-071) | MIT | xyflow team; open-core, maintenance funded by Pro subscriptions; E-009 (T2) | v12 line active | Cytoscape.js (XC-071) |
| Zustand | client state: selection, panes, tool modes | MIT | Poimandres collective; among the most-downloaded React state libraries on npm | v5 stable; minimal API surface | Redux Toolkit — ceremony exceeds the store |
| TanStack Query v5 (`@tanstack/react-query`) | engine reads and @Recalculation polling cache | MIT | TanStack governance; broad production React use, sponsor-funded | v5 active; prior major kept in maintenance | SWR — fewer cache and invalidation primitives |
| react-hook-form + zod | forms and runtime validation of settings and thresholds | MIT (both) | npm ecosystem standards; zod is the reference TS-first schema library | RHF v7 long-stable; zod v3/v4 lines active | Formik — dormant maintenance |
| Recharts | detail-panel time-series charts (detail-panel/REQ-003) | MIT | chart layer used by shadcn/ui charts | active releases, many maintainers | visx — lower level, more build cost |
| next-intl | i18n: JA primary, EN (07_cross_cutting.md) | MIT | most-adopted App Router i18n library on npm | active; single lead plus contributors, version pinned | react-i18next — weaker server-component story |
| Tailwind CSS v4 | styling; CSS-variable design tokens via `@theme` (11_ui.md) | MIT | Tailwind Labs; E-019 (T2) documents the token pipeline | v4 active; commercial backing (Tailwind Plus) | CSS Modules — no token pipeline shared with shadcn/ui |
| shadcn/ui + Radix UI | accessible component primitives | MIT | shadcn/ui code is vendored into the repo; Radix maintained by WorkOS | vendored code has no upgrade coupling; Radix actively released | MUI — theme runtime fights the token system |
| lucide-react | icon set, the only one allowed (XC-077) | ISC | default icon set of shadcn/ui; community-maintained Feather fork | frequent releases, many maintainers | Heroicons — narrower set |
| Geist + Noto Sans JP | UI type; tabular numerals for all values (11_ui.md) | OFL-1.1 | Geist by Vercel; Noto Sans JP by Google Fonts | static versioned assets vendored in-repo | system font stack — tabular-nums coverage differs per OS |
| Auth.js (next-auth v5) | app login: Google OAuth and magic link (XC-075) | ISC | the default Next.js auth library on npm; E-014 (T2) | v5 line active; exact version pinned | Clerk, Auth0 (XC-075) |
| openapi-typescript | generates the CT-008 client (INV-009) | MIT | standard OpenAPI-to-TS generator on npm (openapi-ts org) | v7 active | hand-written client — violates INV-009 |
| FastAPI | engine API and OpenAPI generation (MOD-002) | MIT | E-011 (T2); its docs name Microsoft and Uber production use | frequent releases; small core team, version pinned | Flask — no native OpenAPI; Django — unneeded ORM and admin |
| SQLAlchemy 2 | ORM and query layer | MIT | de-facto Python ORM, maintained since 2006 | 2.x line active | Django ORM — couples to Django |
| Alembic | forward-only migrations (10_delivery.md) | MIT | same governance as SQLAlchemy | released alongside SQLAlchemy | raw SQL migrations — no dependency ordering |
| pydantic v2 | request and response models; settings | MIT | used by FastAPI itself; company-backed v2 | active, funded team | marshmallow — no FastAPI integration |
| Celery 5 | workers and beat scheduling (MOD-003, XC-074) | BSD-3-Clause | E-013 (T2); long-documented large-scale production use | 5.x stable cadence | RQ, BullMQ (XC-074) |
| pandas + numpy + scipy | analysis core (MOD-004): lag cross-correlation within LIM-015, @Confidence scoring | BSD-3-Clause | NumFOCUS-sponsored scientific-Python standard | annual majors under foundation governance | hand-rolled numerics — untested statistics |
| httpx | async client for platform APIs and @Metadata fetch (LIM-006) | BSD-3-Clause | Encode-maintained, same org as the Starlette layer under FastAPI | active releases | requests — synchronous only |
| cryptography | AES-256-GCM sealing of @Connection tokens (INV-001) | Apache-2.0 OR BSD-3-Clause | Python Cryptographic Authority; a pip-ecosystem cornerstone | regular security-driven releases | hand-rolled crypto — excluded outright |
| PostgreSQL 16 | primary datastore (MOD-006) | PostgreSQL Licence | PostgreSQL Global Development Group; default relational store of every managed cloud | five-year support per major (PGDG policy) | MySQL — no TimescaleDB path |
| TimescaleDB | hypertables for CT-005 rows (XC-073) | Apache-2.0 (community features are TSL) | TigerData-maintained; E-012 (T2) | active; TSL terms re-checked when OPEN-007 settles hosting | InfluxDB (XC-073) |
| Redis 7.2 | cache, Celery broker, LIM-007 metadata cache, LIM-009 debounce keys | BSD-3-Clause (7.2 pinned; 7.4+ is RSALv2/SSPLv1) | ubiquitous cache and broker; Celery's reference broker | 7.2 is the final BSD release; exit path is Valkey (Linux Foundation fork) when 7.2 maintenance ends | Memcached — no queues or streams |

Adoption evidence means something checkable - a named company using it in production, download or
release statistics from the registry itself, a governing foundation. **A vendor claiming wide adoption
is marketing, not evidence** (tier T3), and may not justify a Fixed choice.

Not yet a row: the auto-layout library (dagre, elkjs, or d3-force) waits on OPEN-004, and the managed
production services (database, Redis, container runtime) wait on OPEN-007. Neither enters the
dependency table until its question closes.

## Licences

- distribution model: hosted cloud service; users receive only the browser bundle, no installed binaries
- licences not acceptable here: AGPL-3.0 and SSPL in server-side dependencies - network copyleft and service terms would attach to the hosted offering; use-restricted licences (Commons Clause, RSAL) in anything linked into shipped code. Redis 7.4+ (RSALv2/SSPLv1) is avoided by pinning 7.2, the final BSD-3-Clause release; TimescaleDB stays on its Apache-2.0 feature set - TSL community features are re-evaluated when OPEN-007 settles hosting
- attribution: dependency licences are generated from the pnpm and pip lockfiles into a /licenses page in apps/web, regenerated on every release

Copyleft obligations depend on how the software is distributed, so the two questions must be answered
together.

## Development environment

- required tool versions: Node 22 LTS, pnpm 9, Python 3.12, Docker Engine with Compose v2 - pinned in package.json `engines`, `.nvmrc`, and services/engine/pyproject.toml
- build: `pnpm install` then `pnpm build` for web and contracts; `docker compose build` for the engine image
- run: `docker compose up postgres redis` (postgres:16 with the TimescaleDB extension, redis:7.2), then `pnpm dev` for the web app and `uvicorn app.main:app --reload` plus `celery -A app.worker worker -B` for the engine
- test: `pnpm test` (Vitest unit) and `pnpm test:e2e` (Playwright) in apps/web; `pytest` in services/engine
- environment variables: DATABASE_URL, REDIS_URL, TOKEN_ENCRYPTION_KEY (32-byte AES-256-GCM key, INV-001), AUTH_SECRET, and one OAuth client id and secret pair per @Platform; every variable is listed in `.env.example`, secrets are never committed

An agent that cannot reproduce the build cannot verify anything, which disables every check the spec
otherwise provides.
