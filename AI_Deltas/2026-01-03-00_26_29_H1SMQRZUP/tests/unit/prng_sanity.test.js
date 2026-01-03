/*
DeltaID: 2026-01-03-00_26_29_H1SMQRZUP
Purpose: Provide a deterministic seeding sanity check scaffold for the PhaseCube PRNG.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/10_Baseline_Conformance.md (copied as mirror)
Notes:
- This test is skipped until a concrete PRNG module is available.
- Ensures future implementations expose a seed and produce repeatable streams.
*/

import { test } from 'node:test';
import assert from 'node:assert/strict';

// Placeholder: replace with the actual PRNG factory (e.g., mulberry32(seed)).
const createPrng = (_seed) => {
  throw new Error('TODO: connect to PRNG implementation');
};

test.skip('prng: seeded runs are repeatable', () => {
  const seed = 123456;
  const prngA = createPrng(seed);
  const prngB = createPrng(seed);
  const seqA = [prngA(), prngA(), prngA()];
  const seqB = [prngB(), prngB(), prngB()];
  assert.deepEqual(seqA, seqB);
});
