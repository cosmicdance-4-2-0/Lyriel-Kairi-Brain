# Conformance Testing Rules

## Purpose
Conformance tests exist to prevent silent drift across refactors and ports.

## Minimum Required Tests
1. **Boot test**  
   Baseline harness runs for N frames without exceptions.

2. **Shape test**  
   `GRID^3` arrays exist and maintain correct length.

3. **Bounds test**  
   State remains bounded (per spec) after N frames.

4. **No-NaN / No-Infinity test**  
   Rendering/projection must not generate NaN cascades that break execution.

## Optional but Recommended
- RNG seeding mode + golden snapshot metrics (histograms, mean/var over state arrays)

## Where Tests Live
- `tests/conformance/` for baseline conformance
- `tests/unit/` for helper math and utilities

## Codex Rule
If code changes touch `PhaseGrid`, `InputLayer`, or baseline constants:
- tests must be updated or extended in the same change
- behavior changes must be documented via ADR/spec update
