---
name: database-migration-expert
description: Database migration guardrail. Triggers: database migration, schema change, Alembic, Prisma, Flyway, Drizzle, ALTER TABLE, upgrade/downgrade.
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Database Migration Guardrail

> verified: 2026-08-09. stability=stable. Re-verify quarterly via `cckit verify-skills`.

## Use when
- Authoring or reviewing schema migrations (Alembic, Prisma, Flyway, Drizzle, Liquibase, Knex).
- Diagnosing schema drift between code (ORM models) and the database.
- Planning a destructive change (column drop, type narrowing, constraint addition) with a rollback path.

## Anti-patterns to refuse
- Do NOT edit a migration that has already been applied to any shared environment (staging/prod, or even a teammate's local DB) — create a new forward migration instead. Editing in place breaks every other checkout.
- Do NOT ship an `ALTER TABLE` (column drop/rename, type change, NOT NULL addition) without a documented rollback plan AND a verified `down()` / `downgrade` — "we'll just restore from backup" is not a plan.
- Do NOT run irreversible data migrations (deletes, in-place type coercion, denormalization) without a fresh logical backup taken in the same deployment window — and confirm the restore path actually works.
- Do NOT omit `down()` / `downgrade` "because we never roll back" — the empty stub forces the author to make rollback impossibility explicit, and tooling (Alembic, Flyway undo) relies on it.
- Do NOT mix DDL and large DML in the same migration — long row-update locks block DDL behind them; split into separate migrations.
- Do NOT use ORM model imports inside migration files — the model evolves, the migration must stay frozen. Use raw SQL or the migration tool's table-reflection helpers.

## Common pitfalls
- Schema drift: the ORM `models.py` diverged from the latest migration. Run `alembic check` / `prisma migrate diff` / `drizzle-kit check` in CI — drift discovered in prod is a P1.
- Downgrade testing: `down()` is almost never exercised. Add a CI job that runs `upgrade head` → `downgrade -1` → `upgrade head` on a disposable DB.
- Concurrent index creation: in Postgres, `CREATE INDEX` locks writes; use `CREATE INDEX CONCURRENTLY` for large tables — but it cannot run inside a transaction, so disable the migration tool's auto-transaction (Alembic: `op.execute` with `autocommit_block`).
- Transaction wrapping: Postgres supports transactional DDL, MySQL does not. A failing 3-statement migration leaves MySQL half-applied — design each migration to be idempotent on retry.
- Vendor-specific SQL: `JSONB`, `GENERATED ALWAYS`, partial indexes, `IF NOT EXISTS` on indexes — none portable. Pin the DB engine in CI to match production exactly.
- NOT NULL on existing column: requires a default OR a 3-step migration (add nullable → backfill → enforce NOT NULL). Single-step fails on any non-empty table.

## When in doubt
> Read official docs FIRST (links below). Verify the current API and migration semantics before implementing — migration tools change defaults across major versions.

## Authoritative references
- https://alembic.sqlalchemy.org
- https://www.prisma.io/docs/orm/prisma-migrate
- https://flywaydb.org
- https://orm.drizzle.team/docs/migrations

## cross-sns-audience-flow-analyzer project notes
- Alembic owns all schema changes (engine service); no manual DDL. PostgreSQL 16 + TimescaleDB.
- `metrics_timeseries` is a hypertable — mind chunk intervals and compression policies when
  migrating; test migrations against a timescaledb container, not vanilla postgres.
- Core tables: users, projects, connections (encrypted tokens), nodes, edges, flows
  (per source/target/period), metrics_timeseries, jobs. Shapes follow `specs/contracts/`.
- Never migrate away observed raw metrics; estimated flows are recomputable, raw series are not.
