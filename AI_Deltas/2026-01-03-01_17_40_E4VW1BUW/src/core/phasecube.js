/*
DeltaID: 2026-01-03-01_17_40_E4VW1BUW
Purpose: Provide a baseline-conformant PhaseCube core implementation with seeded RNG and bounded updates.
Sources:
- docs/specs/DREAMING_BASELINE.md
- docs/CODEX_Rules/10_Baseline_Conformance.md
- docs/CODEX_Rules/30_Code_Style.md
Notes:
- Implements perturbation and transition stages without altering baseline equations or default bounds.
- Keeps DOM-free core suitable for Node or browser harness wiring.
*/

const clamp01 = (v) => Math.min(1, Math.max(0, v));

const defaultRng = Math.random;

export const DEFAULT_PARAMS = Object.freeze({
  gridSize: 16,
  flipP: 0.02,
  parityP: 0.01,
  pathBP: 0.65,
  parityGain: 0.13,
  alpha: 0.18,
});

export function createMulberry32(seed = 1) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let m = Math.imul(t ^ (t >>> 15), 1 | t);
    m ^= m + Math.imul(m ^ (m >>> 7), 61 | m);
    return ((m ^ (m >>> 14)) >>> 0) / 4294967296;
  };
}

const indexFor = (size, x, y, z) => x + y * size + z * size * size;

const wrap = (size, v) => {
  let n = v % size;
  if (n < 0) n += size;
  return n;
};

export class PhaseCube {
  constructor(params = {}) {
    this.params = { ...DEFAULT_PARAMS, ...params };
    const { gridSize } = this.params;
    this.n = gridSize ** 3;
    this.plasma = new Float32Array(this.n);
    this.liquid = new Float32Array(this.n);
    this.solid = new Float32Array(this.n);
    this.parity = new Uint8Array(this.n);
    const rng = this.params.rng || defaultRng;
    for (let i = 0; i < this.n; i += 1) {
      this.plasma[i] = rng();
      this.liquid[i] = rng();
      this.solid[i] = rng();
      this.parity[i] = rng() < 0.5 ? 0 : 1;
    }
    this.t = 0;
    this._rng = rng;
  }

  neighborAvg(index) {
    const { gridSize } = this.params;
    const x = index % gridSize;
    const y = Math.floor(index / gridSize) % gridSize;
    const z = Math.floor(index / (gridSize * gridSize));
    const sample = (dx, dy, dz) => this.plasma[indexFor(gridSize, wrap(gridSize, x + dx), wrap(gridSize, y + dy), wrap(gridSize, z + dz))];
    const sum =
      sample(1, 0, 0) +
      sample(-1, 0, 0) +
      sample(0, 1, 0) +
      sample(0, -1, 0) +
      sample(0, 0, 1) +
      sample(0, 0, -1);
    return sum / 6;
  }

  perturb() {
    const { flipP, parityP } = this.params;
    const rand = this._rng;
    for (let i = 0; i < this.n; i += 1) {
      if (rand() < flipP) {
        this.plasma[i] = 1 - this.plasma[i];
      }
      if (rand() < parityP) {
        this.parity[i] ^= 1;
      }
    }
  }

  tick() {
    const { pathBP, parityGain, alpha } = this.params;
    this.perturb();
    const nextLiquid = new Float32Array(this.n);
    const nextSolid = new Float32Array(this.n);
    const rand = this._rng;
    for (let i = 0; i < this.n; i += 1) {
      const p = this.plasma[i];
      const l = this.liquid[i];
      const s = this.solid[i];
      const avg = (p + l + s) / 3;
      const nb = Math.abs(p - this.neighborAvg(i)) + this.parity[i] * parityGain;
      const mix = rand() < pathBP ? nb : avg;
      nextLiquid[i] = clamp01(mix);
      nextSolid[i] = clamp01(s * (1 - alpha) + mix * alpha);
    }
    this.liquid = nextLiquid;
    this.solid = nextSolid;
    this.t += 1;
    return {
      t: this.t,
      mean_plasma: meanOf(this.plasma),
      mean_liquid: meanOf(this.liquid),
      mean_solid: meanOf(this.solid),
      parity_ratio: meanOf(this.parity),
    };
  }

  getState() {
    return {
      gridSize: this.params.gridSize,
      plasma: this.plasma,
      liquid: this.liquid,
      solid: this.solid,
      parity: this.parity,
      t: this.t,
    };
  }
}

const meanOf = (arr) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i += 1) {
    sum += arr[i];
  }
  return arr.length ? sum / arr.length : 0;
};

export function createPhaseCubeRunner(options = {}) {
  const rng = options.seed != null ? createMulberry32(options.seed) : defaultRng;
  const cube = new PhaseCube({ ...options, rng });
  return {
    tick: () => cube.tick(),
    get state() {
      return cube.getState();
    },
    get cube() {
      return cube;
    },
  };
}
