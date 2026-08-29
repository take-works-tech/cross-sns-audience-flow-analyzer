#!/usr/bin/env bash
# Local preflight CI for cross-sns-audience-flow-analyzer.
# Mirrors the CI pipeline (lint -> type -> unit tests -> build) without a GitHub round-trip.
# Invoked by the issue-execution-flow skill at Phase D before `gh pr ready`.
#
# Loop discipline: re-run after each fix until exit 0. Two failed iterations on the same
# step is the rewrite signal (per issue-execution-flow Anti-patterns) — `/clear` and restart
# from the plan file.

set -euo pipefail

step() { printf '\n\033[1;36m[%s/%s] %s\033[0m\n' "$1" "$2" "$3"; }

step 1 4 "install dependencies"
npm ci

step 2 4 "lint + type-check"
npm ci && npx eslint . --max-warnings 0 && npx tsc --noEmit

step 3 4 "unit tests"
npm test --silent

step 4 4 "build"
npm run build

printf '\n\033[1;32mLocal CI OK.\033[0m Next: gh pr ready <pr#>\n'
