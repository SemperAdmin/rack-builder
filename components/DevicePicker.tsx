"use client";

import { useRouter } from "next/navigation";
import type { Award, DeviceCode, RackEntry } from "@/lib/types";
import { DEVICE_SPECS, validateDevices } from "@/lib/devices";

interface Props {
  award: Award;
  entry: RackEntry;
  onChange: (next: RackEntry) => void;
}

const COUNT_DEVICES: DeviceCode[] = [
  "star_gold_5_16",
  "star_silver_5_16",
  "star_bronze_3_16",
  "star_silver_3_16",
  "oak_leaf_bronze",
  "oak_leaf_silver",
  "numeral_gold",
  "numeral_bronze"
];

const TOGGLE_DEVICES: DeviceCode[] = [
  "v_device",
  "c_device",
  "r_device",
  "m_device",
  "fmf_device",
  "palm_bronze",
  "wreath_bronze",
  "frame_bronze"
];

export function DevicePicker({ award, entry, onChange }: Props) {
  const authorized = new Set(award.devices.authorized);
  const counts = entry.devices;
  const errors = validateDevices(entry, award);
  const router = useRouter();

  function viewCriteria() {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.push(`/awards/${award.id}${hash}`);
  }

  function setCount(code: DeviceCode, next: number) {
    const safe = Math.max(0, Math.min(99, next));
    const nextDevices = { ...entry.devices, [code]: safe };
    if (safe === 0) delete nextDevices[code];
    onChange({ ...entry, devices: nextDevices });
  }

  function toggle(code: DeviceCode) {
    const current = entry.devices[code] ?? 0;
    setCount(code, current > 0 ? 0 : 1);
  }

  return (
    <div className="card-surface">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg tracking-wide">DEVICES - {award.shortName}</h3>
          <p className="font-mono text-xs text-subtle-foreground truncate">{award.name}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={viewCriteria}
            className="px-2 py-1 rounded-button text-xs font-semibold bg-marine-blue-300 text-parchment hover:bg-brass hover:text-marine-blue-700 transition-colors"
          >
            View full criteria
          </button>
          <span className="font-mono text-[10px] text-subtle-foreground uppercase">
            {award.citations.devices ?? award.citations.criteria ?? award.citations.precedence}
          </span>
        </div>
      </div>

      {award.devices.subsequentAwardMarker && (
        <p className="text-xs text-muted-foreground mb-3 italic">
          Subsequent award marker: {award.devices.subsequentAwardMarker}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-subtle-foreground mb-2">Count devices</h4>
          <ul className="space-y-2">
            {COUNT_DEVICES.filter((d) => authorized.has(d)).map((code) => {
              const spec = DEVICE_SPECS[code];
              const value = counts[code] ?? 0;
              return (
                <li key={code} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-xs"
                      style={{ background: "var(--color-surface-2)", color: spec.color, fontWeight: 700 }}
                    >
                      {spec.short}
                    </span>
                    <span className="text-sm">{spec.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCount(code, value - 1)}
                      className="w-6 h-6 rounded-xs bg-surface-3 hover:bg-brass text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={value}
                      onChange={(e) => setCount(code, parseInt(e.target.value || "0", 10))}
                      className="w-10 text-center bg-surface-2 border border-border rounded-xs text-sm py-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => setCount(code, value + 1)}
                      className="w-6 h-6 rounded-xs bg-surface-3 hover:bg-brass text-sm"
                    >
                      +
                    </button>
                  </div>
                </li>
              );
            })}
            {COUNT_DEVICES.filter((d) => authorized.has(d)).length === 0 && (
              <li className="text-xs italic text-subtle-foreground">No count devices authorized.</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider text-subtle-foreground mb-2">Toggle devices</h4>
          <ul className="space-y-2">
            {TOGGLE_DEVICES.filter((d) => authorized.has(d)).map((code) => {
              const spec = DEVICE_SPECS[code];
              const active = (counts[code] ?? 0) > 0;
              return (
                <li key={code}>
                  <button
                    type="button"
                    onClick={() => toggle(code)}
                    className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-xs border transition-colors ${
                      active
                        ? "border-usmc-scarlet bg-usmc-scarlet/20"
                        : "border-border bg-surface-2 hover:bg-surface-3"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span style={{ color: spec.color, fontWeight: 700 }}>{spec.short}</span>
                      <span className="text-sm">{spec.label}</span>
                    </span>
                    <span className="text-[10px] font-mono uppercase text-subtle-foreground">
                      {active ? "ON" : "off"}
                    </span>
                  </button>
                </li>
              );
            })}
            {TOGGLE_DEVICES.filter((d) => authorized.has(d)).length === 0 && (
              <li className="text-xs italic text-subtle-foreground">No toggle devices authorized.</li>
            )}
          </ul>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="border border-status-stale rounded-button bg-status-stale/10 p-3">
          <h5 className="text-xs uppercase tracking-wider text-status-stale font-semibold mb-1">
            Device violations
          </h5>
          <ul className="list-disc list-inside text-xs text-status-stale space-y-1">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
