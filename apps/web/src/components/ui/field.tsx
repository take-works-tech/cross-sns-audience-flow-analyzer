import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  /** leading icon slot — a 16px lucide glyph */
  icon?: ReactNode;
  /** trailing slot — keyboard hint, unit, action */
  trailing?: ReactNode;
  invalid?: boolean;
  children: ReactNode;
}

/**
 * Input shell. Pass a bare <input className="w-full bg-transparent outline-none" />
 * (or the `fieldInputClass` helper) as children.
 */
export function Field({
  icon,
  trailing,
  invalid = false,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-ctl border bg-s0 px-2.5 py-[7px]",
        "transition-colors duration-150 ease-out-custom",
        invalid
          ? "border-err"
          : "border-line-2 focus-within:border-accent",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="flex-none text-t3" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
      {trailing ? <span className="flex-none">{trailing}</span> : null}
    </div>
  );
}

/** Class list for the <input> placed inside a <Field>. */
export const fieldInputClass =
  "w-full min-w-0 border-0 bg-transparent text-[13px] text-t1 outline-none";
