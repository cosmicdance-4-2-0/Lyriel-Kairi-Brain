/*
PROVENANCE
- Repo: Lyriel-Kairi-Brain
- File: tests/unit/prng_sanity.test.js
- Created: 2026-01-03-07_23_21
- DeltaID: 2026-01-03-07_23_21_YQX1ZLUP
- Generator: Codex
- Source Vectors:
  - docs/specs/DREAMING_BASELINE.md
  - docs/adr/0004-prng-and-determinism.md
- Intent:
  - Verify deterministic seeding for the baseline PRNG utility.
- Constraints:
  - No external dependencies; relies on pure function output.
- Notes:
  - Uses short sequences to keep the test lightweight.
*/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPrng } from '../../src/core/prng.js';

test('prng: seeded runs are repeatable', () => {
  const seed = 123456;
  const prngA = createPrng(seed);
  const prngB = createPrng(seed);
  const seqA = [prngA(), prngA(), prngA(), prngA()];
  const seqB = [prngB(), prngB(), prngB(), prngB()];
  assert.deepEqual(seqA, seqB);
});
