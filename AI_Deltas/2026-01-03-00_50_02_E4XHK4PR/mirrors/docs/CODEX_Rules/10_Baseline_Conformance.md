# Baseline Conformance Rules

## Goal
Preserve the canonical behavior of the baselines while allowing modularization and extension.

## Hard Rules (Do Not Break)
1. **Dreaming remains pre-goal**  
   No goals, reward shaping, planning loops, or “task completion” logic in the Dreaming core.

2. **Input is influence, not command**  
   Hearing may bias probabilities and inject bounded energy, but must not overwrite state directly.

3. **Boundedness**  
   Core state values must remain bounded as defined in specs:
   - plasma/liquid/solid are bounded (typically `[0,1]` or modulo-wrapped)
   - probability clamps are enforced where specified
   - bias fields are clamped

4. **Non-collapse**  
   Avoid fixed-point convergence, runaway excitation, or attractor lock-in induced by new code.

5. **Determinism policy must be explicit**  
   If adding seeded RNG or deterministic modes, do so as an optional feature with documented impact.

## Allowed Changes (Safe)
- Splitting single-file prototypes into modules **without changing update equations**
- Moving constants into config files **without changing default values**
- Refactoring rendering and UI code **without changing simulation state transitions**
- Adding new modules behind feature flags (Input/Bias/Output), default OFF

## Change Control
Any of these requires:
- an ADR in `docs/adr/`
- conformance test updates
- spec revision if behavior changes are intended

Triggers:
- changing update equations
- changing default constants
- changing bounds/clamps
- changing audio→bias mapping semantics
