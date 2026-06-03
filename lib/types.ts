// Types align to data/awards.json schemaVersion 1.0.0-draft.
// Source of truth for fields: SECNAV M-1650.1 and MCO 1020.34H.

export type DeviceCode =
  | "star_gold_5_16"
  | "star_silver_5_16"
  | "star_bronze_3_16"
  | "star_silver_3_16"
  | "oak_leaf_bronze"
  | "oak_leaf_silver"
  | "v_device"
  | "c_device"
  | "r_device"
  | "m_device"
  | "numeral_gold"
  | "numeral_bronze"
  | "fmf_device"
  | "wreath_bronze"
  | "palm_bronze"
  | "frame_bronze";

export type AwardCategory =
  | "pmd"     // Personal Military Decoration
  | "uca"     // Unit Citation Award
  | "ncd"     // Non-combat Decoration
  | "scm"     // Service and Campaign Medal
  | "tsr"     // Training and Service Ribbon
  | "foreign" // Foreign award
  | "marksmanship";

export interface AwardImage {
  ribbon: string | null;
  fileExists: boolean;
}

export interface AwardDevices {
  authorized: DeviceCode[];
  subsequentAwardMarker?: string;
  valorContext?: string;
  cDeviceContext?: string;
  rDeviceContext?: string;
  cDeviceNotAuthorized?: string;
  complexRule?: string;
}

export interface AwardCitations {
  precedence?: string;
  criteria?: string;
  devices?: string;
  wear?: string;
  vDevice?: string;
  cDevice?: string;
  rDevice?: string;
  cDeviceExclusion?: string;
  numerals?: string;
  [k: string]: string | undefined;
}

export interface Award {
  id: string;
  precedence: number;
  category: AwardCategory;
  name: string;
  shortName: string;
  marineApplicable: boolean;
  issuingAuthority?: string;
  statutoryReference?: string;
  effectiveDate?: string;
  image: AwardImage;
  criteriaSummary: string;
  criteriaFullText?: string;
  evidenceStandard?: string;
  devices: AwardDevices;
  wearNotes?: string;
  marineApplicableNote?: string;
  citations: AwardCitations;
}

export interface RackRules {
  rowsDefault: number;
  rowsMaxBeforeDecrease: number;
  topDownOrdering: boolean;
  rightToLeftOrdering: boolean;
  topRowAlignment: "centered_over_row_below";
  lowerRowAlignment: "outer_edge_vertical";
  incompleteRowPosition: "top";
  femaleTwoRibbonRowAllowed: boolean;
  rowSpacing: string[];
  source: string;
}

export interface AwardsData {
  schemaVersion: string;
  lastUpdated: string;
  status: string;
  sourceCitations: {
    precedence: string;
    criteria: string;
    policy: string;
  };
  rackRules: RackRules;
  awards: Award[];
}

// RACK STATE TYPES

export interface RackEntry {
  awardId: string;
  // Device application is a partial map of DeviceCode to integer count.
  // Star/oak leaf counts indicate subsequent award count, not raw devices.
  devices: Partial<Record<DeviceCode, number>>;
  // Author-supplied display variant for awards with multiple PNG variants
  // (Vietnam Gallantry Cross, RVN Civil Action, etc.).
  variantId?: string;
}

export interface RackLayout {
  rows: RackEntry[][];
  rowCount: number;
  ribbonsPerFullRow: number;
  topRowCount: number;
  source: string;
}
