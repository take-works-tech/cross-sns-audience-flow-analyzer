import { clamp, cn, confidenceBand } from "@/lib/utils";

export interface ConfidenceBarProps {
  /** 0..1 */
  value: number;
  className?: string;
}

const BAND_OPACITY = {
  high: "opacity-100",
  mid: "opacity-65",
  low: "opacity-35",
} as const;

export function ConfidenceBar({ value, className }: ConfidenceBarProps) {
  const pct = clamp(value, 0, 1) * 100;
  return (
    <div
      className={cn("h-[5px] overflow-hidden rounded-full bg-s3", className)}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={value}
    >
      <span
        className={cn(
          "block h-full rounded-full bg-accent",
          BAND_OPACITY[confidenceBand(value)],
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
