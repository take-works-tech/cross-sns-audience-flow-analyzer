"""Tests for billing_mode_guard (cckit generated, real tests).

Verifies that AI-initiated billing-mode changes (OAuth -> pay-per-use API key,
auth config changes, workflow file swaps) are detected. Pass-through cases must
remain unblocked. Observation-only tests are forbidden — every case asserts.
"""

import importlib.util
import pathlib
import unittest

_GATE_PATH = pathlib.Path(__file__).resolve().parent / "billing_mode_guard.py"
_SPEC = importlib.util.spec_from_file_location("billing_mode_guard", _GATE_PATH)
assert _SPEC is not None and _SPEC.loader is not None
billing_mode_guard = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(billing_mode_guard)


class TestBashViolations(unittest.TestCase):
    def test_blocks_api_key_export_variants(self) -> None:
        for cmd in (
            "export ANTHROPIC_API_KEY=sk-ant-...",
            "setx ANTHROPIC_API_KEY sk-ant-...",
            "$env:ANTHROPIC_API_KEY = 'sk-ant-...'",
            "ANTHROPIC_API_KEY=sk-ant-... claude",
            "  export ANTHROPIC_API_KEY=x",
            "true && export ANTHROPIC_API_KEY=x",
        ):
            self.assertTrue(billing_mode_guard.violations_for_bash(cmd), cmd)

    def test_blocks_claude_config_changes(self) -> None:
        for cmd in (
            "claude config set authMethod api",
            "claude config set model opus",
            "claude setup-token",
            "sudo claude setup-token",
        ):
            self.assertTrue(billing_mode_guard.violations_for_bash(cmd), cmd)

    def test_allows_safe_commands(self) -> None:
        for cmd in (
            "echo $ANTHROPIC_API_KEY",                 # debug print of existing var
            "env | grep ANTHROPIC",                    # debug listing
            "export PATH=$PATH:/foo",                  # unrelated export
            'echo "to switch, set ANTHROPIC_API_KEY"', # docstring literal
            "claude --version",                        # not a config change
            "git push origin feature",                 # unrelated
        ):
            self.assertEqual(billing_mode_guard.violations_for_bash(cmd), [], cmd)


class TestEditViolations(unittest.TestCase):
    def test_blocks_dotenv_api_key_insertion(self) -> None:
        for path in (".env", ".env.local", ".env.production"):
            v = billing_mode_guard.violations_for_edit(path, "ANTHROPIC_API_KEY=sk-ant-xxxx")
            self.assertTrue(v, path)

    def test_blocks_workflow_oauth_swap(self) -> None:
        content = "anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}"
        v = billing_mode_guard.violations_for_edit(".github/workflows/claude-code-review.yml", content)
        self.assertTrue(v)

    def test_blocks_settings_auth_field(self) -> None:
        v = billing_mode_guard.violations_for_edit(".claude/settings.json", '"anthropic_api_key": "sk-..."')
        self.assertTrue(v)

    def test_allows_unrelated_paths(self) -> None:
        v = billing_mode_guard.violations_for_edit("src/app.ts", "const ANTHROPIC_API_KEY = process.env.X")
        self.assertEqual(v, [])

    def test_allows_unrelated_edits_to_sensitive_paths(self) -> None:
        v = billing_mode_guard.violations_for_edit(".env", "DATABASE_URL=postgres://...")
        self.assertEqual(v, [])
        v = billing_mode_guard.violations_for_edit(".claude/settings.json", '"outputStyle": "concise"')
        self.assertEqual(v, [])


if __name__ == "__main__":
    unittest.main()
