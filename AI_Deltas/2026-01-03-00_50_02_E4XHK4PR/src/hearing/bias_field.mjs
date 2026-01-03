/*
DeltaID: 2026-01-03-00_50_02_E4XHK4PR
Purpose: Implement the Hearing baseline bias field with decay, bounded injections, and Path B coupling.
Sources:
- docs/specs/HEARING_BASELINE.md (copied as mirror)
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/50_Audio_Hearing.md (copied as mirror)
Notes:
- Maps frequency→Z, pan→X, amplitude→strength as defined in the baseline.
- Bias only modulates Path B probability and remains clamped.
*/

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const expFalloff = (dist2) => Math.exp(-dist2 * 2.4);

export const defaultHearingConfig = {
  gridSize: 18,
  binCount: 16,
  decay: 0.94,
  strength: 0.18,
  kernelRadius: null, // defaults to gridSize / 6 when null
  biasMin: -0.38,
  biasMax: 0.38,
  pB_min: 0.05,
  pB_max: 0.95,
};

export const createHearingBias = (options = {}) => {
  const cfg = { ...defaultHearingConfig, ...options };
  const radius = cfg.kernelRadius ?? Math.max(1, Math.floor(cfg.gridSize / 6));
  const total = cfg.gridSize ** 3;
  const stride = cfg.gridSize * cfg.gridSize;
  const bias = new Float32Array(total);

  const idx = (x, y, z) => x + y * cfg.gridSize + z * stride;
  const clampIndex = (value) => clamp(Math.floor(value), 0, cfg.gridSize - 1);

  const injectKernel = (xCenter, yCenter, zCenter, energy) => {
    const base = energy * cfg.strength;
    const r2 = radius * radius;
    for (let dz = -radius; dz <= radius; dz += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const x = clampIndex(xCenter + dx);
          const y = clampIndex(yCenter + dy);
          const z = clampIndex(zCenter + dz);
          const norm = (dx * dx + dy * dy + dz * dz) / r2;
          if (norm > 1) continue;
          const weight = expFalloff(norm);
          const i = idx(x, y, z);
          bias[i] = clamp(bias[i] + base * weight, cfg.biasMin, cfg.biasMax);
        }
      }
    }
  };

  const decayBias = () => {
    for (let i = 0; i < bias.length; i += 1) {
      bias[i] *= cfg.decay;
    }
  };

  const ingest = ({ left = [], right = [] } = {}) => {
    decayBias();
    const bins = Math.min(left.length, right.length, cfg.binCount);
    const denom = Math.max(1, bins - 1);
    const mid = (cfg.gridSize - 1) / 2;
    for (let b = 0; b < bins; b += 1) {
      const l = clamp(left[b] ?? 0, 0, 1);
      const r = clamp(right[b] ?? 0, 0, 1);
      const energy = 0.5 * (l + r);
      if (energy <= 0) continue;
      const zCenter = Math.floor((b / denom) * (cfg.gridSize - 1));
      const pan = (r - l) * (cfg.gridSize * 0.16);
      const xCenter = clampIndex(mid + pan + energy * (cfg.gridSize - 1) * 0.3);
      const yCenter = clampIndex(mid);
      injectKernel(xCenter, yCenter, zCenter, energy);
    }
  };

  const getField = () => bias;

  const tick = () => {
    decayBias();
    return bias;
  };

  const couple = (basePathB) => {
    const result = new Float32Array(total);
    for (let i = 0; i < bias.length; i += 1) {
      result[i] = clamp(basePathB + bias[i], cfg.pB_min, cfg.pB_max);
    }
    return result;
  };

  return {
    ingest,
    tick,
    getField,
    couple,
    config: { ...cfg, kernelRadius: radius },
  };
};
