/*
PROVENANCE
- Repo: Lyriel-Kairi-Brain
- File: src/core/prng.js
- Created: 2026-01-03-07_23_21
- DeltaID: 2026-01-03-07_23_21_YQX1ZLUP
- Generator: Codex
- Source Vectors:
  - docs/specs/DREAMING_BASELINE.md
  - docs/adr/0004-prng-and-determinism.md
- Intent:
  - Provide a deterministic, seedable pseudo-random number generator for PhaseCube runs.
- Constraints:
  - No external dependencies; pure function.
  - Stable output distribution in [0, 1) for repeatable simulations.
- Notes:
  - Mulberry32 is chosen for simplicity and sufficient quality for baseline needs.
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
