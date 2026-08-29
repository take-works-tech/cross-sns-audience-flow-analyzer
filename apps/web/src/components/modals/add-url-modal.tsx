"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

import { ModalShell } from "@/components/modals/modal-shell";
import {
  Button,
  Chip,
  Field,
  fieldInputClass,
  SectionLabel,
  Segmented,
} from "@/components/ui";
import { copy } from "@/lib/copy";
import { SWATCH_BG } from "@/lib/utils";

const addUrl = copy.modals.addUrl;

export interface AddUrlModalProps {
  onClose: () => void;
}

export function AddUrlModal({ onClose }: AddUrlModalProps) {
  const [url, setUrl] = useState<string>(addUrl.sampleValue);
  const [destination, setDestination] = useState<string>(
    addUrl.destinations[0].value,
  );

  return (
    <ModalShell title={addUrl.title} onClose={onClose}>
      <Field icon={<Link2 className="size-4" strokeWidth={1.6} />}>
        <input
          className={fieldInputClass}
          value={url}
          aria-label={copy.leftPanel.urlLabel}
          placeholder={copy.leftPanel.urlPlaceholder}
          onChange={(event) => setUrl(event.target.value)}
        />
      </Field>

      <p className="flex items-center gap-2 text-xs text-t2">
        <Check
          className="size-[13px] flex-none text-ok"
          strokeWidth={1.6}
          aria-hidden="true"
        />
        {addUrl.parsed}
      </p>

      <div className="flex gap-3 rounded-card border border-line-2 bg-s2 p-[13px]">
        <div
          className="h-[54px] w-[72px] flex-none rounded-ctl border border-line-2 bg-linear-to-br from-com-tint to-s0"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-t1">{addUrl.previewTitle}</p>
          <p className="num truncate text-[11px] text-t3">
            {addUrl.previewMeta}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Chip dot={SWATCH_BG.com}>{addUrl.chipProduct}</Chip>
            <Chip>{addUrl.chipOgp}</Chip>
          </div>
        </div>
      </div>

      <div>
        <SectionLabel className="mb-2">
          {addUrl.destinationSection}
        </SectionLabel>
        <Segmented
          className="w-fit"
          options={addUrl.destinations}
          value={destination}
          onChange={setDestination}
          label={addUrl.destinationSection}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>{copy.common.cancel}</Button>
        <Button variant="primary" onClick={onClose}>
          {addUrl.submit}
        </Button>
      </div>
    </ModalShell>
  );
}
