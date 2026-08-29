---
name: auth-expert
description: Authentication and authorization guardrail. Triggers: OAuth, OIDC, JWT, session auth, login, refresh token, OWASP, CSRF, PKCE.
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Auth Guardrail

> verified: 2026-08-09. stability=stable. Re-verify quarterly via `cckit verify-skills`.

## Use when
- Implementing or reviewing login, signup, password reset, MFA, session, or token flows.
- Designing OAuth 2.1 / OIDC client integration (SPA, mobile, server-side).
- Auditing for OWASP ASVS L2/L3 compliance on the auth surface.

## Anti-patterns to refuse
- Do NOT hash passwords with anything other than argon2id, bcrypt, or scrypt at OWASP-recommended cost. NEVER SHA-256, NEVER MD5, NEVER PBKDF2 with low iterations.
- Do NOT issue long-lived JWTs (>1h) without a rotation strategy AND a server-side revocation mechanism — JWTs are by design unrevokable until expiry; long TTL + no rotation = stolen-token replay window of hours.
- Do NOT write custom crypto: no DIY token signing, no rolled-your-own MAC, no "I'll just XOR the secret". Use jose / paseto / cryptography library primitives.
- Do NOT store JWTs in `localStorage` — XSS reads them trivially. Use httpOnly + Secure + SameSite=Lax/Strict cookies; if the architecture forbids cookies, accept the XSS-equals-account-takeover trade-off explicitly.
- Do NOT ship password reset, login, or signup endpoints without rate limiting AND anti-enumeration response shaping (same response for "user exists / wrong password" vs "user does not exist").
- Do NOT skip CSRF protection on cookie-authenticated state-changing endpoints — SameSite=Lax helps but does NOT cover all cases (subdomain, top-level POST). Add a CSRF token or Origin-header check.

## Common pitfalls
- CSRF + SameSite: `SameSite=Lax` blocks cross-site POST but allows top-level GET — never use GET for state changes. `SameSite=Strict` breaks OAuth redirects. Most apps want Lax + CSRF token defence-in-depth.
- Refresh token rotation: on every refresh, issue a new refresh token AND invalidate the old one. If an old refresh token is presented twice, assume compromise and revoke the whole family (RFC 6819 §5.2.2.3).
- PKCE for public clients: mandatory in OAuth 2.1 for SPAs and mobile. Confidential server-side clients still benefit from it. Do not implement the implicit flow.
- Scope vs role confusion: OAuth scopes describe what a token CAN do (consent surface), roles describe what the user IS (authorization). Conflating them leaks role data into JWT claims and creates over-permissioned tokens.
- JWT `exp` vs server-side revocation: short `exp` (5–15 min) + refresh token gives you cheap revocation (next refresh fails). Long `exp` requires a denylist / introspection endpoint.
- Account enumeration via timing: bcrypt verify takes ~100 ms; "user not found" returns in 1 ms. Always run a dummy hash compare on the "user not found" branch to flatten timing.

## When in doubt
> Read official specs FIRST (links below). Auth defaults change (OAuth 2.0 → 2.1 deprecated implicit/password grants). Do not infer current best practice from old tutorials.

## Authoritative references
- https://owasp.org/www-project-application-security-verification-standard/
- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://oauth.net/2.1/
- https://openid.net/connect/
- https://datatracker.ietf.org/doc/html/rfc6819

## cross-sns-audience-flow-analyzer project notes
- Two separate auth planes — never mix them:
  1. App login: Auth.js v5 in `apps/web` (Google OAuth + email magic link), session cookie.
  2. SNS data connections: server-side OAuth flows owned by the engine (YouTube/Google, Instagram,
     TikTok, X). Tokens are per-user data, encrypted at rest (AES-256-GCM, key from env
     `TOKEN_ENC_KEY`), never sent to the browser, never logged.
- Refresh handling and re-auth prompts live in the engine; the UI only shows connection state
  (connected / expired / revoked) per `specs/features/sns-connection/spec.md`.
- Scopes: request the minimum read/analytics scopes per platform; document each scope in
  `specs/06_external.md` before adding it.
