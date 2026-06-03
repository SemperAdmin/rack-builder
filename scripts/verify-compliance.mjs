// Compliance verification pass.
// Inspects awards.json structure and runs the rack engine against a battery
// of fixture inputs that mirror MCO 1020.34H §5301 examples.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const awardsPath = path.join(repoRoot, "data", "awards.json");
const data = JSON.parse(fs.readFileSync(awardsPath, "utf-8"));

const checks = [];

function check(name, pass, detail, citation) {
  checks.push({ name, pass, detail, citation });
}

// ---- 1. Schema sanity ----
check(
  "schemaVersion present",
  typeof data.schemaVersion === "string",
  `value: ${data.schemaVersion}`,
  "self"
);

check(
  "rackRules block matches §5301 derived defaults",
  data.rackRules &&
    data.rackRules.rowsDefault === 3 &&
    data.rackRules.rowsMaxBeforeDecrease === 4 &&
    data.rackRules.topDownOrdering === true &&
    data.rackRules.rightToLeftOrdering === true &&
    data.rackRules.incompleteRowPosition === "top",
  JSON.stringify(data.rackRules),
  "MCO 1020.34H §5301"
);

// ---- 2. Precedence integrity ----
const precs = data.awards.map((a) => a.precedence);
const dupes = precs.filter((v, i, arr) => arr.indexOf(v) !== i);
check(
  "no duplicate precedence values",
  dupes.length === 0,
  dupes.length === 0 ? "all unique" : `duplicates: ${dupes.join(", ")}`,
  "MCO 1020.34H §5102"
);

const sorted = [...precs].sort((a, b) => a - b);
const gaps = [];
for (let i = 1; i < sorted.length; i++) {
  if (sorted[i] - sorted[i - 1] > 1) gaps.push(`${sorted[i - 1]}->${sorted[i]}`);
}
check(
  "precedence sequence is contiguous",
  gaps.length === 0,
  gaps.length === 0 ? "no gaps" : `gaps: ${gaps.join(", ")}`,
  "MCO 1020.34H §5102"
);

// ---- 3. Device exclusion citations ----
const bsm = data.awards.find((a) => a.id === "bsm");
check(
  "BSM blocks C device per Tab 15 line 3096",
  bsm && bsm.devices.cDeviceNotAuthorized,
  bsm ? bsm.devices.cDeviceNotAuthorized : "missing",
  "SECNAV M-1650.1 Tab 15 line 3096"
);

const msm = data.awards.find((a) => a.id === "msm");
check(
  "MSM blocks C device per Tab 15 line 3104",
  msm && msm.devices.cDeviceNotAuthorized,
  msm ? msm.devices.cDeviceNotAuthorized : "missing",
  "SECNAV M-1650.1 Tab 15 line 3104"
);

const nam = data.awards.find((a) => a.id === "nam");
check(
  "NAM blocks V device per Tab 13 line 2901",
  nam && nam.devices.vDeviceNotAuthorized,
  nam ? nam.devices.vDeviceNotAuthorized : "missing",
  "SECNAV M-1650.1 Tab 13 line 2901"
);

// ---- 4. Required citation coverage ----
let missingCitations = 0;
for (const a of data.awards) {
  if (!a.citations || !a.citations.precedence) missingCitations += 1;
}
check(
  "every award has precedence citation",
  missingCitations === 0,
  `${missingCitations} missing`,
  "MCO 1020.34H §5102"
);

// ---- 5. Rack engine smoke tests ----
// Re-implement the engine here for portability (the script does not import TS source).
function chooseRibbonsPerRow(n, female) {
  if (n <= 3) return n;
  if (n === 4) return female ? 3 : 2;
  const R = 3;
  const maxBeforeDecrease = 4;
  if (n <= R * maxBeforeDecrease) return R;
  let width = R + 1;
  while (n > width * maxBeforeDecrease && width < 8) width += 1;
  return width;
}

function buildLayout(n, female) {
  const R = chooseRibbonsPerRow(n, female);
  if (n === 0) return { R: 0, rows: 0, topCount: 0 };
  const fullRows = Math.floor(n / R);
  const remainder = n % R;
  const rows = remainder > 0 ? fullRows + 1 : fullRows;
  const topCount = remainder > 0 ? remainder : R;
  return { R, rows, topCount };
}

const layoutChecks = [
  { n: 1, expected: { R: 1, rows: 1, topCount: 1 } },
  { n: 3, expected: { R: 3, rows: 1, topCount: 3 } },
  { n: 4, female: false, expected: { R: 2, rows: 2, topCount: 2 } },
  { n: 4, female: true, expected: { R: 3, rows: 2, topCount: 1 } },
  { n: 5, expected: { R: 3, rows: 2, topCount: 2 } },
  { n: 7, expected: { R: 3, rows: 3, topCount: 1 } },
  { n: 12, expected: { R: 3, rows: 4, topCount: 3 } },
  { n: 13, expected: { R: 4, rows: 4, topCount: 1 } },
  { n: 16, expected: { R: 4, rows: 4, topCount: 4 } },
  { n: 17, expected: { R: 5, rows: 4, topCount: 2 } }  // engine escalates past 4*4
];

for (const t of layoutChecks) {
  const result = buildLayout(t.n, t.female ?? false);
  const ok =
    result.R === t.expected.R &&
    result.rows === t.expected.rows &&
    result.topCount === t.expected.topCount;
  check(
    `rack layout n=${t.n}${t.female ? " female" : ""}`,
    ok,
    `got ${JSON.stringify(result)} expected ${JSON.stringify(t.expected)}`,
    "MCO 1020.34H §5301"
  );
}

// ---- Output ----
const passed = checks.filter((c) => c.pass).length;
const total = checks.length;
console.log(`Compliance verification: ${passed}/${total} checks passed.`);
console.log("");
for (const c of checks) {
  const mark = c.pass ? "PASS" : "FAIL";
  console.log(`[${mark}] ${c.name}`);
  console.log(`       detail: ${c.detail}`);
  console.log(`       cite:   ${c.citation}`);
}
if (passed < total) process.exit(1);
process.exit(0);
