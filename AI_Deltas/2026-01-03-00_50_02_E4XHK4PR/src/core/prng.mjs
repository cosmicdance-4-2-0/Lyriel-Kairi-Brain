/*
DeltaID: 2026-01-03-00_50_02_E4XHK4PR
Purpose: Provide a minimal, seeded PRNG for deterministic PhaseCube runs.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/10_Baseline_Conformance.md (copied as mirror)
Notes:
- Uses a simple LCG; not suitable for cryptographic purposes.
- Keeps the RNG injectable for future swaps without altering defaults.
*/

const MODULUS = 0x100000000; // 2^32
const MULTIPLIER = 1664525;
const INCREMENT = 1013904223;

export class Lcg {
  constructor(seed = 1) {
    const normalized = Number.isFinite(seed) ? seed >>> 0 : 1;
    this.state = normalized || 1;
  }

  next() {
    this.state = (MULTIPLIER * this.state + INCREMENT) >>> 0;
    return this.state / MODULUS;
  }
}

export const createPrng = (seed = 1) => {
  const lcg = new Lcg(seed);
  return () => lcg.next();
};

export const randomInt = (prng, max) => Math.floor(prng() * max);
