import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  value: ReactNode;
  /** small trailing unit, e.g. "人" / "%" */
  unit?: string;
  className?: string;
}

export function MetricCard({ label, value, unit, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-line-1 bg-s0 px-3 py-2.5",
        className,
      )}
    >
      <div className="mb-[3px] text-[11px] text-t3">{label}</div>
      <div className="num text-[17px] font-semibold text-t1">
        {value}
        {unit ? (
          <small className="ml-[3px] text-[11px] font-normal text-t3">
            {unit}
          </small>
        ) : null}
      </div>
    </div>
  );
}
