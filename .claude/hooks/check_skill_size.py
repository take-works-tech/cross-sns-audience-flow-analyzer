"""Skill-size advisory hook (cckit check-skill-size).

Scans .claude/skills/*/SKILL.md and reports progressive-disclosure violations:
  - metadata (YAML frontmatter description+name fields) > 100 words
  - body (after closing ---) > 500 lines

Source basis: https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md
(skills load metadata always, body on trigger; keeping both small preserves
the always-injected token budget for cross-sns-audience-flow-analyzer.)

Advisory: prints WARNING per offender to stderr, exits 0 (never blocks).
Stdlib-only (pathlib/sys/os).
"""

from __future__ import annotations

import pathlib
import sys

_METADATA_WORD_CAP: int = 100
_BODY_LINE_CAP: int = 500
_SKILLS_ROOT: str = ".claude/skills"


def _split_frontmatter(text: str) -> tuple[str, str]:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return "", text
    for idx in range(1, len(lines)):
        if lines[idx].strip() == "---":
            meta = "\n".join(lines[1:idx])
            body = "\n".join(lines[idx + 1 :])
            return meta, body
    return "", text


def _word_count(text: str) -> int:
    return len(text.split())


def _line_count(text: str) -> int:
    stripped = text.strip("\n")
    if not stripped:
        return 0
    return stripped.count("\n") + 1


def _scan(root: pathlib.Path) -> list[str]:
    violations: list[str] = []
    if not root.is_dir():
        return violations
    for skill_md in sorted(root.glob("*/SKILL.md")):
        try:
            text = skill_md.read_text(encoding="utf-8")
        except OSError:
            continue
        meta, body = _split_frontmatter(text)
        meta_words = _word_count(meta)
        body_lines = _line_count(body)
        rel = skill_md.as_posix()
        if meta_words > _METADATA_WORD_CAP:
            violations.append(
                f"WARNING: {rel} metadata={meta_words} words exceeds cap {_METADATA_WORD_CAP} "
                f"(always-loaded budget; trim description)."
            )
        if body_lines > _BODY_LINE_CAP:
            violations.append(
                f"WARNING: {rel} body={body_lines} lines exceeds cap {_BODY_LINE_CAP} "
                f"(progressive-disclosure violation; split into references/)."
            )
    return violations


def main() -> int:
    root = pathlib.Path(_SKILLS_ROOT)
    for line in _scan(root):
        sys.stderr.write(line + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
