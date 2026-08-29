# Contributing to cross-sns-audience-flow-analyzer

Thank you for considering a contribution. This document describes the
development workflow, branch conventions, and pull-request expectations
for cross-sns-audience-flow-analyzer.

## Development Setup

```sh
npm ci
npm run dev
```

Run the test suite locally before opening a pull request:

```sh
npm test --silent
```

## Branch Naming

One issue = one branch. Always branch from `main`.

```
<type>/<issue-number>-<short-description>
```

Allowed `<type>` values:

- `feature/` — new functionality
- `fix/` — bug fix
- `docs/` — documentation only
- `test/` — test-only change
- `refactor/` — internal refactoring without behavior change
- `chore/` — build, CI, or tooling change

## Commit Message Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject> (#<issue>)

<body — what and why, wrapped at 72 chars>

Signed-off-by: Your Name <you@example.com>
```

Allowed `<type>` values: `feat`, `fix`, `perf`, `docs`, `test`, `refactor`, `chore`.

All commits MUST be signed off (Developer Certificate of Origin). Add the
trailer automatically via `git commit -s`.

For the project's commit helper, see `/commit` (`.claude/commands/commit.md`).

## Code Style

- Follow the project's coding style: see `.claude/rules/coding-style.md`.
- No silent fallback. No suppressed lint/type errors. No skipped tests.
- Type hints / annotations on all functions.
- Tests are required for new behavior (test-first encouraged).

## Pull Request Checklist

Before requesting review, confirm:

- [ ] Branch name follows the naming convention above.
- [ ] Commits follow Conventional Commits and are signed off (`-s`).
- [ ] `npm test --silent` passes locally.
- [ ] Lint/type gates pass locally (npm ci && npx eslint . --max-warnings 0 && npx tsc --noEmit).
- [ ] New or changed behavior is covered by tests.
- [ ] Documentation (README / CHANGELOG / specs) is updated.
- [ ] The PR description references the related issue (`Closes #<n>`).
- [ ] PR opened as **Draft** until local CI passes; then mark **Ready for review**.

## Reporting Security Issues

Do **not** open public issues for security vulnerabilities. See `SECURITY.md`
for the private reporting process.
