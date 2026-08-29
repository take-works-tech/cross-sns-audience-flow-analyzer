import type { Metadata } from "next";
import Link from "next/link";

import { linkButtonClass } from "@/components/chrome/link-button";
import { PageHeader } from "@/components/chrome/page-header";
import { PlatformGlyph } from "@/components/modals/platform-glyph";
import { Button, Chip } from "@/components/ui";
import { copy } from "@/lib/copy";
import { DEFAULT_PROJECT_ID, MOCK_CONNECTIONS } from "@/lib/mock/data";
import type { Platform } from "@/lib/types";
import { cn, PLATFORM_SWATCH, SWATCH_TINT } from "@/lib/utils";

import { SettingsPreferences } from "./settings-preferences";

export const metadata: Metadata = { title: copy.settings.title };

const CANVAS_HREF = `/p/${DEFAULT_PROJECT_ID}`;

/** 30px tinted square holding the platform mark. */
function PlatformTile({ platform }: { platform: Platform }) {
  return (
    <span
      className={cn(
        "flex size-[30px] flex-none items-center justify-center rounded-card",
        SWATCH_TINT[PLATFORM_SWATCH[platform]],
      )}
    >
      <PlatformGlyph platform={platform} />
    </span>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        action={
          <Link href={CANVAS_HREF} className={linkButtonClass("ghost", "sm")}>
            {copy.topBar.backToCanvas}
          </Link>
        }
      />

      <main className="flex-1 overflow-y-auto bg-s0">
        <div className="mx-auto max-w-[720px] px-8 pt-9 pb-[120px]">
          <h1 className="mb-1 text-xl font-semibold tracking-[-0.01em]">
            {copy.settings.title}
          </h1>
          <p className="mb-[26px] text-[13px] text-t2">{copy.settings.sub}</p>

          <section className="mb-4 rounded-modal border border-line-1 bg-s1 px-[22px] py-5">
            <h2 className="mb-3.5 text-sm font-semibold">
              {copy.settings.connections.title}
            </h2>

            {MOCK_CONNECTIONS.map((connection) => (
              <div
                key={connection.platform}
                className="flex items-center gap-3 border-b border-line-1 py-[9px] text-[13px] last:border-b-0"
              >
                <PlatformTile platform={connection.platform} />
                <div className="min-w-0">
                  <div className="truncate text-t1">
                    {connection.accountName}
                  </div>
                  <div className="text-[11.5px] text-t3">
                    {connection.description}
                  </div>
                </div>
                <div className="ml-auto flex flex-none items-center gap-2.5">
                  {connection.status === "connected" ? (
                    <>
                      <Chip tone="ok">{copy.leftPanel.connected}</Chip>
                      <Button size="sm">
                        {copy.settings.connections.disconnect}
                      </Button>
                    </>
                  ) : null}
                  {connection.status === "reauth" ? (
                    <>
                      <Chip tone="warn">{copy.leftPanel.reauth}</Chip>
                      <Button variant="primary" size="sm">
                        {copy.settings.connections.reauth}
                      </Button>
                    </>
                  ) : null}
                  {connection.status === "disconnected" ? (
                    <Button size="sm">
                      {copy.settings.connections.connect}
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </section>

          <SettingsPreferences />
        </div>
      </main>
    </div>
  );
}
