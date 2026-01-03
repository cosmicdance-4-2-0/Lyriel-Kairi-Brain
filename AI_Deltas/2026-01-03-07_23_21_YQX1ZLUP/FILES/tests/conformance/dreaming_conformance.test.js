/*
PROVENANCE
- Repo: Lyriel-Kairi-Brain
- File: tests/conformance/dreaming_conformance.test.js
- Created: 2026-01-03-07_23_21
- DeltaID: 2026-01-03-07_23_21_YQX1ZLUP
- Generator: Codex
- Source Vectors:
  - docs/specs/DREAMING_BASELINE.md
  - docs/CODEX_Rules/40_Conformance_Tests.md
  - docs/adr/0003-clamp-policy.md
- Intent:
  - Execute baseline conformance smoke tests for the PhaseCube runner.
- Constraints:
  - Keep runtime lightweight; avoid large grids in tests.
- Notes:
  - Uses seeded runs to ensure repeatability.
*/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPhaseCubeRunner } from '../../src/core/phasecube/index.js';

const assertBounded = (field, lower = 0, upper = 1) => {
  for (const v of field) {
    assert.ok(Number.isFinite(v), 'value must be finite');
    assert.ok(v >= lower - 1e-6 && v <= upper + 1e-6, 'value must remain bounded');
  }
};

// Boot test: baseline harness runs without throwing for N frames.
test('dreaming: boot runs for N frames without exceptions', () => {
  const runner = createPhaseCubeRunner({ seed: 1234, gridSize: 10 });
  const steps = 24;
  for (let i = 0; i < steps; i += 1) {
    runner.tick();
  }
});

// Shape test: GRID^3 arrays maintain length across updates.
test('dreaming: state arrays maintain expected shape', () => {
  const runner = createPhaseCubeRunner({ seed: 5678, gridSize: 9 });
  const size = runner.state.gridSize;
  const expectedLength = size ** 3;
  assert.equal(runner.state.plasma.length, expectedLength);
  assert.equal(runner.state.liquid.length, expectedLength);
  assert.equal(runner.state.solid.length, expectedLength);
  assert.equal(runner.state.parity.length, expectedLength);
  runner.tick();
  assert.equal(runner.state.plasma.length, expectedLength);
  assert.equal(runner.state.parity.length, expectedLength);
});

// Bounds and NaN/Infinity guard.
test('dreaming: state remains bounded and finite', () => {
  const runner = createPhaseCubeRunner({ seed: 31415, gridSize: 8 });
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
