// PhaseCube core: deterministic 3D lattice with bounded channels and toroidal wrapping.
// Invariants: plasma/liquid/solid ∈ [0,1], parity ∈ {0,1}; no NaN/Infinity; neighbor sampling wraps.

const UINT32_SCALE = 1 / 0x100000000;

const DEFAULT_SEED = 0x9e3779b9; // Knuth constant seed for reproducibility.

export const BASE_DEFAULTS = Object.freeze({
  grid_size: 16,
  flip_p: 0.02,
  parity_p: 0.02,
  path_b_p: 0.5,
  parity_gain: 0.1,
  alpha: 0.25,
});

// Deterministic PRNG (mulberry32 variant) for reproducible evolution.
export function createRng(seed = DEFAULT_SEED) {
  let state = hashSeed(seed) >>> 0;

  const next = () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  };

  return {
    next,
    float: () => next() * UINT32_SCALE,
  };
}

// Convert numeric or string seeds into a bounded 32-bit state.
function hashSeed(seed) {
  if (typeof seed === "number" && Number.isFinite(seed)) {
    return seed >>> 0;
  }

  if (typeof seed === "string") {
    let h = 0x811c9dc5;
    for (let i = 0; i < seed.length; i += 1) {
      // FNV-1a mixing keeps hash in 32-bit range.
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  return DEFAULT_SEED;
}

const clamp01 = (value) => {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
};

const clampProbability = (value) => clamp01(value);

const resolveParams = (params = {}) => {
  const merged = { ...BASE_DEFAULTS, ...params };
  merged.grid_size = Math.max(2, Math.floor(merged.grid_size || BASE_DEFAULTS.grid_size));
  merged.flip_p = clampProbability(merged.flip_p);
  merged.parity_p = clampProbability(merged.parity_p);
  merged.path_b_p = clampProbability(merged.path_b_p);
  merged.parity_gain = Math.max(0, merged.parity_gain);
  merged.alpha = clampProbability(merged.alpha);
  return merged;
};

export function createState(params = {}, seed) {
  const rng = createRng(seed);
  const resolved = resolveParams(params);
  const { grid_size: n } = resolved;
  const total = n * n * n;

  const plasma = new Float32Array(total);
  const liquid = new Float32Array(total);
  const solid = new Float32Array(total);
  const parity = new Uint8Array(total);

  for (let i = 0; i < total; i += 1) {
    plasma[i] = rng.float();
    liquid[i] = rng.float();
    solid[i] = rng.float();
    parity[i] = rng.float() < 0.5 ? 0 : 1;
  }

  return {
    gridSize: n,
    plasma,
    liquid,
    solid,
    parity,
    step: 0,
  };
}

export function tick(previousState, params = {}, rng = createRng()) {
  const resolved = resolveParams(params);
  const { grid_size: n, flip_p, parity_p, path_b_p, parity_gain, alpha } = resolved;

  if (previousState.gridSize !== n) {
    throw new Error(`Grid size mismatch: state has ${previousState.gridSize}, params requested ${n}`);
  }

  const total = n * n * n;

  const plasmaStage = new Float32Array(total);
  const parityStage = new Uint8Array(total);
  const liquidNext = new Float32Array(total);
  const solidNext = new Float32Array(total);

  // Perturbation stage: bounded parity/plasma flips only.
  for (let i = 0; i < total; i += 1) {
    const flip = rng.float() < flip_p;
    const parityFlip = rng.float() < parity_p;
    const plasmaVal = previousState.plasma[i];
    const nextPlasma = flip ? 1 - plasmaVal : plasmaVal;
    plasmaStage[i] = clamp01(nextPlasma);
    const currentParity = previousState.parity[i] & 1;
    parityStage[i] = parityFlip ? (currentParity ^ 1) : currentParity;
  }

  const neighborAvg = createNeighborAverages(plasmaStage, n);

  // Transition stage: deterministic blending with clamped outputs.
  for (let i = 0; i < total; i += 1) {
    const p = plasmaStage[i];
    const l = previousState.liquid[i];
    const s = previousState.solid[i];

    const avg = (p + l + s) / 3;
    const nb = Math.abs(p - neighborAvg[i]) + parityStage[i] * parity_gain;
    const choosePathB = rng.float() < path_b_p;
    const mix = choosePathB ? nb : avg;

    const boundedMix = clamp01(mix); // Clamp protects boundedness invariant.
    liquidNext[i] = boundedMix;

    const blended = s * (1 - alpha) + boundedMix * alpha;
    solidNext[i] = clamp01(blended);
  }

  const nextState = {
    gridSize: n,
    plasma: plasmaStage,
    liquid: liquidNext,
    solid: solidNext,
    parity: parityStage,
    step: (previousState.step || 0) + 1,
  };

  return {
    state: nextState,
    metrics: computeMetrics(nextState),
  };
}

function createNeighborAverages(plasma, n) {
  const total = n * n * n;
  const averages = new Float32Array(total);

  const index = (x, y, z) => ((z * n + y) * n + x);
  for (let z = 0; z < n; z += 1) {
    const zp = (z + 1) % n;
    const zm = (z - 1 + n) % n;
    for (let y = 0; y < n; y += 1) {
      const yp = (y + 1) % n;
      const ym = (y - 1 + n) % n;
      for (let x = 0; x < n; x += 1) {
        const xp = (x + 1) % n;
        const xm = (x - 1 + n) % n;
        const idx = index(x, y, z);

        // Toroidal neighbors: 6-connected with wrap.
        const sum =
          plasma[index(xp, y, z)] +
          plasma[index(xm, y, z)] +
          plasma[index(x, yp, z)] +
          plasma[index(x, ym, z)] +
          plasma[index(x, y, zp)] +
          plasma[index(x, y, zm)];

        averages[idx] = sum / 6;
      }
    }
  }

  return averages;
}

export function computeMetrics(state) {
  const total = state.gridSize * state.gridSize * state.gridSize;
  let meanPlasma = 0;
  let meanLiquid = 0;
  let meanSolid = 0;
  let parityCount = 0;

  for (let i = 0; i < total; i += 1) {
    meanPlasma += state.plasma[i];
    meanLiquid += state.liquid[i];
    meanSolid += state.solid[i];
    parityCount += state.parity[i] & 1;
  }

  meanPlasma /= total;
  meanLiquid /= total;
  meanSolid /= total;

  let varLiquid = 0;
  for (let i = 0; i < total; i += 1) {
    const diff = state.liquid[i] - meanLiquid;
    varLiquid += diff * diff;
  }
  varLiquid /= total;

  return {
    t: state.step || 0,
    mean_plasma: meanPlasma,
    mean_liquid: meanLiquid,
    mean_solid: meanSolid,
    var_liquid: varLiquid,
    parity_ratio: parityCount / total,
  };
}

export function makeWitnessSampler(count = 8, seed = 4242) {
  const rng = createRng(seed);

  const pickIndices = (gridSize) => {
    const total = gridSize * gridSize * gridSize;
    const target = Math.min(count, total);
    const indices = new Set();
    while (indices.size < target) {
      indices.add(Math.floor(rng.float() * total));
    }
    return Array.from(indices);
  };

  let cachedSize = null;
  let cached = null;

  return (state) => {
    if (state.gridSize !== cachedSize || cached === null) {
      cached = pickIndices(state.gridSize);
      cachedSize = state.gridSize;
    }

    return cached.map((index) => ({
      index,
      plasma: state.plasma[index],
      liquid: state.liquid[index],
      solid: state.solid[index],
      parity: state.parity[index],
    }));
  };
}
