import type { RackEntry } from "./types";

// Rack state serialized into a URL hash so navigation to /awards/[id] and
// back preserves the builder. Format:
//
//   #state=<encodeURIComponent of compact JSON>
//
// Compact keys minimize URL length: f = female toggle, e = entries,
// a = awardId, d = device map, v = variant id. Tested round-trip safe.

export interface RackState {
  female: boolean;
  entries: RackEntry[];
}

const HASH_PREFIX = "#state=";

interface CompactEntry {
  a: string;
  d: RackEntry["devices"];
  v?: string;
}

interface CompactState {
  f: boolean;
  e: CompactEntry[];
}

export function serializeRackState(state: RackState): string {
  const compact: CompactState = {
    f: state.female,
    e: state.entries.map((entry) => {
      const ce: CompactEntry = { a: entry.awardId, d: entry.devices };
      if (entry.variantId) ce.v = entry.variantId;
      return ce;
    })
  };
  return encodeURIComponent(JSON.stringify(compact));
}

export function deserializeRackState(encoded: string): RackState | null {
  try {
    const decoded = decodeURIComponent(encoded);
    const obj = JSON.parse(decoded) as Partial<CompactState>;
    if (!obj || !Array.isArray(obj.e)) return null;
    return {
      female: Boolean(obj.f),
      entries: obj.e.map((entry) => ({
        awardId: String(entry.a),
        devices: entry.d ?? {},
        variantId: entry.v
      }))
    };
  } catch {
    return null;
  }
}

export function readRackStateFromHash(hash: string | undefined): RackState | null {
  if (!hash || !hash.startsWith(HASH_PREFIX)) return null;
  return deserializeRackState(hash.slice(HASH_PREFIX.length));
}

export function buildHash(state: RackState): string {
  return `${HASH_PREFIX}${serializeRackState(state)}`;
}

// Helper for components needing the current hash for navigation.
export function getCurrentHash(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash;
}
