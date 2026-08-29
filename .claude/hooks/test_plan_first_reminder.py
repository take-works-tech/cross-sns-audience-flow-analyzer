"""Tests for plan_first_reminder.py — cross-sns-audience-flow-analyzer.

Two properties matter and pull against each other:
  * it must fire when a change is about to start (otherwise the reminder is decorative), and
  * it must stay silent otherwise (otherwise it is a per-prompt tax on every conversation).

A reminder hook is also the last place a crash is acceptable, so the fail-open paths are tested
explicitly rather than assumed.
"""

from __future__ import annotations

import importlib.util
import io
import json
import pathlib
import unittest
from contextlib import redirect_stdout

_HOOK = pathlib.Path(__file__).with_name("plan_first_reminder.py")
_spec = importlib.util.spec_from_file_location("plan_first_reminder", _HOOK)
assert _spec is not None and _spec.loader is not None
hook = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(hook)


class TestIntentDetection(unittest.TestCase):
    def test_fires_on_change_intent(self) -> None:
        for prompt in (
            "implement the retry logic",
            "please fix the flaky test",
            "refactor this module",
            "there is a bug in the parser",
            "what is the root cause here?",
        ):
            self.assertTrue(hook.has_implementation_intent(prompt), prompt)

    def test_silent_on_questions_and_chatter(self) -> None:
        # These are the prompts that would make the hook a per-turn tax if detection were loose.
        for prompt in (
            "what does this function return?",
            "summarise the release notes",
            "who owns this service?",
            "",
        ):
            self.assertFalse(hook.has_implementation_intent(prompt), prompt)

    def test_substring_keywords_match_without_word_boundaries(self) -> None:
        # Scripts without spaces between words cannot rely on \\b, so those keywords are matched
        # as substrings. Losing this makes the hook silently monolingual.
        self.assertTrue(hook.has_implementation_intent("この関数を修正して"))

    def test_keyword_inside_a_longer_word_does_not_fire(self) -> None:
        # "fix" must not match "prefix"/"suffix" — a false positive costs tokens on every prompt
        # that happens to contain the substring.
        self.assertFalse(hook.has_implementation_intent("what is the prefix for these keys?"))


class TestFailOpen(unittest.TestCase):
    """Any malformed input produces no output and exit 0. A reminder must never block a session."""

    def _run(self, stdin_text: str) -> tuple[int, str]:
        import sys
        original, sys.stdin = sys.stdin, io.StringIO(stdin_text)
        try:
            buf = io.StringIO()
            with redirect_stdout(buf):
                code = hook.main()
            return code, buf.getvalue()
        finally:
            sys.stdin = original

    def test_invalid_json_is_silent(self) -> None:
        self.assertEqual(self._run("not json"), (0, ""))

    def test_non_object_payload_is_silent(self) -> None:
        self.assertEqual(self._run(json.dumps(["prompt"])), (0, ""))

    def test_missing_prompt_key_is_silent(self) -> None:
        self.assertEqual(self._run(json.dumps({"other": "x"})), (0, ""))

    def test_non_string_prompt_is_silent(self) -> None:
        self.assertEqual(self._run(json.dumps({"prompt": 42})), (0, ""))


if __name__ == "__main__":
    unittest.main()
