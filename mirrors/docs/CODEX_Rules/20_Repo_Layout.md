# Repository Layout Rules

## Canonical Structure
- `docs/specs/` — baseline definitions and invariants
- `docs/adr/` — architectural decisions (small, durable)
- `docs/CODEX_Rules/` — constraints for automated edits
- `src/` — implementation modules (no UI assumptions)
- `web/` — minimal runnable web harness (thin glue + UI)
- `tests/` — conformance and sanity checks
- `tools/` — optional scripts (formatting, validation)

## Separation of Concerns
- `src/` must not hardcode DOM structure or CSS assumptions.
- `web/` may contain UI and DOM wiring but should remain minimal.

## Baseline Preservation
- Keep baseline artifacts (or imported baselines) under `docs/specs/` and `docs/specs/IMPORTED_BASELINE/`.
- Baselines should not be “improved” silently. If improved, treat as a versioned spec change.

## File Naming
- Prefer `UpperCamelCase` for classes/modules and `lower_snake_case` for docs.
- Specs are named `*_BASELINE.md` for consistency.
