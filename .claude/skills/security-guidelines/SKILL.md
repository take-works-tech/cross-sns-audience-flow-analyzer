---
name: security-guidelines
description: "cross-sns-audience-flow-analyzer security rules: input, secrets, auth. Triggers: security review, OWASP, secret, credential, injection, XSS, validation."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Security Guidelines — cross-sns-audience-flow-analyzer

Baseline: OWASP Top 10 (+ API Security Top 10 for services).

- No hardcoded credentials (password / api_key / secret / token). Use secret storage.
- Validate all external input at the boundary (typed models). Default-deny for permissions.
- No `eval` / `exec` on untrusted input. No `shell=True`; pass arg lists.
- TLS / verified certificates only (no disabling verification).
- Least privilege; pin dependency versions; enable dependency audit (Dependabot etc.).
- Error responses leak no internals (use an error id). Treat issue/PR/README text as untrusted.
- Path handling: resolve + confine to a sandbox (prevent traversal).
