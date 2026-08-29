import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type ChipTone = "default" | "obs" | "est" | "ok" | "warn" | "err";

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone;
  /** Identity dot colour utility, e.g. "bg-yt" (see SWATCH_BG). */
  dot?: string;
}

const TONES: Record<ChipTone, string> = {
  default: "border-line-2 text-t2",
  obs: "border-accent-line bg-accent-dim text-accent",
  est: "border-dashed border-line-2 text-t2",
  ok: "border-ok-line text-ok",
  warn: "border-warn-line text-warn",
  err: "border-err-line text-err",
};

export function Chip({
  tone = "default",
  dot,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[5px] rounded-full border px-2 py-0.5 text-[11px] font-medium",
        TONES[tone],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span className={cn("size-1.5 rounded-full", dot)} aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
}
