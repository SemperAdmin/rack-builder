import type { Award, DeviceCode, RackEntry } from "./types";

// Device metadata. Source: SECNAV M-1650.1 Tabs 13 (V), 15 (C), 16 (R),
// and general device placement rules under §5302.

export interface DeviceSpec {
  code: DeviceCode;
  label: string;
  short: string;            // glyph or initial used in the device layer
  color: string;            // hex for inline render
  category: "valor" | "combat" | "remote" | "count" | "subsequent" | "frame";
  citation: string;
}

export const DEVICE_SPECS: Record<DeviceCode, DeviceSpec> = {
  star_gold_5_16: {
    code: "star_gold_5_16",
    label: "5/16-inch Gold Star",
    short: "★",
    color: "#D4AF67",
    category: "subsequent",
    citation: "SECNAV M-1650.1 §General Provisions, 5/16 gold star marks subsequent Marine awards"
  },
  star_silver_5_16: {
    code: "star_silver_5_16",
    label: "5/16-inch Silver Star",
    short: "★",
    color: "#C0C0C0",
    category: "subsequent",
    citation: "SECNAV M-1650.1 silver star replaces five gold stars"
  },
  star_bronze_3_16: {
    code: "star_bronze_3_16",
    label: "3/16-inch Bronze Star",
    short: "★",
    color: "#CD7F32",
    category: "subsequent",
    citation: "SECNAV M-1650.1 Service medal subsequent award and campaign credit"
  },
  star_silver_3_16: {
    code: "star_silver_3_16",
    label: "3/16-inch Silver Star",
    short: "★",
    color: "#C0C0C0",
    category: "subsequent",
    citation: "SECNAV M-1650.1 silver service star replaces five bronze"
  },
  oak_leaf_bronze: {
    code: "oak_leaf_bronze",
    label: "Bronze Oak Leaf Cluster",
    short: "❦",
    color: "#CD7F32",
    category: "subsequent",
    citation: "DoD policy. Used on joint and DoD awards worn by Marines"
  },
  oak_leaf_silver: {
    code: "oak_leaf_silver",
    label: "Silver Oak Leaf Cluster",
    short: "❦",
    color: "#C0C0C0",
    category: "subsequent",
    citation: "Replaces five bronze oak leaf clusters"
  },
  v_device: {
    code: "v_device",
    label: "Valor Device",
    short: "V",
    color: "#CD7F32",
    category: "valor",
    citation: "SECNAV M-1650.1 Tab 13 Table 4. Mandatory when award is for valor in combat"
  },
  c_device: {
    code: "c_device",
    label: "Combat Distinguishing Device",
    short: "C",
    color: "#CD7F32",
    category: "combat",
    citation: "SECNAV M-1650.1 Tab 15 Table 6. Authorized for meritorious service under combat conditions"
  },
  r_device: {
    code: "r_device",
    label: "Remote Impact Device",
    short: "R",
    color: "#CD7F32",
    category: "remote",
    citation: "SECNAV M-1650.1 Tab 16 Table 7. Impact awards with remote effect on combat operations"
  },
  m_device: {
    code: "m_device",
    label: "Mobilization Device",
    short: "M",
    color: "#CD7F32",
    category: "subsequent",
    citation: "Authorized on AFRM for mobilized service"
  },
  numeral_gold: {
    code: "numeral_gold",
    label: "Gold Strike/Flight Numeral",
    short: "#",
    color: "#D4AF67",
    category: "count",
    citation: "SECNAV M-1650.1 lines 2372-2373. Air Medal strike/flight count"
  },
  numeral_bronze: {
    code: "numeral_bronze",
    label: "Bronze Numeral",
    short: "#",
    color: "#CD7F32",
    category: "count",
    citation: "Used on Overseas Service Ribbon and similar"
  },
  fmf_device: {
    code: "fmf_device",
    label: "FMF Device",
    short: "FMF",
    color: "#D4AF67",
    category: "frame",
    citation: "Sea Service Deployment Ribbon FMF designation"
  },
  wreath_bronze: {
    code: "wreath_bronze",
    label: "Bronze Wreath",
    short: "❀",
    color: "#CD7F32",
    category: "frame",
    citation: "Specific foreign awards"
  },
  palm_bronze: {
    code: "palm_bronze",
    label: "Bronze Palm",
    short: "✦",
    color: "#CD7F32",
    category: "frame",
    citation: "Vietnam Gallantry Cross with Palm"
  },
  frame_bronze: {
    code: "frame_bronze",
    label: "Bronze Frame",
    short: "▭",
    color: "#CD7F32",
    category: "frame",
    citation: "Vietnam Gallantry Cross unit citation frame"
  }
};

/**
 * Validate that a device set on a RackEntry is permitted by the award's
 * authorized device list. Returns a list of violation strings. Empty array
 * means the entry passes.
 */
export function validateDevices(entry: RackEntry, award: Award): string[] {
  const errors: string[] = [];
  const authorized = new Set(award.devices.authorized);

  for (const [code, count] of Object.entries(entry.devices)) {
    if (count == null || count <= 0) continue;
    if (!authorized.has(code as DeviceCode)) {
      const spec = DEVICE_SPECS[code as DeviceCode];
      errors.push(
        `${award.shortName}: ${spec?.label ?? code} not authorized. Permitted: ${award.devices.authorized.join(", ") || "none"}.`
      );
    }
  }

  // Mutual exclusion: V, C, R devices are mutually exclusive on a single
  // ribbon per SECNAV M-1650.1 Tab 13 line 2839 and Tab 15 line 3046.
  const exclusiveActive = (["v_device", "c_device", "r_device"] as DeviceCode[]).filter(
    (d) => (entry.devices[d] ?? 0) > 0
  );
  if (exclusiveActive.length > 1) {
    errors.push(
      `${award.shortName}: V, C, and R devices are mutually exclusive on the same ribbon. Found: ${exclusiveActive.join(", ")}.`
    );
  }

  // BSM explicit exclusion of C device per Tab 15 line 3096.
  if (award.id === "bsm" && (entry.devices.c_device ?? 0) > 0) {
    errors.push("BSM: C device prohibited per SECNAV M-1650.1 Tab 15 line 3096. BSM is inherently a combat award.");
  }

  // MSM explicit exclusion of C device per Tab 15 line 3104.
  if (award.id === "msm" && (entry.devices.c_device ?? 0) > 0) {
    errors.push("MSM: C device prohibited per SECNAV M-1650.1 Tab 15 line 3104. MSM is awarded for service without exposure to hostile action.");
  }

  // NAM explicit exclusion of V device per Tab 13 line 2901 (effective 7 Jan 2016).
  if (award.id === "nam" && (entry.devices.v_device ?? 0) > 0) {
    errors.push("NAM: V device prohibited per SECNAV M-1650.1 Tab 13 line 2901, effective 7 January 2016. NAM is not awarded for valor.");
  }

  return errors;
}

/**
 * Computes the visual device set to render on top of the ribbon image based
 * on subsequent award count and combat/valor/remote selections. Star and
 * oak leaf substitution rules apply per SECNAV M-1650.1: five gold stars
 * become one silver star, five bronze oak leaf become one silver oak leaf.
 *
 * Returns an ordered array of (DeviceCode, count) tuples ready for layout.
 */
export function resolveDisplayDevices(entry: RackEntry, award: Award): Array<{ code: DeviceCode; count: number }> {
  const out: Array<{ code: DeviceCode; count: number }> = [];

  // Star substitution: 5 gold -> 1 silver.
  const goldStars = entry.devices.star_gold_5_16 ?? 0;
  if (award.devices.authorized.includes("star_gold_5_16")) {
    const silver = Math.floor(goldStars / 5) + (entry.devices.star_silver_5_16 ?? 0);
    const remainingGold = goldStars % 5;
    if (silver > 0) out.push({ code: "star_silver_5_16", count: silver });
    if (remainingGold > 0) out.push({ code: "star_gold_5_16", count: remainingGold });
  }

  // Service star substitution: 5 bronze -> 1 silver.
  const bronzeService = entry.devices.star_bronze_3_16 ?? 0;
  if (award.devices.authorized.includes("star_bronze_3_16")) {
    const silver = Math.floor(bronzeService / 5) + (entry.devices.star_silver_3_16 ?? 0);
    const remainingBronze = bronzeService % 5;
    if (silver > 0) out.push({ code: "star_silver_3_16", count: silver });
    if (remainingBronze > 0) out.push({ code: "star_bronze_3_16", count: remainingBronze });
  }

  // Oak leaf substitution: 5 bronze -> 1 silver.
  const bronzeOak = entry.devices.oak_leaf_bronze ?? 0;
  if (award.devices.authorized.includes("oak_leaf_bronze")) {
    const silver = Math.floor(bronzeOak / 5) + (entry.devices.oak_leaf_silver ?? 0);
    const remainingBronze = bronzeOak % 5;
    if (silver > 0) out.push({ code: "oak_leaf_silver", count: silver });
    if (remainingBronze > 0) out.push({ code: "oak_leaf_bronze", count: remainingBronze });
  }

  // Single-instance devices.
  for (const code of ["v_device", "c_device", "r_device", "m_device", "fmf_device", "palm_bronze", "wreath_bronze", "frame_bronze"] as DeviceCode[]) {
    const c = entry.devices[code] ?? 0;
    if (c > 0 && award.devices.authorized.includes(code)) {
      out.push({ code, count: 1 });
    }
  }

  // Numerals.
  for (const code of ["numeral_gold", "numeral_bronze"] as DeviceCode[]) {
    const c = entry.devices[code] ?? 0;
    if (c > 0 && award.devices.authorized.includes(code)) {
      out.push({ code, count: c });
    }
  }

  return out;
}
