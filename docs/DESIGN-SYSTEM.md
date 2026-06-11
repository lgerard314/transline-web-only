# Design system — the locked baseline

This is the canonical design/style guide for **both** apps in this monorepo (`apps/miller-web` and `apps/transline49-web`). There are now **two finished reference pages**, and new work should match them:

1. **The Miller home page** (with its header `TopNav` and footer `SiteFooter`) — the canonical for the **overall language** and for top-level/marketing sections. The header and footer are the finished chrome for every page.
2. **The Miller emergency-response service page** (`/industrial-services/emergency-response`) — the canonical for **interior & service pages**. It is the first fully-built interior page in the new look and demonstrates the locked interior rules (§12) end to end: the light "alert" hero, the response timeline, the two-column head + photo-card grid, the selectable hover-swap gallery, the dark dispatch CTA, and the shared related-services rail. See §13 for the section-by-section map.

Every other page that gets built or converted should match these two. New sections will still get designed, but they must be composed from the tokens, type, motifs, and patterns recorded here so they sit seamlessly next to the references.

Read this before redesigning any page. When something here conflicts with what you find in code, **the code on the two reference pages wins** (the home page for language/marketing sections, the emergency-response page for interior/service patterns) — and this doc should be updated to match in the same change.

The authoritative source files (read these when you need exact values):

| Concern | File |
| --- | --- |
| Shared tokens, `tl-*` primitives, palettes, type pairings, density, buttons, cards, layout | `apps/brand/styles/globals.css` |
| Miller CSS entry point — `@import` barrel + table of contents only, **no rule blocks** | `apps/miller-web/app/globals.css` |
| Miller palette/type overrides + every `mw-*` component + chrome repaint + scroll-reveal, split into 9 layered partials (`01-tokens` → `09-service-project-management`) | `apps/miller-web/app/styles/*.css` |
| Fonts loaded, `<html>` data-attributes, page shell | `apps/miller-web/app/layout.jsx` |
| Home page markup (section order, components) | `apps/miller-web/app/(home)/page.jsx` (a thin composition of `components-v2/06_sections` templates fed by `lib/content/template-testing-home.js` — no per-route `sections/`) |
| Header markup + behavior | `apps/miller-web/components/TopNav.jsx` |
| Footer markup | `apps/miller-web/components/SiteFooter.jsx` |
| Shared components (Marquee, FamilyOfCompanies) | `apps/brand/components/` |
| **Interior/service reference** — page markup, section order, every `mw-svc-*` interior pattern | `apps/miller-web/app/industrial-services/emergency-response/page.jsx` + `sections/` |
| Interior section components (timeline, gallery, related rail, contact form) | `apps/miller-web/components/{ResponseTimeline,TimelineNotifyCycle,CoverageGallery,RelatedServices,ContactForm}.jsx` |
| Service-page copy (one file per service page) | `apps/miller-web/lib/content/service-emergency-response.js` |

---

## 1. Architecture: shared brand package + per-app overrides

Both sites render through one shared package, `@white-owl/brand`. It owns the vocabulary: design tokens, the `tl-*` primitive classes (`tl-display`, `tl-btn`, `tl-card`, `tl-eyebrow`, `tl-container`, …), the layout shell, the Marquee and FamilyOfCompanies components, and the base reset. Its stylesheet (`apps/brand/styles/globals.css`) is imported first in each app's `layout.jsx`.

Theme is selected with data-attributes on `<html>`. Miller and TransLine49 both set `data-palette="clay" data-type="utility" data-density="regular"`. Miller additionally sets `data-brand="miller"`, which is the hook for all of Miller's overrides.

Each app then layers its own `globals.css` (imported second, so it wins on equal specificity). For Miller this entry file is a thin `@import` barrel over 9 layered partials under `app/styles/` (`01-tokens` → `09-service-project-management`), ordered tokens → primitives → chrome → home → service pages; **never add rule blocks back into the barrel**. New shared utility → `02-primitives.css`; new chrome → `03-chrome.css`; a net-new service page with its own blocks → a new `10-service-<slug>.css` plus one `@import`. Miller's overrides do three things, and nothing else should be added that doesn't fit one of these buckets:

1. **Re-binds tokens** for the warm clay palette and Miller's type families, scoped to `html[data-brand="miller"]`.
2. **Repaints shared `tl-*` chrome** (topbar, mobile nav, footer, buttons) via `html[data-brand="miller"] .tl-…` selectors — the markup stays shared, the look becomes Miller's.
3. **Adds net-new components** that only Miller uses, namespaced `mw-*` (or `miller-*` for the emergency banner).

TransLine49 currently has **no** per-app override file — it renders straight from the brand package with the default Geist type. Bringing a TL49 page to this baseline means adopting the type system and editorial motifs below (see §14).

**Namespacing rule:** `tl-*` = shared/brand, reused by both apps. `mw-*` = Miller-only. Never put Miller-specific styling on a bare `tl-*` selector in the brand package; scope it under `html[data-brand="miller"]` in Miller's file, or make a new `mw-*` class.

---

## 2. Color — the warm clay palette

The palette is **load-bearing and warm**. Everything lives in a clay / terracotta / walnut / cream family. There is **no blue, teal, or turquoise anywhere** — and crucially, several token *names* are historical leftovers whose *values* are warm browns. `--c-navy` is a deep walnut, not navy. `--c-blue` is a mid clay-brown, not blue. Trust the hex, not the name. Introducing a cool color anywhere breaks the brand.

**Sanctioned exceptions — third-party marks keep their official colours.** The no-blue rule governs everything *you* author: backgrounds, UI, type, accents, and graded photography. Third-party marks render in their real brand colours and are not "mistakes to fix": the **blue ISO 9001 / 14001 / 45001 certification seals** in the Trust band are intentional and load-bearing — the cool accent is what keeps the all-clay strip from going flat, so do not recolour or warm-grade them — and the **affiliate/partner logos** in the marquee likewise keep their official colours. These are the only cool colours allowed on the page.

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
3. **The 49° paper-grain wash.** A near-invisible `repeating-linear-gradient(49deg, transparent 0 38px, <grain> 38px 39px)` texture overlaid on section backgrounds. Its color is a **single global token per surface tone**, not a per-section choice — `--c-grain-on-light` (`rgba(168,90,44,0.03)`, terracotta) on every light surface and `--c-grain-on-dark` (`rgba(245,230,203,0.025)`, cream) on every walnut surface — so the texture reads identically across all sections. New sections **must** reference those two tokens and never hand-pick a one-off alpha (a one-off value is what once made one dark section's lines visibly heavier than its neighbors'). It gives surfaces a faint "document paper" texture and quietly ties sections together; the 49° angle is a nod to TransLine49.
4. **Numbered "article" framing.** Items and cards carry zero-padded numbers (`01`, `02`, …) in mono; the hero carries a small mono caption (`mw-hero__article`). The whole page is composed to read like a numbered document/dossier, not a generic marketing scroll.
5. **The "→" arrow.** A mono right-arrow trails CTAs and forward links (`tl-btn-arr`, or an inline `<span aria-hidden="true">→</span>`). It's the standard "go" affordance.
6. **The chain-of-custody hairline.** A 1px vertical clay gradient line in the hero (`.mw-hero::after`, at `clamp(20px, 3vw, 60px)`) — a thin terracotta thread that reinforces the "documented chain from dock to disposal" story. (A page-long scroll-drawn version of this was trialled and removed: bound to scroll progress it read as a redundant second scrollbar against the browser's own. If the motif is ever extended past the hero, decouple it from scroll position — e.g. in-flow custody nodes stamped at real section boundaries — so it documents *stages*, not scroll percentage.)
7. **The unified photographic grade.** Every photograph wears one warm "LUT" — a single `--mw-photo-grade` filter token (`saturate(0.9) contrast(1.05) sepia(0.1) brightness(1.01)`) that calms over-saturated shots, adds a little contrast to flat ones, and pulls cool/neutral images toward the clay palette, so the imagery reads as one art-directed set instead of mixed stock. It is applied **only to photographic layers** (hero, bento tiles, sector cards, facility gallery, careers bleed) and **never** to logos, the blue ISO seals, affiliate marks, social icons, or the truck/vector graphics — those keep their true colour (§2). It is non-destructive (a CSS `filter`, no asset edits); tune the whole page from the one token in `04-home.css`.
8. **Hairline rules.** Decorative divider/separator rules — the cert-band dividers, the statement-band and scale-band dividers, the facility "spec row" rules — are **0.5px** hairlines in `--c-line` for a fine, refined finish. Structural and interactive borders (cards, buttons) stay **1px** so they hold their 3:1 contrast. On dark surfaces the hairline alpha is nudged up slightly so 0.5px stays visible.

---

## 6. Core primitives & components

These are the visual primitives the design is built from. On miller-web they are now packaged as the **`components-v2` template library** — you compose pages from `06_sections` templates rather than hand-assembling these classes (see `apps/miller-web/components-v2/README.md` and the live catalog at `/template-gallery`). The class vocabulary below still describes what those templates render and is the reference when building or extending a template. Class names are the Miller (`mw-*`) versions used on the home page.

**Eyebrow tag** — `mw-section-tag` containing `mw-section-tag-mark` (the diamond) + `mw-section-tag-label` (mono uppercase). Use `mw-section-tag-label--invert` for the cream variant on dark surfaces. Every section opens with one.

**Section header** — `mw-section-head` (a grid with generous bottom margin) holds: eyebrow → `mw-section-title` (+ trailing `mw-stop`) → lead paragraph. A single key phrase in the title is often emphasized in clay via a `*__title-em` span.

**CTAs.**
- Editorial (in page sections): `mw-cta mw-cta--solid` = clay background, white text, squared, Plex Sans 600, ~18×28px padding, lifts `translateY(-1px)` and darkens to `--c-accent-2` on hover. `mw-cta mw-cta--ghost` = transparent with a thin border, used for the **24/7 emergency phone** as a stacked block (`mw-cta__sup` small mono label over `mw-cta__num` tabular number).
- Chrome/utility: the shared `tl-btn` family (`--primary`, `--ghost`, `--ghost-light`, `--dark`, `--lg`) is used where brand markup expects it (nav, footer, forms). On Miller these are repainted squared-clay — same markup, Miller look. **Don't add a third button style.**

**Cards.** Light card = `--c-surface-warm` + `1px solid --c-line` + radius 12 + a tight warm shadow. Dark card = `--c-navy` + `--c-on-navy` text + `--c-navy-2` border. Accent borders (a 2px clay edge on one side) mark active/hover-revealed cards.

**Interactive accents** (the `05_widgets` layer — all client components, all pause under `prefers-reduced-motion`): `PhraseCycle01` (the hero's cycling word, with an accent-tone variant), `StatCycle01` / `SectorStatCycle` (rotating stat with a progress-dot row), `ThumbGallery01` (thumbnail switcher with crossfade), `HoverCard01` (hover-swap photo card), `VerticalTimeline01` (hover-reveal milestone cards alternating across a center spine), `MarqueeBand01` (logo marquee), `CountUp01` (a figure that counts from 0 to its target on scroll-in; see §9). These are the sanctioned flavor of interactivity — restrained, single-purpose, accessible. See them all at `/template-gallery/widgets`. The page-level service interactives (`ResponseTimeline`, `CoverageGallery`, `RelatedServices`, `ContactForm`, `LiteYouTube`) are wrapped by `06_sections` templates — drive them through the template, don't fork them.

---

## 7. Section rhythm (page composition)

The home page alternates **dark walnut anchors** against a family of **warm light surfaces**, with the clay accent and 49° grain as connective tissue. The order and surfaces:

| # | Section | Surface | Tone |
| --- | --- | --- | --- |
| 1 | Hero | `--c-navy` + graded photo | dark |
| 2 | Trust (certifications band) | `--c-bg` cream, thin | light |
| 3 | Statement band ("creed") | `--c-surface-warm` | light |
| 4 | Services (bento grid) | `--c-surface-warm` | light |
| 5 | Scale band (signature count-up) | `--c-navy-2` walnut | dark |
| 6 | Who we serve | `--c-surface-warm` | light |
| 7 | Facility (VBEC) | `--c-surface-warm` | light |
| 8 | Our history (timeline + stats + mission) | `--c-bg` cream | light |
| 9 | Careers | `--c-navy-2` walnut | dark |
| 10 | Affiliates marquee | `--c-bg` cream, thin band | light |
| 11 | Final CTA | `--c-surface-warm` | light |

The dark anchors (hero #1, scale band #5, careers #9) are evenly spaced punctuation across the long light run — that spacing is deliberate; don't cluster them or place two dark sections adjacent.

**Two editorial section types carry the rhythm** (both `06_sections/statements/*`): the **statement band** (`StatementBand01`, `mw-creed`) is a quiet, photo-free typographic interlude — an oversized condensed statement (with `mw-stop` and a clay-emphasised phrase) beside one crescendo stat — dropped between dense grids to let the page breathe; the **scale band** (`ScaleBand01`, `mw-scale`) is the page's single dramatic moment — a full-bleed walnut field with a hero-scale `CountUp01` figure and a quiet supporting trio. Use at most **one** scale band per page, and don't let a stat it owns (e.g. the lifetime tonnage) reappear as a headline figure elsewhere on the same page.

Standard content sections share one vertical rhythm — `padding-block: clamp(64px, 6.5vw, 112px)` — so spacing stays uniform; the dense Services grid (7vw) and the dramatic Scale band (8vw) run slightly more generous on purpose. Keep new sections on the shared value unless they are a deliberate special case — a section padded noticeably more than its neighbours reads as an empty outlier, not as "air."

On miller-web you assemble this rhythm by **composing `06_sections` templates** in a thin `page.jsx`, each fed a `content` object (see `components-v2/README.md`). To add or convert a section so it slots in: reach for an existing `06_sections` template first (`/template-gallery`); pick a surface consistent with its neighbors (a long light run is fine — dark anchors are deliberate punctuation); the template already handles `.mw-inner`, the eyebrow → title (+ stop) → lead opening, and scroll-reveal (§9). Templates may carry backwards-compatible variants — e.g. `HoverCardGrid01` drops its stat cycle and collapses to a single-column header when no `stats` are supplied. Only when no template fits do you extend one (a backwards-compatible config knob) or add a new `*-02` template — never hand-build a bespoke section into the route. Two adjacent dark sections or a jarring surface jump break the cadence — avoid them.

---

## 8. Header & footer (finished chrome)

**Header (`TopNav`, repainted from `tl-topbar`).** A fixed **cream** bar (`--c-bg`, `1px --c-line` bottom border) sitting below the emergency banner. Logo + condensed-uppercase wordmark on the left, centered condensed-uppercase nav in the middle, phone + squared-clay "Contact" CTA + hamburger on the right. Behaviors that are part of the design: it **collapses** past the hero (`data-scroll-state="past-hero"` → bar slides to top, inner height 76px → 56px, banner hides); the brand mark **swaps** from a diamond-framed maple leaf to the Miller logomark as the hero mark scrolls behind it; nav links carry a **clay underline that wipes in** (`scaleX(0→1)`) on hover/active; the **Services** item opens a 2-column mega-menu and the others open dropdowns (cream panel, 2px clay top border, diamond bullet that slides in on hover); mobile is a full-height cream drawer with big numbered condensed links, a clay-underline accent, and `inert` when closed.

**Footer (`SiteFooter`, repainted from `tl-footer`).** A warm **dark walnut** close (`--c-navy`) with a **3px clay top border** and the 49° grain. Layout: a pitch column (mono diamond eyebrow → condensed headline with a clay-emphasized fragment → lede → Contact + 24/7 CTAs) beside three link columns (Services / Company / Locations + Office). Column heads are condensed uppercase with a short 2px clay underline; links are condensed with a clay underline that wipes in on hover and recolor to clay. Below: the shared **FamilyOfCompanies** strip (cross-links the sibling brands, current one marked clay) and a mono, wide-tracked bottom legal bar. All inner content is capped at the same 1560px measure.

Header and footer are **done** — match their type, spacing, colors, and interaction grammar when building anything new; don't redesign them.

---

## 9. Motion

**The reveal.** One keyframe, `mw-rv`: opacity 0→1 with a 12px upward settle, `320ms cubic-bezier(.22,.61,.36,1)`. Any element that should animate in on scroll gets `data-reveal`; a container whose direct children should stagger gets `data-reveal-stagger` (children trail by `--reveal-order * 60ms`, set per column by `components/MillerScrollReveal.jsx`, which flips `data-in="1"` via IntersectionObserver). This is the **only** scroll-in motion — don't add bespoke entrance animations. Sprinkle `data-reveal` on cards, headers, and list groups.

**The hero entrance (home).** The home hero is the one place that earns a bespoke, cinematic load choreography — it's above the fold and plays once. Three moves, all CSS, all in `04-home.css`: (1) a **slow push-in** on the photo (`mw-hero-zoom`, `scale(1.18)→1.06` over 2.4s) that settles 6% zoomed to leave parallax headroom; (2) a **kinetic type reveal** — each headline line is wrapped in `.mw-hero__line` (`overflow:hidden`) over `.mw-hero__line-in` that rises from `translateY(116%)` (`mw-hero-rise`), the three lines staggered 0.45/0.57/0.69s; (3) the mark, lead, and CTAs **fade up** after (`mw-hero-fade`). This entrance is hero-only — interior heroes use the standard reveal.

**Scroll parallax (home).** The hero photograph drifts at a fraction of scroll speed for cinematic depth. `components/MillerParallax.jsx` reads `[data-parallax]` (the hero photo wrap carries `data-parallax-speed="0.16"`) and writes a `translate3d` per frame (rAF-coalesced, passive listener, GPU-composited — no layout/paint). The parallax transform lives on the **wrap** (which overhangs the hero ±14% and is clipped by it) while the zoom lives on the inner photo, so the two transforms never fight; the drift is clamped to the headroom so a hard edge is never exposed. Use parallax sparingly and subtly — depth, not spectacle.

**Micro-interactions.** Restrained and slow — a few, well-chosen. Card lifts are a small `translateY` eased over ~420ms (`cubic-bezier(.2,.7,.2,1)`); photo tiles scale gently (~1.03, 600–1200ms) and brighten on hover; the **clay underline-draw** — a 1px clay rule that sweeps in from the left with `scaleX(0→1)` over ~420ms — is the standard hover/focus emphasis for both nav links and editorial text links (`mw-fac2__about`, the mission link). Simple state changes (colour, border) sit in the 180–320ms range. High-end reads as *slow and few*, not fast and many.

**Count-up.** The scale band's hero figure counts from 0 to its value once it scrolls into view (`CountUp01` — IntersectionObserver + `requestAnimationFrame`, easeOutCubic, written straight to the DOM node so there are **no per-frame React re-renders**; tabular figures so the width never jitters). The animating digits are `aria-hidden`; a `tl-sr-only` span carries the final value so screen readers announce it once, never the ticking intermediates.

**Reduced motion is mandatory.** Every animation has a `@media (prefers-reduced-motion: reduce)` branch that disables it: reveals snap to visible, cycles freeze on their first item, the count-up renders its final value immediately, the underline-draws appear instantly, and the hero entrance (zoom, kinetic type, fades) and scroll parallax are switched off (the hero renders settled). Any new animation **must** ship its reduced-motion off-switch in the same change. (Verified: under `prefers-reduced-motion: reduce` the hero line-in and parallax wrap both compute to no transform.)

**Pinned (scroll-jacked) sections — landscape only.** Sections that freeze full-screen while scroll scrubs a choreography (the who-we-serve framing pause, the lifetime-reel auto-draw) are a **landscape desktop/tablet signature, never a portrait behavior** — on portrait the frozen 100vh band strands large empty surfaces and hijacks touch scrolling. The locked pattern: gate the pin on `(min-width: 721px) and (orientation: landscape) and (min-height: <what the composition needs>) and (prefers-reduced-motion: no-preference)`, and mirror the same gate in the section's JS (`canPin`) so pin-state classes can never fire without the CSS pin (home/sectors.css + sector-diamonds-04.jsx and home/lifetime.css + lifetime-reel-01.jsx are the worked references). Everywhere the pin is off, the section **flows at natural height** with its own padding — and flowing surfaces need an explicit in-panel content inset (in pinned mode the JS centers content; in flow mode a panel edge and the content start can coincide and glue the eyebrow to the container edge; see the flow-mode inset block in home/lifetime.css). Hover-dependent choreography (spotlights, gathers) must be media-gated off any surface where a TAP would trigger it via sticky `:hover` on a re-flowed layout; tap-to-select stands in on touch. **Un-pinning is not de-animating:** scroll-tied life (background zoom/parallax drifts, draw-ins, reveals) should survive on flowing surfaces as a lighter scroll scrub — e.g. the lifetime map zooms 1→1.2 and drifts with the section's viewport travel on every non-pinned viewport (flow-mode bg effect in `lifetime-reel-01.jsx`, drift capped to the zoom's crop headroom). Only the home hero is ever full-viewport-height on portrait. Flow-surface scrubs are specified as **motion contracts** — progress source plus start/end anchors written as exact geometric events ("complete when the section bottom meets the viewport bottom", "when the band is fully visible"), with per-item slices spread across the full runway so assembly lands AT the anchor frame, never early — and must be *perceptible* where the eye actually is (an effect on a near-invisible layer, or completing below the fold, counts as missing). The full translation process, approved narrow-surface vocabulary, and worked recipes live in **`docs/RESPONSIVE-PLAYBOOK.md` — read it before any responsive/viewport work.**

---

## 10. Accessibility baseline

The home page meets these; new work must too (this aligns with the repo's accessibility-guard skill).

- **Focus:** `:focus-visible` shows a 2px clay outline at 3px offset. Never remove a focus ring without an equally visible replacement.
- **Semantics & landmarks:** real `header` / `nav` / `main` / `footer`; each `section` is labelled (`aria-labelledby` to its heading, or `aria-label`). Use `<button>`/`<a>` for interactive elements, not click-bound divs.
- **Contrast:** the tuned tokens exist for a reason — `--c-ink-3` is darkened on Miller, dark surfaces use `--c-on-navy` (≥0.55 alpha) for AA. Don't reach below those for body text.
- **Live regions:** cycling/auto-changing text mirrors its current value into a `tl-sr-only` `aria-live="polite"` node (see `PhraseCycle01` / `StatCycle01`).
- **Imagery:** decorative images get `alt=""` + `aria-hidden`; meaningful images get real `alt`. Icon-only buttons get `aria-label`.
- **Keyboard:** the mobile drawer uses `inert` when closed; menus close on Escape and outside-click; tab order is logical.
- **Skip link:** `tl-skip` to `#main` is present in the shell — keep it.

---

## 11. Authoring checklist (new or converted pages)

Do:
- **Compose from the `components-v2` templates first** (miller-web): build the page as a thin `page.jsx` ordering `06_sections` templates fed by `content` (see `components-v2/README.md`; browse `/template-gallery`). Extend a template only via a backwards-compatible config knob, or add a new `*-02` template when the DOM diverges — and run `npm run template-map` + Playwright-verify affected pages before/after any template change. The visual rules below are what those templates already embody.
- Open every section with the eyebrow (diamond + mono label) → condensed uppercase title (+ `mw-stop`) → Plex Sans lead.
- Wrap section content in `.mw-inner` (1560 cap, 24px gutters).
- Use the warm surfaces (`--c-bg` / `--c-surface-warm`) and the `--c-navy`/`--c-navy-2` dark anchors; keep the light/dark cadence sensible.
- Use `mw-cta` (squared) in body sections, the repainted `tl-btn` in chrome/forms; trail CTAs with the `→`.
- Reuse the stamp, diamond, 49° grain, and numbered framing motifs.
- Wire `data-reveal` / `data-reveal-stagger`, and ship a reduced-motion branch for anything new that moves.
- Keep numbers/labels/eyebrows in mono with tabular-nums; keep headlines condensed-uppercase; keep reading copy in Plex Sans.
- Verify in a browser with Playwright and **look at the screenshots** before calling it done (per repo testing norms) — and for responsive work, follow the **component-walk protocol in the root `CLAUDE.md` ("How to verify responsive work")**: every component of the section judged per viewport with measured assertions, in-between widths included (~430, 600–720, portrait tablets, and a fine-pointer responsive-mode window), "looks a bit off" treated as a bug, and touch emulated with `isMobile`/`hasTouch`. For the design half — translating a desktop section to smaller surfaces in the first place — `docs/RESPONSIVE-PLAYBOOK.md` is the mandatory pre-read.
- Mind the type floor on portrait: section display titles should scale UP on phones/portrait tablets (≈34–50px at 390–720, wrapping to 3–4 lines is welcome), card titles ≥ ~22px, body ≥ 14px — the desktop clamps' floors are usually too timid for a phone where the headline IS the section's opening statement.

Don't:
- Introduce any blue/teal/turquoise, or read `--c-navy`/`--c-blue` as cool — they're warm browns.
- Add rounded pills, gray generic shadows, or a third button style.
- Put Miller-only styling on a bare `tl-*` selector (scope under `html[data-brand="miller"]` or make an `mw-*` class).
- Invent new entrance animations, decorations, or eyebrow treatments when a motif already exists.
- Hand-build a bespoke section into a miller route, or edit a shared template's default output without checking its blast radius (`npm run template-map`) and re-verifying every affected page.
- Redesign the header or footer.

---

## 12. Interior & service-page rules (locked)

These govern every non-home page (service pages and other interior pages). The home page is the deliberate exception where noted — it stays the single most powerful page and is not modified to satisfy these.

- **No breadcrumb line in heroes.** Interior heroes open with a single eyebrow (`mw-section-tag`) — never a "Section / Page-name" nav line.
- **One eyebrow per element — zero double/triple eyebrows.** A hero gets one `mw-section-tag`; each content section gets exactly one. Any other mono-uppercase line (e.g. a live-status indicator) must live elsewhere — beside the CTA it reinforces — not stacked with the eyebrow.
- **Heroes are never dark-brown.** Interior heroes use a light surface (`--c-surface-warm`) — the light split-masthead `.mw-svc-hero`. The dark walnut hero is reserved for the home page so it stays the most powerful first impression.
- **The last section before the footer is never dark-brown.** Close on a light surface (cream/`--c-bg`), mirroring the home Final CTA → dark footer transition. Never stack two dark surfaces into the footer.
- **All buttons match a home button — no exceptions.** Use `mw-cta mw-cta--solid` (square clay) or `mw-cta mw-cta--ghost` (stacked phone) in page content, or the repainted `tl-btn` family in chrome/forms. On light surfaces the ghost is recolored exactly like the home Final CTA (ink text + border, clay on hover). Never invent a bespoke button (icon buttons, custom call buttons, etc.). **When two buttons sit together they are always the same height** — the row stretches them to match (`align-items: stretch`, with the ghost's stacked content vertically centered).
- **No `<h1>`–`<h6>` ever has a diamond directly in front of it.** The clay diamond belongs to the eyebrow `<p>` (`mw-section-tag-mark`) and to functional marks (timeline/scale nodes, list-item markers on spans) — never as a decorative prefix on a heading element.
- **Dark-brown sections copy the home Careers ("Join the team") text colors.** Title `#fff`, lead `rgba(250,243,229,0.91)`, body/card text `rgba(250,243,229,0.89)`, eyebrow `--invert` (`rgba(245,230,203,0.72)`), card bg `rgba(245,230,203,0.035)`. Don't reach for `--c-on-navy` at an arbitrary alpha.
- **Photos: one shared border; per-page variety in ratio + overlay.** Every photo uses `.mw-svc-photo` — a `1px --c-line` border plus a thick clay top bar that grows to full width on hover (the Careers card motif; a `.mw-svc-photo--side` variant moves the growing bar to the left edge). Within a single page, no two single-photo sections may share identical styling: vary the **aspect ratio** and the **caption/overlay** (position + color), while keeping the border treatment identical across all of them.
- **Related services is one shared rail everywhere.** Every service page closes with the `RelatedServices` client component (`.mw-rel`) — a horizontal scroll-snap track of uniform landscape cards (compact photo band over a solid `--c-surface` body with the service title in the display font + a two-line summary, the home "who we serve" card pattern), with squared prev/next controls (disabled at the ends, reduced-motion safe) and an "All services" link. It lists every service except the current page; do not hand-roll a per-page related-services grid.

---

## 13. The emergency-response page — the worked interior reference

`apps/miller-web/app/industrial-services/emergency-response/` is the canonical reference for service/interior pages — the interior counterpart to the home page. It puts the §11 authoring checklist and the §12 interior rules into practice. **When building a new service or interior page, open this page (and `/template-gallery`) first and reuse its templates before inventing new ones.** Its copy lives in one file, `lib/content/service-emergency-response.js`; its `page.jsx` is thin composition only, ordering **six `components-v2/06_sections` templates** (no banners). The table maps each worked pattern to the template that now produces it; the `mw-svc-*` classes are what those templates render (Miller interior namespacing).

| # | Template | Pattern it establishes (reuse this) | Key classes / component |
| --- | --- | --- | --- |
| 1 | `ServiceHero01` (heroes) | **Interior "alert" masthead** — the light split hero of §12 (`mw-svc-hero mw-svc-hero--alert`): one eyebrow → condensed title with a clay-emphasized fragment (`*__title-em`) + `mw-stop` → lead → a **same-height** button row pairing a stacked ghost 24/7 phone (`mw-cta--ghost`: small mono `__sup` over tabular `__num`) with a solid clay CTA (`mw-cta--solid` + `→`), plus a bleed photo. Never dark-brown. Config: `media` (photo-bleed/transparent-png/video), `alert`, `photoHalf`, `reveal`, `ghostPhone`. | `.mw-svc-hero`, `.mw-svc-hero--alert` |
| 2 | `ResponseTimeline01` (flows) | **Response timeline (single-clock)** — wraps `ResponseTimeline`, which owns one `index` (a `setInterval`, frozen under reduced motion) driving *both* the cycling notification banners (`TimelineNotifyCycle`) and the axis line-fill (via `data-tl-active` on the `<ol>`), so the two never drift. Eyebrow → title → lead, then a numbered staircase `<ol class="mw-svc-tl">`. | `ResponseTimeline`, `TimelineNotifyCycle`, `.mw-svc-tl` |
| 3 | `PhotoCardGrid01` (grids) | **Two-column head + photo-card grid** — the header splits into a copy column (eyebrow/title/lead; a later title line can go italic via `*__title-em`) and a decorative transparent-PNG image column (`__head-media`, `aria-hidden`). Cards stay **horizontal**: a 4:3 photo half with the card title overlaid on a bottom-up scrim (`mw-svc-ind__name`) beside an **equal-width** white half carrying the **tick marker** (a clay diamond + short hairline, `mw-svc-ind__tick` = `__tick-dot` + `__tick-line`) above a one-line description. On card hover the diamond rotates and the caption weight bumps +100. Config: `cardStyle` (thumb/gallery/wwd/case), `head`, `trailingCta`. | `.mw-svc-inds--photo`, `.mw-svc-ind`, `.mw-svc-ind__tick` |
| 4 | `PickerGallery01` (pickers) | **Selectable hover-swap gallery** — wraps `CoverageGallery`: a list of capabilities on one side and a large photo on the other that swaps on hover/select, with a **default-selected** item (`default: true` in content), a darker-brown phone number (`--c-navy`), and a signature diamond (`mw-svc-cov__cap-mark`) before the big photo's caption. Config: `serve`. | `CoverageGallery`, `.mw-svc-cov` |
| 5 | `DispatchCta01` (callouts) | **Dark dispatch CTA** — the page's single dark-walnut anchor (`mw-svc-cta--dark`, using the home-Careers dark text colors per §12). A dispatch block aligns the logomark to the 24/7 hotline (`__dispatch` / `__dispatch-row` / `__dispatch-logo`) with the "answered by a responder" note beneath, beside a warm cream contact-form card (`ContactForm showOptionalFields={false}`). The card's hover/focus lift lives on a **non-reveal wrapper** (`__form-col` holds `data-reveal`; the inner `__form` does the transform) because `mw-rv`'s fill-mode would otherwise override a hover transform. This dark panel is mid-page punctuation — the light related rail still closes the page. Config: `reverse`. | `.mw-svc-cta--dark`, `.mw-svc-cta__dispatch`, `ContactForm` |
| 6 | `RelatedRail01` (rails) | **Related-services rail** — wraps the shared `RelatedServices` close of §12: a light surface, a horizontal scroll-snap track listing every service except the current one. Don't hand-roll a per-page grid. | `RelatedServices`, `.mw-svc-related-sec` |

Two standing rules this page proves out:

- **Compose the templates (and the interactive components they wrap), don't fork them.** `ResponseTimeline`, `CoverageGallery`, `RelatedServices`, and `ContactForm` are existing, accessible, reduced-motion-safe components wrapped by the templates above. Drive them with new content (`lib/content/<page>.js`); only extend a template (backwards-compatible config) or add a new one when none of the existing patterns fit — see `components-v2/README.md`.
- **A reveal element can't also be a hover-transform element.** Because the `mw-rv` reveal ends at `translate3d(0,0,0)` with `fill: both`, it permanently wins over any `:hover { transform }` on the *same* node. Put `data-reveal` on a wrapper and do the hover lift on an inner non-reveal child (the §5 CTA form and the photo cards both do this).

---

## 14. Applying this to TransLine49

TL49 already shares the clay palette (`data-palette="clay"`), so the **color system is common** — keep it warm there too. The gaps to close to bring a TL49 page to this baseline: it currently uses Geist (`data-type="utility"` default) rather than Barlow Condensed + IBM Plex, and it has no editorial `mw-*` layer (it renders straight from the brand package). To match: adopt the condensed-uppercase-display / Plex-body / mono-label type system, and reproduce the motifs and section grammar above. Use the **same two Miller reference pages** as the target — a TL49 home/marketing page mirrors the Miller home page, and a TL49 interior/service page mirrors the emergency-response page (§13) — so the two sites feel like one design language with two brands. Because `mw-*` classes are Miller-namespaced, replicate the patterns for TL49 either by promoting the truly shared pieces into the brand package as new `tl-*` primitives, or by adding a TL49-scoped equivalent (e.g. a `tl49-*` layer mirroring `mw-*`) — don't reach across and apply `mw-*` to TL49. The `components-v2` template library is **miller-only and not yet promoted to the shared package** — don't import `@/components-v2` into TL49; when TL49 adopts the templates we'll revisit promoting the shared pieces. Until then TL49 stays bespoke.

---

*Keep this file in sync with the Miller home page. If you intentionally evolve a pattern there, update the relevant section here in the same change so the baseline never drifts from the code.*
