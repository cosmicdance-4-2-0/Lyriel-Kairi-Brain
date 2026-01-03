/*
DeltaID: 2026-01-03-01_17_36_YE9AZ79B
Purpose: Baseline PhaseCube core runner with deterministic seeding, clamps, and Path B bias modulation hooks.
Sources:
- docs/specs/DREAMING_BASELINE.md
- docs/adr/0001-neighborhood.md
- docs/adr/0003-clamp-policy.md
- docs/adr/0004-prng-and-determinism.md
Notes:
- Implements the baseline perturbation + transition cycle with clamp01 semantics (no modulo wrapping).
- Bias is optional and only modulates Path B probability within safe clamps; other state updates follow the baseline equations.
*/

const DEFAULT_CONFIG = {
  gridSize: 16,
  flipP: 0.02,
  parityP: 0.01,
  pathBP: 0.65,
  parityGain: 0.13,
  alpha: 0.18,
  pBMin: 0.05,
  pBMax: 0.95,
  seed: null,
  randomizeParity: true
};

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

const createPrng = (seedInput) => {
  const seed = (seedInput ?? Date.now()) >>> 0;
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const idx = (x, y, z, size) => x + y * size + z * size * size;

const wrap = (v, size) => {
  const m = v % size;
  return m < 0 ? m + size : m;
};

class PhaseCube {
  constructor(config, rng) {
    this.config = config;
    this.rng = rng;
    this.n = config.gridSize ** 3;
    this.state = {
      gridSize: config.gridSize,
      plasma: new Float32Array(this.n),
      liquid: new Float32Array(this.n),
      solid: new Float32Array(this.n),
      parity: new Int8Array(this.n)
    };
    for (let i = 0; i < this.n; i += 1) {
      this.state.plasma[i] = this.rng();
      this.state.liquid[i] = this.rng();
      this.state.solid[i] = this.rng();
      if (config.randomizeParity) {
        this.state.parity[i] = this.rng() < 0.5 ? 0 : 1;
      }
    }
  }

  neighborAvg(i) {
    const { gridSize } = this.config;
    const x = i % gridSize;
    const y = Math.floor(i / gridSize) % gridSize;
    const z = Math.floor(i / (gridSize * gridSize));
    const sample = (dx, dy, dz) => {
      const nx = wrap(x + dx, gridSize);
      const ny = wrap(y + dy, gridSize);
      const nz = wrap(z + dz, gridSize);
      return this.state.plasma[idx(nx, ny, nz, gridSize)];
    };
    return (
      sample(1, 0, 0) +
      sample(-1, 0, 0) +
      sample(0, 1, 0) +
      sample(0, -1, 0) +
      sample(0, 0, 1) +
      sample(0, 0, -1)
    ) / 6;
  }

  perturb() {
    const { flipP, parityP } = this.config;
    for (let i = 0; i < this.n; i += 1) {
      if (this.rng() < flipP) {
        this.state.plasma[i] = 1 - this.state.plasma[i];
      }
      if (this.rng() < parityP) {
        this.state.parity[i] ^= 1;
      }
    }
  }

  transition(biasField) {
    const { parityGain, alpha, pathBP, pBMin, pBMax } = this.config;
    const plasma = this.state.plasma;
    const liquid = this.state.liquid;
    const solid = this.state.solid;
    const parity = this.state.parity;

    const nextLiquid = new Float32Array(this.n);
    const nextSolid = new Float32Array(this.n);

    for (let i = 0; i < this.n; i += 1) {
      const p = plasma[i];
      const l = liquid[i];
      const s = solid[i];
      const avg = (p + l + s) / 3;
      const nb = Math.abs(p - this.neighborAvg(i)) + parity[i] * parityGain;

      const bias = biasField && biasField.length === this.n ? biasField[i] : 0;
      const pB = clamp(pathBP + bias, pBMin, pBMax);
      const mix = this.rng() < pB ? nb : avg;

      nextLiquid[i] = clamp01(mix);
      nextSolid[i] = clamp01(s * (1 - alpha) + mix * alpha);
    }

    this.state.liquid = nextLiquid;
    this.state.solid = nextSolid;
  }

  tick(biasField = null) {
    this.perturb();
    this.transition(biasField);
    return {
      t: undefined,
      mean_plasma: this.mean(this.state.plasma),
      mean_liquid: this.mean(this.state.liquid),
      mean_solid: this.mean(this.state.solid),
      parity_ratio: this.mean(this.state.parity)
    };
  }

  mean(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i += 1) {
      sum += arr[i];
    }
    return sum / arr.length;
  }
}

export const createPhaseCubeRunner = (options = {}) => {
  const config = { ...DEFAULT_CONFIG, ...options };
  const rng = createPrng(config.seed);
  const cube = new PhaseCube(config, rng);
  return {
    state: cube.state,
    tick: (biasField) => cube.tick(biasField)
  };
};
