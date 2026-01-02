import assert from "node:assert/strict";

import {
  BASE_DEFAULTS,
  computeMetrics,
  createRng,
  createState,
  makeWitnessSampler,
  tick,
} from "../src/core/phasecube/index.js";

const expectTypedArraysEqual = (a, b, epsilon = 1e-9) => {
  assert.strictEqual(a.length, b.length, "length mismatch");
  for (let i = 0; i < a.length; i += 1) {
    assert.ok(Math.abs(a[i] - b[i]) <= epsilon, `value mismatch at ${i}`);
  }
};

const expectParityValid = (arr) => {
  for (let i = 0; i < arr.length; i += 1) {
    const value = arr[i];
    assert.ok(value === 0 || value === 1, `parity out of bounds at ${i}`);
  }
};

const expectChannelBounded = (arr) => {
  for (let i = 0; i < arr.length; i += 1) {
    const value = arr[i];
    assert.ok(value >= 0 && value <= 1, `channel out of bounds at ${i}`);
  }
};

const expectStateBounded = (state) => {
  expectChannelBounded(state.plasma);
  expectChannelBounded(state.liquid);
  expectChannelBounded(state.solid);
  expectParityValid(state.parity);
};

const params = { ...BASE_DEFAULTS, grid_size: 8 };

(() => {
  const seed = "determinism";
  const stateA = createState(params, seed);
  const stateB = createState(params, seed);

  expectTypedArraysEqual(stateA.plasma, stateB.plasma);
  expectTypedArraysEqual(stateA.liquid, stateB.liquid);
  expectTypedArraysEqual(stateA.solid, stateB.solid);
  expectTypedArraysEqual(stateA.parity, stateB.parity);
})();

(() => {
  const seed = "tick-determinism";
  const rngA = createRng(seed);
  const rngB = createRng(seed);
  const stateA = createState(params, 123);
  const stateB = createState(params, 123);

  const nextA = tick(stateA, params, rngA).state;
  const nextB = tick(stateB, params, rngB).state;

  expectTypedArraysEqual(nextA.plasma, nextB.plasma);
  expectTypedArraysEqual(nextA.liquid, nextB.liquid);
  expectTypedArraysEqual(nextA.solid, nextB.solid);
  expectTypedArraysEqual(nextA.parity, nextB.parity);
})();

(() => {
  const rng = createRng("boundedness");
  let state = createState(params, "boundedness-init");
  for (let i = 0; i < 3; i += 1) {
    state = tick(state, params, rng).state;
  }
  expectStateBounded(state);
})();

(() => {
  const state = createState(params, "witness");
  const sampler = makeWitnessSampler(5, "witness");
  const witness1 = sampler(state);
  const witness2 = sampler(state);

  assert.deepStrictEqual(
    witness1.map((w) => w.index),
    witness2.map((w) => w.index),
    "witness indices should remain stable per sampler",
  );

  const evolved = tick(state, params, createRng("witness-tick")).state;
  const witness3 = sampler(evolved);
  assert.deepStrictEqual(
    witness1.map((w) => w.index),
    witness3.map((w) => w.index),
    "witness indices should remain stable across ticks",
  );
})();

(() => {
  const rng = createRng("metrics");
  const state = tick(createState(params, "metrics"), params, rng).state;
  const metrics = computeMetrics(state);

  assert.ok(metrics.parity_ratio >= 0 && metrics.parity_ratio <= 1, "parity ratio out of bounds");
  assert.ok(metrics.var_liquid >= 0, "liquid variance must be non-negative");
})();

console.log("phasecube tests passed");
