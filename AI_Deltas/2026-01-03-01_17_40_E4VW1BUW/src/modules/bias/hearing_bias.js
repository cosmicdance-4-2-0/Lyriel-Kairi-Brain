/*
DeltaID: 2026-01-03-01_17_40_E4VW1BUW
Purpose: Supply a Hearing baseline bias field that decays, injects kernelized audio energy, and modulates Path B probability.
Sources:
- docs/specs/HEARING_BASELINE.md
- docs/CODEX_Rules/50_Audio_Hearing.md
- docs/CODEX_Rules/10_Baseline_Conformance.md
Notes:
- Bias only influences Path B probability; it does not overwrite core state arrays.
- Defaults match baseline clamps for boundedness and non-collapse.
*/

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const defaultConfig = Object.freeze({
  gridSize: 16,
  binCount: 64,
  decay: 0.94,
  strength: 0.18,
  kernelRadius: null,
  biasMin: -0.38,
  biasMax: 0.38,
  pathBMin: 0.05,
  pathBMax: 0.95,
});

const indexFor = (size, x, y, z) => x + y * size + z * size * size;

export class HearingBiasField {
  constructor(config = {}) {
    this.config = { ...defaultConfig, ...config };
    if (!Number.isInteger(this.config.gridSize) || this.config.gridSize < 1) {
      throw new Error('gridSize must be a positive integer');
    }
    if (!Number.isInteger(this.config.binCount) || this.config.binCount < 1) {
      throw new Error('binCount must be a positive integer');
    }
    const { gridSize } = this.config;
    this.n = gridSize ** 3;
    this.bias = new Float32Array(this.n);
    this.kernelRadius = Math.max(1, this.config.kernelRadius ?? Math.floor(gridSize / 6));
  }

  decayStep() {
    const { decay } = this.config;
    for (let i = 0; i < this.n; i += 1) {
      this.bias[i] *= decay;
    }
  }

  binToZ(binIdx) {
    const { binCount, gridSize } = this.config;
    if (binCount === 1) return 0;
    return Math.floor((binIdx / (binCount - 1)) * (gridSize - 1));
  }

  injectBin(binIdx, ampL, ampR) {
    const { gridSize, strength } = this.config;
    const r = this.kernelRadius;
    const zCenter = this.binToZ(binIdx);
    const energy = 0.5 * (ampL + ampR);
    const pan = (ampR - ampL) * (gridSize * 0.16);
    let xCenter = Math.floor((gridSize - 1) / 2 + pan + energy * (gridSize - 1) * 0.3);
    xCenter = clamp(xCenter, 0, gridSize - 1);
    const yCenter = Math.floor((gridSize - 1) / 2);

    const xMin = Math.max(0, xCenter - r);
    const xMax = Math.min(gridSize - 1, xCenter + r);
    const yMin = Math.max(0, yCenter - r);
    const yMax = Math.min(gridSize - 1, yCenter + r);
    const zMin = Math.max(0, zCenter - r);
    const zMax = Math.min(gridSize - 1, zCenter + r);

    for (let x = xMin; x <= xMax; x += 1) {
      for (let y = yMin; y <= yMax; y += 1) {
        for (let z = zMin; z <= zMax; z += 1) {
          const dx = (x - xCenter) / r;
          const dy = (y - yCenter) / r;
          const dz = (z - zCenter) / r;
          const dist2 = dx * dx + dy * dy + dz * dz;
          const kernel = Math.exp(-dist2 * 2.4);
          const delta = energy * strength * kernel;
          const idx = indexFor(gridSize, x, y, z);
          this.bias[idx] += delta;
        }
      }
    }
  }

  ingest({ left = [], right = [] } = {}) {
    this.decayStep();
    const { binCount, biasMin, biasMax } = this.config;
    for (let b = 0; b < binCount; b += 1) {
      const ampL = left[b] ?? 0;
      const ampR = right[b] ?? 0;
      this.injectBin(b, ampL, ampR);
    }
    for (let i = 0; i < this.n; i += 1) {
      this.bias[i] = clamp(this.bias[i], biasMin, biasMax);
    }
  }

  couple(basePathBP) {
    const { pathBMin, pathBMax } = this.config;
    const out = new Float32Array(this.n);
    for (let i = 0; i < this.n; i += 1) {
      out[i] = clamp(basePathBP + this.bias[i], pathBMin, pathBMax);
    }
    return out;
  }

  getField() {
    return this.bias;
  }
}
