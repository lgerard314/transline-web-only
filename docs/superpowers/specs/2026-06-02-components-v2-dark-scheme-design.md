# Design spec — fully-general `dark` scheme for v2 sections

- **Date:** 2026-06-02
- **Status:** Approved (design); implementation plan to follow.
- **App:** `apps/miller-web` · route `/template-testing` (+ `/template-testing-variants` fixture) only.
- **Builds on:** the content-and-config refactor (`docs/superpowers/specs/2026-06-02-components-v2-content-and-config-design.md`). The `scheme` knob and `template-testing.css` already exist; this extends the `dark` value to be complete.

## 1. Goal

Make `config.scheme = "dark"` produce a **complete, on-brand dark inversion of any of the 7 light sections** (certs-banner, services/bento, sectors, facility, history, affiliates, final-cta), not just a partial surface swap. A darkened section must read like the home Careers / emergency-response dark panels: warm walnut surface, cream text, no leftover light cards/washes/hairlines, AA-readable. (Hero and Careers are already dark; `scheme:"dark"` on them is a documented no-op.)

## 2. Approach

The dark scheme is two layers, both inside the existing route-scoped `apps/miller-web/app/template-testing/template-testing.css`:

### 2a. Complete token rebind
Replace the current partial `[data-scheme="dark"]` block with a full §12-aligned rebind. Because the 7 light sections color themselves overwhelmingly through tokens, rebinding the tokens on the section subtree flips most of each section automatically:

```css
[data-scheme="dark"] {
  --c-bg: var(--c-navy);
  --c-surface-warm: var(--c-navy);
  --c-surface: var(--c-navy-2);
  --c-ink: #ffffff;
  --c-ink-2: rgba(250, 243, 229, 0.91);
  --c-ink-3: rgba(245, 230, 203, 0.72);
  --c-line: var(--c-navy-2);
  --c-line-2: rgba(245, 230, 203, 0.12);
  --c-grain-on-light: var(--c-grain-on-dark);
}
```
Values are the locked §12 dark-section colors so a darkened section matches the existing dark panels. All clay-family; no blue/teal.

### 2b. Per-section literal overrides
A bounded set of `[data-scheme="dark"] .mw-<section>__<el> { … }` rules for elements that hardcode a **light** value (token rebind can't reach them). Confirmed blocker:

- **history** — `.mw-ten3__milestone-body { background: #ffffff }` (04-home.css:934) → override to a dark card wash: `background: rgba(245, 230, 203, 0.035)` (the §12 dark card bg) + soften its `box-shadow` (the warm `rgba(42,27,18,…)` drop shadow is invisible on dark; acceptable to leave or zero out).

Other light sections currently show no hardcoded light surface in the audit — but a few may surface only when rendered dark (e.g. a card body, a hairline, an inline `style` set in a component). The plan therefore pairs each section with a **render-dark → screenshot → override-any-remaining-light-artifact** loop, seeding the known override above. The exhaustive per-section list is finalized during implementation by rendering each section dark; this spec defines the mechanism + the one known case, and the screenshot gate guarantees completeness.

### 2c. Explicitly left alone (not light artifacts)
- Warm **drop shadows** `rgba(42,27,18,0.x)` (e.g. 04-home.css:146, 524, 937) — a dark shadow on a dark surface is invisible; harmless.
- **Photo-overlay** gradients `rgba(42,27,18,…)` (e.g. 187, 1666–67, 2267) — they sit over photographs, which don't change with scheme.
- The clay **accent** (`--c-accent`) and the stamp/diamond motifs — unchanged in dark (they read on both tones, matching the home dark panels).

## 3. Scope / constraints

- Applies to the **7 light sections**. Hero/Careers (already dark): `scheme:"dark"` is a no-op (documented).
- **Only `template-testing.css` changes** (the one route-scoped file). No edits to `app/styles/*`, no edits to the section component files (the `data-scheme` attribute wiring already exists from the prior phase). No edits to `app/(home)/`, brand, etc.
- **Default render unaffected:** the dark rules apply only under `[data-scheme="dark"]`, which is emitted only when `config.scheme === "dark"`. `/template-testing` (no config) stays byte-identical; the existing parity tests still pass.
- Clay-only; reuse §12 dark values.

## 4. Verification

- A fixture (extend `/template-testing-variants`) renders **each of the 7 light sections** with `config={{ scheme: "dark" }}`.
- For each, capture a screenshot and review (by eye) that it is a clean, complete dark inversion: walnut surface, cream text, **no** white card / light wash / light hairline remaining, motifs intact, AA-readable text.
- Automated: a test asserting, for a representative darkened section (e.g. `.mw-ten3[data-scheme="dark"]`), that the resolved surface is the dark token and a body-text element resolves to a cream (not ink) color; and that `.mw-ten3__milestone-body` under dark is no longer white.
- Default-parity test (0 `[data-scheme]` on `/template-testing`) continues to pass.

## 5. Risks

- **A light literal missed** → a light artifact in an otherwise-dark section. Mitigation: the per-section render-and-screenshot loop is the gate; the audit already found the literal set is small.
- **Contrast** — the §12 dark text tokens on `--c-navy` are AA-clean (verified previously: `--c-ink-3` ≈ 7:1). New overrides must keep cream text on walnut, not reintroduce dark-on-dark.
- **Accent legibility** on dark — `--c-accent` (#A85A2C) on walnut is the established home-dark-panel treatment; acceptable.
- **Scope creep into `app/styles`** — forbidden; if a section can only be darkened by changing a base partial, that section's override stays in `template-testing.css` via a more specific selector instead.
