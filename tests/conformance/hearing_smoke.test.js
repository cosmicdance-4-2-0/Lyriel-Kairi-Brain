import assert from 'node:assert';
import { test } from 'node:test';

class XorShift32 {
  constructor(seed = 987654321) {
    this.state = seed | 0;
  }

  random() {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x;
    return ((x >>> 0) / 0x100000000);
  }
}

const Config = {
  GRID: 16,
  SCALE: 24,
  FPS: 60,
  POINT_SIZE: 4,
  FLIP_P: 0.015,
  PARITY_P: 0.005,
  BASE_PATH_B_P: 0.73,
  ALPHA: 0.18,
  BIN_COUNT: 64,
  FFT_SIZE: 2048
};

class PhaseGrid {
  constructor(size, rng) {
    this.size = size;
    this.n = size ** 3;
    this.rng = rng;
    this.plasma = new Float32Array(this.n);
    this.liquid = new Float32Array(this.n);
    this.solid = new Float32Array(this.n);
    this.parity = new Int8Array(this.n);
    for (let i = 0; i < this.n; i++) {
      this.plasma[i] = this.rng.random() * 0.8 + 0.1;
      this.liquid[i] = this.rng.random() * 0.5;
      this.solid[i] = this.rng.random() * 0.3;
      this.parity[i] = this.rng.random() < 0.5 ? 1 : 0;
    }
  }

  idx(x, y, z) {
    return x + y * this.size + z * this.size * this.size;
  }

  neighborAvg(i) {
    const s = this.size;
    const x = i % s;
    const y = Math.floor(i / s) % s;
    const z = Math.floor(i / (s * s));
    const get = (a, b, c) => this.plasma[this.idx((a + s) % s, (b + s) % s, (c + s) % s)];
    return (
      get(x + 1, y, z) +
      get(x - 1, y, z) +
      get(x, y + 1, z) +
      get(x, y - 1, z) +
      get(x, y, z + 1) +
      get(x, y, z - 1)
    ) / 6;
  }

  perturb(bias = null) {
    for (let i = 0; i < this.n; i++) {
      if (this.rng.random() < Config.FLIP_P) this.plasma[i] = 1 - this.plasma[i];
      if (this.rng.random() < Config.PARITY_P) this.parity[i] ^= 1;
      if (bias) {
        const b = bias[i];
        this.plasma[i] = clamp01(this.plasma[i] + b * 0.008);
        const jitter = Math.abs(b) > 0.05 ? 0.003 * (1 + Math.abs(b)) : 0.001;
        this.liquid[i] += (this.parity[i] ? jitter : -jitter) * (this.rng.random() * 0.3 + 0.2);
        this.liquid[i] = clamp01(this.liquid[i]);
      }
    }
  }

  step(bias = null) {
    const p0 = this.plasma.slice();
    const l0 = this.liquid.slice();
    const s0 = this.solid.slice();
    for (let i = 0; i < this.n; i++) {
      const p = p0[i];
      const l = l0[i];
      const s = s0[i];
      const avg = (p + l + s) / 3;
      const nb = Math.abs(p - this.neighborAvg(i)) + this.parity[i] * 0.08;
      let probB = Config.BASE_PATH_B_P + (bias ? bias[i] * 0.08 : 0);
      probB = clamp(probB, 0.55, 0.92);
      const choice = this.rng.random() < probB ? nb : avg;
      this.liquid[i] = clamp01(choice);
      this.solid[i] = s * (1 - Config.ALPHA) + choice * Config.ALPHA;
    }
  }
}

class InputLayer {
  constructor(size, bins) {
    this.size = size;
    this.n = size ** 3;
    this.bins = bins;
    this.bias = new Float32Array(this.n);
    this.decay = 0.94;
    this.strength = 0.08;
    this.radius = Math.floor(size / 6);
  }

  ingest(left, right) {
    for (let i = 0; i < this.n; i++) this.bias[i] *= this.decay;
    for (let b = 0; b < this.bins; b++) {
      const aL = left[b] || 0;
      const aR = right[b] || 0;
      const energy = (aL + aR) * 0.5;
      const pan = (aR - aL) * (this.size * 0.16);
      const z = Math.floor((b / (this.bins - 1)) * (this.size - 1));
      let x = Math.floor(energy * (this.size - 1) + pan);
      x = clamp(x, 0, this.size - 1);
      const y = Math.floor((this.size - 1) / 2);
      const r = this.radius;
      const str = this.strength;
      for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dz = -r; dz <= r; dz++) {
            const d2 = (dx * dx + dy * dy + dz * dz) / (r * r);
            if (d2 > 1) continue;
            const kernel = Math.exp(-d2 * 2.4);
            const idx = (x + dx) + (y + dy) * this.size + (z + dz) * this.size * this.size;
            if (idx >= 0 && idx < this.n) this.bias[idx] += energy * str * kernel;
          }
        }
      }
    }
    for (let i = 0; i < this.n; i++) this.bias[i] = clamp(this.bias[i], -0.2, 0.2);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function syntheticFeatures(rng, bins, energyScale = 1) {
  const left = new Array(bins);
  const right = new Array(bins);
  for (let i = 0; i < bins; i++) {
    left[i] = clamp01(rng.random() * energyScale);
    right[i] = clamp01(rng.random() * energyScale);
  }
  return { left, right };
}

function assertFinite(values) {
  for (const v of values) {
    assert.ok(Number.isFinite(v), `value ${v} must be finite`);
  }
}

function assertRange(values, min, max) {
  for (const v of values) {
    assert.ok(v >= min - 1e-6 && v <= max + 1e-6, `value ${v} outside [${min}, ${max}]`);
  }
}

test('bias field clamps and remains finite under repeated injections', () => {
  const rng = new XorShift32(0xfeedface);
  const input = new InputLayer(Config.GRID, Config.BIN_COUNT);
  for (let step = 0; step < 12; step++) {
    const { left, right } = syntheticFeatures(rng, Config.BIN_COUNT, 1.2);
    input.ingest(left, right);
  }
  assertFinite(input.bias);
  assertRange(input.bias, -0.2, 0.2);
});

test('hearing baseline dynamics stay bounded with bias influence', () => {
  const rng = new XorShift32(0xdecafbad);
  const grid = new PhaseGrid(Config.GRID, rng);
  const input = new InputLayer(Config.GRID, Config.BIN_COUNT);

  for (let step = 0; step < 80; step++) {
    const { left, right } = syntheticFeatures(rng, Config.BIN_COUNT, 0.9);
    input.ingest(left, right);
    grid.perturb(input.bias);
    grid.step(input.bias);
  }

  assertFinite(grid.plasma);
  assertFinite(grid.liquid);
  assertFinite(grid.solid);
  assertRange(grid.plasma, 0, 1);
  assertRange(grid.liquid, 0, 1);
  assertRange(grid.solid, 0, 1.2); // solid is blended but baseline never pushes it far beyond 1

  const meanLiquid = grid.liquid.reduce((sum, v) => sum + v, 0) / grid.liquid.length;
  assert.ok(meanLiquid > 0.05 && meanLiquid < 0.95, `mean liquid ${meanLiquid} drifted out of band`);
});
