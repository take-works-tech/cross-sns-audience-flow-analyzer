"""PreCompact lifecycle hook (Anthropic Claude Code).

Fires before a /compact (matcher=manual) or automatic context compaction
(matcher=auto). Anthropic best practice: "Customize compaction behavior in
CLAUDE.md" -- this hook surfaces what will be preserved and (for auto-compact)
blocks when uncommitted test changes are detected so the user can decide.

Hook protocol (Anthropic):
    stdin = JSON payload with at least {"matcher": "manual"|"auto", ...}
    exit 0 = allow, advisory text on stderr ok
    exit 2 = block; stderr is shown to the user

Source: https://code.claude.com/docs/en/hooks
"""

from __future__ import annotations

import json
import subprocess
import sys

_PROTECTED_RAW: str = "CLAUDE.md,.claude/rules,tests/"


def _protected_paths() -> list[str]:
    raw = _PROTECTED_RAW.strip()
    if not raw:
        return ["CLAUDE.md", ".claude/rules", "tests/"]
    return [p.strip() for p in raw.split(",") if p.strip()]


def _read_payload() -> dict[str, object]:
    try:
        data = sys.stdin.read()
    except OSError:
        return {}
    if not data.strip():
        return {}
    try:
        obj = json.loads(data)
    except json.JSONDecodeError:
        return {}
    return obj if isinstance(obj, dict) else {}


def _has_unsaved_test_changes() -> bool:
    """Detect uncommitted modifications under tests/ via `git diff --name-only`."""
    try:
        result = subprocess.run(  # noqa: S603 -- fixed argv, shell=False
            ["git", "diff", "--name-only", "HEAD", "--", "tests/"],
            capture_output=True, text=True, timeout=5, check=False,
        )
    except (OSError, subprocess.SubprocessError):
        return False
    if result.returncode != 0:
        return False
    return any(line.strip() for line in result.stdout.splitlines())


def main() -> int:
    payload = _read_payload()
    matcher = str(payload.get("matcher", "")).lower()
    protected = _protected_paths()

    if matcher == "auto" and _has_unsaved_test_changes():
        sys.stderr.write(
            "Pending test changes detected -- manual /compact recommended\n"
        )
        return 2

    sys.stderr.write(
        "PreCompact: preserving " + ", ".join(protected) + "\n"
        "(Customize compaction behavior in CLAUDE.md -- Anthropic best practice)\n"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
