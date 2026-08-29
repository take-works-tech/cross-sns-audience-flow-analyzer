#!/usr/bin/env bash
# Fetch the third-party Claude Code skills this project uses.
#
# They are NOT vendored into this repository: they are other people's work under
# their own licence, and a copy here would ship without its licence text and go
# stale silently. This script pulls them into .claude/skills/, which .gitignore
# excludes, so every developer gets the upstream version.
#
#   bash scripts/install-external-skills.sh
#
# The official Anthropic frontend-design plugin is installed separately, from
# inside Claude Code:  /plugin install frontend-design@claude-plugins-official
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="$REPO_ROOT/.claude/skills"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# vercel-labs/agent-skills — MIT licence
git clone --depth 1 --quiet https://github.com/vercel-labs/agent-skills.git "$WORK/vercel"

mkdir -p "$SKILLS_DIR"
for skill in web-design-guidelines react-best-practices composition-patterns; do
  rm -rf "${SKILLS_DIR:?}/$skill"
  cp -r "$WORK/vercel/skills/$skill" "$SKILLS_DIR/$skill"
  # Keep the licence with the copy, so the copy is not an unlicensed one.
  cp "$WORK/vercel/LICENSE" "$SKILLS_DIR/$skill/LICENSE" 2>/dev/null ||
    cp "$WORK/vercel/license" "$SKILLS_DIR/$skill/LICENSE" 2>/dev/null || true
  echo "installed  .claude/skills/$skill"
done

echo
echo "Done. Restart Claude Code to pick the skills up."
