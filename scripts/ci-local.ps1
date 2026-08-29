# Local preflight CI for cross-sns-audience-flow-analyzer.
# Mirrors the CI pipeline (lint -> type -> unit tests -> build) without a GitHub round-trip.
# Invoked by the issue-execution-flow skill at Phase D before `gh pr ready`.
#
# Loop discipline: re-run after each fix until exit 0. Two failed iterations on the same
# step is the rewrite signal (per issue-execution-flow Anti-patterns) — `/clear` and restart
# from the plan file.

$ErrorActionPreference = "Stop"

function Step([int]$n, [int]$total, [string]$label) {
    Write-Host ""
    Write-Host "[$n/$total] $label" -ForegroundColor Cyan
}

function Assert-Ok([string]$label) {
    if ($LASTEXITCODE -ne 0) {
        Write-Host "FAIL: $label (exit $LASTEXITCODE)" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

Step 1 4 "install dependencies"
npm ci
Assert-Ok "install"

Step 2 4 "lint + type-check"
npm ci && npx eslint . --max-warnings 0 && npx tsc --noEmit
Assert-Ok "lint"

Step 3 4 "unit tests"
npm test --silent
Assert-Ok "tests"

Step 4 4 "build"
npm run build
Assert-Ok "build"

Write-Host ""
Write-Host "Local CI OK." -ForegroundColor Green
Write-Host "Next: gh pr ready <pr#>"
