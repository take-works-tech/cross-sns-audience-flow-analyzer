"""Module ownership and dependency direction for cross-sns-audience-flow-analyzer.

A file that belongs to no module belongs to whoever edited it last, and a dependency that points
upward is a shortcut that becomes the reason a change is never local. Both are cheap to check and
expensive to discover by reading.

The declaration lives in `.claude/module-map.json`:

    {
      "layers": ["ui", "service", "engine", "domain"],
      "modules": [
        {"name": "domain-core", "layer": "domain",  "paths": ["src/domain"],  "depends_on": []},
        {"name": "reader",      "layer": "engine",  "paths": ["src/engine/reader"],
         "depends_on": ["domain-core"]}
      ]
    }

`layers` is ordered from the top down; a module may depend on its own layer or below, never above.
`paths` are prefixes, and the longest matching prefix wins, so a module may live inside another's
directory when that is what the code actually does.

**Without that file this gate checks nothing, and says so.** It does not pass quietly: a gate that
finds no configuration and prints success is worse than no gate, because the green tick is read as
evidence. Ownership is worth declaring the day a second person joins the project; until then the
message is the reminder.

Exit code: 0 clean or unconfigured, 1 violations. Stdlib only.
"""

from __future__ import annotations

import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
MAP_PATH = ROOT / ".claude" / "module-map.json"

SOURCE_SUFFIXES = (".py", ".ts", ".tsx", ".js", ".jsx")
SKIP_DIRS = {
    ".git", ".venv", "venv", "node_modules", "__pycache__", "dist", "build",
    ".mypy_cache", ".pytest_cache", ".ruff_cache", "site-packages", "tests", "test",
}

_PY_IMPORT = re.compile(r"^\s*(?:from\s+([A-Za-z0-9_.]+)\s+import|import\s+([A-Za-z0-9_.]+))")
_TS_IMPORT = re.compile(r"""^\s*(?:import|export)[^'"]*['"]([^'"]+)['"]""")


def load_map() -> dict | None:
    if not MAP_PATH.is_file():
        return None
    return json.loads(MAP_PATH.read_text(encoding="utf-8"))


def owner_of(relative: str, modules: list[dict]) -> dict | None:
    """Longest matching path prefix wins, so a nested module beats the one containing it."""
    best: dict | None = None
    best_length = -1
    for module in modules:
        for prefix in module.get("paths", []):
            if relative == prefix or relative.startswith(prefix.rstrip("/") + "/"):
                if len(prefix) > best_length:
                    best, best_length = module, len(prefix)
    return best


def sources() -> list[pathlib.Path]:
    return [
        path
        for path in sorted(ROOT.rglob("*"))
        if path.suffix in SOURCE_SUFFIXES
        and path.is_file()
        and not any(part in SKIP_DIRS for part in path.parts)
    ]


def resolve_import(target: str, path: pathlib.Path, modules: list[dict]) -> dict | None:
    """Best-effort resolution of an import to the module that owns it."""
    if target.startswith("."):
        candidate = (path.parent / target.lstrip(".")).resolve()
        try:
            return owner_of(str(candidate.relative_to(ROOT)).replace("\\", "/"), modules)
        except ValueError:
            return None
    as_path = target.replace(".", "/")
    return owner_of(as_path, modules) or owner_of(f"src/{as_path}", modules)


def main() -> int:
    declared = load_map()
    if declared is None:
        print("NOT checked: .claude/module-map.json does not exist, so no file has a declared owner")
        print("and no dependency direction is enforced. Declare the modules to turn this gate on.")
        return 0

    layers: list[str] = declared.get("layers", [])
    modules: list[dict] = declared.get("modules", [])
    rank = {name: index for index, name in enumerate(layers)}

    unowned: list[str] = []
    upward: list[str] = []
    undeclared: list[str] = []

    for path in sources():
        relative = str(path.relative_to(ROOT)).replace("\\", "/")
        owner = owner_of(relative, modules)
        if owner is None:
            unowned.append(relative)
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        pattern = _PY_IMPORT if path.suffix == ".py" else _TS_IMPORT
        for line in text.splitlines():
            match = pattern.match(line)
            if not match:
                continue
            target = next((group for group in match.groups() if group), "")
            other = resolve_import(target, path, modules)
            if other is None or other["name"] == owner["name"]:
                continue
            if rank.get(other["layer"], 0) < rank.get(owner["layer"], 0):
                upward.append(f"{relative}: {owner['name']} ({owner['layer']}) -> {other['name']} ({other['layer']})")
            elif other["name"] not in owner.get("depends_on", []):
                undeclared.append(f"{relative}: {owner['name']} -> {other['name']} is not in depends_on")

    for label, items, note in (
        ("Files owned by no module", unowned, "Every file belongs to exactly one module, or the boundary is a suggestion."),
        ("Dependencies pointing upward", upward, "A dependency that points up is a defect, not a shortcut."),
        ("Undeclared dependencies", undeclared, "Declare it, or move the shared part down to a module both may depend on."),
    ):
        if items:
            print(f"{label} ({len(items)}):")
            for item in items[:40]:
                print(f"  - {item}")
            if len(items) > 40:
                print(f"  ... and {len(items) - 40} more")
            print(f"\n{note}\n")

    if unowned or upward or undeclared:
        return 1
    print(f"OK: {len(modules)} modules, every file owned, every dependency declared and downward.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
