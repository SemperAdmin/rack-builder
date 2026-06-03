"use client";

import type { Award, RackEntry } from "@/lib/types";
import { DEVICE_SPECS, resolveDisplayDevices } from "@/lib/devices";

interface Props {
  award: Award;
  entry: RackEntry;
  onClick?: () => void;
  highlighted?: boolean;
  compact?: boolean;
}

export function RibbonCell({ award, entry, onClick, highlighted, compact }: Props) {
  const devices = resolveDisplayDevices(entry, award);
  const sizingClass = compact ? "ribbon-cell compact" : "ribbon-cell";
  const labelClass = compact
    ? "absolute inset-0 flex items-center justify-center text-[8px] font-mono text-muted-foreground"
    : "absolute inset-0 flex items-center justify-center text-[10px] font-mono text-muted-foreground";

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${award.name} (P${award.precedence})`}
      className={`${sizingClass} ${highlighted ? "ring-2 ring-usmc-scarlet" : ""}`}
      style={{ background: award.image.fileExists ? undefined : "var(--color-muted)" }}
    >
      {award.image.fileExists && award.image.ribbon ? (
        <img src={award.image.ribbon} alt={award.shortName} draggable={false} />
      ) : (
        <span className={labelClass}>{award.shortName}</span>
      )}
      {devices.length > 0 && (
        <span className="device-layer">
          {devices.map((d, i) =>
            Array.from({ length: d.count }).map((_, j) => {
              const spec = DEVICE_SPECS[d.code];
              return (
                <span key={`${i}-${j}`} style={{ color: spec.color }}>
                  {spec.short}
                </span>
              );
            })
          )}
        </span>
      )}
    </button>
  );
}
