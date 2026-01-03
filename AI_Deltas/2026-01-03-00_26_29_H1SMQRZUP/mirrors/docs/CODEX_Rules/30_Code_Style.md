# Code Style Rules

## JS Dialect
- ES modules (`import`/`export`)
- No build step required for the minimal web harness (use native browser modules).

## Minimalism
- Avoid adding dependencies unless there is a strong justification.
- Prefer small, composable modules with explicit inputs/outputs.

## Documentation in Code
- Use short comments for: invariants, clamps, probability bounds, and “why this exists.”
- Do not write narrative essays in code. Specs and ADRs carry long-form reasoning.

## Defaults
- Default configs must match the baseline specs.
- If a new option is added, defaults must preserve baseline behavior.

## Performance
- Prefer typed arrays for core state (Float32Array / Int8Array).
- Avoid allocations in the inner loop unless unavoidable.
