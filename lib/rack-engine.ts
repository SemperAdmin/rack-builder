import type { RackEntry, RackLayout, RackRules } from "./types";
import { awardsData, getAwardById } from "./awards";

/**
 * Row stacking engine per MCO 1020.34H §5301.
 *
 * Inputs:
 *  - entries: a precedence-ordered list of RackEntry items. Order is highest
 *    precedence first (precedence value ascending: 1, 2, 3, ...).
 *  - rules: rackRules from awards.json. Default to the parsed rules.
 *
 * Output: RackLayout. rows[0] is the TOP row of the rack. Inside each row,
 * the array is stored in left-to-right visual order. Renderers must apply
 * row-reverse flex to place the highest-precedence ribbon on the wearer's
 * RIGHT (the viewer's LEFT). Per §5301 the rack is read top-down,
 * right-to-left from the wearer's perspective.
 *
 * Algorithm:
 *  1. Sort entries by award precedence ascending.
 *  2. Choose ribbons-per-row R based on count:
 *      - 1 to 3 ribbons: 1 row, R = count.
 *      - 4 ribbons: 2 rows of 2, optional 1+3 for female (§5301).
 *      - 5+ ribbons: rowsDefault = 3 per row, until count exceeds capacity
 *        of rowsMaxBeforeDecrease * 3. Then R increases to 4. Then to 5+.
 *  3. Fill bottom row first with the LOWEST precedence ribbons, working up.
 *     The top row holds the highest precedence ribbons. If the top row is
 *     incomplete (fewer than R), it is centered above the row below per
 *     topRowAlignment.
 *  4. femaleTwoRibbonRow option allows a 2-ribbon top row for 4-ribbon
 *     racks. Not enabled by default.
 */

export interface BuildLayoutOptions {
  female?: boolean;          // affects 4-ribbon racks per §5301
  forceRibbonsPerRow?: number; // override when caller wants a specific R
}

export function buildLayout(
  entries: RackEntry[],
  rules: RackRules = awardsData.rackRules,
  opts: BuildLayoutOptions = {}
): RackLayout {
  // Filter unknown awards defensively.
  const valid = entries.filter((e) => getAwardById(e.awardId));

  // Sort by precedence ascending (1 is highest authority).
  const sorted = [...valid].sort((a, b) => {
    const ap = getAwardById(a.awardId)!.precedence;
    const bp = getAwardById(b.awardId)!.precedence;
    return ap - bp;
  });

  const n = sorted.length;
  if (n === 0) {
    return { rows: [], rowCount: 0, ribbonsPerFullRow: 0, topRowCount: 0, source: rules.source };
  }

  // Determine ribbons per row.
  let R = opts.forceRibbonsPerRow ?? chooseRibbonsPerRow(n, rules, opts.female ?? false);
  if (R < 1) R = 1;

  // Compute number of rows. Top row holds the remainder.
  const fullRows = Math.floor(n / R);
  const remainder = n % R;
  const rowCount = remainder > 0 ? fullRows + 1 : fullRows;
  const topRowCount = remainder > 0 ? remainder : R;

  // Build rows. Bottom row gets lowest precedence (highest precedence number).
  // Walk the sorted array from the END (lowest precedence) and fill the
  // bottom row first.
  const rows: RackEntry[][] = [];
  let cursor = n;

  // Bottom up.
  for (let row = rowCount - 1; row >= 0; row--) {
    const size = row === 0 ? topRowCount : R;
    const slice = sorted.slice(cursor - size, cursor);
    cursor -= size;
    // Within each row, the highest-precedence entry must end up on the
    // wearer's right. We store left-to-right; renderer applies row-reverse.
    // Since we sliced a contiguous precedence-ordered range, the FIRST
    // element of the slice has the highest precedence. We store
    // left-to-right with the LOWEST precedence first so row-reverse pushes
    // the highest precedence to the visual right.
    rows[row] = slice.slice().reverse();
  }

  return {
    rows,
    rowCount,
    ribbonsPerFullRow: R,
    topRowCount,
    source: rules.source
  };
}

/**
 * §5301 ribbons-per-row decision.
 *
 * Standard practice:
 *  - 1 ribbon worn alone.
 *  - 2 worn side by side.
 *  - 3 worn side by side (one row of three).
 *  - 4 worn in two rows of two, or 1 over 3 for female uniforms.
 *  - 5 to 12 worn in rows of three. Top row centered when incomplete.
 *  - 13+ worn in rows of four. Top row centered when incomplete.
 *  - Past 16, rows of five or more once the rack would exceed the wearer's
 *    height limit per §5301. We escalate to R=5 at n > 20, R=6 at n > 30.
 *
 * Returns the integer R.
 */
export function chooseRibbonsPerRow(n: number, rules: RackRules, female: boolean): number {
  if (n <= 3) return n;
  if (n === 4) {
    if (female && rules.femaleTwoRibbonRowAllowed) return 3; // 1+3 stack
    return 2; // 2+2
  }
  // 5+ uses rowsDefault as the base ribbons per row.
  const R = rules.rowsDefault; // 3 by default
  const maxBeforeDecrease = rules.rowsMaxBeforeDecrease; // 4 rows of R = 12

  // Up to maxBeforeDecrease rows at R width.
  if (n <= R * maxBeforeDecrease) return R; // 5 to 12 ribbons -> rows of 3

  // Escalate width to next size.
  let width = R + 1; // 4
  while (n > width * maxBeforeDecrease && width < 8) {
    width += 1;
  }
  return width;
}

// Renderer helper: returns the visual offset (in ribbons) the top row should
// shift right so it centers over the row below. Used for centered_over_row_below.
export function topRowCenterOffset(layout: RackLayout): number {
  if (layout.rowCount <= 1) return 0;
  const below = layout.ribbonsPerFullRow;
  const top = layout.topRowCount;
  if (top >= below) return 0;
  return (below - top) / 2;
}
