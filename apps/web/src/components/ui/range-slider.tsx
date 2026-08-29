import { cn } from "@/lib/utils";

export interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** required — the control carries no visible text */
  label: string;
  className?: string;
}

/**
 * Thin accent-thumb slider. Track + thumb styling lives in globals.css (`.range`)
 * because ::-webkit-slider-thumb cannot be expressed as a utility.
 */
export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  className,
}: RangeSliderProps) {
  return (
    <input
      type="range"
      className={cn("range", className)}
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={label}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}
