import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

export interface LogoProps {
  /** mark size in px (default 22, auth card uses 26) */
  size?: number;
  withWordmark?: boolean;
  /** wordmark size in px */
  wordmarkSize?: number;
  className?: string;
}

/** Three linked nodes — the product mark. Never recoloured. */
export function Logo({
  size = 22,
  withWordmark = false,
  wordmarkSize = 14,
  className,
}: LogoProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 font-semibold tracking-[0.01em] text-t1",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        role="img"
        aria-label={copy.common.appName}
        className="flex-none"
      >
        <circle cx="6" cy="16" r="3.4" className="fill-accent" />
        <circle cx="17" cy="6" r="2.6" className="fill-ig" />
        <circle cx="18" cy="17" r="2.2" className="fill-tt" />
        <path
          d="M8.8 14.2 15 7.8M9.2 16.6l6.6.3"
          fill="none"
          strokeWidth="1.3"
          className="stroke-est"
        />
      </svg>
      {withWordmark ? (
        <span style={{ fontSize: wordmarkSize }}>{copy.common.appName}</span>
      ) : null}
    </span>
  );
}
