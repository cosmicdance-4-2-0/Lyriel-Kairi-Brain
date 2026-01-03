/*
DeltaID: 2026-01-03-00_50_02_E4XHK4PR
Purpose: Validate Hearing baseline behavior for bias decay, clamping, and coupling.
Sources:
- docs/specs/HEARING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/50_Audio_Hearing.md (copied as mirror)
- docs/CODEX_Rules/40_Conformance_Tests.md (copied as mirror)
Notes:
- Uses synthetic feature vectors to avoid audio dependencies.
- Coupling test ensures Path B modulation stays bounded.
*/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHearingBias } from '../../src/hearing/bias_field.mjs';

const assertWithin = (arr, min, max) => {
  for (const v of arr) {
    assert.ok(Number.isFinite(v), 'bias value must be finite');
    assert.ok(v >= min - 1e-6 && v <= max + 1e-6, 'bias value must be bounded');
  }
};

test('hearing: bias decays without input', () => {
  const bias = createHearingBias({ gridSize: 6, decay: 0.9 });
  bias.ingest({ left: [1, 0.5, 0], right: [1, 0.5, 0] });
  const initialMagnitude = bias.getField().reduce((acc, v) => acc + Math.abs(v), 0);
  bias.tick(); // decay step
  const afterMagnitude = bias.getField().reduce((acc, v) => acc + Math.abs(v), 0);
  assert.ok(afterMagnitude <= initialMagnitude + 1e-6, 'bias should decay or hold steady');
});

test('hearing: injected bias is clamped', () => {
  const bounds = { biasMin: -0.38, biasMax: 0.38 };
  const bias = createHearingBias({ ...bounds, gridSize: 5 });
  bias.ingest({ left: [1, 1, 1, 1], right: [1, 1, 1, 1] });
  assertWithin(bias.getField(), bounds.biasMin, bounds.biasMax);
});

test('hearing: coupling clamps Path B probability', () => {
  const bias = createHearingBias({ gridSize: 4 });
  bias.ingest({ left: [1, 0.5], right: [0.5, 1] });
  const coupled = bias.couple(0.5);
  assertWithin(coupled, 0.05, 0.95);
});
