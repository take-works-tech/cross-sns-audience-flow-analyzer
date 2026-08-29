import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "default" | "primary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANTS: Record<ButtonVariant, string> = {
  default:
    "border-line-2 bg-s2 text-t1 hover:border-line-3 hover:bg-s3",
  primary:
    "border-accent bg-accent font-semibold text-accent-ink hover:border-accent-hover hover:bg-accent-hover",
  ghost:
    "border-transparent bg-transparent text-t2 hover:bg-s2 hover:text-t1",
  danger:
    "border-err-line bg-s2 text-err hover:border-err hover:bg-s3",
};

const SIZES: Record<ButtonSize, string> = {
  md: "px-3.5 py-[7px] text-[13px]",
  sm: "px-2.5 py-1 text-xs",
};

export function Button({
  variant = "default",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-[7px] rounded-ctl border font-medium",
        "transition-colors duration-150 ease-out-custom",
        "disabled:pointer-events-none disabled:opacity-45",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}
