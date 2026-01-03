/*
PROVENANCE
- Repo: Lyriel-Kairi-Brain
- File: tests/conformance/hearing_conformance.test.js
- Created: 2026-01-03-07_23_21
- DeltaID: 2026-01-03-07_23_21_YQX1ZLUP
- Generator: Codex
- Source Vectors:
  - docs/specs/HEARING_BASELINE.md
  - docs/CODEX_Rules/50_Audio_Hearing.md
  - docs/CODEX_Rules/40_Conformance_Tests.md
- Intent:
  - Validate bounded decay, clamping, and Path B coupling for the Hearing bias field.
- Constraints:
  - Bias only modulates Path B probability; no direct state writes.
- Notes:
  - Uses small grids for fast execution.
*/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHearingBias } from '../../src/modules/bias/hearing.js';

const sumMagnitude = (arr) => arr.reduce((acc, v) => acc + Math.abs(v), 0);
const assertWithin = (arr, min, max) => {
  for (const v of arr) {
    assert.ok(Number.isFinite(v), 'bias value must be finite');
    assert.ok(v >= min - 1e-6 && v <= max + 1e-6, 'bias value must be bounded');
  }
};

// Decay sanity: bias should trend toward 0 when no input is injected.
test('hearing: bias decays without input', () => {
  const bias = createHearingBias({ gridSize: 8, decay: 0.9 });
  bias.ingest({ left: [1, 1, 1], right: [1, 1, 1] });
  const initialMagnitude = sumMagnitude(bias.getField());
  bias.tick();
  const afterMagnitude = sumMagnitude(bias.getField());
  assert.ok(afterMagnitude <= initialMagnitude + 1e-6, 'bias field should decay');
});

// Clamp sanity: injected energy stays within configured bounds.
test('hearing: injected bias is clamped', () => {
  const bias = createHearingBias({ biasMin: -0.38, biasMax: 0.38, gridSize: 8 });
  bias.ingest({ left: [1, 1, 1], right: [1, 1, 1] });
  const field = bias.getField();
  assertWithin(field, -0.38, 0.38);
});

// Coupling sanity: bias only modulates Path B probability.
test('hearing: coupling clamps Path B probability', () => {
  const bias = createHearingBias({ biasMin: -0.38, biasMax: 0.38, gridSize: 6 });
  bias.ingest({ left: [0.6, 0.2, 0.1], right: [0.5, 0.7, 0.2] });
  const base = 0.5;
  const pB = bias.couple(base);
  for (const v of pB) {
    assert.ok(v >= 0.05 && v <= 0.95, 'pB must respect baseline clamps');
  }
});
