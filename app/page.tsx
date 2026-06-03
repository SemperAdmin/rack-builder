"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RackEntry } from "@/lib/types";
import { getAwardById } from "@/lib/awards";
import { RackCanvas } from "@/components/RackCanvas";
import { AwardPicker } from "@/components/AwardPicker";
import { DevicePicker } from "@/components/DevicePicker";
import { buildHash, readRackStateFromHash } from "@/lib/rack-state";

export default function BuilderPage() {
  const [entries, setEntries] = useState<RackEntry[]>([]);
  const [selectedAwardId, setSelectedAwardId] = useState<string | null>(null);
  const [female, setFemale] = useState(false);
  const hasHydratedFromHash = useRef(false);

  // Hydrate from URL hash once on mount. The detail page navigation round-trip
  // carries rack state across as #state=<encoded JSON>.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const state = readRackStateFromHash(window.location.hash);
    if (state) {
      setEntries(state.entries);
      setFemale(state.female);
    }
    hasHydratedFromHash.current = true;
  }, []);

  // Persist state into the hash after every change. Use replaceState so the
  // history stack does not bloat.
  useEffect(() => {
    if (!hasHydratedFromHash.current) return;
    if (typeof window === "undefined") return;
    const hash = buildHash({ female, entries });
    history.replaceState(null, "", hash);
  }, [female, entries]);

  const selectedIds = useMemo(() => new Set(entries.map((e) => e.awardId)), [entries]);
  const selectedEntry = entries.find((e) => e.awardId === selectedAwardId) ?? null;
  const selectedAward = selectedEntry ? getAwardById(selectedEntry.awardId) ?? null : null;

  function addEntry(entry: RackEntry) {
    setEntries((prev) => [...prev, entry]);
    setSelectedAwardId(entry.awardId);
  }

  function removeEntry(awardId: string) {
    setEntries((prev) => prev.filter((e) => e.awardId !== awardId));
    if (selectedAwardId === awardId) setSelectedAwardId(null);
  }

  function updateEntry(next: RackEntry) {
    setEntries((prev) => prev.map((e) => (e.awardId === next.awardId ? next : e)));
  }

  return (
    <div className="ambient-bloom max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      <section className="space-y-6">
        <div className="card-surface bg-card border border-border rounded-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-4xl tracking-wide">
              <span className="gradient-accent">RACK</span> PREVIEW
            </h1>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={female} onChange={(e) => setFemale(e.target.checked)} />
              Female uniform 1+3 stack for 4 ribbons (§5301)
            </label>
          </div>
          <RackCanvas
            entries={entries}
            female={female}
            selectedAwardId={selectedAwardId ?? undefined}
            onSelect={setSelectedAwardId}
          />
        </div>

        {selectedAward && selectedEntry ? (
          <DevicePicker
            award={selectedAward}
            entry={selectedEntry}
            onChange={updateEntry}
          />
        ) : (
          <div className="card-surface bg-card border border-border rounded-card p-6 shadow-card">
            <p className="text-sm text-muted-foreground italic">
              Select a ribbon to configure devices. Highlighted ribbons in the preview are editable. Click a ribbon image in the awards library to read full criteria.
            </p>
          </div>
        )}
      </section>

      <aside className="card-surface bg-card border border-border rounded-card p-6 shadow-card h-fit lg:sticky lg:top-24">
        <AwardPicker selectedIds={selectedIds} onAdd={addEntry} onRemove={removeEntry} />
      </aside>
    </div>
  );
}
