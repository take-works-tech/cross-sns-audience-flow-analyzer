"""UserPromptSubmit hook: point at the root-cause-first skill when work is about to start.

Why a hook and not a line in CLAUDE.md: this is a *procedure*, needed at one moment (the start of a
change) and irrelevant the rest of the time. Putting it in an always-injected file would charge
every turn of every session for something most turns do not use, and would add one more standing
rule the model has to reconcile — the over-constraining failure Anthropic named when they cut
Claude Code's own system prompt by 80%.

So: detection is conditional and the payload is a POINTER, not the content. A prompt with no
implementation intent emits nothing and costs nothing; a matching prompt pays ~40 tokens, and the
skill body loads only if the model actually opens it.

Fail-open by design: any malformed input, missing file, or unexpected shape exits 0 with no output.
A reminder hook must never be able to block a session — the cost of a missed reminder is a nudge
not given, while the cost of a crash is the user locked out of their own tool.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

SKILL_PATH = ".claude/skills/root-cause-first/SKILL.md"

# Intent detection. Deliberately narrow: a false positive spends tokens on a prompt that did not
# need the nudge, so the keywords name *starting or changing work*, not merely discussing it.
_KEYWORDS: tuple[str, ...] = (
    "implement", "refactor", "rewrite", "redesign", "migrate", "fix", "bug", "broken",
    "add support", "build", "change", "root cause",
)
_PATTERN = re.compile(r"\b(?:" + "|".join(re.escape(k) for k in _KEYWORDS) + r")\b", re.IGNORECASE)
# Non-ASCII trigger words cannot rely on \b (there are no word boundaries in Japanese/Chinese
# script), so they are matched as plain substrings.
_SUBSTRING_KEYWORDS: tuple[str, ...] = ("実装", "修正", "リファクタ", "設計", "原因", "直して")

REMINDER = (
    "Before editing: decompose to <=2h units, list the consumers of what you are about to touch, "
    f"and read the contract on that path. Fix the cause, not the symptom. Detail: {SKILL_PATH}"
)


def has_implementation_intent(prompt_text: str) -> bool:
    """True if the prompt looks like the start of a change rather than a question about one."""
    if any(word in prompt_text for word in _SUBSTRING_KEYWORDS):
        return True
    return bool(_PATTERN.search(prompt_text))


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0  # fail-open: unreadable input means no reminder, never a blocked session
    if not isinstance(payload, dict):
        return 0
    prompt_text = payload.get("prompt")
    if not isinstance(prompt_text, str) or not prompt_text.strip():
        return 0
    if not has_implementation_intent(prompt_text):
        return 0
    if not (Path.cwd() / SKILL_PATH).is_file():
        return 0  # never point at something that is not there
    print(REMINDER)
    return 0


if __name__ == "__main__":
    sys.exit(main())
