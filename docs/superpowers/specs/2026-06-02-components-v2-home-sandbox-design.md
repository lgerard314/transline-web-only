# Design spec — components-v2 home sandbox (`/template-testing`)

- **Date:** 2026-06-02
- **Status:** Approved (design); implementation plan to follow.
- **App:** `apps/miller-web`
- **Scope:** Planning + sandbox only. No production route, page, section, or component is modified.

## 1. Goal

Build an Elementor-style composition ladder under `apps/miller-web/components-v2/` and use it to recreate the current Miller home page on a new sandbox route, `/template-testing`. The sandbox must be **100% aesthetically identical** to `/` on the dev server — same look, feel, and animations — while being built from an entirely new component layer (different "backend build", identical output).

This is an architecture experiment: we are testing whether a layered ladder (items → blocks → widgets → sections → page) with a clean config-vs-content prop split can reproduce the locked Miller design without duplicating the design system.

## 2. Success criteria

1. Visiting `/template-testing` renders all nine home blocks, in order, with content equivalent to `/`.
2. **Visual + behavioral parity with `/`** — including scroll-reveal motion, the hero phrase cycle, the sector stat cycle, hover-swap galleries/cards, the hover-open history timeline, the affiliate marquee, and the TopNav collapse + leaf→logomark swap.
3. **Zero diffs on existing production routes/components.** Only new files and one new route are introduced.
4. Parity is the goal. Must-match: tokens, typography, motifs, section rhythm, animation timing, DOM structure. May-defer (call out if it occurs): sub-pixel timeline alignment that depends on lazy-image reflow timing.
5. Verification includes a dev-server check and a side-by-side screenshot/interaction pass on `/template-testing` (new test file only).

## 3. Hard constraints

- **Do not modify, delete, or move any existing file** anywhere in the repo, except new files created for this experiment.
- **Do not refactor** existing pages, sections, templates, or components (`app/(home)/`, `components/`, `components/templates/`, etc.).
- All new UI lives under `apps/miller-web/components-v2/` with nested folders by composition level.
- The only new route is `/template-testing`.
- Reuse existing content read-only (import only); copy into a new v2 content file only where the source is not importable.
- Reuse existing CSS classes/tokens (`mw-*`, design tokens) read-only. Any v2-specific CSS lives in new files only.
- `@white-owl/brand` package is out of scope to change. The TransLine49 app is out of scope.

## 4. Why parity is mostly inherited (verified)

The new route does **not** need to re-wire the design system. Everything that produces the "look and feel" is mounted globally in the **root** `app/layout.jsx` and applies to every route, including `/template-testing`:

- **CSS** — `app/layout.jsx` imports `@white-owl/brand/styles/globals.css` then `./globals.css`, whose barrel `@import`s all nine partials (`01-tokens` … `09-…`), including `04-home.css`. Every `mw-*` class and token is therefore available on the new route with no per-route import.
- **Scroll-reveal** — `<MillerScrollReveal />` is mounted in the root `<body>` and re-scans the whole document (`[data-reveal], [data-reveal-stagger] > *`) on every route change via `usePathname()`. Any v2 markup carrying the same `data-reveal` / `data-reveal-stagger` attributes animates identically, with no per-route mount and no re-implementation of the motion engine.
- **Chrome** — TopNav, SiteFooter, and EmergencyBanner come from the root layout. There is **no** `app/(home)/layout.jsx`, so the home route and the sandbox route share the exact same shell.
- **TopNav hero behavior** — TopNav locates the hero with `document.querySelector("main > section:first-of-type, .mw-hero, .tl-hero")` and the logo swap with `document.querySelector(".mw-hero__mark")`. Because the v2 hero emits `<section class="mw-hero">` as the first section in `<main>` and reproduces the `.mw-hero__mark` element, the nav collapse and leaf→logomark swap trigger identically — again, no wiring.

### The single hard rule that makes this work

**v2 components must emit byte-identical DOM with zero extra wrapper elements.** Each component returns the same tag/fragment the original markup produces — same class names, same `data-reveal` placement, same attribute set. A gratuitous wrapping `<div>` would break two things at once: the reveal driver's direct-child selector `[data-reveal-stagger] > *`, and its row-grouping stagger geometry (which measures each stagger child's bounding box). React components achieve this by returning fragments and the original element — composition adds files, not DOM.

## 5. Folder tree (Approach C: flat L0/L1, folder-per-component L2/L3)

```
apps/miller-web/
  components-v2/
    items/                       L0 — flat .jsx; primitives with a stable shared mw-* class
      eyebrow-01.jsx
      stop-period-01.jsx
      stop-text-01.jsx
      action-arrow-01.jsx
      nobr-01.jsx
      num-token-01.jsx
      cta-solid-01.jsx
      cta-ghost-phone-01.jsx
    blocks/                      L1 — flat .jsx; the repeated .map() sub-units
      head-intro-01.jsx
      cert-card-01.jsx
      service-anchor-01.jsx
      service-card-01.jsx
      service-tile-01.jsx
      figure-stat-01.jsx
      cap-item-01.jsx
      plate-stat-01.jsx
      mission-block-01.jsx
      milestone-item-01.jsx
      careers-card-01.jsx
      social-link-01.jsx
    widgets/                     L2 — folder-per-component; "use client" where interactive
      phrase-cycle-01/index.jsx
      sector-card-01/index.jsx
      stat-cycle-01/index.jsx
      gallery-thumb-01/index.jsx
      timeline-vertical-01/index.jsx
      marquee-band-01/index.jsx
    sections/                    L3 — folder-per-component; full section templates
      hero-01/index.jsx
      certs-banner-01/index.jsx
      services-01/index.jsx
      services-01/service-order.js     (recreated ordering helper; not "use client")
      sectors-01/index.jsx
      facility-01/index.jsx
      history-01/index.jsx
      careers-01/index.jsx
      affiliates-banner-01/index.jsx
      final-cta-01/index.jsx
    styles/                      reserved; expected to stay EMPTY (see §10)
  app/
    template-testing/
      page.jsx                   L4 — thin orchestrator (metadata + ordered sections)
  lib/content/
    template-testing-home.js     NEW — copied inline arrays only (see §9)
```

Naming: every component carries a `-01` version suffix so future variants (`hero-02`, etc.) can sit beside the original without renames. L2/L3 are folders (`index.jsx` + co-located helper/CSS/contract); L0/L1 are single files.

## 6. Prop-contract convention (config vs content)

Every component separates **config** (scheme / layout / ids / className / behavior flags) from **content** (strings, arrays, images). Content is passed as named fields; config fields default to values that reproduce the current home page exactly, so a component rendered with content only is pixel-identical. Config exists to make the ladder reusable later — it is never required for parity.

Convention: content fields are top-level named props; config fields are optional named props with parity defaults. (No nested `cfg` object is required at runtime; "config vs content" is a documentation/contract distinction, kept explicit in each component's header comment.)

## 7. Component inventory — L0 items

Each emits exactly the element the original markup uses.

- **`eyebrow-01`** — section eyebrow. Content: `label`. Config: `invert=false` (adds `mw-section-tag-label--invert` for dark surfaces), `reveal=false` (adds `data-reveal`). Emits `<p class="mw-section-tag" aria-hidden="true"><span class="mw-section-tag-mark"/><span class="mw-section-tag-label[ --invert]">{label}</span></p>`.
- **`stop-period-01`** — clay stamp period. Config: `variant="title"` → class map `title→mw-stop`, `hero→mw-hero__stop`, `colon→mw-stop-colon`. Emits `<span class={cls} aria-hidden="true"/>`.
- **`stop-text-01`** — recreates `StopText`: glues the stamp to the last word with a `mw-nobr` wrapper. Content: `children` (text). Config: `stopClassName="mw-stop"`. Pure render, server-safe.
- **`action-arrow-01`** — the `→` affordance. No props. Emits `<span aria-hidden="true">→</span>`.
- **`nobr-01`** — no-wrap wrapper. Content: `children`. Emits `<span class="mw-nobr">{children}</span>`.
- **`num-token-01`** — zero-padded mono number. Content: `n`. Config: `className` (context class, e.g. `mw-svcs-tile__num`), `ariaHidden=false`. Emits `<span class={className}[ aria-hidden]>{String(n).padStart(2,"0")}</span>`.
- **`cta-solid-01`** — primary CTA. Content: `href`, `children`. Config: `external=false`, `ariaLabel`. Emits `<Link class="mw-cta mw-cta--solid">` (internal) or `<a target="_blank" rel="noopener noreferrer" class="mw-cta mw-cta--solid">` (external).
- **`cta-ghost-phone-01`** — stacked 24/7 phone. Content: `sup`, `num`, `href`, `ariaLabel`. Emits `<a href class="mw-cta mw-cta--ghost" aria-label><span class="mw-cta__sup">{sup}</span><span class="mw-cta__num">{num}</span></a>`.

## 8. Component inventory — L1 blocks, L2 widgets, L3 sections

### L1 blocks (root class in parentheses)

- **`head-intro-01`** (`mw-section-head`) — canonical eyebrow→title→lead header. Content: `eyebrow`, `title` (node), `intro`. Config: `headingId`, `stagger=true` (`data-reveal-stagger`). Used by `services-01`; the bespoke headers of other sections are composed inside their own section template.
- **`cert-card-01`** (`mw-cert`) — certification download card. Content: a `cert` record (`{ slug, name, href, sizeKB, mark, long, year }`). Emits the `<a class="mw-cert" download role="listitem">` with prefix/num/desc/pdf, reproducing the ISO/COR display logic.
- **`service-anchor-01`** (`mw-svcs-anchor`), **`service-card-01`** (`mw-svcs-card`), **`service-tile-01`** (`mw-svcs-tile`, with `external` variant → `mw-svcs-tile--external` + raw `<a>`). Content: a `service` record + `num` + (for the title) the two-line split. Each composes `num-token-01` and `action-arrow-01`.
- **`figure-stat-01`** (`mw-fac2__fig`) — facility figure (label + number + unit). Content: `label`, `num`, `unit`.
- **`cap-item-01`** (`mw-fac2__caps-item`) — facility capability (num + name). Content: `n`, `name`.
- **`plate-stat-01`** (`mw-ten3__plate-stat`) — history truck-plate stat (value/unit + label). Content: `num`, `unit`, `label`.
- **`mission-block-01`** (`mw-ten2__mission`) — history mission block (heading + paragraphs + link). Content: `paragraphs[]`, `cta`.
- **`milestone-item-01`** (`mw-ten3__milestone`) — single timeline milestone; consumed by `timeline-vertical-01`. Content: `item` (`{ year, title, body }`), `index`. Config: `side` ("left"/"right"), `active`.
- **`careers-card-01`** (`mw-careers__card`) — culture/hiring card (tag + title + text + link). Content: `tag`, `title`, `text`, `cta`.
- **`social-link-01`** (`mw-final__social`) — social icon link. Content: `label`, `href`, `path` (SVG path d).

### L2 widgets (folder-per-component)

Recreated verbatim from the existing client components, preserving DOM, classes, timings, the `tl-sr-only` `aria-live` mirror, and the `prefers-reduced-motion` freeze-on-first-item behavior:

- **`phrase-cycle-01`** (`mw-hero__cycle`) — cycling hero word; `interval=4160` ms; longest-phrase sizer; accent-tone variant. "use client".
- **`sector-card-01`** (`mw-sec2__card`) — hover/focus row swaps the photo above. "use client".
- **`stat-cycle-01`** (`mw-stat-cycle`) — rotating stat; `interval=5500` ms; per-dot progress fill. "use client".
- **`gallery-thumb-01`** (`mw-fac2__media`) — main photo + thumbnail switcher; crossfade via `key`. "use client".
- **`timeline-vertical-01`** (`mw-ten3__milestones`) — vertical zigzag; one open milestone at a time; no collapse on mouse-leave. Composes `milestone-item-01`. "use client".
- **`marquee-band-01`** (`mw-marquee`) — the home affiliate band framing (label + row) that wraps the brand `Marquee` track. **Decision:** imports `Marquee` from `@white-owl/brand/components` (a brand-package primitive, treated like `mw-*` CSS — not a home-page component, and the brand package is out of scope to change). Not re-implemented.

### L3 sections (folder-per-component) — root class and composition

- **`hero-01`** (`mw-hero`) — composes the `.mw-hero__mark`, `phrase-cycle-01`, `stop-period-01` (hero variant), `cta-solid-01`, `cta-ghost-phone-01`. Reproduces `.mw-hero__photo`, `.mw-hero__lead`, `.mw-hero__foot`, `.mw-hero__article`.
- **`certs-banner-01`** (`mw-trust` / `mw-certs`) — maps `CERTS` → `cert-card-01`; carries `data-reveal-stagger`.
- **`services-01`** (`mw-services`) — `head-intro-01` + the bento grid (`service-anchor-01`, `service-card-01` ×2, `service-tile-01` ×N + external tile). Includes a recreated `service-order.js` (the `HOME_FIRST` ordering + `splitTitle` + `homeServiceOrder` logic, copied — these are inline helpers in the original section file).
- **`sectors-01`** (`mw-sec2`) — `eyebrow-01` + split head with `stat-cycle-01` + `sector-card-01` ×4.
- **`facility-01`** (`mw-fac2`) — `eyebrow-01` + `stop-period-01`, lead, `figure-stat-01` ×3, `cta-solid-01` + about-link, `gallery-thumb-01`, capability grid of `cap-item-01` ×7.
- **`history-01`** (`mw-ten3`) — `timeline-vertical-01`, `eyebrow-01`, truck-plate of `plate-stat-01` ×3, `mission-block-01`.
- **`careers-01`** (`mw-careers mw-careers--bleed`) — bleed photo, `eyebrow-01` (invert), title, lead, `careers-card-01` ×2.
- **`affiliates-banner-01`** (`mw-marquee`) — `marquee-band-01`.
- **`final-cta-01`** (`mw-final`) — truck/logo columns, `eyebrow-01`, `stop-text-01` title, body, `cta-solid-01`, `cta-ghost-phone-01`, divider, `social-link-01` ×5.

## 9. Composition map (page block → section template → composed parts)

| # | Page block | Section template | Composes |
|---|---|---|---|
| 1 | Hero | `hero-01` | phrase-cycle-01 · cta-solid-01 · cta-ghost-phone-01 · stop-period-01 |
| 2 | Certs banner | `certs-banner-01` | cert-card-01 ×N |
| 3 | Services | `services-01` | head-intro-01 · service-anchor/card/tile · num-token-01 · action-arrow-01 |
| 4 | Who we serve | `sectors-01` | eyebrow-01 · stat-cycle-01 · sector-card-01 ×4 |
| 5 | Facility / VBEC | `facility-01` | eyebrow-01 · stop-period-01 · figure-stat-01 ×3 · cap-item-01 ×7 · gallery-thumb-01 · cta-solid-01 |
| 6 | History | `history-01` | timeline-vertical-01 (milestone-item-01) · plate-stat-01 ×3 · mission-block-01 · eyebrow-01 |
| 7 | Careers | `careers-01` | eyebrow-01(invert) · careers-card-01 ×2 |
| 8 | Affiliates | `affiliates-banner-01` | marquee-band-01 |
| 9 | Final CTA | `final-cta-01` | eyebrow-01 · stop-text-01 · cta-solid-01 · cta-ghost-phone-01 · social-link-01 ×5 |

## 10. Content sourcing (import vs copy)

| Source | Strategy | Used by |
|---|---|---|
| `@/lib/services` (`SERVICES`) | import read-only | services-01 |
| `@/lib/certs` (`CERTS`) | import read-only | certs-banner-01 |
| `lib/content/brand.js` (`EMERGENCY_PHONE`, `VBEC_SHORT`, `OVER_25_YEARS`) | import read-only | hero-01, facility-01, final-cta-01, page metadata |
| `app/(home)/home.js` (`HOME`: vbec / mission / joinFamily / finalCta) | import read-only | facility-01, history-01, careers-01, final-cta-01 |
| `SECTOR_STATS`, `SECTOR_CARDS`, `FACILITY_PHOTOS`, `MILESTONES`, `AFFILIATES`, `SOCIALS`, `HOME_FIRST` | **copy** into new `lib/content/template-testing-home.js` | sectors-01, facility-01, history-01, affiliates-banner-01, final-cta-01, services-01 |

The copied set are inline, non-exported `const`s inside the original section files; importing them would require editing those files, which the constraints forbid. Importing (reading) the exported sources does not modify them and is preferred per the brief.

## 11. CSS strategy

Reuse all `mw-*` classes and tokens read-only. Because parity requires identical class names, **the expected new-CSS count is zero**. `components-v2/styles/` and an optional `app/template-testing/template-testing.css` are reserved; if an unavoidable v2-only rule ever appears, it goes into a **new** file there and is flagged at review — existing partials are never edited.

## 12. Client-widget fidelity checklist

For each recreated `"use client"` widget: identical DOM/classes; identical interval (`4160` phrase, `5500` stat); identical default-open/closed state (timeline opens nothing on mount; sector card defaults to index 0; gallery to index 0); `tl-sr-only` + `aria-live="polite"` mirror present; `prefers-reduced-motion` branch freezes on the first item / disables the interval (matching the originals).

## 13. Risks

- **Extra-wrapper DOM drift** breaking `[data-reveal-stagger] > *` and stagger geometry → mitigated by the §4 no-wrapper rule (fragments, return the original element).
- **Client-timing drift** → copy exact intervals and verify the reduced-motion freeze.
- **Cross-route content coupling** to `app/(home)/home.js` → acceptable for a sandbox; documented.
- **`Marquee` source** → resolved: import the brand primitive (§8).
- **TopNav hero detection** → satisfied by emitting `.mw-hero` + `.mw-hero__mark`; verified in §4 but re-checked in the parity pass.

## 14. Phased rollout

- **P0** — route + `lib/content/template-testing-home.js` + all L0 items; confirm `/template-testing` renders inside chrome.
- **P1** — `hero-01` end-to-end (incl. `phrase-cycle-01`) + stand up the side-by-side screenshot harness; prove the pattern and the parity rule on one section.
- **P2** — static sections: `certs-banner-01`, `services-01`, `facility-01` shell, `careers-01`, `affiliates-banner-01`, `final-cta-01` (via L1 blocks).
- **P3** — remaining client widgets (`sector-card-01`, `stat-cycle-01`, `gallery-thumb-01`, `timeline-vertical-01`) + `sectors-01`, facility gallery wiring, `history-01`.
- **P4** — full-page parity pass: side-by-side `/` vs `/template-testing` at three widths + interaction/animation check; document any intentional deferrals.

## 15. Verification

- Dev server renders `/template-testing` with no console errors.
- New Playwright spec (`apps/miller-web/tests/template-testing.spec.js` — new file only; existing smoke tests untouched) captures `/template-testing` at three widths and exercises the interactive widgets; screenshots are reviewed by eye against `/`.
- Confirm `git status` shows only new files + the one new route (no diffs on existing files).
