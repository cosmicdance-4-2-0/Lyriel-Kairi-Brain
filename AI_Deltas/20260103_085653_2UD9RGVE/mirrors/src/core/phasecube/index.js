/*
DeltaID: 20260103_085653_2UD9RGVE
Purpose: Mirror of the PhaseCube core runner to accompany the deployment delta.
Sources:
- src/core/phasecube/index.js
Notes:
- Preserves baseline logic; header added for traceability only.
*/
import { clamp01, createPrng } from '../prng.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * PROVENANCE: DeltaID=2026-01-03-07_23_21_YQX1ZLUP | Source=docs/specs/DREAMING_BASELINE.md | Intent=PhaseCube state container and evolution logic
 */
export class PhaseCubeRunner {
  constructor(options = {}) {
    const {
      gridSize = 16,
      flipP = 0.02,
      parityP = 0.02,
      pathBP = 0.5,
      parityGain = 0.12,
      alpha = 0.18,
      pBMin = 0.05,
      pBMax = 0.95,
      seed = 1234,
    } = options;

    this.size = gridSize;
    this.count = gridSize ** 3;
    this.flipP = flipP;
    this.parityP = parityP;
    this.pathBP = pathBP;
    this.parityGain = parityGain;
    this.alpha = alpha;
    this.pBMin = pBMin;
    this.pBMax = pBMax;
    this.prng = createPrng(seed);

    this.state = {
      gridSize,
      plasma: new Float32Array(this.count),
      liquid: new Float32Array(this.count),
      solid: new Float32Array(this.count),
      parity: new Uint8Array(this.count),
      step: 0,
    };

    this.#initialize();
  }

  /**
   * PROVENANCE: DeltaID=2026-01-03-07_23_21_YQX1ZLUP | Source=docs/adr/0004-prng-and-determinism.md | Intent=Deterministic initialization
   */
  #initialize() {
    for (let i = 0; i < this.count; i += 1) {
      this.state.plasma[i] = this.prng();
      this.state.liquid[i] = this.prng();
      this.state.solid[i] = this.prng();
      this.state.parity[i] = this.prng() > 0.5 ? 1 : 0;
    }
  }

  /**
   * PROVENANCE: DeltaID=2026-01-03-07_23_21_YQX1ZLUP | Source=docs/adr/0002-boundary-topology.md | Intent=Toroidal wrapping helper
   */
  #wrap(n) {
    const mod = n % this.size;
    return mod < 0 ? mod + this.size : mod;
  }

  /**
   * PROVENANCE: DeltaID=2026-01-03-07_23_21_YQX1ZLUP | Source=docs/adr/0001-neighborhood.md | Intent=Compute 6-connected neighbor average
   */
  #neighborAverage(idx, plasmaArray) {
    const size = this.size;
    const layer = size * size;
    const z = Math.floor(idx / layer);
    const rem = idx - z * layer;
    const y = Math.floor(rem / size);
    const x = rem - y * size;

    const xm = this.#wrap(x - 1);
    const xp = this.#wrap(x + 1);
    const ym = this.#wrap(y - 1);
    const yp = this.#wrap(y + 1);
    const zm = this.#wrap(z - 1);
    const zp = this.#wrap(z + 1);

    const idxAt = (xi, yi, zi) => (zi * layer) + (yi * size) + xi;

    const total =
      plasmaArray[idxAt(xm, y, z)] +
      plasmaArray[idxAt(xp, y, z)] +
      plasmaArray[idxAt(x, ym, z)] +
      plasmaArray[idxAt(x, yp, z)] +
      plasmaArray[idxAt(x, y, zm)] +
      plasmaArray[idxAt(x, y, zp)];

    return total / 6;
  }

  /**
   * PROVENANCE: DeltaID=2026-01-03-07_23_21_YQX1ZLUP | Source=docs/specs/DREAMING_BASELINE.md | Intent=Advance state by one tick with optional bias coupling
   */
  tick({ biasField } = {}) {
    const plasmaStage = new Float32Array(this.count);
    const parityStage = new Uint8Array(this.count);

    // Perturbation stage: plasma inversion and parity toggles
    for (let i = 0; i < this.count; i += 1) {
      let p = this.state.plasma[i];
      if (this.prng() < this.flipP) {
        p = 1 - p;
      }
      plasmaStage[i] = clamp01(p);

      let parityBit = this.state.parity[i];
      if (this.prng() < this.parityP) {
        parityBit ^= 1;
      }
      parityStage[i] = parityBit;
    }

    const liquidNext = new Float32Array(this.count);
    const solidNext = new Float32Array(this.count);

    // Transition stage: average vs difference-amplifying path selection
    for (let i = 0; i < this.count; i += 1) {
      const p = plasmaStage[i];
      const l = this.state.liquid[i];
      const s = this.state.solid[i];

      const avg = (p + l + s) / 3;
      const neighborAvg = this.#neighborAverage(i, plasmaStage);
      const nb = Math.abs(p - neighborAvg) + parityStage[i] * this.parityGain;

      const bias = biasField ? biasField[i] ?? 0 : 0;
      const pathProb = clamp(this.pathBP + bias, this.pBMin, this.pBMax);
      const mix = this.prng() < pathProb ? nb : avg;

      const liquidVal = clamp01(mix);
      liquidNext[i] = liquidVal;
      solidNext[i] = clamp01(s * (1 - this.alpha) + mix * this.alpha);
    }

    this.state.plasma = plasmaStage;
    this.state.liquid = liquidNext;
    this.state.solid = solidNext;
    this.state.parity = parityStage;
    this.state.step += 1;
  }
}

/**
 * PROVENANCE: DeltaID=2026-01-03-07_23_21_YQX1ZLUP | Source=docs/specs/DREAMING_BASELINE.md | Intent=Factory helper for consumers/tests
 */
export function createPhaseCubeRunner(options = {}) {
  return new PhaseCubeRunner(options);
}
