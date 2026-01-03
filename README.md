# Lyriel-Kairi-Brain

A minimal, continuously-active swarm substrate intended to explore **pre-goal, pre-symbolic, non-teleological** agent dynamics in an inspectable, portable form.
> *“Not everything with a mind is smart.  
> Not everything that thinks needs a goal.”*

This repository defines **canonical baselines** (specifications) for:
- **Dreaming**: the always-on substrate (PhaseCube core dynamics)
- **Hearing**: an audio influence layer that biases (does not control) the Dreaming substrate

The baselines are designed to be extended modularly (input/bias/output modules) without rewriting the core.

---

## Start Here (Canonical)

These documents define what “correct” means for this repo:

- **Dreaming baseline (canonical):** `docs/specs/DREAMING_BASELINE.md`
- **Hearing baseline (canonical):** `docs/specs/HEARING_BASELINE.md`

### Historical context (non-canonical)
Prior prototypes and earlier writeups are preserved as trace material:

- `docs/specs/IMPORTED_BASELINE/`

Anything under `IMPORTED_BASELINE/` is **history**, not a conformance target.

---

## Repository Layout

- `docs/specs/`  
  Canonical baseline specifications and conformance definitions.

- `docs/adr/`  
  Architecture Decision Records (why choices were made, and what alternatives were rejected).

- `src/`  
  Implementation modules intended to conform to the baselines.

- `web/`  
  Minimal runnable web harnesses / demos for baseline conformance and iteration.

- `tests/`  
  Smoke tests and invariants (boundedness, non-collapse checks, regression traps).

- `tools/`  
  Utility scripts (formatting, build helpers, analysis tooling).

---

## Baseline Rules (Read This Before Editing)

1. **Specs are canonical.**  
   The truth source is `docs/specs/*.md`, not the implementation.

2. **The core must remain influenceable, not controllable.**  
   Input modules may bias probabilities and inject bounded energy, but must not overwrite state.

3. **Non-collapse is a first-class constraint.**  
   The Dreaming substrate must remain bounded and avoid fixed-point lock-in and runaway excitation.

4. **History is read-only.**  
   `docs/specs/IMPORTED_BASELINE/` should not be “cleaned up” or rewritten except for trivial formatting fixes.

5. **Changes require a decision trail.**  
   Material changes to behavior or conformance targets should be accompanied by an ADR in `docs/adr/`.

---

## Development tooling

From the repository root:

```bash
npm install
```

### Commands

```bash
# Lint source, tests, and web harness files
npm run lint

# Run the Node.js test suite
npm test

# Check formatting (Prettier)
npm run format

# Simple static web serving (existing baseline harness)
python -m http.server 8000
```
