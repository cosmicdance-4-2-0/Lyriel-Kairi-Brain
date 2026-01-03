/*
DeltaID: 2026-01-03-00_50_02_E4XHK4PR
Purpose: Exercise baseline conformance checks for the Dreaming (PhaseCube) core.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/40_Conformance_Tests.md (copied as mirror)
- docs/CODEX_Rules/10_Baseline_Conformance.md (copied as mirror)
Notes:
- Uses a small grid for quick feedback while preserving baseline semantics.
- Keeps bias optional; default runs test the autonomous substrate.
*/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPhaseCubeRunner } from '../../src/core/phasecube.mjs';

const assertBounded = (field, lower = 0, upper = 1) => {
  for (const v of field) {
    assert.ok(Number.isFinite(v), 'value must be finite');
    assert.ok(v >= lower - 1e-6 && v <= upper + 1e-6, 'value must remain bounded');
  }
};

test('dreaming: boot runs for N frames without exceptions', () => {
  const runner = createPhaseCubeRunner({ gridSize: 10, seed: 2026 });
  const steps = 24;
  for (let i = 0; i < steps; i += 1) {
    runner.tick();
  }
});

test('dreaming: state arrays maintain expected shape', () => {
  const runner = createPhaseCubeRunner({ gridSize: 9, seed: 77 });
  const size = runner.state.gridSize;
  const expectedLength = size ** 3;
  assert.equal(runner.state.plasma.length, expectedLength);
  assert.equal(runner.state.liquid.length, expectedLength);
  assert.equal(runner.state.solid.length, expectedLength);
  assert.equal(runner.state.parity.length, expectedLength);
  runner.tick();
  assert.equal(runner.state.plasma.length, expectedLength);
});

test('dreaming: state remains bounded and finite', () => {
  const runner = createPhaseCubeRunner({ gridSize: 8, seed: 1234 });
  for (let i = 0; i < 48; i += 1) {
    runner.tick();
    assertBounded(runner.state.plasma, 0, 1);
    assertBounded(runner.state.liquid, 0, 1);
    assertBounded(runner.state.solid, 0, 1);
    for (const bit of runner.state.parity) {
      assert.ok(bit === 0 || bit === 1, 'parity must remain binary');
    }
  }
});

test('dreaming: seeded runs are deterministic for metrics', () => {
  const makeMeans = () => {
    const runner = createPhaseCubeRunner({ gridSize: 7, seed: 2468 });
    let last;
    for (let i = 0; i < 12; i += 1) {
      last = runner.tick();
    }
    return last;
  };
  const metricsA = makeMeans();
  const metricsB = makeMeans();
  assert.deepEqual(metricsA, metricsB);
});
