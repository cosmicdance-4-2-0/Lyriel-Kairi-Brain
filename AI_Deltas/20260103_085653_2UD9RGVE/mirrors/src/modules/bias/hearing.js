/*
DeltaID: 20260103_085653_2UD9RGVE
Purpose: Mirror of the Hearing bias module for deployment via the delta package.
Sources:
- src/modules/bias/hearing.js
Notes:
- Functionality unchanged; header comment adds provenance.
*/

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * PROVENANCE: DeltaID=2026-01-03-07_23_21_YQX1ZLUP | Source=docs/specs/HEARING_BASELINE.md | Intent=Maintain decaying bias field and apply feature injections
 */
export class HearingBiasField {
  constructor(options = {}) {
    const {
      gridSize = 16,
      binCount = 8,
      decay = 0.94,
      strength = 0.18,
      kernelRadius = Math.max(1, Math.floor(gridSize / 6)),
      biasMin = -0.38,
      biasMax = 0.38,
      pBMin = 0.05,
      pBMax = 0.95,
    } = options;

    this.size = gridSize;
    this.count = gridSize ** 3;
    this.binCount = binCount;
    this.decay = decay;
    this.strength = strength;
    this.kernelRadius = kernelRadius;
    this.biasMin = biasMin;
    this.biasMax = biasMax;
    this.pBMin = pBMin;
    this.pBMax = pBMax;

    this.field = new Float32Array(this.count);
  }

  #wrap(n) {
    const mod = n % this.size;
    return mod < 0 ? mod + this.size : mod;
  }

  #index(x, y, z) {
    const layer = this.size * this.size;
    return (z * layer) + (y * this.size) + x;
  }

  #decayField() {
    for (let i = 0; i < this.count; i += 1) {
      this.field[i] *= this.decay;
      this.field[i] = clamp(this.field[i], this.biasMin, this.biasMax);
    }
  }

  #injectBin(binIndex, left, right) {
    const size = this.size;
    const radius = this.kernelRadius;
    const zCenter = Math.floor(((this.binCount > 1 ? binIndex / (this.binCount - 1) : 0) * (size - 1)));
    const energy = clamp((left + right) * 0.5, 0, 1);
    const pan = (right - left) * (size * 0.16);
    const xBase = ((size - 1) / 2) + pan + energy * (size - 1) * 0.3;
    const xCenter = clamp(Math.floor(xBase), 0, size - 1);
    const yCenter = Math.floor((size - 1) / 2);

    const strength = energy * this.strength;
    if (strength === 0) return;

    const radiusSq = radius * radius;
    for (let dz = -radius; dz <= radius; dz += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const dist2 = (dx * dx + dy * dy + dz * dz) / radiusSq;
          const kernel = Math.exp(-dist2 * 2.4);
          if (kernel < 1e-5) continue;
          const x = this.#wrap(xCenter + dx);
          const y = this.#wrap(yCenter + dy);
          const z = this.#wrap(zCenter + dz);
          const idx = this.#index(x, y, z);
          this.field[idx] = clamp(this.field[idx] + strength * kernel, this.biasMin, this.biasMax);
        }
      }
    }
  }

  /**
   * PROVENANCE: DeltaID=2026-01-03-07_23_21_YQX1ZLUP | Source=docs/specs/HEARING_BASELINE.md | Intent=Process a feature vector injection
   */
  ingest(features) {
    const { left = [], right = [] } = features ?? {};
    this.#decayField();
    const bins = Math.max(this.binCount, left.length, right.length);
    for (let b = 0; b < bins; b += 1) {
      const l = left[b] ?? 0;
      const r = right[b] ?? 0;
      this.#injectBin(b, l, r);
    }
  }

  /**
   * PROVENANCE: DeltaID=2026-01-03-07_23_21_YQX1ZLUP | Source=docs/CODEX_Rules/50_Audio_Hearing.md | Intent=Decay-only tick for idle frames
   */
  tick() {
    this.#decayField();
  }

  getField() {
    return this.field;
  }

  /**
   * PROVENANCE: DeltaID=2026-01-03-07_23_21_YQX1ZLUP | Source=docs/adr/0003-clamp-policy.md | Intent=Clamp Path B modulation using bias field
   */
  couple(basePathB = 0.5) {
    const result = new Float32Array(this.count);
    for (let i = 0; i < this.count; i += 1) {
      result[i] = clamp(basePathB + this.field[i], this.pBMin, this.pBMax);
    }
    return result;
  }
}

export function createHearingBias(options = {}) {
  return new HearingBiasField(options);
}
