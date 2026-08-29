"use client";

import { ChevronDown, RefreshCw, Search, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/chrome/Logo";
import { Button, Field, fieldInputClass, Segmented } from "@/components/ui";
import { copy } from "@/lib/copy";
import { MOCK_PROJECTS } from "@/lib/mock/data";
import { useCanvasStore } from "@/stores/canvas-store";

export interface TopBarProps {
  /** overrides the project switcher label */
  projectName?: string;
}

export function TopBar({
  projectName = MOCK_PROJECTS[0].name,
}: TopBarProps) {
  const [period, setPeriod] = useState<string>(copy.topBar.defaultPeriod);
  const [query, setQuery] = useState("");
  const triggerRecalc = useCanvasStore((s) => s.triggerRecalc);
  const recalculating = useCanvasStore((s) => s.recalculating);

  return (
    <header className="flex h-[52px] flex-none items-center gap-3.5 border-b border-line-1 bg-s1 px-3.5">
      <Logo />

      <button
        type="button"
        aria-label={copy.topBar.projectSwitcherLabel}
        className="flex items-center gap-1.5 rounded-ctl px-2.5 py-[5px] font-medium whitespace-nowrap text-t1 transition-colors duration-150 ease-out-custom hover:bg-s2"
      >
        {projectName}
        <ChevronDown className="size-[13px] text-t3" strokeWidth={1.6} />
      </button>

      <Field
        className="w-[250px]"
        icon={<Search className="size-4" strokeWidth={1.6} />}
        trailing={
          <kbd className="num rounded-[4px] border border-b-2 border-line-2 px-[5px] text-[10.5px] text-t3">
            {copy.topBar.searchShortcut}
          </kbd>
        }
      >
        <input
          className={fieldInputClass}
          placeholder={copy.topBar.searchPlaceholder}
          aria-label={copy.topBar.searchLabel}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </Field>

      <div className="flex-1" />

      <Segmented
        options={copy.topBar.periods}
        value={period}
        onChange={setPeriod}
        label={copy.topBar.periodLabel}
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={triggerRecalc}
        aria-busy={recalculating}
      >
        <RefreshCw className="size-4" strokeWidth={1.6} />
        {copy.topBar.recalc}
      </Button>

      <span className="flex items-center gap-1.5 text-xs whitespace-nowrap text-t3">
        <span className="size-1.5 rounded-full bg-ok" aria-hidden="true" />
        <span className="num">{copy.topBar.autosave}</span>
      </span>

      <Link
        href="/settings"
        aria-label={copy.topBar.settings}
        className="inline-flex size-7 items-center justify-center rounded-ctl text-t2 transition-colors duration-150 ease-out-custom hover:bg-s2 hover:text-t1"
      >
        <Settings className="size-4" strokeWidth={1.6} />
      </Link>

      <span className="flex size-7 flex-none items-center justify-center rounded-full bg-linear-to-br from-line-3 to-est text-[11px] font-semibold text-t1">
        {copy.topBar.avatarInitials}
      </span>
    </header>
  );
}
