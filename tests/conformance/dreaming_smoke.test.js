import assert from 'node:assert';
import { test } from 'node:test';

class XorShift32 {
  constructor(seed = 123456789) {
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

class PhaseGrid {
  constructor(size, rng) {
    this.size = size;
    this.n = size * size * size;
    this.rng = rng;
    this.plasma = new Float32Array(this.n);
    this.liquid = new Float32Array(this.n);
    this.solid = new Float32Array(this.n);
    this.parity = new Int8Array(this.n);

    for (let i = 0; i < this.n; i++) {
      this.plasma[i] = this.rng.random() * 0.5;
      this.liquid[i] = this.rng.random() * 0.5;
      this.solid[i] = this.rng.random() * 0.5;
      this.parity[i] = 0;
    }
  }

  idx(x, y, z) {
    const s = this.size;
    return x + y * s + z * s * s;
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

  perturb() {
    for (let i = 0; i < this.n; i++) {
      if (this.rng.random() < 0.02) this.plasma[i] = 1 - this.plasma[i];
      if (this.rng.random() < 0.01) this.parity[i] ^= 1;
    }
  }

  step() {
    const p0 = new Float32Array(this.plasma);
    const l0 = new Float32Array(this.liquid);
    const s0 = new Float32Array(this.solid);

    for (let i = 0; i < this.n; i++) {
      const p = p0[i];
      const l = l0[i];
      const s = s0[i];
      const avg = (p + l + s) / 3;
      const nb = Math.abs(p - this.neighborAvg(i)) + this.parity[i] * 0.13;
      const mix = this.rng.random() < 0.65 ? nb : avg;
      this.liquid[i] = mix;
      this.solid[i] = (s * (1 - 0.18) + mix * 0.18) % 1;
    }
  }
}

function assertFiniteInRange(values, min = 0, max = 1) {
  for (const v of values) {
    assert.ok(Number.isFinite(v), `value ${v} must be finite`);
    assert.ok(v >= min - 1e-6 && v <= max + 1e-6, `value ${v} outside [${min}, ${max}]`);
  }
}

test('dreaming baseline invariants hold under stepped evolution', () => {
  const rng = new XorShift32(0x1a2b3c4d);
  const grid = new PhaseGrid(16, rng);

  for (let step = 0; step < 200; step++) {
    grid.perturb();
    grid.step();
  }

  assertFiniteInRange(grid.plasma);
  assertFiniteInRange(grid.liquid);
  assertFiniteInRange(grid.solid);

  const meanLiquid = grid.liquid.reduce((sum, v) => sum + v, 0) / grid.liquid.length;
  assert.ok(meanLiquid > 0.05 && meanLiquid < 0.85, `mean liquid ${meanLiquid} drifted out of band`);
});

test('dreaming grid topology and length stay consistent', () => {
  const rng = new XorShift32(1234);
  const size = 12;
  const grid = new PhaseGrid(size, rng);

  assert.strictEqual(grid.plasma.length, size ** 3);
  assert.strictEqual(grid.liquid.length, size ** 3);
  assert.strictEqual(grid.solid.length, size ** 3);

  grid.perturb();
  grid.step();

  assertFiniteInRange(grid.plasma);
});
