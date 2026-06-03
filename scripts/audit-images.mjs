// Cross-reference awards.json image claims against the filesystem.
// Usage: node scripts/audit-images.mjs
//
// Exit 0 if no Marine-applicable blocker is missing. Non-zero otherwise.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const awardsPath = path.join(repoRoot, "data", "awards.json");
const imagesRoot = path.join(repoRoot, "images");

const data = JSON.parse(fs.readFileSync(awardsPath, "utf-8"));

const results = {
  total: 0,
  marineTotal: 0,
  marineHasImage: 0,
  marineMissingImage: 0,
  marineClaimedButFileMissing: [],
  marineClaimedButFilePresent: [],
  marineMissing: [],
  orphanFiles: []
};

const claimedFiles = new Set();

for (const award of data.awards) {
  results.total += 1;
  if (!award.marineApplicable) continue;
  results.marineTotal += 1;

  if (award.image.fileExists && award.image.ribbon) {
    const fsPath = path.join(repoRoot, award.image.ribbon.replace(/^\//, ""));
    claimedFiles.add(path.normalize(fsPath));
    if (fs.existsSync(fsPath)) {
      results.marineHasImage += 1;
    } else {
      results.marineClaimedButFileMissing.push({
        id: award.id,
        shortName: award.shortName,
        precedence: award.precedence,
        path: award.image.ribbon
      });
    }
  } else {
    results.marineMissingImage += 1;
    results.marineMissing.push({
      id: award.id,
      shortName: award.shortName,
      name: award.name,
      precedence: award.precedence
    });
  }
}

// Detect orphan files: PNGs in images/ribbons that no award claims.
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(png|jpg|jpeg|gif|webp)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

if (fs.existsSync(path.join(imagesRoot, "ribbons"))) {
  const files = walk(path.join(imagesRoot, "ribbons"));
  for (const f of files) {
    if (!claimedFiles.has(path.normalize(f))) {
      results.orphanFiles.push(path.relative(repoRoot, f));
    }
  }
}

console.log(JSON.stringify(results, null, 2));

const blockers = results.marineClaimedButFileMissing.length;
if (blockers > 0) {
  console.error(`FAIL: ${blockers} Marine-applicable awards claim images that do not exist on disk.`);
  process.exit(2);
}
process.exit(0);
