"""Notification lifecycle hook (Anthropic Claude Code).

Fires on Notification events (e.g. permission prompts, idle awaiting input).
Emits a terminal escape sequence so the shell can ring/notify, and -- if
configured -- POSTs the notification body to a webhook URL via stdlib urllib
(no external dependency).

Always exits 0; notification delivery is best-effort.

Source: https://code.claude.com/docs/en/hooks
"""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request

_TERMINAL_SEQUENCE_RAW: str = "\a"
_WEBHOOK_URL: str = ""


def _decode_sequence(raw: str) -> str:
    """Decode common escape literals (\\a, \\n, \\t, \\r, \\e) from a template slot."""
    if not raw:
        return "\a"
    return (
        raw.replace("\\a", "\a")
           .replace("\\n", "\n")
           .replace("\\t", "\t")
           .replace("\\r", "\r")
           .replace("\\e", "\x1b")
    )


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


def _post_webhook(url: str, body: dict[str, object]) -> None:
    encoded = json.dumps(body, sort_keys=True).encode("utf-8")
    req = urllib.request.Request(  # noqa: S310 -- url is operator-configured slot
        url, data=encoded, method="POST",
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=3) as _:  # noqa: S310
            return
    except (urllib.error.URLError, TimeoutError, OSError):
        return


def main() -> int:
    payload = _read_payload()
    sequence = _decode_sequence(_TERMINAL_SEQUENCE_RAW)
    sys.stdout.write(sequence)
    sys.stdout.flush()

    url = _WEBHOOK_URL.strip()
    if url:
        seq = payload.get("seq", 0)
        body = {
            "event": str(payload.get("event", "notification")),
            "message": str(payload.get("message", "")),
            "ts": seq if isinstance(seq, int) else 0,
        }
        _post_webhook(url, body)
    return 0


if __name__ == "__main__":
    sys.exit(main())
