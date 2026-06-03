"use client";

import type { RackEntry, RackLayout } from "@/lib/types";
import { buildLayout } from "@/lib/rack-engine";
import { getAwardById } from "@/lib/awards";
import { RibbonCell } from "./RibbonCell";

interface Props {
  entries: RackEntry[];
  female?: boolean;
  selectedAwardId?: string;
  onSelect?: (awardId: string) => void;
}

export function RackCanvas({ entries, female = false, selectedAwardId, onSelect }: Props) {
  const layout: RackLayout = buildLayout(entries, undefined, { female });

  if (layout.rowCount === 0) {
    return (
      <div className="rack-canvas">
        <span className="text-xs text-subtle-foreground italic">
          Empty rack. Add a ribbon from the list below.
        </span>
      </div>
    );
  }

  // Per MCO 1020.34H §5301 top-row centering. Each row is its own flex line
  // inside .rack-canvas, and the canvas applies align-items: center. Natural
  // row width equals (n_ribbons * ribbon-w) + ((n_ribbons - 1) * gap). When
  // the top row contains fewer ribbons than the row below, its narrower
  // natural width sits centered above the wider bottom row. No padding
  // needed. Earlier paddingRight attempt inflated row width and pushed the
  // ribbon to the left visually.
  return (
    <div className="rack-canvas">
      {layout.rows.map((row, ri) => (
        <div key={ri} className="rack-row">
          {row.map((entry, ci) => {
            const award = getAwardById(entry.awardId);
            if (!award) return null;
            return (
              <RibbonCell
                key={`${ri}-${ci}`}
                award={award}
                entry={entry}
                highlighted={award.id === selectedAwardId}
                onClick={() => onSelect?.(award.id)}
              />
            );
          })}
        </div>
      ))}
      <div className="mt-3 font-mono text-[10px] text-subtle-foreground uppercase tracking-wide">
        {entries.length} ribbon{entries.length === 1 ? "" : "s"} - {layout.rowCount} row{layout.rowCount === 1 ? "" : "s"} of {layout.ribbonsPerFullRow} - {layout.source}
      </div>
    </div>
  );
}
