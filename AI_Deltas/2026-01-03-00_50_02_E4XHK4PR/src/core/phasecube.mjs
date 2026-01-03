/*
DeltaID: 2026-01-03-00_50_02_E4XHK4PR
Purpose: Implement a minimal PhaseCube runner that follows the Dreaming baseline with optional Hearing bias coupling.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/10_Baseline_Conformance.md (copied as mirror)
Notes:
- Preserves baseline update equations, clamps, and boundedness.
- Bias is optional and only modulates Path B probability within safe bounds.
*/

import { createPrng } from './prng.mjs';

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const defaultConfig = {
  gridSize: 18,
  flip_p: 0.02,
  parity_p: 0.02,
  path_b_p: 0.5,
  parity_gain: 0.18,
  alpha: 0.12,
  pB_min: 0.05,
  pB_max: 0.95,
  seed: 1337,
};

const buildCoordinates = (gridSize) => {
  const total = gridSize ** 3;
  const xs = new Uint16Array(total);
  const ys = new Uint16Array(total);
  const zs = new Uint16Array(total);
  const stride = gridSize * gridSize;
  for (let i = 0; i < total; i += 1) {
    const z = Math.floor(i / stride);
    const rem = i - z * stride;
    const y = Math.floor(rem / gridSize);
    const x = rem - y * gridSize;
    xs[i] = x;
    ys[i] = y;
    zs[i] = z;
  }
  return { xs, ys, zs };
};

export const createPhaseCubeRunner = (options = {}) => {
  const cfg = { ...defaultConfig, ...options };
  const { gridSize, seed } = cfg;
  const total = gridSize ** 3;
  const stride = gridSize * gridSize;

  const plasma = new Float32Array(total);
  const liquid = new Float32Array(total);
  const solid = new Float32Array(total);
  const parity = new Uint8Array(total);

  const nextLiquid = new Float32Array(total);
  const nextSolid = new Float32Array(total);

  const prng = createPrng(seed ?? 1);
  const coords = buildCoordinates(gridSize);

  for (let i = 0; i < total; i += 1) {
    plasma[i] = prng();
    liquid[i] = prng();
    solid[i] = prng();
    parity[i] = prng() > 0.5 ? 1 : 0;
  }

  const idx = (x, y, z) => {
    const nx = (x + gridSize) % gridSize;
    const ny = (y + gridSize) % gridSize;
    const nz = (z + gridSize) % gridSize;
    return nx + ny * gridSize + nz * stride;
  };

  const neighborAvg = (index) => {
    const x = coords.xs[index];
    const y = coords.ys[index];
    const z = coords.zs[index];
    const sum =
      plasma[idx(x - 1, y, z)] +
      plasma[idx(x + 1, y, z)] +
      plasma[idx(x, y - 1, z)] +
      plasma[idx(x, y + 1, z)] +
      plasma[idx(x, y, z - 1)] +
      plasma[idx(x, y, z + 1)];
    return sum / 6;
  };

  const metrics = {
    step: 0,
    mean_plasma: 0,
    mean_liquid: 0,
    mean_solid: 0,
    parity_ratio: 0,
  };

  const tick = (biasField = null) => {
    for (let i = 0; i < total; i += 1) {
      if (prng() < cfg.flip_p) {
        plasma[i] = 1 - plasma[i];
      }
      if (prng() < cfg.parity_p) {
        parity[i] = parity[i] ^ 1;
      }
    }

    let sumPlasma = 0;
    let sumLiquid = 0;
    let sumSolid = 0;
    let sumParity = 0;

    for (let i = 0; i < total; i += 1) {
      const p = plasma[i];
      const l = liquid[i];
      const s = solid[i];
      const avg = (p + l + s) / 3;
      const nb = Math.abs(p - neighborAvg(i)) + parity[i] * cfg.parity_gain;

      const bias = biasField && Number.isFinite(biasField[i]) ? biasField[i] : 0;
      const pB = clamp(cfg.path_b_p + bias, cfg.pB_min, cfg.pB_max);
      const usePathB = prng() < pB;
      const mix = usePathB ? nb : avg;
      const nextL = clamp01(mix);
      const nextS = clamp01(s * (1 - cfg.alpha) + nextL * cfg.alpha);

      nextLiquid[i] = nextL;
      nextSolid[i] = nextS;

      sumPlasma += p;
      sumLiquid += nextL;
      sumSolid += nextS;
      sumParity += parity[i];
    }

    liquid.set(nextLiquid);
    solid.set(nextSolid);

    metrics.step += 1;
    metrics.mean_plasma = sumPlasma / total;
    metrics.mean_liquid = sumLiquid / total;
    metrics.mean_solid = sumSolid / total;
    metrics.parity_ratio = sumParity / total;

    return { ...metrics };
  };

  return {
    state: {
      gridSize,
      plasma,
      liquid,
      solid,
      parity,
    },
    tick,
    metrics,
    config: { ...cfg },
  };
};
