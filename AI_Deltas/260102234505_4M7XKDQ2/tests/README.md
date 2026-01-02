# Tests

This repository uses lightweight conformance smoke tests to detect drift in the imported Dreaming and Hearing baselines. The tests are written with Node's built-in `node:test` runner and do not depend on the DOM.

## Structure

- `tests/conformance/dreaming_smoke.test.js` — exercises the Dreaming baseline update rules with a deterministic PRNG and checks boundedness, finiteness, and mean activity bands.
- `tests/conformance/hearing_smoke.test.js` — exercises the Hearing baseline bias field and coupled dynamics, verifying clamp policies and activity stability.

## Adding new invariants

1. Keep tests deterministic by using the local xorshift PRNG instead of `Math.random()`.
2. Mirror baseline equations and constants; do not introduce new behavior without an accompanying spec change.
3. Prefer metrics that detect drift (bounds, NaN/Inf, mean/variance bands) over rendering checks.
4. If core dynamics change, extend the conformance suite in the same commit to encode the new expectations.

Run all tests with:

```sh
npm test
```
