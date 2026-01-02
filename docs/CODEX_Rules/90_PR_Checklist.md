# PR Checklist (Human or Automated)

- [ ] Does this change touch baseline behavior? If yes, is there an ADR + spec update?
- [ ] Do defaults preserve baseline behavior?
- [ ] Do conformance tests pass (boot/shape/bounds/no-NaN)?
- [ ] Are new modules behind flags if they might change behavior?
- [ ] Is `web/` only thin glue (no logic duplicated from `src/`)?
- [ ] Are new knobs documented in config and/or spec?
