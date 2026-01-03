/*
DeltaID: 2026-01-03-00_50_02_E4XHK4PR
Purpose: Validate deterministic seeding behavior for the PhaseCube PRNG.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/10_Baseline_Conformance.md (copied as mirror)
Notes:
- Focuses on repeatability and bounded output; not a statistical battery.
*/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPrng } from '../../src/core/prng.mjs';

test('prng: seeded runs are repeatable', () => {
  const seed = 123456;
  const prngA = createPrng(seed);
  const prngB = createPrng(seed);
  const seqA = [prngA(), prngA(), prngA(), prngA()];
  const seqB = [prngB(), prngB(), prngB(), prngB()];
  assert.deepEqual(seqA, seqB);
});

test('prng: values remain within [0,1)', () => {
  const prng = createPrng(99);
  for (let i = 0; i < 10; i += 1) {
    const v = prng();
    assert.ok(Number.isFinite(v), 'value must be finite');
    assert.ok(v >= 0 && v < 1, 'value must stay in [0,1)');
  }
});
