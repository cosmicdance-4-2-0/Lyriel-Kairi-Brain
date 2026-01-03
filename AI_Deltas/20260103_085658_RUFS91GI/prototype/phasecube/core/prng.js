/*
DeltaID: 20260103_085658_RUFS91GI
Purpose: Seeded Mulberry32 PRNG for the hostable PhaseCube prototype bundle.
Sources:
- src/core/prng.js
Notes:
- Mirrors baseline behavior; only the provenance header differs from the upstream file.
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

export function clamp01(value) {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}
