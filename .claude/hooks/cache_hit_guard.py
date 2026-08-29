"""Prompt-cache hit-ratio advisory hook (cckit cache-hit-guard).

Reads recent prompt-cache usage records (one JSON object per line) and emits a
WARNING when the hit ratio over the last N records drops below a threshold.
Advisory only: always exits 0 so it never blocks the user. If the telemetry log
is missing or empty, exits silently. Stdlib-only (json/pathlib/sys/os).

Record shape (per line):
    {"label": "<turn-id>", "hit": <int>, "miss": <int>}
or  {"label": "<turn-id>", "cache_read_input_tokens": <int>, "cache_creation_input_tokens": <int>}

The first form is preferred; the second is tolerated for Anthropic-style usage rows.
"""

from __future__ import annotations

import json
import os
import pathlib
import sys

_DEFAULT_LOG: str = ".claude/state/cache-telemetry.jsonl"
_WINDOW: int = 10
_THRESHOLD: float = 0.7
_BP_MIN: int = 1
_BP_MAX: int = 4


def _hits_misses(record: dict[str, object]) -> tuple[int, int] | None:
    hit = record.get("hit")
    miss = record.get("miss")
    if isinstance(hit, int) and isinstance(miss, int):
        return hit, miss
    read = record.get("cache_read_input_tokens")
    create = record.get("cache_creation_input_tokens")
    if isinstance(read, int) and isinstance(create, int):
        return read, create
    return None


def _label(record: dict[str, object], fallback: int) -> str:
    label = record.get("label")
    return label if isinstance(label, str) and label else f"#{fallback}"


def main() -> int:
    log_path_str = os.environ.get("CCKIT_CACHE_TELEMETRY_LOG", _DEFAULT_LOG)
    log_path = pathlib.Path(log_path_str)
    if not log_path.is_file():
        return 0
    try:
        raw = log_path.read_text(encoding="utf-8").strip()
    except OSError:
        return 0
    if not raw:
        return 0

    records: list[dict[str, object]] = []
    for line in raw.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(obj, dict):
            records.append(obj)

    window = records[-_WINDOW:]
    if not window:
        return 0

    total_hit = 0
    total_miss = 0
    offending: list[str] = []
    bp_offending: list[str] = []
    for idx, rec in enumerate(window):
        bp = rec.get("breakpoint_count")
        if isinstance(bp, int) and not isinstance(bp, bool):
            if bp < _BP_MIN:
                bp_offending.append(
                    f"{_label(rec, idx)}(count={bp},lt-min)"
                )
            elif bp > _BP_MAX:
                bp_offending.append(
                    f"{_label(rec, idx)}(count={bp},gt-max)"
                )
        pair = _hits_misses(rec)
        if pair is None:
            continue
        hit, miss = pair
        total_hit += hit
        total_miss += miss
        denom = hit + miss
        if denom > 0 and (hit / denom) < _THRESHOLD:
            offending.append(_label(rec, idx))

    if bp_offending:
        sys.stderr.write(
            f"WARNING: cache_control breakpoint count out of range "
            f"[{_BP_MIN},{_BP_MAX}] for: {', '.join(bp_offending)}. "
            "0 indicates Issue #29966 manifestation; >4 indicates API 400 risk.\n"
        )

    denom = total_hit + total_miss
    if denom == 0:
        return 0
    ratio = total_hit / denom
    if ratio < _THRESHOLD:
        labels = ", ".join(offending) if offending else "(aggregate)"
        sys.stderr.write(
            f"WARNING: prompt-cache hit ratio {ratio:.2%} over last {len(window)} "
            f"records is below threshold {_THRESHOLD:.0%}. Offending: {labels}\n"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
