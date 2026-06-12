# Design language — where the canon lives + cross-cutting locked rules

## Precedence

On any conflict: **the user's explicit brief > the moved canon files (`references/white-owl-*.md`) > the distilled reference files (this one, motion.md, imagery.md, …) > anything remembered from past sessions.** The canon must be re-read per session (it evolves; stale memory of it has shipped real mistakes):

| Canon file (white-owl monorepo) | Owns |
|---|---|
| root `CLAUDE.md` | Scoped-work rules, shared dev-server rules, verification protocol, namespacing law (kept in the repo — not moved) |
| `references/white-owl-design-system.md` (this skill) | Palette/tokens, type, motifs, §12 interior-page rules, §13/§14 worked references — moved from `docs/DESIGN-SYSTEM.md` (that path is now a stub) |
| `references/white-owl-responsive-playbook.md` (this skill) | Motion recipes, responsive vocabulary, §6 pre-ship checklist, §7 page-scale production (incl. the imagery rules) — moved from `docs/RESPONSIVE-PLAYBOOK.md` (that path is now a stub) |
| `references/white-owl-templates.md` (this skill) | Template library, knob protocol, blast-radius workflow — moved from `apps/miller-web/components-v2/README.md` (that path is now a stub) |

The old repo paths are stubs only — the in-skill copies are the ONLY editable canon. "Update the canon in the same change" now means editing the skill copies (`references/white-owl-*.md`), not the stub files. In any other repo, locate the equivalent canon first; if none exists, say so and get the language locked before designing.

## The home page is the foundation (white-owl)

The HOME page is the only surface logan rates ~95% there, and it is the rendered foundation every other page builds FROM — not just its motion ceiling but its structural baseline: section padding clamps, the type scale (display/lead/body/mono sizes per breakpoint), button specs (mw-cta pair heights, sentence-case labels), eyebrow/section-tag treatment, in-section gaps and spacing rhythm, seam handoffs, border weights and treatments (where 1px lines vs 0.5px hairlines vs heavier ink frames are used), and the MICRO-INTERACTION grammar — the small hover motions like the services-section title indent are what make the page feel alive, and they must behave identically wherever that element type appears. When building or updating any page, pull these values from the rendered home sections (and the canon's token/type specs) rather than inventing near-misses — a page whose paddings, type sizes, borders, or button geometry drift from home reads as a different site.

**Consistency without sameness:** pages must NOT all feel the same — each gets its own composition concept and section devices — but they all share the same grammar (tokens, spacing rhythm, borders, type scale, hover/micro-interaction behavior, mark motifs). Vary the COMPOSITION, never the grammar.

The other v2 interior pages (CWC, project-management, vision-mission-values, environmental-remediation) predate parts of this baseline and are scheduled for update passes — do NOT treat their current rendered state as the foundation; home is.

The concrete blessed-device ledger extracted from these surfaces — what each approved device is FOR and how it reuses — lives in vocabulary.md, alongside the forbidden list.

## Cross-cutting locked rules (repo-portable)

- **Contextual fit drives every choice.** Design for WHO lands on the page and what they need from it; the register is the brand's actual business, not generic marketing energy.
- **The bar is "exceptional, high-end, expensive-looking" — judged in rendered pixels.** Crowding, runt lines, broken words, drifting alignment, and dead voids are bar failures even when every probe passes.
- **Sibling pages differ structurally.** A new page is a new composition concept (different hero architecture, different section devices), never a re-skin of the last page with new copy.
- **Break the column at least once per page (logan, 2026-06-12).** Every page carries at least one EDGE-SPANNING element: it runs from one screen edge to the OPPOSITE side's body-content boundary (and never past that far gutter) — viewport-left → content-right, or vice versa. Great for photos and card groups; it's what keeps a page from reading like every other site where everything just runs down the content column in order, and these surfaces take scroll effects naturally (a ready-made medium-tier moment, motion.md). Full-width 100% sections are ALSO allowed where they earn it — scrollable carousels/rails, full-bleed photo stages — that's a different device than the asymmetric edge-span, and a page can use both.
- **The palette lock is UI-scoped.** Locked colors govern tokens, chrome, CSS, and generated GRAPHICS/illustrations. It does NOT extend to photographs — see imagery.md. Sanctioned palette exception (white-owl): the blue ISO certification seals on the Miller home page are intentional — do not "fix" them.
- **No leading numbers on stacked lists** (logan, 2026-06-12). Vertical/stacked list items never lead with mono `01/02/…` markers — use the house mark (e.g. small diamond, hollow at rest / filled when active, which doubles as a non-color state cue). Compositional numbering (cards in a row, route stations, plates) is a different device and stays.
- **Typography discipline:** display/condensed for headings per canon, mono for labels/eyebrows/captions, sans for body — never decorative substitutions, and when torn between two sizes on small screens, take the larger.
- **One eyebrow per element; equal-height CTA pairs; the last section before the footer is never dark; at most one dark anchor per page (zero is fine), placed differently than sibling pages** — the white-owl HOME page is the deliberate exception, carrying three evenly spaced dark anchors (hero / scale band / careers).
- **Uniform heading-stack spacing (logan, 2026-06-12).** Whenever a header immediately follows its eyebrow, the eyebrow→header gap is ONE shared value site-wide (pulled from home, never re-invented per section); likewise the header→body-intro gap when the intro immediately follows. These two gaps are grammar, not per-section tuning — probe them like seam rhythm.
- **The 24/7 emergency CTA is NOT a default hero element (logan, 2026-06-12).** It appears in a hero only on the HOME page and on pages related to emergency services; every other hero carries a single primary CTA. (Heroes on the existing v2 interior pages predate this rule and get corrected in their update passes.)
- **Seam rhythm:** section paddings derive from one shared clamp so seams are uniform per width — probe them, don't eyeball.
- **Namespacing:** every page gets its own CSS namespace; grep existing prefixes BEFORE naming (a "v2 page" prefix colliding with a v1 token family is a real failure mode — e.g. needing `mw-rem2-*` because `mw-rem-*` was taken). Never style bare shared selectors; scope brand-specific rules under the brand's html attribute or a new namespaced class.
- **Shared components are composed, not forked**; template changes ship behind default-preserving knobs after a blast-radius check.
- **Copy lives in content modules**, never inline in page composition files. Non-breaking hyphens/word-joiners for compounds that runt-wrap ("as‑builts", "clear‑out"); `text-wrap: pretty/balance` for widow control.
- **A11y floor:** visible warm focus ring (`:focus-visible`), semantic landmarks + labelled sections, real `<button>`/`<a>` for interactive things, `aria-live` for cycling/announcing devices, AA contrast on every new text/control color, and a reduced-motion off-switch on EVERY animation. This bullet is the floor, not the standard — for any non-trivial a11y question also invoke `global-plugin:accessibility-guard`.
