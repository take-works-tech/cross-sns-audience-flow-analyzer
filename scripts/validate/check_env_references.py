"""Every `.claude/**` path named by a live instruction file must exist — cross-sns-audience-flow-analyzer.

Deleting an agent, hook, skill, or rule without sweeping its references leaves prose that tells
the agent to use something that is gone. Nothing errors: the instruction simply points at nothing,
so the environment looks configured while doing less than it claims. The failure modes observed in
practice were an unsatisfiable gate (a required reviewer that could no longer be spawned), a skill
documenting an enforcement hook that had been deleted, and a reviewer told to read a section that
no longer existed.

Same root cause every time: **deletion without a reference sweep**. This gate makes the sweep
mandatory instead of remembered.

Scope: files that *instruct* — `.claude/**`, `docs/`, `scripts/`. Historical records are excluded
on purpose (see EXCLUDED_DIRS): an architecture decision record or a finding accurately describes
what existed when it was written, and rewriting history to satisfy a linter destroys the record.

Exit code: 0 = every reference resolves, 1 = otherwise.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

SCAN_ROOTS: tuple[Path, ...] = (
    PROJECT_ROOT / ".claude",
    PROJECT_ROOT / "docs",
    PROJECT_ROOT / "scripts",
)
# The root instruction files are NOT under any scan root, yet they are the most-read files in the
# repository and the likeliest place for a stale reference to survive. Omitting them leaves the
# guard blind exactly where it matters most.
SCAN_ROOT_FILES: tuple[str, ...] = ("CLAUDE.md", "AGENTS.md", "CLAUDE.local.md")
SCAN_SUFFIXES: frozenset[str] = frozenset({".md", ".py", ".json", ".yml", ".yaml", ".txt"})

# Historical records: they describe what was true when written. A linter must not force them to
# be rewritten, so they are never scanned.
EXCLUDED_DIRS: tuple[str, ...] = (
    "docs/knowledge/adr",
    "docs/knowledge/findings",
)

# Path shapes that name a concrete, checkable artifact. Anything vaguer (a bare directory such as
# `.claude/skills/`) is intentionally not matched — it is not a claim that a specific file exists.
_REFERENCE_RE = re.compile(
    r"\.claude/(?:"
    r"agents/[A-Za-z0-9_-]+\.md"
    r"|hooks/[A-Za-z0-9_.-]+\.py"
    r"|skills/[A-Za-z0-9_-]+/SKILL\.md"
    r"|skills/[A-Za-z0-9_-]+/(?:references|procedures)/[A-Za-z0-9_.-]+\.md"
    r"|rules/[A-Za-z0-9_-]+\.md"
    r"|output-styles/[A-Za-z0-9_-]+\.md"
    r"|guides/[A-Za-z0-9_-]+\.md"
    r")"
)

# References that are illustrative rather than real (a placeholder inside a documented example),
# keyed to the reason they are allowed to be missing.
ALLOWED_MISSING: dict[str, str] = {
    ".claude/module-map.json": (
        "A declaration this project writes, not an artifact the generator produces. The ownership "
        "gate is inert until it exists and says so, so naming it before it is written points at the "
        "next step rather than at nothing."
    ),
}

# Files whose dangling references are known and tracked rather than fixed. Every entry needs a
# reason, so that an exemption is a recorded decision instead of a silently tolerated violation.
EXEMPT_FILES: dict[str, str] = {}

# Runtime paths the environment writes for itself; they do not exist in a clean checkout.
RUNTIME_PREFIXES: tuple[str, ...] = (".claude/state/",)


def _is_excluded(path: Path) -> bool:
    rel = path.relative_to(PROJECT_ROOT).as_posix()
    return any(rel.startswith(d) for d in EXCLUDED_DIRS)


def _scan_files() -> list[Path]:
    files: list[Path] = [
        PROJECT_ROOT / name for name in SCAN_ROOT_FILES if (PROJECT_ROOT / name).is_file()
    ]
    for root in SCAN_ROOTS:
        if not root.exists():
            continue
        for path in sorted(root.rglob("*")):
            if path.is_file() and path.suffix in SCAN_SUFFIXES and not _is_excluded(path):
                files.append(path)
    return files


def find_dangling_references() -> list[str]:
    """Return "<source> -> <missing path>" for every reference that does not resolve."""
    dangling: list[str] = []
    for path in _scan_files():
        rel_source = path.relative_to(PROJECT_ROOT).as_posix()
        if rel_source in EXEMPT_FILES:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for ref in dict.fromkeys(_REFERENCE_RE.findall(text)):
            if ref in ALLOWED_MISSING or ref.startswith(RUNTIME_PREFIXES):
                continue
            if not (PROJECT_ROOT / ref).exists():
                dangling.append(f"{rel_source} -> {ref}")
    return dangling


def find_unregistered_hooks() -> list[str]:
    """Return hook scripts that exist but are named nowhere in settings.json.

    A hook nobody registers is a guard that was written and never runs — which is worse than no
    guard, because it reads as enforcement. `test_*.py` files are the hooks' own unit tests, run
    by CI rather than by the hook runner, so they are not expected to be registered.
    """
    settings_path = PROJECT_ROOT / ".claude" / "settings.json"
    hooks_dir = PROJECT_ROOT / ".claude" / "hooks"
    if not settings_path.exists() or not hooks_dir.exists():
        return []
    settings = settings_path.read_text(encoding="utf-8")
    return [
        f".claude/hooks/{p.name}"
        for p in sorted(hooks_dir.glob("*"))
        if p.is_file() and not p.name.startswith("test_") and p.name not in settings
    ]


def find_unwired_validators() -> list[str]:
    """Return validator scripts that no workflow or task runner invokes.

    The same failure as an unregistered hook, one directory over: a check that exists and never runs
    reads as enforcement while enforcing nothing. Written down after a project discovered five of its
    own validators had never been wired to CI - each of them green, none of them running. `test_*.py`
    files are the validators' own tests and are collected by the test runner instead.
    """
    validators = PROJECT_ROOT / "scripts" / "validate"
    if not validators.is_dir():
        return []
    runners = []
    for pattern in (".github/workflows/*.yml", ".github/workflows/*.yaml", "Makefile", "package.json", "noxfile.py", "tox.ini"):
        runners.extend(PROJECT_ROOT.glob(pattern))
    invoked = "\n".join(p.read_text(encoding="utf-8", errors="replace") for p in runners if p.is_file())
    return [
        f"scripts/validate/{p.name}"
        for p in sorted(validators.glob("*.py"))
        if p.is_file() and not p.name.startswith(("test_", "_")) and p.name not in invoked
    ]


def main() -> int:
    dangling = find_dangling_references()
    unregistered = find_unregistered_hooks()
    unwired = find_unwired_validators()
    if dangling:
        print(f"Dangling .claude references ({len(dangling)}):")
        for item in dangling:
            print(f"  - {item}")
        print("\nDeleting an artifact requires sweeping its references in the same change.")
    if unregistered:
        print(f"\nHook scripts never registered in settings.json ({len(unregistered)}):")
        for item in unregistered:
            print(f"  - {item}")
        print("\nA hook that nothing registers never runs; register it or delete it.")
    if unwired:
        print(f"\nValidator scripts nothing invokes ({len(unwired)}):")
        for item in unwired:
            print(f"  - {item}")
        print("\nA check that never runs is not a check; wire it into CI or delete it.")
    if not dangling and not unregistered and not unwired:
        print("OK: every .claude reference resolves, every hook is registered, every validator runs.")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
