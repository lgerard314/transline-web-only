# Design system — the locked baseline

This is the canonical design/style guide for **both** apps in this monorepo (`apps/miller-web` and `apps/transline49-web`). The **Miller home page, its header (TopNav), and its footer (SiteFooter) are the finished reference** — every other page that gets built or converted to the new look should match them. New sections will still get designed, but they must be composed from the tokens, type, motifs, and patterns recorded here so they sit seamlessly next to the home page.

Read this before redesigning any page. When something here conflicts with what you find in code, the code on the Miller home page wins — and this doc should be updated to match.

The authoritative source files (read these when you need exact values):

| Concern | File |
| --- | --- |
| Shared tokens, `tl-*` primitives, palettes, type pairings, density, buttons, cards, layout | `apps/brand/styles/globals.css` |
| Miller palette/type overrides + every `mw-*` home component + header/footer repaint + scroll-reveal | `apps/miller-web/app/globals.css` |
| Fonts loaded, `<html>` data-attributes, page shell | `apps/miller-web/app/layout.jsx` |
| Home page markup (section order, components) | `apps/miller-web/app/(home)/HomeTemplate.jsx` |
| Header markup + behavior | `apps/miller-web/components/TopNav.jsx` |
| Footer markup | `apps/miller-web/components/SiteFooter.jsx` |
| Shared components (Marquee, FamilyOfCompanies) | `apps/brand/components/` |

---

## 1. Architecture: shared brand package + per-app overrides

Both sites render through one shared package, `@white-owl/brand`. It owns the vocabulary: design tokens, the `tl-*` primitive classes (`tl-display`, `tl-btn`, `tl-card`, `tl-eyebrow`, `tl-container`, …), the layout shell, the Marquee and FamilyOfCompanies components, and the base reset. Its stylesheet (`apps/brand/styles/globals.css`) is imported first in each app's `layout.jsx`.

Theme is selected with data-attributes on `<html>`. Miller and TransLine49 both set `data-palette="clay" data-type="utility" data-density="regular"`. Miller additionally sets `data-brand="miller"`, which is the hook for all of Miller's overrides.

Each app then layers its own `globals.css` (imported second, so it wins on equal specificity). Miller's override file does three things, and nothing else should be added that doesn't fit one of these buckets:

1. **Re-binds tokens** for the warm clay palette and Miller's type families, scoped to `html[data-brand="miller"]`.
2. **Repaints shared `tl-*` chrome** (topbar, mobile nav, footer, buttons) via `html[data-brand="miller"] .tl-…` selectors — the markup stays shared, the look becomes Miller's.
3. **Adds net-new components** that only Miller uses, namespaced `mw-*` (or `miller-*` for the emergency banner).

TransLine49 currently has **no** per-app override file — it renders straight from the brand package with the default Geist type. Bringing a TL49 page to this baseline means adopting the type system and editorial motifs below (see §13).

**Namespacing rule:** `tl-*` = shared/brand, reused by both apps. `mw-*` = Miller-only. Never put Miller-specific styling on a bare `tl-*` selector in the brand package; scope it under `html[data-brand="miller"]` in Miller's file, or make a new `mw-*` class.

---

## 2. Color — the warm clay palette

The palette is **load-bearing and warm**. Everything lives in a clay / terracotta / walnut / cream family. There is **no blue, teal, or turquoise anywhere** — and crucially, several token *names* are historical leftovers whose *values* are warm browns. `--c-navy` is a deep walnut, not navy. `--c-blue` is a mid clay-brown, not blue. Trust the hex, not the name. Introducing a cool color anywhere breaks the brand.

Miller pins these values under `html[data-brand="miller"]` (defensively, so a stray palette switch can never force a cool accent):

| Token | Hex | Role / where it shows up |
| --- | --- | --- |
| `--c-bg` | `#F7F1E6` | Warm cream. Default page background; the lighter of the two light section surfaces (Trust banner, History, the affiliate band, the nav bar, the mobile drawer). |
| `--c-surface-warm` | `#FBF8F2` | Warm off-white. The **preferred** content-section + card surface (Services, Who-we-serve, Facility, Final CTA). Use this, not pure white, for most light surfaces — it carries a hint of warmth. |
| `--c-surface` | `#FFFFFF` | Pure white. Used sparingly, for cards that need maximum lift off a tinted surface. |
| `--c-ink` | `#2A1B12` | Deep warm brown. Primary text and section titles. |
| `--c-ink-2` | `#5C4937` | Secondary text — leads, body copy, eyebrow labels. |
| `--c-ink-3` | `#736049` | Muted/tertiary text — small captions. (Brand default is `#9C8975`; Miller darkens it for WCAG AA on cream.) |
| `--c-line` | `#E8DCC6` | Hairline borders, dividers, card outlines. |
| `--c-line-2` | `#F0E7D5` | Lighter tint — subtle fills and hover backgrounds. |
| `--c-navy` | `#3B2418` | **Deep walnut** (the primary dark surface). Hero base, footer, dark anchors. |
| `--c-navy-2` | `#4A2F1F` | Lighter walnut — the Careers section, dark-card borders. |
| `--c-blue` | `#6E3D1A` | **Mid clay-brown** (secondary link color on light surfaces). |
| `--c-accent` | `#A85A2C` | **Signature clay / terracotta.** The brand accent — stamps, eyebrow diamonds, CTAs, underlines, hover color, focus ring. Matches the logo. |
| `--c-accent-2` | `#8A4720` | Darker clay — hover state for the solid accent. |
| `--c-amber` | `#D89A3F` | Warm amber/gold — sparing highlight only. |
| `--c-on-navy` | `#F5E6CB` | Warm cream-on-dark. Text/icons on any walnut surface. |

Usage rules: light surfaces use `--c-ink` / `--c-ink-2` / `--c-ink-3` for text and `--c-accent` for emphasis. Dark walnut surfaces use `--c-on-navy` (often dialed to 0.55–0.84 alpha for hierarchy) and `--c-accent` for emphasis; never put `--c-ink` text on a dark surface. The clay accent is a spice, not a base — it appears as marks, single emphasized words, borders, and CTAs, never as large fills.

---

## 3. Typography

Three families, each with one job. Miller binds them over the brand defaults (which are Geist). Fonts are self-hosted via `next/font` in `layout.jsx`.

| Family | Token(s) | Role |
| --- | --- | --- |
| **Barlow Condensed** | `--font-condensed` → `--font-display` | All display: hero, section titles, footer headline, nav links, footer heads, mega-menu items. Set **UPPERCASE**, weight 600–700, tight leading. This condensed civic/industrial face is the single biggest reason the page reads as "Miller". |
| **IBM Plex Sans** | `--font-plex-sans` → `--font-sans` | Body, leads, paragraph copy, buttons. Sentence case, weight 300–600. |
| **IBM Plex Mono** | `--font-plex-mono` → `--font-mono` | Labels, eyebrows, numbers, phone numbers, "article" captions, the bottom legal bar. Uppercase, wide-tracked (0.12–0.22em), `font-variant-numeric: tabular-nums` for stats. |

Geist / Geist Mono remain loaded only as fallbacks for the brand stylesheet's literal `"Geist"` references.

The type scale, as used on the home page:

| Element | Family | Size | Weight / case | Notes |
| --- | --- | --- | --- | --- |
| Hero H1 (`mw-hero__title`) | Condensed | `clamp(56px, 8.5vw, 152px)` | 700, UPPERCASE | line-height **0.78** — deliberately tight, monumental. |
| Section title (`mw-section-title`) | Condensed | `clamp(32px, 3.4vw, 60px)` | 600, UPPERCASE | line-height 1.02, letter-spacing 0.005em, ends with a `.mw-stop` square. |
| Footer headline (`tl-footer__big`) | Condensed | `clamp(38px, 4vw, 64px)` | 600, mixed-case | the one large condensed heading that is **not** uppercased. |
| Lead (`*__lead`) | Plex Sans | `clamp(17px, 1.3–1.4vw, 21px)` | 400 | line-height 1.45–1.55, color `--c-ink-2`, max ~56–60ch. |
| Body | Plex Sans | ~15.5px | 400 | line-height 1.55, color `--c-ink-2`. |
| Small / caption | Plex Sans or Mono | 13–14px | 400–500 | color `--c-ink-3`. |
| Eyebrow (`mw-section-tag`) | Mono | 11–12px | 500, UPPERCASE | letter-spacing 0.18em. |
| Stat numbers | Condensed/Mono | large | — | tabular-nums; pair a big number with a small mono unit + label. |

For non-home / brand-primitive contexts the shared `tl-display--xl|l|m|s` sizes exist (`clamp(56–108px)` down to `clamp(22–30px)`), `tl-lead`, `tl-body`, `tl-small`, `tl-mono`, `tl-eyebrow`. On Miller pages these inherit the condensed/Plex families through the token rebind.

Heading rule of thumb: **condensed + uppercase + tight leading for anything that should feel like a headline; Plex Sans for anything you actually read in sentences; mono for anything that labels, numbers, or tags.**

---

## 4. Space, radius, shadow, container

**Spacing** uses the brand scale `--space-1`…`--space-10` = 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px, all multiplied by `--d-scale` (density). `--section-y` = 96px at regular density. In practice Miller sections use `padding-block: clamp(56px, 5.5vw, 100px)` (Services is taller at `clamp(68px, 7vw, 124px)`); section headers carry `margin-bottom: clamp(48px, 5vw, 96px)`.

**Content width.** The home page uses a wider measure than the brand default: every home section, the hero, the topbar, and the footer wrap their content in `width: min(100% - 48px, 1560px); margin-inline: auto` — that is the `.mw-inner` helper. The brand `.tl-container` is capped at 1280px and is used on non-home/brand layouts. For new home-family sections, wrap content in `.mw-inner` so the gutters line up with everything else.

**Radius.** Tokens `--radius-xs|s|m|l|xl` = 4 / 6 / 10 / 14 / 22px exist, but Miller's editorial language is **squared**: buttons (`mw-cta`, the repainted nav/footer CTAs), the mega-menu/dropdown panels, and the menu button all use `border-radius: 0` to echo the stamp motif. Cards use a small radius (cert/affiliation/location cards = 12px). **Pills are not part of Miller's look** — the shared `tl-btn` is a 999px pill in the brand baseline, but every Miller instance is repainted to a squared rectangle. Prefer crisp rectangles + the clay stamp over rounded shapes.

**Shadow.** Tokens `--shadow-soft` and `--shadow-card` exist; Miller cards lean on warm, tight drop shadows like `0 18px 36px -22px rgba(42,27,18,0.28)` — low-spread, warm-tinted, never a generic gray blur.

---

## 5. Signature motifs

These small, repeated details are what make the page feel authored. Reuse them; don't invent parallel decorations.

1. **The clay square "stamp" / period.** A small filled terracotta square set on the text baseline as a full stop after display headings. `.mw-stop` (0.16em) closes section titles; `.mw-hero__stop` (0.18em) closes the hero. It is the core brand mark. Reproduce by appending `<span className="mw-stop" aria-hidden="true" />` to the end of a heading.
2. **The rotated diamond eyebrow mark.** The same square, rotated 45° into a diamond, sits before every section's eyebrow label (`.mw-section-tag-mark`, 8px clay). The footer eyebrow, footer column heads, and mega-menu hover bullet all reuse this diamond. It is how a section announces itself.
3. **The 49° paper-grain wash.** A near-invisible `repeating-linear-gradient(49deg, …)` texture overlaid on section backgrounds — terracotta-on-warm at ~3–4% alpha on light surfaces, cream-on-walnut at ~2% on dark. It gives surfaces a faint "document paper" texture and quietly ties sections together. The 49° angle is a nod to TransLine49.
4. **Numbered "article" framing.** Items and cards carry zero-padded numbers (`01`, `02`, …) in mono; the hero carries a small mono caption (`mw-hero__article`). The whole page is composed to read like a numbered document/dossier, not a generic marketing scroll.
5. **The "→" arrow.** A mono right-arrow trails CTAs and forward links (`tl-btn-arr`, or an inline `<span aria-hidden="true">→</span>`). It's the standard "go" affordance.
6. **The chain-of-custody hairline.** A 1px vertical clay gradient line in the hero — a thin terracotta thread that reinforces the "documented chain from dock to disposal" story.

---

## 6. Core primitives & components

Open and build sections from these. Class names are the Miller (`mw-*`) versions used on the home page.

**Eyebrow tag** — `mw-section-tag` containing `mw-section-tag-mark` (the diamond) + `mw-section-tag-label` (mono uppercase). Use `mw-section-tag-label--invert` for the cream variant on dark surfaces. Every section opens with one.

**Section header** — `mw-section-head` (a grid with generous bottom margin) holds: eyebrow → `mw-section-title` (+ trailing `mw-stop`) → lead paragraph. A single key phrase in the title is often emphasized in clay via a `*__title-em` span.

**CTAs.**
- Editorial (in page sections): `mw-cta mw-cta--solid` = clay background, white text, squared, Plex Sans 600, ~18×28px padding, lifts `translateY(-1px)` and darkens to `--c-accent-2` on hover. `mw-cta mw-cta--ghost` = transparent with a thin border, used for the **24/7 emergency phone** as a stacked block (`mw-cta__sup` small mono label over `mw-cta__num` tabular number).
- Chrome/utility: the shared `tl-btn` family (`--primary`, `--ghost`, `--ghost-light`, `--dark`, `--lg`) is used where brand markup expects it (nav, footer, forms). On Miller these are repainted squared-clay — same markup, Miller look. **Don't add a third button style.**

**Cards.** Light card = `--c-surface-warm` + `1px solid --c-line` + radius 12 + a tight warm shadow. Dark card = `--c-navy` + `--c-on-navy` text + `--c-navy-2` border. Accent borders (a 2px clay edge on one side) mark active/hover-revealed cards.

**Interactive accents** (all are client components, all pause under `prefers-reduced-motion`): `HeroPhraseCycle` (the hero's cycling word, with an accent-tone variant), `SectorStatCycle` (rotating stat with a progress-dot row), `FacilityGallery` (thumbnail switcher with crossfade), `HistoryTimeline` (hover-reveal milestone cards alternating across a center spine). These are the sanctioned flavor of interactivity — restrained, single-purpose, accessible.

---

## 7. Section rhythm (page composition)

The home page alternates **dark walnut anchors** against a family of **warm light surfaces**, with the clay accent and 49° grain as connective tissue. The order and surfaces:

| # | Section | Surface | Tone |
| --- | --- | --- | --- |
| 1 | Hero | `--c-navy` + darkened photo | dark |
| 2 | Trust (certifications band) | `--c-bg` cream, thin | light |
| 3 | Services (bento grid) | `--c-surface-warm` | light |
| 4 | Who we serve | `--c-surface-warm` | light |
| 5 | Facility (VBEC) | `--c-surface-warm` | light |
| 6 | Our history (timeline + stats + mission) | `--c-bg` cream | light |
| 7 | Careers | `--c-navy-2` walnut | dark |
| 8 | Affiliates marquee | `--c-bg` cream, thin band | light |
| 9 | Final CTA | `--c-surface-warm` | light |

To add or convert a section so it slots into this rhythm: wrap content in `.mw-inner`; pick a surface token consistent with its neighbors (a long light run is fine — dark anchors are used as deliberate punctuation, e.g. hero and careers); open with an eyebrow → title (+ stop) → lead; reach for the existing primitives before inventing; and wire scroll-reveal (§9). Two adjacent dark sections or a jarring surface jump break the cadence — avoid them.

---

## 8. Header & footer (finished chrome)

**Header (`TopNav`, repainted from `tl-topbar`).** A fixed **cream** bar (`--c-bg`, `1px --c-line` bottom border) sitting below the emergency banner. Logo + condensed-uppercase wordmark on the left, centered condensed-uppercase nav in the middle, phone + squared-clay "Contact" CTA + hamburger on the right. Behaviors that are part of the design: it **collapses** past the hero (`data-scroll-state="past-hero"` → bar slides to top, inner height 76px → 56px, banner hides); the brand mark **swaps** from a diamond-framed maple leaf to the Miller logomark as the hero mark scrolls behind it; nav links carry a **clay underline that wipes in** (`scaleX(0→1)`) on hover/active; the **Services** item opens a 2-column mega-menu and the others open dropdowns (cream panel, 2px clay top border, diamond bullet that slides in on hover); mobile is a full-height cream drawer with big numbered condensed links, a clay-underline accent, and `inert` when closed.

**Footer (`SiteFooter`, repainted from `tl-footer`).** A warm **dark walnut** close (`--c-navy`) with a **3px clay top border** and the 49° grain. Layout: a pitch column (mono diamond eyebrow → condensed headline with a clay-emphasized fragment → lede → Contact + 24/7 CTAs) beside three link columns (Services / Company / Locations + Office). Column heads are condensed uppercase with a short 2px clay underline; links are condensed with a clay underline that wipes in on hover and recolor to clay. Below: the shared **FamilyOfCompanies** strip (cross-links the sibling brands, current one marked clay) and a mono, wide-tracked bottom legal bar. All inner content is capped at the same 1560px measure.

Header and footer are **done** — match their type, spacing, colors, and interaction grammar when building anything new; don't redesign them.

---

## 9. Motion

**The reveal.** One keyframe, `mw-rv`: opacity 0→1 with a 12px upward settle, `320ms cubic-bezier(.22,.61,.36,1)`. Any element that should animate in on scroll gets `data-reveal`; a container whose direct children should stagger gets `data-reveal-stagger` (children trail by `--reveal-order * 60ms`, set per column by `components/MillerScrollReveal.jsx`, which flips `data-in="1"` via IntersectionObserver). This is the **only** scroll-in motion — don't add bespoke entrance animations. Sprinkle `data-reveal` on cards, headers, and list groups.

**Micro-interactions.** Hover lifts are a small `translateY(-1px)`; emphasis is a clay underline wiping in with `scaleX`; transitions sit in the 120–320ms range on ease / `cubic-bezier(.2,.7,.2,1)`. Keep motion subtle and functional.

**Reduced motion is mandatory.** Every animation on the page has a `@media (prefers-reduced-motion: reduce)` branch that disables it (reveals snap to visible, cycles freeze on their first item). Any new animation **must** ship its reduced-motion off-switch in the same change.

---

## 10. Accessibility baseline

The home page meets these; new work must too (this aligns with the repo's accessibility-guard skill).

- **Focus:** `:focus-visible` shows a 2px clay outline at 3px offset. Never remove a focus ring without an equally visible replacement.
- **Semantics & landmarks:** real `header` / `nav` / `main` / `footer`; each `section` is labelled (`aria-labelledby` to its heading, or `aria-label`). Use `<button>`/`<a>` for interactive elements, not click-bound divs.
- **Contrast:** the tuned tokens exist for a reason — `--c-ink-3` is darkened on Miller, dark surfaces use `--c-on-navy` (≥0.55 alpha) for AA. Don't reach below those for body text.
- **Live regions:** cycling/auto-changing text mirrors its current value into a `tl-sr-only` `aria-live="polite"` node (see `HeroPhraseCycle` / `SectorStatCycle`).
- **Imagery:** decorative images get `alt=""` + `aria-hidden`; meaningful images get real `alt`. Icon-only buttons get `aria-label`.
- **Keyboard:** the mobile drawer uses `inert` when closed; menus close on Escape and outside-click; tab order is logical.
- **Skip link:** `tl-skip` to `#main` is present in the shell — keep it.

---

## 11. Authoring checklist (new or converted pages)

Do:
- Open every section with the eyebrow (diamond + mono label) → condensed uppercase title (+ `mw-stop`) → Plex Sans lead.
- Wrap section content in `.mw-inner` (1560 cap, 24px gutters).
- Use the warm surfaces (`--c-bg` / `--c-surface-warm`) and the `--c-navy`/`--c-navy-2` dark anchors; keep the light/dark cadence sensible.
- Use `mw-cta` (squared) in body sections, the repainted `tl-btn` in chrome/forms; trail CTAs with the `→`.
- Reuse the stamp, diamond, 49° grain, and numbered framing motifs.
- Wire `data-reveal` / `data-reveal-stagger`, and ship a reduced-motion branch for anything new that moves.
- Keep numbers/labels/eyebrows in mono with tabular-nums; keep headlines condensed-uppercase; keep reading copy in Plex Sans.
- Verify in a browser with Playwright and **look at the screenshots** before calling it done (per repo testing norms).

Don't:
- Introduce any blue/teal/turquoise, or read `--c-navy`/`--c-blue` as cool — they're warm browns.
- Add rounded pills, gray generic shadows, or a third button style.
- Put Miller-only styling on a bare `tl-*` selector (scope under `html[data-brand="miller"]` or make an `mw-*` class).
- Invent new entrance animations, decorations, or eyebrow treatments when a motif already exists.
- Redesign the header or footer.

---

## 12. Applying this to TransLine49

TL49 already shares the clay palette (`data-palette="clay"`), so the **color system is common** — keep it warm there too. The gaps to close to bring a TL49 page to this baseline: it currently uses Geist (`data-type="utility"` default) rather than Barlow Condensed + IBM Plex, and it has no editorial `mw-*` layer (it renders straight from the brand package). To match: adopt the condensed-uppercase-display / Plex-body / mono-label type system, and reproduce the motifs and section grammar above. Because `mw-*` classes are Miller-namespaced, replicate the patterns for TL49 either by promoting the truly shared pieces into the brand package as new `tl-*` primitives, or by adding a TL49-scoped equivalent — don't reach across and apply `mw-*` to TL49. The goal is that a visitor moving between the two sites feels one design language with two brands.

---

*Keep this file in sync with the Miller home page. If you intentionally evolve a pattern there, update the relevant section here in the same change so the baseline never drifts from the code.*
