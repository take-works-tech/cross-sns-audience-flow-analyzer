#!/usr/bin/env bash
# SessionStart hook: warn if on the default branch.
# Safety invariant: the AI must NOT commit/push directly to main; branch first.
# Warn-only (exit 0) so it never blocks a legitimate session.
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
  echo "WARNING: on '$branch'. Create a feature branch before changes (feature/<issue>-<desc>). No direct commits to the default branch."
fi
exit 0
