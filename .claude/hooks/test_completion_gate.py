"""Tests for completion_gate (cckit generated, real tests).

Verifies blocking / allowing of destructive commands
(observation-only tests are forbidden = real assertions).
"""

import importlib.util
import pathlib
import unittest

_GATE_PATH = pathlib.Path(__file__).resolve().parent / "completion_gate.py"
_SPEC = importlib.util.spec_from_file_location("completion_gate", _GATE_PATH)
assert _SPEC is not None and _SPEC.loader is not None
completion_gate = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(completion_gate)


class TestCompletionGate(unittest.TestCase):
    def test_blocks_destructive_commands(self) -> None:
        for cmd in ("rm -rf /tmp/x", "rm -fr build", "rm -Rf /", "rm -fR out", "rm -r out -f",
                    "rm --force --recursive /tmp", "rm -r --force /tmp", "rm --force -r /tmp",
                    "rm --recursive x --force",
                    "sudo rm -rf /var", "cd /x && rm -rf y",
                    "echo ok\nrm -rf /",          # Subsequent line start after newline (MULTILINE bypass)
                    "  rm -rf /tmp", "\trm -rf /tmp",  # Leading whitespace / tab
                    "git push --force origin feature", "git push -f origin feature",
                    "git reset --hard HEAD~1", "git clean -fd",
                    "git push origin main", "git push origin HEAD:main", "git push origin +main"):
            self.assertTrue(completion_gate.violations("Bash", cmd), cmd)

    def test_allows_safe_commands(self) -> None:
        for cmd in ("rm out.txt", "rm --force file", "git push origin feature/x",
                    "git push origin main-branch", "git reset --hard-reset-doc",
                    'echo "rm -rf /tmp"', 'grep "rm -rf" deploy.sh',
                    'cat log | grep "git push origin main"',
                    'echo "warn: (rm -rf) is destructive"',  # Do not misfire on a () literal inside quotes (FP regression guard)
                    "git status", "pytest -q", "rm -r build"):
            self.assertEqual(completion_gate.violations("Bash", cmd), [], cmd)

    def test_non_bash_tools_pass(self) -> None:
        self.assertEqual(completion_gate.violations("Write", "rm -rf /"), [])


if __name__ == "__main__":
    unittest.main()
