---
DeltaID: 2026-01-03-01_17_21_E69CSI40
Purpose: Provide current run and test entry points for the scaffolded PhaseCube project.
Sources:
- README.md
- tests/README.md
Notes:
- No runnable core is included in this delta; commands are for the existing scaffold.
- Update these notes once concrete implementations and fixtures exist.
---

# RUN.md — Harness + Test Entry Points

## Static Web Harness (viewer placeholder)
The repository is intended to be served as static assets until a build system exists. From the repo root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/web/` in a browser. The current `web/` directory is a scaffold; expect missing wiring until the core is implemented.

## Tests (Node built-in runner)
Tests are present but currently skipped because core modules are not yet connected.

```bash
node --test tests/conformance/*.test.js
node --test tests/unit/*.test.js
```

If your Node version requires ESM flags, add:

```bash
export NODE_OPTIONS=--experimental-vm-modules
```

## Expectations
- Conformance tests (`tests/conformance/`) will fail early until `src/core/phasecube` and the Hearing bias module are available.
- Unit PRNG sanity will fail until a deterministic PRNG factory is provided.
- No additional dependencies are needed for these commands; they rely on built-in Node tooling.
