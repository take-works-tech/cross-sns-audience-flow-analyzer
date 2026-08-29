# Confirmed Stack — web

> Confirmed stack (verified: 2026-06-08). **Develop unified to this**.

## Frameworks (confirmed)
| Axis | Language | Framework |
|---|---|---|
| frontend | TypeScript | **React (Next.js)** |
| backend | Python | **FastAPI** |
| ui_framework | TypeScript | **shadcn/ui (Radix + Tailwind)** |
| deployment | - | Deploy to cloud |

## Security baseline (required)
- OWASP Top 10
- OWASP ASVS
- Content-Security-Policy
- secure/HttpOnly cookies
- Dependency audit (Dependabot/npm audit)

## Agent composition
- builder, reviewer, test-runner, code-reviewer-ci, quality-verifier, integrity-verifier

## Development sequence (strict)
1. fix spec/AC
2. data-model
3. complete backend API (+tests)
4. freeze API contract (OpenAPI)
5. frontend (against frozen contract)
6. integration
7. E2E + visual
8. security review (OWASP)
9. perf
