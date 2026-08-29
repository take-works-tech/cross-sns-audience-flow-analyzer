"""SessionEnd lifecycle hook (Anthropic Claude Code).

Fires on session termination. Matchers handled:
    clear / resume / logout / prompt_input_exit / bypass_permissions

Best-effort cleanup: read cache telemetry if present, append a deterministic
one-line summary to .claude/state/session-log.jsonl (no timestamp -- a record
counter + sha-256 content hash keeps tests reproducible), and on `logout` reset
the correction counter. Always exits 0; cleanup never blocks logout.

Source: https://code.claude.com/docs/en/hooks
"""

from __future__ import annotations

import hashlib
import json
import pathlib
import sys

_CACHE_LOG: pathlib.Path = pathlib.Path(".claude/state/cache-telemetry.jsonl")
_SESSION_LOG: pathlib.Path = pathlib.Path(".claude/state/session-log.jsonl")
_CORRECTION_COUNTER: pathlib.Path = pathlib.Path(".claude/state/correction-counter.txt")

_VALID_MATCHERS: frozenset[str] = frozenset({
    "clear", "resume", "logout", "prompt_input_exit", "bypass_permissions",
})


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


def _cache_metrics() -> dict[str, float | int]:
    if not _CACHE_LOG.is_file():
        return {"tokens": 0, "hit_ratio": 0.0}
    try:
        lines = _CACHE_LOG.read_text(encoding="utf-8").splitlines()
    except OSError:
        return {"tokens": 0, "hit_ratio": 0.0}
    total_hit = 0
    total_miss = 0
    tokens = 0
    for line in lines:
        line = line.strip()
        if not line:
            continue
        try:
            rec = json.loads(line)
        except json.JSONDecodeError:
            continue
        if not isinstance(rec, dict):
            continue
        hit = rec.get("hit")
        miss = rec.get("miss")
        if isinstance(hit, int) and isinstance(miss, int):
            total_hit += hit
            total_miss += miss
        t = rec.get("tokens")
        if isinstance(t, int):
            tokens += t
    denom = total_hit + total_miss
    ratio = (total_hit / denom) if denom > 0 else 0.0
    return {"tokens": tokens, "hit_ratio": round(ratio, 4)}


def _record_counter() -> int:
    if not _SESSION_LOG.is_file():
        return 0
    try:
        return sum(1 for line in _SESSION_LOG.read_text(encoding="utf-8").splitlines() if line.strip())
    except OSError:
        return 0


def _append_summary(matcher: str, metrics: dict[str, float | int]) -> None:
    counter = _record_counter()
    payload = {
        "seq": counter,
        "matcher": matcher,
        "tokens": metrics["tokens"],
        "hit_ratio": metrics["hit_ratio"],
    }
    body = json.dumps(payload, sort_keys=True)
    digest = hashlib.sha256(body.encode("utf-8")).hexdigest()[:12]
    line = json.dumps({**payload, "hash": digest}, sort_keys=True)
    try:
        _SESSION_LOG.parent.mkdir(parents=True, exist_ok=True)
        with _SESSION_LOG.open("a", encoding="utf-8") as fp:
            fp.write(line + "\n")
    except OSError:
        return


def _rotate_correction_counter() -> None:
    try:
        _CORRECTION_COUNTER.parent.mkdir(parents=True, exist_ok=True)
        _CORRECTION_COUNTER.write_text("0\n", encoding="utf-8")
    except OSError:
        return


def main() -> int:
    payload = _read_payload()
    matcher = str(payload.get("matcher", "")).lower()
    if matcher not in _VALID_MATCHERS:
        matcher = "unknown"
    metrics = _cache_metrics()
    _append_summary(matcher, metrics)
    if matcher == "logout":
        _rotate_correction_counter()
    return 0


if __name__ == "__main__":
    sys.exit(main())
