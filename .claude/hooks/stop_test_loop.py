#!/usr/bin/env python3
"""Stop hook for cross-sns-audience-flow-analyzer - run tests on stop and loop back on failure.

Source: https://every.to/podcast/how-to-use-claude-code-like-the-people-who-built-it
(Boris Cherny pattern: Stop hook executes the test command; on failure exit 2 so
Claude Code re-prompts the agent rather than ending the turn.)

Exit codes:
  0 - tests pass OR no test command configured (silent skip) -> allow stop
  2 - tests failed -> stderr instruction, Claude Code continues the session
"""

import shlex
import subprocess
import sys

_TEST_COMMAND = "npm test --silent"


def main() -> int:
    cmd = _TEST_COMMAND.strip()
    if not cmd:
        return 0  # No test command -> nothing to enforce, allow stop
    try:
        result = subprocess.run(
            shlex.split(cmd), capture_output=True, text=True, timeout=600, check=False
        )
    except FileNotFoundError:
        # Test runner not installed in this environment -> do not block stop.
        print(f"ADVISORY: stop_test_loop skipped ({cmd!r} not found)", file=sys.stderr)
        return 0
    except subprocess.TimeoutExpired:
        print("BLOCKED: stop_test_loop timed out. Investigate hanging tests.", file=sys.stderr)
        return 2
    if result.returncode == 0:
        return 0
    tail = "\n".join((result.stdout + result.stderr).splitlines()[-40:])
    print(
        "Tests failed. Fix the failures and continue rather than stopping.\n"
        f"--- {cmd} (exit {result.returncode}) ---\n{tail}",
        file=sys.stderr,
    )
    return 2


if __name__ == "__main__":
    sys.exit(main())
