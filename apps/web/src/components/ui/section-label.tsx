import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type SectionLabelProps = HTMLAttributes<HTMLDivElement>;

export function SectionLabel({
  className,
  children,
  ...props
}: SectionLabelProps) {
  return (
    <div
      className={cn(
        "text-[11px] font-semibold tracking-[0.08em] text-t3 uppercase",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
