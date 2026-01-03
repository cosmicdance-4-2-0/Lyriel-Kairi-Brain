# LKB PhaseCube Baseline
## Design Document — Dreaming Substrate v0.1

**Status:** Baseline Definition  
**Audience:** Developers and researchers implementing or extending a minimal, continuously-active, influenceable swarm substrate  
**Scope:** Defines the canonical “Dreaming” baseline (PhaseCube) and the repository/iteration rules that prevent drift across implementations.

---

## 1. Purpose

This document formalizes a minimal baseline for a “dreaming” swarm substrate: a continuously evolving dynamical system with internal state, bounded behavior, and well-defined extension seams. The baseline is intentionally **pre-goal**, **pre-symbolic**, and **non-teleological**.

The system is designed to:
- Run locally on commodity hardware with no special dependencies.
- Remain inspectable and portable.
- Support incremental extension (input/bias/output) without re-authoring the core.
- Prevent silent behavior drift across iterations and ports by providing a conformance target.

---

## 2. Non-Goals

The baseline **does not** attempt to provide:
- Intelligence, planning, optimization, or task performance.
- Training, learning, or reward-based behavior.
- A “correct” cognitive model.
- Any guarantee of useful outputs.

The baseline is a substrate for experimentation and extension, not an application.

---

## 3. Terminology

- **Cell:** One element in a 3D lattice.
- **Grid:** The full 3D lattice of cells.
- **Phase channels:** Continuous-valued state variables per cell.
- **Parity bit:** A binary state per cell that introduces asymmetry.
- **Dreaming:** Autonomous evolution under bounded noise and local interactions.
- **Influence (Bias):** External modulation that changes transition probabilities/parameters without overwriting state.
- **Renderer:** A visualization of the internal state; not a separate simulation.
- **Pipeline:** A composition seam for input → bias → core tick → output.

---

## 4. High-Level Requirements

### 4.1 Baseline Requirements
The baseline implementation MUST:
1. Evolve autonomously with no external input.
2. Remain bounded: all state variables must stay within defined numeric domains.
3. Avoid trivial collapse into a fixed point under default parameters for typical runs.
4. Be deterministic under a fixed seed (where a seeded PRNG is used).
5. Expose a stable API to support input/bias/output modules without modifying the core.

### 4.2 Portability Requirements
The baseline MUST be implementable in multiple languages without relying on:
- GPU APIs
- external services
- hidden global state
- runtime-specific side effects

### 4.3 Extension Requirements
Extensions MUST:
- Not overwrite the core state arrays directly (unless explicitly declared as a baseline-breaking change).
- Use the influence seam to modulate probabilities, dampers, or injected fields.
- Preserve core invariants unless explicitly declared otherwise.

---

## 5. System Overview

The baseline is composed of:
- **Core (PhaseCube):** the lattice state and update rules (“Dreaming” dynamics).
- **Renderer (Web Demo):** a minimal visualization that projects 3D points to a 2D canvas.
- **Pipeline Seams:** placeholders for input, bias, and output modules.

The baseline defines a “reference behavior” that future changes can extend while remaining conformant.

---

## 6. Core Model

### 6.1 Topology
- The system is a 3D lattice of size **N × N × N**.
- Indexing and neighbor sampling MUST be explicitly defined.
- Boundary behavior MUST be explicitly defined:
  - **Baseline:** toroidal wrapping (modular arithmetic) is the canonical default.
  - If non-wrapping boundaries are used in a variant, it must be declared as a baseline-breaking change.

### 6.2 Per-Cell State
Each cell stores:
- **plasma** ∈ [0, 1] — excitation channel (fast, noisy)
- **liquid** ∈ [0, 1] — active/visible channel (immediate update)
- **solid** ∈ [0, 1] — persistence channel (slow accumulator)
- **parity** ∈ {0, 1} — asymmetry bit

### 6.3 Initialization
Baseline initialization MUST specify:
- Random initialization ranges for plasma/liquid/solid (uniform).
- Parity initialization policy:
  - **Baseline:** parity MAY be randomized; if randomized, it must be seeded for determinism.
- A deterministic seed MUST be supported in the reference implementation.

### 6.4 Update Cycle (Tick)
Each tick consists of two stages:
1. **Perturbation stage**: low-level stochastic noise and parity toggling.
2. **Transition stage**: deterministic/probabilistic update based on local neighborhood and internal channels.

The baseline update MUST be implementable as:
- A pure function over (previous state, RNG stream, parameters) → (next state, metrics).

---

## 7. Dreaming Dynamics (Baseline Equations)

### 7.1 Perturbation Stage
For each cell `i`:
- With probability `flip_p`: `plasma[i] ← 1 - plasma[i]`
- With probability `parity_p`: `parity[i] ← parity[i] XOR 1`

Notes:
- Perturbation MUST NOT directly set `liquid` or `solid` in the baseline.
- Variants may add internal “dream jitter” into liquid, but that is not baseline unless explicitly adopted.

### 7.2 Neighborhood Function
Baseline uses a defined neighborhood over plasma values:
- **Baseline neighborhood:** 6-connected (±x, ±y, ±z).
- A 26-connected neighborhood is permitted only as a declared variant.

Define:
- `neighborAvg(i)` returns the average plasma of selected neighbors.

### 7.3 Transition Stage
Let `p = plasma[i]`, `l = liquid[i]`, `s = solid[i]`.

Define:
- **Path A (averaging):**
  - `avg = (p + l + s) / 3`
- **Path B (difference-amplifying):**
  - `nb = abs(p - neighborAvg(i)) + parity[i] * parity_gain`

Select:
- With probability `path_b_p` choose Path B, else Path A:
  - `mix = nb` if Path B else `avg`

Update:
- `liquid[i] = clamp01(mix)`
- `solid[i] = clamp01(s * (1 - alpha) + mix * alpha)`

Constraints:
- **Clamp policy** is canonical baseline behavior.
- Modulo wrapping (e.g., `% 1`) is treated as a variant unless explicitly adopted.

---

## 8. Configuration Parameters

The baseline defines the following parameters:

| Name | Type | Typical Range | Role |
|---|---:|---:|---|
| `grid_size` | int | 8–64 | lattice dimension N |
| `scale` | float | > 0 | spatial scale for visualization only |
| `flip_p` | float | 0–0.1 | plasma inversion noise rate |
| `parity_p` | float | 0–0.1 | parity toggle noise rate |
| `path_b_p` | float | 0–1 | probability of Path B |
| `parity_gain` | float | 0–0.5 | parity contribution to Path B |
| `alpha` | float | 0–1 | solid blending factor |
| `point_size` | float | > 0 | visualization only |
| `fps_target` | int | 30–120 | runner pacing only |

The reference implementation SHOULD provide defaults that produce:
- visible motion,
- non-trivial structure,
- bounded stability,
- no frequent numeric pathologies.

---

## 9. Invariants and Safety Properties

A conformant baseline implementation MUST maintain:
1. **Bounds:** plasma/liquid/solid always ∈ [0,1]; parity always ∈ {0,1}.
2. **Numerical sanity:** no NaN, no Infinity.
3. **Topology correctness:** neighbor sampling and wrapping behavior match the declared baseline.
4. **Determinism option:** with a fixed seed and fixed parameters, state evolution is repeatable.

A baseline implementation SHOULD provide metrics to monitor:
- Mean and variance of plasma/liquid/solid
- Parity distribution
- A “dispersion” proxy (e.g., variance of liquid or neighbor differences)

---

## 10. Observability

The system SHOULD support two forms of observability:

### 10.1 Metrics
A minimal metrics object per tick:
- `t` (time or step count)
- `mean_plasma`, `mean_liquid`, `mean_solid`
- `var_liquid` (or equivalent dispersion proxy)
- `parity_ratio`

### 10.2 Witness Sampling
To support debugging and conformance tests, the system SHOULD provide:
- A deterministic “witness set” of cell indices.
- Output of those indices’ state values per tick.

Witness sampling exists to detect drift without dumping entire state arrays.

---

## 11. Extension Seams

The baseline defines extension seams but does not prescribe implementations.

### 11.1 Input Module
Produces observations/events (e.g., audio bins, scripted pulses, network messages).

Contract:
- Input returns an observation object or null.
- Input must be optional; baseline runs with no input.

### 11.2 Bias Module
Transforms observation into influence parameters.

Contract:
- Bias outputs influence that can only modulate parameters or inject a bias field.
- Bias must not overwrite core state arrays directly (unless declared as baseline-breaking).

Examples of bias outputs:
- `path_b_p_delta`
- `flip_p_delta`
- `parity_p_delta`
- `bias_field` (an influence array in a bounded range)

### 11.3 Output Module
Consumes state/metrics for logging, snapshots, diagnostics, or export.

Contract:
- Output must not mutate core state.
- Output must be optional.

---

## 12. Rendering (Web Baseline)

The web demo is a reference visualization, not part of the core.

Requirements:
- Projects precomputed 3D point positions to a 2D canvas with perspective.
- Rotates view based on mouse input.
- Colors points based on a hue function of time + parity + plasma.
- Draws only a subset of points above a visibility threshold to reduce clutter.
- Supports snapshot export (PNG).

Renderer MUST remain replaceable without changes to the core dynamics.

---

## 13. Conformance and Drift Control

### 13.1 Reference Behavior
A baseline release MUST include:
- A fixed seed
- A fixed parameter set
- A golden witness trace for K steps
- Golden metrics over the same run

### 13.2 Conformance Test
Ports or refactors are conformant if, for the baseline seed and parameters:
- Witness traces match within defined numeric tolerance.
- Metrics match within defined numeric tolerance.

### 13.3 Change Classification
Any change MUST be classified:

- **Baseline-preserving:** renderer changes, file organization changes, performance changes, documentation changes, non-semantic refactors, new modules that do not alter core behavior.
- **Baseline-extending:** adding input/bias/output modules that do not overwrite core state; adding optional features gated behind flags.
- **Baseline-breaking:** changing topology, neighborhood, core equations, initialization policy, clamp/modulo policy, or default parameter set.

Baseline-breaking changes require:
- A baseline version bump
- Regeneration of golden fixtures
- Explicit documentation of changes

---

## 14. Repository Structure (Baseline Recommendation)

A baseline repository SHOULD use:

```

/docs
/specs
DREAMING_BASELINE.md
/adr
0001-neighborhood.md
0002-clamp-policy.md

/src
/core
/phasecube
index.(js|ts|kt|java|py)
prng.(...)
metrics.(...)
/pipeline
pipeline.(...)
/modules
/input
/bias
/output
/render
canvasRenderer.(...)

/tests
/conformance
run_conformance.(...)
/fixtures
baseline_seed.json
golden_witness.json
golden_metrics.json

/web
index.html
styles.css
main.js

```

This structure separates:
- **core** (truth),
- **modules** (experiments),
- **renderers** (views),
- **specs/tests** (drift control).

---

## 15. Implementation Notes (Baseline Guidance)

- Prefer typed arrays for state performance in JS/TS.
- Use a seeded PRNG for deterministic runs.
- Avoid hidden dependencies (DOM access inside core).
- Keep core tick free of allocation inside hot loops where possible.
- Provide explicit parameter clamping at module boundaries.

---

## 16. Acceptance Criteria for the Baseline

The baseline is considered established when:
1. A reference implementation exists that conforms to Sections 6–9.
2. A web demo exists that renders the reference implementation.
3. Golden fixtures exist for a baseline seed and parameter set.
4. Conformance tests exist and pass for the reference implementation.
5. Extension seams exist for input/bias/output without modifying core.

---

## 17. Next Steps

After baseline establishment, the recommended progression is:
1. Implement bias as influence-only (bounded modulation of parameters or a bias field).
2. Add deterministic input modes (scripted pulses) before live audio.
3. Add output “witness/oracle” logging for debugging and later automation.
4. Add optional multi-grid/delay memory as baseline-extending modules.
5. Begin porting the conformant core to additional target languages.

---
```
