import { cn } from "@/lib/utils";

export interface SkeletonRowProps {
  /** show the 26px leading square (avatar / platform glyph placeholder) */
  withThumb?: boolean;
  className?: string;
}

/** Shimmer placeholder row. Never a spinner — skeletons carry loading state. */
export function SkeletonRow({ withThumb = true, className }: SkeletonRowProps) {
  return (
    <div
      className={cn("flex items-center gap-2.5", className)}
      aria-hidden="true"
    >
      {withThumb ? <span className="skel size-[26px] rounded-[7px]" /> : null}
      <span className="skel h-3 flex-1" />
      <span className="skel h-3 w-12" />
    </div>
  );
}
