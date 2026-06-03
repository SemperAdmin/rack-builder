"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { RackEntry } from "@/lib/types";
import { marineAwards } from "@/lib/awards";

interface Props {
  selectedIds: Set<string>;
  onAdd: (entry: RackEntry) => void;
  onRemove: (awardId: string) => void;
}

export function AwardPicker({ selectedIds, onAdd, onRemove }: Props) {
  const [query, setQuery] = useState("");
  const [showOnlyWithImage, setShowOnlyWithImage] = useState(false);
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return marineAwards.filter((a) => {
      if (showOnlyWithImage && !a.image.fileExists) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.shortName.toLowerCase().includes(q) ||
        String(a.precedence).includes(q)
      );
    });
  }, [query, showOnlyWithImage]);

  function viewAward(awardId: string) {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.push(`/awards/${awardId}${hash}`);
  }

  return (
    <div className="card-surface">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl tracking-wide">AWARDS LIBRARY</h2>
          <span className="font-mono text-xs text-subtle-foreground">
            {filtered.length} of {marineAwards.length} marine-applicable
          </span>
        </div>
        <input
          type="text"
          placeholder="Search by name, short code, or precedence number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 rounded-button bg-surface-2 border border-border text-sm focus:outline-none focus:border-usmc-scarlet"
        />
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={showOnlyWithImage}
            onChange={(e) => setShowOnlyWithImage(e.target.checked)}
          />
          Hide awards missing ribbon image
        </label>
      </div>
      <p className="text-[10px] font-mono uppercase tracking-wider text-subtle-foreground mb-2">
        Tip: click a ribbon image to read full criteria. Use Add to put it on the rack.
      </p>
      <ul className="divide-y divide-border max-h-[60vh] overflow-y-auto">
        {filtered.map((award) => {
          const selected = selectedIds.has(award.id);
          return (
            <li key={award.id} className="flex items-center gap-3 py-2">
              <button
                type="button"
                onClick={() => viewAward(award.id)}
                title={`Open full criteria for ${award.name}`}
                className="ribbon-cell compact flex-shrink-0 hover:ring-2 hover:ring-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-usmc-scarlet"
                style={{ background: award.image.fileExists ? undefined : "var(--color-muted)" }}
              >
                {award.image.fileExists && award.image.ribbon ? (
                  <img src={award.image.ribbon} alt="" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-muted-foreground">
                    {award.shortName}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => viewAward(award.id)}
                className="flex-1 min-w-0 text-left hover:text-usmc-scarlet-300 transition-colors"
              >
                <div className="text-sm font-medium truncate">{award.name}</div>
                <div className="font-mono text-[11px] text-subtle-foreground truncate">
                  P{award.precedence} - {award.shortName} - {award.category.toUpperCase()}
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  selected
                    ? onRemove(award.id)
                    : onAdd({ awardId: award.id, devices: {} })
                }
                className={`px-3 py-1 rounded-button text-xs font-semibold transition-colors ${
                  selected
                    ? "bg-usmc-scarlet text-white hover:bg-usmc-scarlet-700"
                    : "bg-surface-3 hover:bg-brass hover:text-marine-blue-700"
                }`}
              >
                {selected ? "Remove" : "Add"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
