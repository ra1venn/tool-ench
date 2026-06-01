import { Enchantment } from './enchantments';

export interface AnvilItem {
  name: string;
  enchantments: { enchantment: Enchantment; level: number }[];
  priorWorkPenalty: number;
  isBook: boolean;
}

export interface AnvilStep {
  target: AnvilItem;
  sacrifice: AnvilItem;
  result: AnvilItem;
  cost: number;
  stepNumber: number;
}

export interface OptimizationResult {
  steps: AnvilStep[];
  totalCost: number;
  tooExpensive: boolean;
}

function getPWP(count: number): number {
  return (1 << count) - 1;
}

function calcCost(target: AnvilItem, sacrifice: AnvilItem): number {
  let cost = getPWP(target.priorWorkPenalty) + getPWP(sacrifice.priorWorkPenalty);
  for (const se of sacrifice.enchantments) {
    const incompatible = target.enchantments.some(e =>
      e.enchantment.incompatibleWith.includes(se.enchantment.id)
    );
    if (incompatible) { cost += 1; continue; }
    const te = target.enchantments.find(e => e.enchantment.id === se.enchantment.id);
    let finalLevel: number;
    if (te) {
      finalLevel = te.level === se.level
        ? Math.min(te.level + 1, se.enchantment.maxLevel)
        : Math.max(te.level, se.level);
    } else {
      finalLevel = se.level;
    }
    const mult = sacrifice.isBook ? se.enchantment.bookMultiplier : se.enchantment.itemMultiplier;
    cost += finalLevel * mult;
  }
  return cost;
}

function mergeItems(target: AnvilItem, sacrifice: AnvilItem): AnvilItem {
  const enchantments = target.enchantments.map(e => ({ ...e }));
  for (const se of sacrifice.enchantments) {
    if (enchantments.some(e => e.enchantment.incompatibleWith.includes(se.enchantment.id))) continue;
    const existing = enchantments.find(e => e.enchantment.id === se.enchantment.id);
    if (existing) {
      existing.level = existing.level === se.level
        ? Math.min(existing.level + 1, se.enchantment.maxLevel)
        : Math.max(existing.level, se.level);
    } else {
      enchantments.push({ ...se });
    }
  }
  return {
    name: target.isBook && sacrifice.isBook ? 'Combined Book' : target.name,
    enchantments,
    priorWorkPenalty: Math.max(target.priorWorkPenalty, sacrifice.priorWorkPenalty) + 1,
    isBook: target.isBook && sacrifice.isBook,
  };
}

// ─────────────────────────────────────────────
// Bitmask DP over subsets.
//
// items[0] = the tool, items[1..n] = individual books.
//
// For every subset S of items, we compute the cheapest way
// to reduce S down to a single item by anvil operations,
// and what that single item looks like.
//
// dp[mask] = { item: AnvilItem, cost: number, leftMask: number, rightMask: number }
//
// Base case: single-item subsets.
// Transition: for each mask with ≥2 bits, try splitting it into
// two non-empty subsets (left, right) and combine dp[left] + dp[right].
//
// Key constraints:
//   • The tool (index 0) can never be the sacrifice (right side).
//     So if index 0 is in the mask, it must be in the LEFT submask.
//   • We try both (left=target, right=sacrifice) orderings
//     for pure-book subsets, but when the tool is present, it's always target.
// ─────────────────────────────────────────────

interface DPEntry {
  item: AnvilItem;
  cost: number;       // total cost to build this merged item from its subset
  leftMask: number;   // -1 for base cases
  rightMask: number;
  targetIsLeft: boolean;
}

function solveDP(items: AnvilItem[]): OptimizationResult {
  const n = items.length;
  const full = (1 << n) - 1;
  const toolBit = 1; // items[0] is the tool

  const dp: (DPEntry | null)[] = new Array(full + 1).fill(null);

  // Base cases: single items
  for (let i = 0; i < n; i++) {
    const mask = 1 << i;
    dp[mask] = {
      item: items[i],
      cost: 0,
      leftMask: -1,
      rightMask: -1,
      targetIsLeft: true,
    };
  }

  // Enumerate subsets by size (2, 3, ..., n)
  for (let size = 2; size <= n; size++) {
    // iterate over all masks of `size` bits
    forEachSubsetOfSize(n, size, (mask) => {
      const hasTool = (mask & toolBit) !== 0;

      // Try all ways to split mask into two non-empty subsets
      // We only need to try each unordered partition once (sub < complement)
      // then try both target/sacrifice orderings.
      // Optimization: iterate over all sub-masks of mask.
      let sub = (mask - 1) & mask;
      while (sub > 0) {
        const comp = mask ^ sub;

        // both must be non-empty and have DP entries
        if (dp[sub] && dp[comp]) {
          // If tool is present, it must be on the target (left) side.
          // The tool cannot be sacrificed.
          if (hasTool) {
            // Tool must be in the target's submask
            if (sub & toolBit) {
              // sub contains tool → sub is target, comp is sacrifice
              tryMerge(mask, sub, comp, true);
            }
            if (comp & toolBit) {
              // comp contains tool → comp is target, sub is sacrifice
              tryMerge(mask, comp, sub, true);
            }
          } else {
            // No tool involved — try both orderings
            // sub-mask iteration visits (sub, comp) and later (comp, sub),
            // so we only need to try one ordered pair per visit to cover all.
            // But for safety and simplicity, we try both here — sub < comp check
            // avoids duplicating since the loop visits both (sub,comp) and (comp,sub).
            if (sub < comp) {
              tryMerge(mask, sub, comp, true);
              tryMerge(mask, comp, sub, true);
            }
          }
        }

        sub = (sub - 1) & mask;
      }
    });
  }

  function tryMerge(mask: number, targetMask: number, sacrificeMask: number, targetIsLeft: boolean) {
    const targetEntry = dp[targetMask]!;
    const sacrificeEntry = dp[sacrificeMask]!;
    const stepCost = calcCost(targetEntry.item, sacrificeEntry.item);
    const totalCost = targetEntry.cost + sacrificeEntry.cost + stepCost;

    const existing = dp[mask];
    if (!existing || totalCost < existing.cost) {
      dp[mask] = {
        item: mergeItems(targetEntry.item, sacrificeEntry.item),
        cost: totalCost,
        leftMask: targetMask,
        rightMask: sacrificeMask,
        targetIsLeft,
      };
    }
  }

  // Reconstruct steps from DP
  const entry = dp[full];
  if (!entry) {
    return { steps: [], totalCost: 0, tooExpensive: false };
  }

  const steps: AnvilStep[] = [];
  let stepNum = 0;

  function reconstruct(mask: number): AnvilItem {
    const e = dp[mask]!;
    if (e.leftMask === -1) return e.item; // base case

    const targetItem = reconstruct(e.leftMask);
    const sacrificeItem = reconstruct(e.rightMask);
    stepNum++;
    const cost = calcCost(targetItem, sacrificeItem);
    const result = mergeItems(targetItem, sacrificeItem);
    steps.push({ target: targetItem, sacrifice: sacrificeItem, result, cost, stepNumber: stepNum });
    return result;
  }

  reconstruct(full);

  return {
    steps,
    totalCost: entry.cost,
    tooExpensive: steps.some(s => s.cost > 39),
  };
}

// Helper to iterate over all bitmasks of exactly `size` bits within `n` total bits
function forEachSubsetOfSize(n: number, size: number, callback: (mask: number) => void) {
  // Gosper's hack to enumerate all bitmasks with exactly `size` bits set
  if (size === 0 || size > n) return;
  let mask = (1 << size) - 1;
  const limit = 1 << n;
  while (mask < limit) {
    callback(mask);
    // Gosper's hack — use bit shifts instead of division for integer safety
    const lowest = mask & (-mask);
    const ripple = mask + lowest;
    // trailing = number of trailing set bits → log2(lowest)
    let trail = 0;
    let tmp = lowest;
    while (tmp > 1) { tmp >>= 1; trail++; }
    const ones = ((mask ^ ripple) >> (trail + 2));
    mask = ripple | ones;
  }
}

// ─────────────────────────────────────────────
// For > 12 items (11+ enchantments) the bitmask DP is too large (2^13 = 8192 subsets,
// with O(3^n) sub-subset enumeration ≈ 1.6M for n=13, which is still feasible up to ~15).
// Beyond that, fall back to heuristics.
// ─────────────────────────────────────────────

function binaryTreeCombine(toolItem: AnvilItem, books: AnvilItem[]): OptimizationResult {
  if (books.length === 0) return { steps: [], totalCost: 0, tooExpensive: false };
  const steps: AnvilStep[] = [];
  let stepCounter = 0, totalCost = 0, tooExpensive = false;
  let currentItems = [...books];
  while (currentItems.length > 1) {
    const nextLevel: AnvilItem[] = [];
    for (let i = 0; i < currentItems.length; i += 2) {
      if (i + 1 < currentItems.length) {
        stepCounter++;
        const cost = calcCost(currentItems[i], currentItems[i + 1]);
        const result = mergeItems(currentItems[i], currentItems[i + 1]);
        steps.push({ target: currentItems[i], sacrifice: currentItems[i + 1], result, cost, stepNumber: stepCounter });
        totalCost += cost;
        if (cost > 39) tooExpensive = true;
        nextLevel.push(result);
      } else {
        nextLevel.push(currentItems[i]);
      }
    }
    currentItems = nextLevel;
  }
  stepCounter++;
  const cost = calcCost(toolItem, currentItems[0]);
  const result = mergeItems(toolItem, currentItems[0]);
  steps.push({ target: toolItem, sacrifice: currentItems[0], result, cost, stepNumber: stepCounter });
  totalCost += cost;
  if (cost > 39) tooExpensive = true;
  return { steps, totalCost, tooExpensive };
}

function sequentialCombine(toolItem: AnvilItem, books: AnvilItem[]): OptimizationResult {
  if (books.length === 0) return { steps: [], totalCost: 0, tooExpensive: false };
  const steps: AnvilStep[] = [];
  let current = { ...toolItem, enchantments: [...toolItem.enchantments] };
  let totalCost = 0, tooExpensive = false;
  const remaining = [...books];
  let stepNum = 0;
  while (remaining.length > 0) {
    let bestIdx = 0, bestCost = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const c = calcCost(current, remaining[i]);
      if (c < bestCost) { bestCost = c; bestIdx = i; }
    }
    stepNum++;
    const sacrifice = remaining.splice(bestIdx, 1)[0];
    const result = mergeItems(current, sacrifice);
    steps.push({ target: current, sacrifice, result, cost: bestCost, stepNumber: stepNum });
    totalCost += bestCost;
    if (bestCost > 39) tooExpensive = true;
    current = result;
  }
  return { steps, totalCost, tooExpensive };
}

function pseudoRandom(seed: number): number {
  let x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function heuristicSearch(toolItem: AnvilItem, books: AnvilItem[]): OptimizationResult {
  const strategies: AnvilItem[][] = [];
  const byCostDesc = [...books].sort((a, b) =>
    (b.enchantments[0].level * b.enchantments[0].enchantment.bookMultiplier) -
    (a.enchantments[0].level * a.enchantments[0].enchantment.bookMultiplier)
  );
  strategies.push(byCostDesc);
  strategies.push([...byCostDesc].reverse());

  const byMultDesc = [...books].sort((a, b) => {
    const d = b.enchantments[0].enchantment.bookMultiplier - a.enchantments[0].enchantment.bookMultiplier;
    return d !== 0 ? d : b.enchantments[0].level - a.enchantments[0].level;
  });
  strategies.push(byMultDesc);
  strategies.push([...byMultDesc].reverse());

  const interleaved: AnvilItem[] = [];
  const h = Math.ceil(byCostDesc.length / 2);
  for (let i = 0; i < h; i++) {
    interleaved.push(byCostDesc[i]);
    if (i + h < byCostDesc.length) interleaved.push(byCostDesc[i + h]);
  }
  strategies.push(interleaved);
  strategies.push([...interleaved].reverse());

  for (let t = 0; t < 60; t++) {
    const shuffled = [...books];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(pseudoRandom(t * 1000 + i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    strategies.push(shuffled);
  }

  let best: OptimizationResult | null = null;
  for (const strat of strategies) {
    const r = binaryTreeCombine(toolItem, strat);
    if (!best || r.totalCost < best.totalCost) best = r;
  }
  const seq = sequentialCombine(toolItem, books);
  if (!best || seq.totalCost < best.totalCost) best = seq;
  return best!;
}

// ─────────────────────────────────────────────
// Main entry
// ─────────────────────────────────────────────
export function findOptimalOrder(
  itemName: string,
  selectedEnchantments: { enchantment: Enchantment; level: number }[]
): OptimizationResult {
  if (selectedEnchantments.length === 0) {
    return { steps: [], totalCost: 0, tooExpensive: false };
  }

  const toolItem: AnvilItem = {
    name: itemName,
    enchantments: [],
    priorWorkPenalty: 0,
    isBook: false,
  };

  const books: AnvilItem[] = selectedEnchantments.map(e => ({
    name: `${e.enchantment.name} ${toRoman(e.level)}`,
    enchantments: [{ enchantment: e.enchantment, level: e.level }],
    priorWorkPenalty: 0,
    isBook: true,
  }));

  const n = books.length;

  // Bitmask DP is feasible up to ~14 items (tool + 13 books).
  // 2^14 = 16384 masks, sub-subset enum ≈ 3^14 ≈ 4.8M — fast enough.
  // Most items in Minecraft have at most 7-8 enchantments, so this covers all practical cases.
  if (n <= 13) {
    return solveDP([toolItem, ...books]);
  } else {
    return heuristicSearch(toolItem, books);
  }
}

export function toRoman(num: number): string {
  const map: [number, string][] = [[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
  let result = '';
  for (const [v, s] of map) { while (num >= v) { result += s; num -= v; } }
  return result;
}
