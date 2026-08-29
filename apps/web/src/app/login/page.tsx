import { Clock, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { linkButtonClass } from "@/components/chrome/link-button";
import { Logo } from "@/components/chrome/Logo";
import { Button, Field, fieldInputClass } from "@/components/ui";
import { copy } from "@/lib/copy";

export const metadata: Metadata = { title: copy.common.appName };

export default function LoginPage() {
  return (
    <main className="stage-ground relative flex h-full items-center justify-center overflow-y-auto p-6">
      <div
        className="dot-grid pointer-events-none absolute inset-0 opacity-75"
        aria-hidden="true"
      />

      <div className="relative flex w-[380px] max-w-full flex-col gap-[18px] rounded-auth border border-line-2 bg-s1 px-[34px] pt-[34px] pb-7 shadow-modal">
        <Logo size={26} withWordmark wordmarkSize={16} className="gap-2.5" />

        <h1 className="text-[19px] font-semibold tracking-[-0.01em]">
          {copy.login.headline[0]}
          <br />
          {copy.login.headline[1]}
        </h1>

        <p className="-mt-2.5 text-[13px] text-t2">{copy.login.sub}</p>

        <Button className="justify-center py-2.5">
          <Clock className="size-4" strokeWidth={1.6} aria-hidden="true" />
          {copy.login.google}
        </Button>

        <div className="flex items-center gap-2.5 text-[11px] text-t3">
          <span className="h-px flex-1 bg-line-1" aria-hidden="true" />
          {copy.login.or}
          <span className="h-px flex-1 bg-line-1" aria-hidden="true" />
        </div>

        <Field icon={<Mail className="size-4" strokeWidth={1.6} />}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            className={fieldInputClass}
            placeholder={copy.login.emailPlaceholder}
            aria-label={copy.login.emailLabel}
          />
        </Field>

        <Link href="/onboarding" className={linkButtonClass("primary")}>
          {copy.login.submit}
        </Link>

        <p className="text-center text-[11px] text-t3">
          {copy.login.termsBefore}
          <a
            href="#"
            className="text-t2 underline underline-offset-2 transition-colors duration-150 ease-out-custom hover:text-t1"
          >
            {copy.login.termsLink}
          </a>
          {copy.login.termsAfter}
        </p>
      </div>
    </main>
  );
}
