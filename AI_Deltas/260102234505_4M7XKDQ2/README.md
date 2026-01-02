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
- **Codex rules:** `docs/CODEX_Rules/` (including `NO_TOUCH_BASELINES.md` for baseline guardrails)

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

- `web/`  
  Minimal runnable web harnesses / demos for baseline conformance and iteration.

- `tests/`  
  Smoke tests and invariants (boundedness, non-collapse checks, regression traps).

- `src/` and `tools/`  
  Implementation modules and utility scripts.

---

## Running (Local)

Serve the repository root with any static file server. Example:

```bash
python -m http.server 8000
```

Then open the web harness:
- Demo index: <http://localhost:8000/web/index.html>
- Dreaming baseline: <http://localhost:8000/web/demos/dreaming_baseline.html>
- Hearing baseline: <http://localhost:8000/web/demos/hearing_baseline.html>

See `web/README.md` for expected visual and behavioral outputs.

---

## Tests

Install the Node toolchain (no external dependencies are required) and run:

```bash
npm install --ignore-scripts --no-audit --no-fund
npm test
```

Conformance smoke tests live in `tests/conformance/` and check boundedness, NaN/Inf protections, and broad activity bands. `tests/README.md` describes how to add new invariants.

---

## Baseline Rules (Read Before Editing)

1. **Specs are canonical.**  
   The truth source is `docs/specs/*.md`, not the implementation.

2. **Influence, not control.**  
   Input modules may bias probabilities and inject bounded energy, but must not overwrite state directly.

3. **Non-collapse is a first-class constraint.**  
   The Dreaming substrate must remain bounded and avoid fixed-point lock-in and runaway excitation.

4. **History is read-only.**  
   `docs/specs/IMPORTED_BASELINE/` should not be “cleaned up” or rewritten except for trivial formatting fixes.

5. **Changes require a decision trail.**  
   Material changes to behavior or conformance targets should be accompanied by an ADR in `docs/adr/` and matching conformance updates.

For detailed guardrails, see `docs/CODEX_Rules/`.
