import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const src = path.join(repoRoot, "images");
const dest = path.join(repoRoot, "public", "images");

if (!fs.existsSync(src)) {
  const ribbonsDir = path.join(dest, "ribbons");
  if (fs.existsSync(ribbonsDir) && fs.readdirSync(ribbonsDir).length > 0) {
    console.log("✓ Assets already in /public/images/ribbons. Sync skipped.");
    process.exit(0);
  }
  console.error(`FAIL: source folder missing at ${src} and /public/images/ribbons is empty`);
  process.exit(1);
}

let copied = 0;
let skipped = 0;

function walk(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      walk(s, d);
    } else {
      let shouldCopy = true;
      if (fs.existsSync(d)) {
        const ss = fs.statSync(s);
        const ds = fs.statSync(d);
        if (ss.mtimeMs <= ds.mtimeMs && ss.size === ds.size) {
          shouldCopy = false;
          skipped += 1;
        }
      }
      if (shouldCopy) {
        fs.copyFileSync(s, d);
        copied += 1;
      }
    }
  }
}

walk(src, dest);
console.log(`Synced /public/images: ${copied} copied, ${skipped} up-to-date.`);
process.exit(0);
