import { cn } from "@/lib/utils";

export interface ToggleProps {
  pressed: boolean;
  onToggle: () => void;
  /** required — the control carries no visible text */
  label: string;
  className?: string;
}

export function Toggle({ pressed, onToggle, label, className }: ToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        "relative h-[19px] w-[34px] flex-none rounded-full",
        "transition-colors duration-150 ease-out-custom",
        "after:absolute after:top-0.5 after:size-[15px] after:rounded-full after:content-['']",
        "after:transition-all after:duration-150 after:ease-out-custom",
        pressed
          ? "bg-accent after:left-[17px] after:bg-accent-ink"
          : "bg-s3 after:left-0.5 after:bg-t2",
        className,
      )}
    />
  );
}
