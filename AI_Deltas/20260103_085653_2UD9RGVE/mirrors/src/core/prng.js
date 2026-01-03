/*
DeltaID: 20260103_085653_2UD9RGVE
Purpose: Mirror of the baseline PRNG utility for deployment packaging.
Sources:
- src/core/prng.js
Notes:
- Behavior unchanged; header added for provenance.
*/
/**
 * PROVENANCE: DeltaID=2026-01-03-07_23_21_YQX1ZLUP | Source=docs/adr/0004-prng-and-determinism.md | Intent=Deterministic PRNG factory
 */
export function createPrng(seed = Date.now()) {
  let state = seed >>> 0;
  return function next() {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * PROVENANCE: DeltaID=2026-01-03-07_23_21_YQX1ZLUP | Source=docs/specs/DREAMING_BASELINE.md | Intent=Clamp helper for PRNG consumers
 */
export function clamp01(value) {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}
