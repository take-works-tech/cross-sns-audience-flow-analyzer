---
status: active
updated: 2026-08-29
---

# Cross-cutting requirements

Nobody's feature, and therefore stated here as requirements like any other, not footnotes. Update and
rollback are delivery concerns and live in specs/10_delivery.md; the ordered product principles that
judge every Bounded item live in specs/04_principles.md; default failure semantics and the message-ID
convention live in specs/03_failure_policy.md.

### XC-020 - Message and error catalogue
- statement: every user-visible message has a stable ID in the `domain.reason` convention of specs/03_failure_policy.md; an ID never changes once shipped, and every refusal names its cause — the limit, the @Platform, or the missing data — instead of a generic failure text
- applies_when: any toast, empty state, badge, panel notice, or API error surfaced to the user
- decidedness: Bounded

### XC-021 - Localisation
- statement: the UI ships Japanese (primary authoring locale) and English via next-intl; locale follows the account setting, defaulting from the browser language; an untranslated key renders the Japanese source string, never a raw key ID; dates and numbers format per locale, numerals always tabular (specs/11_ui.md)
- applies_when: every user-visible string, including catalogue messages from XC-020
- decidedness: Bounded

### XC-022 - Accessibility
- statement: the primary UI meets WCAG 2.2 level AA — full keyboard operability, a visible focus state on every focusable element, text contrast at or above LIM-017, and no color-only encoding, so @Estimated flow stays distinguishable from @Observed flow without color per INV-003; where the OS reports prefers-reduced-motion, continuous @Particle motion is disabled (flow-animation/REQ-003); a high-contrast theme ships (specs/11_ui.md); screen-reader support covers panes, dialogs, and settings, and every value readable from the @Canvas graph is also readable as text in the detail panel
- applies_when: all themes and panes, including node labels rendered on @Platform brand colors
- decidedness: Fixed
- basis: E-007 (T1), E-008 (T1)

### XC-023 - Audit and operation logging
- statement: engine logs are structured JSON carrying request ID, internal user ID, and event kind; they record auth events (login, OAuth grant, token refresh, disconnect), @Metric series sync runs, and @Recalculation outcomes; they never contain access tokens or OAuth authorization codes (INV-001), session cookies, email addresses, or fetched platform payload bodies — personal data is minimized to internal IDs; logs are readable by operators only, and retention is an operations choice recorded in specs/10_delivery.md
- applies_when: every service in specs/01_boundaries.md that emits logs, including workers
- decidedness: Bounded

### XC-025 - Third-party licence attribution
- statement: every dependency's licence is recorded in the specs/09_technology.md dependency table before adoption; permissive licences are acceptable, network-copyleft (AGPL) code is never linked into the service, and source-available infrastructure licences (Redis RSAL, Timescale TSL) are acceptable only run unmodified as services with the choice recorded in specs/09_technology.md; shipped attribution is a licences page in the app generated from the lockfiles
- applies_when: any new package, image, font, or icon set entering the repository
- decidedness: Bounded

### XC-026 - Security and data protection
- statement: OWASP ASVS is the verification baseline; all traffic is HTTPS and every OAuth flow validates state, with PKCE where the @Platform supports it (INV-010); @Platform tokens are encrypted at rest with AES-256-GCM using a key from the environment and never reach the client, logs, or error messages (INV-001); a @Connection is disconnectable at any time, which deletes its tokens (sns-connection/REQ-003); sessions use secure, HttpOnly cookies via Auth.js (E-014 (T2)); every API response is scoped to the owning user with not-found semantics for foreign resources (INV-004); the web app sends a Content-Security-Policy with no inline script and allowlisted origins only; platform API keys exist server-side only
- default: deny - a permission check returns false unless a rule grants access
- decidedness: Fixed
- basis: E-017 (T1), E-018 (T1)
