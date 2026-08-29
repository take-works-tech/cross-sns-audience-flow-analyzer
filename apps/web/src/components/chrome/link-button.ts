import { cn } from "@/lib/utils";

/**
 * Class list that makes a <Link> (or <a>) read exactly like <Button>.
 * Mirrors src/components/ui/button.tsx — keep the two in sync.
 */
export type LinkButtonVariant = "default" | "primary" | "ghost";
export type LinkButtonSize = "sm" | "md";

const BASE =
  "inline-flex items-center justify-center gap-[7px] rounded-ctl border font-medium transition-colors duration-150 ease-out-custom";

const VARIANTS: Record<LinkButtonVariant, string> = {
  default: "border-line-2 bg-s2 text-t1 hover:border-line-3 hover:bg-s3",
  primary:
    "border-accent bg-accent font-semibold text-accent-ink hover:border-accent-hover hover:bg-accent-hover",
  ghost: "border-transparent bg-transparent text-t2 hover:bg-s2 hover:text-t1",
};

const SIZES: Record<LinkButtonSize, string> = {
  md: "px-3.5 py-[7px] text-[13px]",
  sm: "px-2.5 py-1 text-xs",
};

export function linkButtonClass(
  variant: LinkButtonVariant = "default",
  size: LinkButtonSize = "md",
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}
