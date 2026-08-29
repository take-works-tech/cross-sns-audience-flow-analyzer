"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export interface ModalShellProps {
  /** visible heading, also the accessible name of the dialog */
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * Scrim + centred 520px dialog. Owns the modal's a11y contract:
 * role/aria-modal/labelledby, Escape, scrim click, autofocused close button,
 * a Tab focus loop, and focus restoration to the trigger on unmount.
 */
export function ModalShell({
  title,
  onClose,
  children,
  className,
}: ModalShellProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;

      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!(active instanceof HTMLElement) || !root.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "flex max-h-[86vh] w-[520px] max-w-[92vw] flex-col overflow-y-auto",
          "rounded-modal border border-line-2 bg-s1 shadow-modal",
          className,
        )}
      >
        <header className="flex flex-none items-center gap-2 border-b border-line-1 px-5 py-4">
          <h2 id={titleId} className="text-[15px] font-semibold text-t1">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            aria-label={copy.common.close}
            onClick={onClose}
            className={cn(
              "ml-auto inline-flex size-7 flex-none items-center justify-center rounded-ctl",
              "text-t3 transition-colors duration-150 ease-out-custom hover:bg-s2 hover:text-t1",
            )}
          >
            <X className="size-4" strokeWidth={1.6} />
          </button>
        </header>

        <div className="flex flex-col gap-3.5 p-5">{children}</div>
      </div>
    </div>
  );
}
