import { cn } from "@/lib/utils";

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedProps {
  options: readonly SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  /** aria-label for the group */
  label?: string;
  className?: string;
}

export function Segmented({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex rounded-ctl border border-line-2 bg-s0 p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const pressed = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-[4px] px-2.5 py-1 text-xs whitespace-nowrap",
              "transition-colors duration-150 ease-out-custom",
              pressed ? "bg-s3 text-t1" : "text-t2 hover:text-t1",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
