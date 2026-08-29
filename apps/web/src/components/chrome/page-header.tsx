import type { ReactNode } from "react";

import { Logo } from "@/components/chrome/Logo";
import { copy } from "@/lib/copy";

export interface PageHeaderProps {
  /** trailing slot before the avatar — usually one ghost link */
  action?: ReactNode;
}

/**
 * Reduced top bar for the standalone pages (/projects, /settings):
 * logo + wordmark on the left, one action and the avatar on the right.
 */
export function PageHeader({ action }: PageHeaderProps) {
  return (
    <header className="flex h-[52px] flex-none items-center gap-3.5 border-b border-line-1 bg-s1 px-3.5">
      <Logo withWordmark />
      <div className="flex-1" />
      {action}
      <span className="flex size-7 flex-none items-center justify-center rounded-full bg-linear-to-br from-line-3 to-est text-[11px] font-semibold text-t1">
        {copy.topBar.avatarInitials}
      </span>
    </header>
  );
}
