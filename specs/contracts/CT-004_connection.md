---
status: active
updated: 2026-08-29
---

# Contract: Connection

### CT-004 - Connection
- purpose: the client-visible view of one @Connection — enough to list, badge, and re-authenticate a @Platform link without ever carrying a token
- schema: schema/CT-004.json
- version: 1.0.0
- strictness: unknown fields rejected; `additionalProperties: false` is load-bearing here — it structurally forbids a token field from ever entering the payload (INV-001)
- compatibility: same-build client and server only (CT-008)
- migration: none; rows re-serialize from the engine store, and token material lives in a separate encrypted column that is never mapped into this contract
- decidedness: Bounded

Semantics the schema cannot carry:

- `capability` is `observed` when the @Platform reports a @Traffic source, as YouTube does (E-002 (T1)), and `estimated-only` when it does not — TikTok (E-005 (T1)) and X (E-006 (T1)); Instagram's label is pending OPEN-002 and X launch support is pending OPEN-001
- the capability shown here is the pre-analysis honesty signal: the user sees whether a connection can yield @Observed flow or only @Estimated flow before any edge exists
- a `status` of `expired` drives the node badge on the @Canvas and the re-authentication prompt
- `scopes` is the granted scope list as the platform reported it, used for display and for planning sync inside LIM-011
- `expires_at` is null when the platform issues non-expiring or auto-refreshed tokens; refresh handling stays server-side
