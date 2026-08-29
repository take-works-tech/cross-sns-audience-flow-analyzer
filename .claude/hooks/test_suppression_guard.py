"""Tests for suppression_guard (cckit generated, real tests).

Verifies blocking / allowing of suppression comments
(observation-only tests are forbidden = real assertions).
"""

import importlib.util
import json
import pathlib
import subprocess
import sys
import unittest

_GUARD = pathlib.Path(__file__).resolve().parent / "suppression-guard.py"
_SPEC = importlib.util.spec_from_file_location("suppression_guard", _GUARD)
assert _SPEC is not None and _SPEC.loader is not None
guard = importlib.util.module_from_spec(_SPEC)
sys.modules["suppression_guard"] = guard
_SPEC.loader.exec_module(guard)


def _run(path: str, text: str, *, key: str = "content") -> int:
    payload = json.dumps({"tool_name": "Write", "tool_input": {"file_path": path, key: text}})
    return subprocess.run([sys.executable, str(_GUARD)], input=payload, capture_output=True, text=True).returncode


class TestSuppressionGuard(unittest.TestCase):
    def test_blocks_suppression_in_code(self) -> None:
        for path, text in (("a.ts", "const x = y // @ts-ignore"),
                           ("a.ts", "// eslint-disable-next-line\nfoo()"),
                           ("a.py", "x = bad()  # type: ignore"),
                           ("a.py", "import os  # noqa: F401")):
            self.assertEqual(_run(path, text), 2, f"{path}: {text}")

    def test_blocks_tool_prefixed_and_modern_suppressions(self) -> None:
        # Whole-file suppressions (most dangerous) and modern tools are also blocked (FN fix)
        for path, text in (("a.py", "# ruff: noqa"),
                           ("a.py", "# flake8: noqa"),
                           ("a.py", "x = f()  # pyright: ignore[reportAny]"),
                           ("a.ts", "// @ts-expect-error narrowing"),
                           ("a.ts", "// biome-ignore lint/suspicious: x"),
                           ("a.pyi", "def f() -> int: ...  # type: ignore")):
            self.assertEqual(_run(path, text), 2, f"{path}: {text}")

    def test_blocks_other_language_suppressions(self) -> None:
        # Block Rust/Go/Java/Kotlin/C#/Ruby suppressions (incl. major / strongest forms)
        for path, text in (("a.rs", "#[allow(dead_code)]\nfn f() {}"),
                           ("a.rs", "#![allow(unused)]"),
                           ("a.rs", "#[cfg_attr(test, allow(dead_code))]"),  # conditional allow
                           ("a.go", "x := f() //nolint:errcheck"),
                           ("a.go", "y := g() // lint:ignore SA1019"),
                           ("a.java", "@SuppressWarnings(\"unchecked\")"),
                           ("a.kt", "@file:Suppress(\"UNCHECKED_CAST\")"),       # whole-file suppression
                           ("a.cs", "#pragma warning disable CS0168"),
                           ("a.cs", "[SuppressMessage(\"Cat\", \"Rule\")]"),     # C# major form
                           ("a.scala", "@nowarn def f = 1"),                   # Scala canonical suppression (bare ok)
                           ("a.rb", "x = bad # rubocop:todo Style/Foo")):
            self.assertEqual(_run(path, text), 2, f"{path}: {text}")

    def test_cross_language_no_false_positive(self) -> None:
        # Per-language routing: other languages' suppression syntax is not misdetected in this language's file (FP structurally eliminated)
        self.assertEqual(_run("a.py", "@Suppress(\"x\")  # python decorator, not Java"), 0)
        self.assertEqual(_run("a.py", "x = [allow(y)]  # not rust attribute"), 0)
        self.assertEqual(_run("a.ts", "const s = '@SuppressWarnings is Java only'"), 0)
        self.assertEqual(_run("a.go", "// @Suppress: ported from Java note"), 0)

    def test_allows_clean_code(self) -> None:
        self.assertEqual(_run("a.py", "def f(x: int) -> int:\n    return x"), 0)
        self.assertEqual(_run("a.ts", "export const x = 1"), 0)
        self.assertEqual(_run("a.rs", "fn main() { println!(\"hi\"); }"), 0)
        self.assertEqual(_run("a.go", "func main() { fmt.Println(1) }"), 0)

    def test_docs_and_tests_excluded(self) -> None:
        # Docs (rules describe suppressions as "forbidden") and tests (which include patterns as test data) pass through
        self.assertEqual(_run("rules.md", "Forbidden: `# type: ignore` / `@ts-ignore`"), 0)
        self.assertEqual(_run("test_x.py", 'BAD = "# noqa"'), 0)
        self.assertEqual(_run("x.spec.ts", "// @ts-ignore in test data"), 0)

    def test_non_code_extension_skipped(self) -> None:
        self.assertEqual(_run("config.json", '{"x": "# type: ignore"}'), 0)

    def test_prose_word_noqa_not_blocked(self) -> None:
        # noqa prefix is restricted to actual linter names -> prose comment `# TODO: noqa` is not misdetected
        self.assertEqual(_run("a.py", "x = 1  # TODO: noqa cleanup later"), 0)
        self.assertEqual(_run("a.py", "# FIXME: handle noqa case"), 0)

    def test_edit_new_string_checked(self) -> None:
        self.assertEqual(_run("a.py", "y  # pylint: disable=all", key="new_string"), 2)

    def test_malformed_input_passes(self) -> None:
        for bad in ("not json", "null", "[]", "{}"):
            r = subprocess.run([sys.executable, str(_GUARD)], input=bad, capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, bad)


if __name__ == "__main__":
    unittest.main()
