---
DeltaID: 2026-01-03-01_18_09_LHAUG50D
Purpose: Provide run guidance for the documentation-only delta packet.
Sources:
- tests/README.md
- tests/conformance/dreaming_conformance.test.js
- tests/conformance/hearing_conformance.test.js
Notes:
- No runnable artifacts are produced by this delta.
- Guidance assumes future wiring of core and hearing modules.
---

# RUN GUIDANCE

This delta does not introduce runnable code. After copy-out and once the Dreaming/Hearing modules are wired into the conformance tests, run:

```sh
node --test tests/conformance/*.test.js
```

Add `NODE_OPTIONS=--experimental-vm-modules` if needed for ES module support. Skip removal should only occur after fixtures and module imports are in place to avoid baseline drift.
