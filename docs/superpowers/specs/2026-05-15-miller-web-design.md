# Miller Environmental web rebuild — design spec

> **Repo path:** `apps/miller-web/` (Next.js 16 + React 19, JSX)
> **Sibling app:** `apps/transline49-web/`
> **Source-of-truth content:** [`docs/superpowers/miller-scrape/`](../miller-scrape/)
> **Draft status:** **v3 — final.** Round-1 and round-2 critiques live in
> [`docs/superpowers/agent-teams/`](../agent-teams/). Disposition of every
> round-2 item recorded in §12. Phase plans live in `miller-web-phase-NN.md`
> companions.

## Goal

Rebuild https://www.millerenvironmental.ca as a Next.js 16 App Router app under
`apps/miller-web/`, preserving every route and verbatim copy from the scrape,
while extending the **TransLine49° design system** (shipped in
`apps/transline49-web/`) so Miller reads as the **senior** brand it actually
is — not as a TL49 re-skin.

## Non-goals
- Re-writing copy. Verbatim port from the scrape; minor case/punctuation tidy only.
- Backend integrations (form submit, CMS, search). Forms behave as in TL49:
  client-side state, on-submit confirmation.
- Animated stats counters. **The `StatsBand` section is removed entirely** —
  the live site shows `0+` because of broken CMS, and the round-2 reviewers
  agreed a "Data unavailable" placeholder reads worse than no section at all.
- Renaming `tl-*` CSS classes to `wo-*`. See later in this list.
- ~~Migrating WordPress media~~ — **resolved.** 83 images downloaded from the
  live site to `apps/miller-web/public/miller/` on 2026-05-15 (see
  `_manifest.md`). Phase 02 onward references real local paths via
  `lib/photos.js`; no Unsplash dependency. The original Miller logomark
  ships from phase 01.
- ~~Case-study detail and individual job-posting pages are stub routes~~ —
  **resolved.** All 4 case-study detail pages (Brandon Power, Grain Elevator,
  Highway 16 diesel, Steinbach mall fire) and both job postings (Plant
  Manager, Enterprise Automation Manager) were scraped in the same pass.
  They now ship as **full content routes** from phase 03 onward — see
  scrape files 26-31 in `docs/superpowers/miller-scrape/`.
- Class-name rename `tl-*` → `wo-*`. Round-2 reviewers correctly flagged
  this as vanity at high risk: 144 unique class tokens across 19 files, plus
  `@keyframes`, plus `data-tlgrid*` attributes, plus the shipped iOS-Safari
  cache-bust commit. The shared package keeps the historical `tl-`
  vocabulary; both apps consume it. One-line comment in the shared package
  documents the origin.

---

## 1. Architecture

### 1.1 Repo position

The package goes to **`apps/brand/`**, not `apps/shared/brand/`. The
existing workspaces glob (`apps/*` in the root `package.json`) is **not
recursive** — it would not pick up `apps/shared/brand/`. Relocating to
`apps/brand/` is one less moving part than rewriting the glob.

```
<repo root>/
├── apps/
│   ├── transline49-web/         existing
│   ├── miller-web/              NEW — this spec
│   └── brand/                   NEW — @white-owl/brand package
├── package.json                 workspace root — scripts updated
├── eslint.config.mjs            NEW — hoisted from per-app
└── docs/superpowers/…
```

Workspace-root `package.json` scripts:
```json
"scripts": {
  "dev": "npm run dev:tl49",
  "dev:tl49": "npm run dev --workspace=transline49-web",
  "dev:miller": "npm run dev --workspace=miller-web",
  "build": "npm run build --workspaces --if-present",
  "start": "npm run start --workspace=transline49-web",
  "lint": "eslint apps/**/*.{js,jsx,mjs}"
}
```

### 1.2 `@white-owl/brand` — `apps/brand/`

Source-shipped (no build step). Consumer's SWC transpiles JSX + CSS at
build time. Avoids dual-package hazard, dist/sync, ESM/CJS interop.

`apps/brand/package.json`:
```json
{
  "name": "@white-owl/brand",
  "version": "0.1.0",
  "private": true,
  "exports": {
    "./styles/globals.css": "./styles/globals.css",
    "./components": "./components/index.js",
    "./tweaks": "./tweaks/index.js"
  },
  "peerDependencies": {
    "next": "^16",
    "react": "^19",
    "react-dom": "^19"
  }
}
```

`peerDependencies` (not `dependencies`) is load-bearing — two React copies
on a future `npm install` would cause "Invalid hook call".

#### Both consuming apps require:

In `next.config.mjs`:
```js
transpilePackages: ["@white-owl/brand"]
```
(Without this, Next 16 refuses to compile JSX from a workspace package.)

In `app/layout.jsx`:
```js
import "@white-owl/brand/styles/globals.css";
```
(No CSS `@import` — Next 16's CSS pipeline doesn't `@import` from `node_modules`
packages cleanly.)

In `package.json` `dependencies`:
```json
"@white-owl/brand": "*"
```
(Symlink resolution fails silently otherwise.)

#### Intra-package imports must be relative.

`@/` alias inside the shared package resolves to the **consumer's** root and
breaks. No exceptions.

#### ESLint hoisted to repo root.

`<repo root>/eslint.config.mjs` runs `eslint apps/**/*.{js,jsx,mjs}`. The
existing per-app config at `apps/transline49-web/eslint.config.mjs` is
deleted. Per-app `lint` scripts are removed; only the root `npm run lint`
exists. IDE plugins (VS Code) auto-discover the root flat config.

#### Tweaks panel gated to non-production at import site.

```js
// apps/<app>/app/layout.jsx
{process.env.NODE_ENV !== "production" && <SiteTweaksProvider />}
```
That's render-site gating which leaves the bundle. To get a true zero-KB
production payload, the import itself is gated:
```js
const SiteTweaksProvider =
  process.env.NODE_ENV !== "production"
    ? (await import("@white-owl/brand/tweaks")).SiteTweaksProvider
    : null;
```
Done at the top of layout.jsx as a top-level await; Next 16 supports it in
server components. Production bundle has zero `tweaks/` references.
Phase-1 verification: `grep -r "twk-" .next/static/chunks/` after a prod
build returns nothing.

#### Exports

| Export | Source | Notes |
| ------ | ------ | ----- |
| `./styles/globals.css` | `apps/brand/styles/globals.css` | Design tokens, base, `tl-*` component selectors. Lifted verbatim from `apps/transline49-web/app/globals.css`. |
| `./components` | `ParallelRule`, `Marquee`, `SectionHead`, `FAQ`, `TrustBar`, `Icon`, `HeroPhoto`, `PageHero`, `ServiceCard`, `ScrollReveal`, `FormField` | Generic primitives. `ServiceCard` takes `href` so each app supplies its own routes. |
| `./tweaks` | `useTweaks`, `TweaksPanel`, `TweakSection`/`Radio`/`Select`, `SiteTweaksProvider` | Dev-only. Hard-coded localStorage key per app — TL49 uses `tweaks:tl49`, Miller uses `tweaks:miller`. No namespace factory; two separate provider instantiations. |

App-specific components stay per-app:
- TransLine49°: `TopNav`, `SiteFooter`, `Logomark`, `BorderMap`, `ProcessFlow`.
- Miller: `TopNav`, `SiteFooter`, `Logomark`, `EmergencyBanner`,
  `MillerProcessFlow`, `LocationCard`, `CertificationGrid`,
  `AffiliationsGrid`, `CaseStudyCard`.

(`FamilyOfCompanies` cross-link footer module is **deferred to phase 5**
— it requires touching the TL49 footer, the parent group has not provided
final ownership-line copy, and Miller can launch with a normal footer.)

### 1.3 New package — `apps/miller-web/`

```
apps/miller-web/
├── app/
│   ├── layout.jsx              fonts (Geist + Geist Mono only), EmergencyBanner gate, TopNav, Footer, ScrollReveal, SiteTweaksProvider (dev-only)
│   ├── page.jsx                /
│   ├── globals.css             Miller-only overrides
│   ├── industrial-services/
│   │   ├── page.jsx
│   │   ├── customer-waste-collection/page.jsx          compact
│   │   ├── emergency-response/page.jsx                 capabilities
│   │   ├── environmental-remediation-services/page.jsx bespoke (RemediationTemplate)
│   │   ├── industrial-cleaning/page.jsx                compact
│   │   ├── industrial-waste-treatment/page.jsx         capabilities (flagship)
│   │   ├── project-management/page.jsx                 compact
│   │   ├── research-development/page.jsx               capabilities
│   │   ├── specialty-recycling/page.jsx                capabilities
│   │   ├── stewardship/page.jsx                        compact
│   │   └── vacuum-truck/page.jsx                       compact
│   ├── processes/disposal-of-inorganic-oxidizers/page.jsx  (kept as route; not in primary nav — see §2.2)
│   ├── about-us/
│   │   ├── page.jsx
│   │   ├── health-safety/page.jsx
│   │   ├── licencing-information/page.jsx
│   │   ├── professional-affiliations/page.jsx
│   │   ├── quality-assurance/page.jsx
│   │   └── vision-mission-and-core-values/page.jsx
│   ├── treatment-facility/page.jsx
│   ├── winnipeg-service-centre/page.jsx
│   ├── case-studies/{page.jsx,[slug]/page.jsx}
│   ├── careers/
│   │   ├── page.jsx                          CareersTemplate (not IndexTemplate)
│   │   ├── benefits-rewards/page.jsx
│   │   ├── working-at-miller/page.jsx
│   │   └── [position]/page.jsx
│   └── contact-us/{page.jsx,ContactForm.jsx}
├── components/                 see §1.2 list of Miller-specific
├── lib/
│   ├── services.js             10 services, each with { id, slug, title, summary, icon, photo, variant: "compact"|"capabilities"|"bespoke" }
│   ├── nav.js                  primary nav + emergency-banner route allow-list
│   ├── photos.js               Unsplash registry
│   ├── certs.js                ISO + COR cert metadata
│   └── content/                Per-page modules — plain strings + arrays ONLY. No JSX. Inline emphasis stays in templates.
├── public/{logo.png,og.png,certs/}
├── package.json
├── next.config.mjs             transpilePackages: ["@white-owl/brand"]
├── jsconfig.json
└── README.md
```

### 1.4 Routes

- **32 real routes** — the original 26 plus the 4 case-study detail pages
  (`/case-studies/brandon-power-facility/`,
  `…/grain-elevator-remediation-project/`,
  `…/highway-16-diesel-spill-response-remediation/`,
  `…/steinbach-strip-mall-fire-recovery-restoration-project/`) and the 2 job
  postings (`/careers/plant-manager/`,
  `/careers/enterprise-automation-manager/`), all now scraped with full
  content (scrape files 26-31).
- **No stub routes.** Earlier draft assumed case-study and job slugs would
  ship as stubs; the second scrape pass made that unnecessary. Dynamic
  `[slug]` and `[position]` segments are NOT used — each route is a real
  static page with its own content module.

**Total prerendered: 32.**

---

## 2. Information architecture

### 2.1 Three user journeys

- **A — Emergency caller.** Wants the 24/7 number, fast. Solved by
  `EmergencyBanner` on the routes where emergencies originate (§2.4).
- **B — Industrial procurement.** Multi-visit vendor evaluation. Wants ISO
  certifications, VBEC licensure, capability depth, case studies. Solved by
  trust signals above the fold on home + service pages (§3).
- **C — Job seeker.** Wants employer brand, benefits, openings. Solved by a
  dedicated `CareersTemplate` with narrative spine (§3.7).

### 2.2 Primary nav

| Label | URL | Type |
| ----- | --- | ---- |
| Services | `/industrial-services/` | mega-menu, 10 children |
| About | `/about-us/` | dropdown, 5 children |
| Locations | `/treatment-facility/` | dropdown, 2 children |
| Case Studies | `/case-studies/` | direct |
| Careers | `/careers/` | dropdown, 2 children |
| Contact | `/contact-us/` | direct |

**`Processes` is removed from the primary nav.** The single child page
(Disposal of Inorganic Oxidizers) is narratively a specialised operating
detail of Industrial Waste Treatment — the round-2 content critic was right
that a one-item dropdown signals "we ran out of structure." The route
remains at `/processes/disposal-of-inorganic-oxidizers/` (SEO equity
preservation), but its discovery surface moves to a
"Specialised Processes" link block on Industrial Waste Treatment. If R&D
publishes a second process page, the top-level slot can be restored.

### 2.3 Footer

`<SiteFooter>` (Miller-specific): four columns (Services / Company /
Locations / Contact) + social row. The `FamilyOfCompanies` cross-link
strip is deferred to phase 5 (see §1.2).

### 2.4 `EmergencyBanner` — scoped route allow-list

Rendered above `TopNav` only on routes where Journey A originates:
- **Shown:** `/`, all `/industrial-services/*`, `/treatment-facility/`
- **Hidden:** `/about-us/*`, `/careers/*`, `/case-studies/*`, `/contact-us/`,
  `/winnipeg-service-centre/`, `/processes/*`

Banner state persists for the session via cookie (server-readable so SSR
emits the correct initial state and there's no hydration flash). Mobile
collapses to an icon button with
`aria-label="Call 24/7 emergency: (204) 957-6327"`.

### 2.5 Persistent header CTAs

- **General CTA:** "Contact Miller" → `/contact-us/` in `TopNav` right slot.
- Phone (general) `(204) 925-9600` in `TopNav` on ≥md viewports.

---

## 3. Page templates

Six templates + two specials.

### 3.1 `HomeTemplate` — `/`

Sequence (reordered after round-2 content review; VBEC promoted from step 6
to step 4 — procurement journey wants to *see the facility*):

1. **Hero** — carousel (3 photos), headline, subhead, two CTAs (Contact +
   tel:).
2. **Trust strip** — eyebrow line *"The only hazardous waste management
   company in Canada with an integrated management system featuring three
   ISO certifications"* + 4-card `CertificationGrid` (ISO 9001:2015 /
   14001:2015 / 45001:2018 / **MHCA COR 2023**) + "Over 25 Years" tagline.
3. **Services grid — 10 cards** via `ServiceCard`. Reordered:
   Industrial Waste Treatment first (the flagship operating story per the
   round-2 content critic), then Environmental Remediation, then Emergency
   Response, then the rest alphabetical.
4. **Our Facility (VBEC)** — promoted from step 6. Eyebrow names "Vaughn
   Bullough Environmental Centre", 7-capability list from
   `19-location-treatment-facility.md`, CTA to `/treatment-facility/`. The
   eyebrow also tells the *person* story in one line ("named for the
   General Manager who built it"), pointing at the About page for the full
   account.
5. **"For Over 25 Years"** editorial block (verbatim from scrape).
6. **Our Mission** + CTA to Core Values.
7. **"Join The Miller Family"** recruitment block.
8. **Marquee** with the brand refrains.
9. **Final CTA** — emergency phone + Contact Miller.

(Note: the `Statistics` section is **deleted**, not stubbed — see Non-goals.)

### 3.2 `ServiceDetailTemplate` — two variants

Round-2 content critic correctly flagged that 10 service pages with
wildly different copy depths cannot share one template. Two variants
declared in `lib/services.js` and dispatched by the template:

**`compact` variant** (`Customer Waste Collection`, `Industrial Cleaning`,
`Project Management`, `Stewardship`, `Vacuum Truck`):
- `PageHero`.
- One lead paragraph + one or two prose sections.
- Optional bullet list block.
- "Related Services" 3-card rail.

**`capabilities` variant** (`Industrial Waste Treatment` — flagship — plus
`Emergency Response`, `Research & Development`, `Specialty Recycling`):
- `PageHero` with optional CTA row.
- Lead paragraph.
- **Grouped capability sections** — for Treatment, the 6 processing
  categories (Specialty Soil / Inorganic / Liquid Organic / Solid Organic /
  Special Waste / Misc Processing) become collapsible group blocks with
  bullet lists. Other capabilities pages get the same shape with fewer
  groups.
- Inline trust badge near the lead: the "only in Canada" claim verbatim
  (see Deliberate Repetition list in §5.4).
- "Related Services" 3-card rail.

Both variants suppress their own emergency CTA when the sitewide
`EmergencyBanner` is shown on the route (avoids duplication on Remediation
and others).

### 3.3 `RemediationTemplate` — `/industrial-services/environmental-remediation-services/`

Bespoke — the live site's most marketing-driven page:
- `PageHero` + 2 CTAs.
- 6-card "What We Do" grid.
- Industries served bullet list.
- 5-step process — rendered as **`<ol>`** with `<li>` per stage.
- Case-study rail (4 cards).
- "Why Choose Miller" 4-card grid.
- Callback form (`FormField` from shared; on submit-with-errors,
  programmatically focus the first invalid input).

### 3.4 `ProcessTemplate` — `/processes/disposal-of-inorganic-oxidizers/`

`PageHero` + 4-card highlights + descriptive prose + `FAQ` + CTA.

### 3.5 `AboutTemplate` — `/about-us/` + 5 sub-pages

- `PageHero`.
- Prose + lists.
- `/about-us/` includes a dedicated **"The Vaughn Bullough story"** section
  preserving the renaming-announcement framing from `13-about.md`: Bullough
  joined as GM in 1997, the facility was renamed for him by President & CEO
  Blair McArthur. VBEC is a person, not just an acronym.
- `/about-us/quality-assurance/` hero `lead` = the verbatim *"only
  hazardous waste management company in Canada with an integrated management
  system featuring three ISO certifications"*. `CertificationGrid` renders
  beneath the lead.
- `/about-us/licencing-information/`: cert/license cards declare
  `{ name, code, href, sizeKB }`; link text formats as
  `"VBEC Processing Facility Operating Licence · PDF, 0.2 MB"`.
- `/about-us/professional-affiliations/`: 10-card `AffiliationsGrid`. TL49
  entry is a real cross-link.
- `/about-us/vision-mission-and-core-values/`: 4-card core-values grid.

### 3.6 `LocationTemplate` — `/treatment-facility/`, `/winnipeg-service-centre/`

- `PageHero` with facility imagery. Treatment-facility hero headline
  includes the full **"Vaughn Bullough Environmental Centre"** name with a
  one-line "named for…" subhead.
- Address card with `<iframe>` to
  `https://www.google.com/maps?...&output=embed` (`loading="lazy"`,
  `referrerPolicy="no-referrer-when-downgrade"`).
- Capabilities list.
- Contact card.

### 3.7 `CareersTemplate` — `/careers/` (not `IndexTemplate`)

Round-2 content critic flagged that a bare card grid for two job openings
reads as "we are not hiring." Real narrative spine:
- `PageHero`.
- "Why Miller" 4-card with the four core values (Respect / Empowerment &
  Accountability / Teamwork / Healthy Work Environment).
- "Open Positions" — 2 cards linking to the stub `[position]/page.jsx`.
- Benefits teaser (links to `/careers/benefits-rewards/`).
- DEI block (verbatim from `24-careers-working-at-miller.md`).
- "Send your resume to hr@millerenvironmental.mb.ca" close.

`/careers/benefits-rewards/` and `/careers/working-at-miller/` keep
`AboutTemplate` (prose + lists).

### 3.8 `IndexTemplate` — `/case-studies/` only

`PageHero` + 4-card grid linking to stub detail routes.

### 3.9 `ContactTemplate` — `/contact-us/`

`PageHero` + 3 cards (Phone / Office / Project Intake — the third is the
24/7 number, replacing the suppressed banner) + single-step form.

---

## 4. Visual language

### 4.1 Palette

Shared `globals.css` defines five `[data-palette]` themes. Miller's default
is **`deep`** with **full token override** so it doesn't render on TL49's
warm cream:

```css
[data-palette="deep"] {
  --c-bg: #F2F4F6;
  --c-surface: #FFFFFF;
  --c-ink: #0A1620;
  --c-ink-2: #2B3C48;
  --c-ink-3: #6B7C88;
  --c-line: #DCE3E8;
  --c-line-2: #E8EEF2;
  --c-navy: #06141B;
  --c-blue: #0E3A4D;
  --c-accent: #2EBFA5;
  --c-amber: #E3A857;
  --c-on-navy: #E6EEF2;
}
```

### 4.2 Eyebrow motif

TL49's `ParallelRule` encodes the 49°N motif (cross-border iconography
Miller doesn't share). Round-2 pragmatist + skeptic both flagged the
`motif="parallel-49"|"cert-tick"|"vbec-coord"` enum as architecture for
brand decoration — overbuilt for two brands.

**Resolution:** `ParallelRule` does not take a prop. CSS selectors gate the
motif by `data-brand` on the consumer's `<html>` element:
```css
[data-brand="miller"] .tl-parallel__tick::before { content: "✓"; }
```
TL49 sets `data-brand="tl49"`, Miller sets `data-brand="miller"`. Adding a
third brand later is one more CSS rule, not a new component API.

### 4.3 Typography — production ships two families, period

Production loads **Geist + Geist Mono only.** The lazy-load-alternate-fonts
mechanism from v2 is dropped — round-2 skeptic was right that dynamic
`@font-face` injection in a Next 16 RSC app is unproven in this stack and
not worth the foot-gun.

Alternate families (Newsreader, Manrope, Funnel Display, JetBrains Mono)
exist only in `npm run dev` and only when the env flag
`NEXT_PUBLIC_FONTS=all` is set. The dev `<head>` reads:
```jsx
{process.env.NEXT_PUBLIC_FONTS === "all" && (
  <link rel="stylesheet" href={GOOGLE_FONTS_FULL_HREF} />
)}
```
Production never includes the link. Designers preview alternates via
`NEXT_PUBLIC_FONTS=all npm run dev:miller` locally.

Preload only Geist 400 + Geist Mono 400.

### 4.4 Photography — local, real

`lib/photos.js` registers **local paths under `/miller/<dir>/<file>`**, served
from `apps/miller-web/public/miller/` (83 files, 11 MB, downloaded from the
live site on 2026-05-15 — see `public/miller/_manifest.md`). No external
CDN, no domain config.

**`next/image` IS used** — local files make the image domain story trivial.
Each `<HeroPhoto>` accepts `{ src, alt, width, height, priority? }` and
emits `next/image` with `priority` on first-paint slots (home hero, page
heroes for the LCP route).

Fallback gradient is no longer needed for "Unsplash 404" — local files
don't disappear. The `fallbackBg` prop is dropped from `<HeroPhoto>`.

### 4.5 Miller-specific components

- **`EmergencyBanner`** — `<aside role="region" aria-label="24-hour emergency contact">` with `tel:` link followed by dismiss button. Cookie-gated SSR initial state. Sticky with reserved height + `dvh` units for iOS Safari address-bar resilience. See §6, §7.
- **`MillerProcessFlow`** — 5-step Assessment → Containment → Excavation → Treatment → Verification timeline used on Remediation. Renders as `<ol>`.
- **`LocationCard`** — homepage locations cross-link + dropdown.
- **`CertificationGrid`** — 4-card display (ISO 9001 / 14001 / 45001 / MHCA COR 2023). Each card links to a real PDF; link text
  `"ISO 9001:2015 certificate · PDF, 0.3 MB"`.
- **`AffiliationsGrid`** — 10-card org grid.
- **`CaseStudyCard`** — used on Remediation + Case Studies.

### 4.6 Carousel — concrete CSS spec

Round-2 pragmatist asked for a concrete sketch. Three stacked layers, one
animation, holds frame 1 for 3s of a 12s cycle, reduced-motion freezes:

```css
.tl-hero__carousel { position: relative; }
.tl-hero__frame { position: absolute; inset: 0; opacity: 0; animation: tl-carousel 12s linear infinite; }
.tl-hero__frame--1 { animation-delay: 0s; }
.tl-hero__frame--2 { animation-delay: -8s; }
.tl-hero__frame--3 { animation-delay: -4s; }

@keyframes tl-carousel {
  0%, 25% { opacity: 1; }   /* hold 3s (= 25% of 12s) */
  33%, 92% { opacity: 0; }
  100% { opacity: 1; }       /* fade back in just before next cycle */
}

@media (prefers-reduced-motion: reduce) {
  .tl-hero__frame { animation: none; }
  .tl-hero__frame--1 { opacity: 1; }
  .tl-hero__frame--2, .tl-hero__frame--3 { display: none; }
}
```
Frame 1 has `fetchpriority="high"`; frames 2 + 3 are `loading="lazy"`.

### 4.7 Animation

ScrollReveal inherits from shared. **Honours
`@media (prefers-reduced-motion: reduce)`** — no observer attached, all
elements rendered visible.

---

## 5. Implementation rules

### 5.1 Stack
- **JSX (not TSX).** Match TL49.
- **Server components by default.** Client islands: `TopNav`,
  `EmergencyBanner`, `FAQ`, `ContactForm`, `RemediationCallback`,
  `ScrollReveal`, `SiteTweaksProvider` + panel (dev-only).
- **Content lives in `lib/content/`.** **Plain strings + arrays only.** No
  JSX inside content modules — if inline `<strong>` is needed, it lives in
  the template, not the content. Round-2 pragmatist flagged that a content
  layer that allows JSX becomes components-in-disguise and loses the
  "templates render plain data" guarantee.

### 5.2 Don't ship invented numbers
- StatsBand section is deleted.
- ISO cert hrefs that resolve to `"#"` are forbidden at lint time
  (eslint `no-restricted-syntax`) and grep-checked on `lib/certs.js` in CI.

### 5.3 Maps
- `<iframe>` to Google Maps embed URL. `loading="lazy"`. No JS map library.

### 5.4 Deliberate repetition list (centralised in `lib/content/brand.js`)

Phrases that appear on multiple pages by design, sourced once:

| Phrase | Appears on |
| ------ | ---------- |
| **"Over 25 years"** | Home trust eyebrow; Remediation lead; About hero; service-page leads (optional) |
| **"Safe, dependable, and on-time service"** | Home hero subhead; footer tagline; contact-page hero |
| **"The only hazardous waste management company in Canada with an integrated management system featuring three ISO certifications"** | Home trust eyebrow; QA hero; inline trust badge on the 5 regulated-service pages (Treatment, Remediation, Emergency Response, Stewardship, Specialty Recycling) |
| **"Cradle to grave"** | Home editorial block (verbatim); QA tracking section (verbatim). Nowhere else — repetition past two locations dilutes it. |
| **24/7 emergency `(204) 957-6327`** | `EmergencyBanner` (every shown route); Contact-page Phone card. Not in service-page body copy. |
| **"Vaughn Bullough Environmental Centre (VBEC)"** | Full name once per page on first use, then "VBEC". Treatment Facility + About pages keep the full name in headlines. |

### 5.5 Voice & tone

Miller voice: **dry, technical, slightly institutional** — the voice of a
30-year operator who runs a licensed facility. Short declarative sentences.
Capability lists over narrative paragraphs. Named certifications over
adjectives ("ISO 45001:2018", not "rigorously safe"). Compare to TL49's
editorial cadence ("the 49th parallel runs through every shipment") —
Miller deliberately doesn't reach for that.

Two exceptions, where one editorial register is allowed: the VBEC renaming
story on About, and "Join the Miller Family" on home/careers.

---

## 6. Accessibility (WCAG 2.2 AA)

- **Skip link target** = `<main id="main" tabIndex={-1}>` on every page. Skip
  link href `#main`. Skip link is first focusable on every route.
- **EmergencyBanner semantics**: `<aside role="region" aria-label="24-hour emergency contact">`. Phone link first, dismiss button second. Banner sits before skip-link's `<main>` destination in tab order; skip link bypasses it.
- **Mobile banner icon** announces full phone number.
- **Cert + licence download links** include type + size and `<a download>`.
  Build-time check: eslint `no-restricted-syntax` forbids
  `JSXAttribute[name.name="href"][value.value="#"]` in JSX; CI greps
  `lib/certs.js` for `href: "#"`. Both fail the build.
- **5-step process timeline = `<ol>`.** Non-negotiable.
- **Form a11y.** Reuse shared `FormField` (`useId`, `htmlFor`,
  `aria-invalid`, `aria-describedby`, `role="alert"`, visually-hidden
  "(required)"). On submit-with-errors, programmatically focus the first
  invalid input.
- **Reduced motion.** ScrollReveal + carousel honour `prefers-reduced-motion: reduce`.
- **Mobile nav drawer.** Inherits TL49's focus trap + body-scroll lock.
- **Colour contrast.** `deep` palette passes WCAG AA at 4.5:1 for body text
  and 3:1 for ≥18 px headings — re-audited in phase 5.

---

## 7. Performance

Round-2 skeptic was right that v2's per-route JS budgets were invented.
This spec **targets, doesn't gate** — phase-5 measurement decides whether
budget thresholds make it into CI.

### Targets (aspirational, measured at phase 5)
- Thin pages: ~120 KB first-load JS (compressed).
- Rich pages (Home, Remediation, Treatment, Contact): ~180 KB.
- LCP measured via **Lighthouse mobile preset (Moto G Power, Slow 4G)** on
  `/` and `/industrial-services/environmental-remediation-services/`.
  Target ≤ 2.5 s. Anything > 3.0 s is a phase-5 fix item.

### Practical commits (do, not measure)
- All images are local; `next/image` handles AVIF/WebP/responsive sizes.
  No third-party preconnect needed.
- `<link rel="preload" as="image" fetchpriority="high" href="<hero-frame-1>" />`
  in `<head>` for the home route only.
- Carousel frame 1 has `priority` (next/image equivalent of fetchpriority=high);
  frames 2 + 3 omit `priority` and rely on next/image's default lazy behaviour.
- All routes prerendered as static HTML (no SSR).
- Tweaks panel **import-site gated** to non-prod — zero bytes in production.
- Two font families only in prod.

### CLS budget
- < 0.05. `EmergencyBanner` uses `position: sticky; top: 0` inside a wrapper
  with reserved `min-block-size` and `dvh` units to absorb iOS address-bar
  shifts.

---

## 8. SEO / metadata

- Per-route `metadata` exports sourced from `lib/content/*`.
- `app/sitemap.js` enumerates the 32 prerendered routes.
- `robots.txt` allows all.
- OG image `/og.png` placeholder.
- Title template `"%s · Miller Environmental"`.

---

## 9. Phasing

Five phases in `docs/superpowers/specs/miller-web-phase-NN.md`.

| Phase | Theme | Intra-phase parallelism |
| ----- | ----- | ----------------------- |
| 01 | Foundation: shared package extraction + workspace rewire | Sequential (each step gates the next) |
| 02 | Miller components + page templates | **Parallel** — 5 component/template clusters, no inter-dependencies |
| 03 | Thin pages (10 services, 5 about subs, 2 locations, indexes, contact) | **Parallel** — page-per-task |
| 04 | Rich pages (Home, Treatment, Remediation, Quality Assurance, Careers) | **Parallel** — page-per-task |
| 05 | Polish: stub routes, SEO, a11y/perf audit, lint clean, local commit | Sequential — verification gates |

Phases 02-04 are parallel-friendly. The user's instruction
("structure it so any phase-plans that can be executed in parallel … are
put in the earlier phase-plans") is satisfied: foundation must come first
by definition, then three parallel phases, then sequential polish.

---

## 10. Open questions (deferred, not blocking)

1. **Real ISO PDFs + Miller logomark + VBEC imagery clearance** — who supplies, and when? Phase 1 ships with placeholder hrefs and the build-time check off; phase 5 turns the check on.
2. **`FamilyOfCompanies` ownership-line copy** — parent group hasn't approved the cross-link strip; deferred to phase 5.
3. **Staging URL + preview-deploy gating** — out of scope for this spec; the user has explicitly said all commits stay local for now.
4. **TL49 footer edit timing** — needs a small change to host the
   `FamilyOfCompanies` strip when phase 5 lands. Until then, TL49 ships
   unchanged.

---

## 11. Phase-01 hard prerequisites

Before any Miller page can render in dev, **in this order, each gated by
the next**:

1. **Update workspaces glob → `["apps/*", "apps/shared/*"]` OR relocate brand to `apps/brand/`.** Spec adopts the latter. Update root `package.json`.
2. **Create `apps/brand/`** with extracted CSS + components (no class rename). `package.json` lists `peerDependencies`.
3. **Add `"@white-owl/brand": "*"` to both apps' dependencies.** Add `transpilePackages: ["@white-owl/brand"]` to TL49's `next.config.mjs`. Replace TL49's `app/layout.jsx` CSS import.
4. **Run `npm install` at root**, verify symlink at `apps/transline49-web/node_modules/@white-owl/brand`.
5. **TL49 still builds + matches visually** (manual diff).
6. **Hoist ESLint to root.** Move deps to root `devDependencies`. Write root `eslint.config.mjs`. Delete `apps/transline49-web/eslint.config.mjs` and the per-app lint script. Verify `npm run lint` at root passes.
7. **Move tweaks into `@white-owl/brand`** with import-site gating on `NODE_ENV !== "production"`. Verify production build of TL49 has zero `twk-*` references in client chunks (`grep -r "twk-" .next/static/chunks/`).
8. **Scaffold `apps/miller-web/`** skeleton: `package.json`, `next.config.mjs` (with `transpilePackages`), `app/layout.jsx` (with shared CSS import), `app/page.jsx` (empty placeholder). Verify `npm run dev:miller` boots and root `npm run build` builds both apps.

Anything beyond step 8 is phase 2.

---

## 12. Decision log — round-2 disposition

**A** = adopted · **D** = deferred · **R** = rejected. Round-1 dispositions
already merged into the spec body and not re-listed here.

### From Skeptical Reviewer
| # | Objection | Disposition |
| - | --------- | ----------- |
| 1 | Drop the `tl-*` → `wo-*` rename | **A** Non-goals + §1.2 — sed is vanity. |
| 2 | 120/180 KB budgets are invented | **A** §7 — converted to *targets measured at phase 5*, not CI gates. |
| 3 | Lazy `@font-face` injection is unproven | **A** §4.3 — dropped. Prod ships two families. Alternates only via dev env flag. |
| 4 | LCP < 2.0s on "4G" has no device/tool | **A** §7 — replaced with Lighthouse mobile preset (Moto G Power, Slow 4G), ≤ 2.5s LCP target. |
| 5 | `motif` enum is brand-decoration architecture | **A** §4.2 — dropped prop entirely; use `data-brand` CSS selectors. Killed `vbec-coord`. |
| 6 | 32-routes count conflates real with stubs | **A** §1.4 — explicitly `26 real + 6 stub`. |
| 7 | Tweaks namespace factory unsolved | **A** §1.2 — dropped factory; hard-code keys per app. |
| 8 | Unsplash photo-removal has no fallback | **A** §4.4 — `<HeroPhoto>` accepts `fallbackBg` gradient. |

### From Implementation Pragmatist
| # | Friction | Disposition |
| - | -------- | ----------- |
| 1 | `tl-*` rename is 144 tokens + keyframes + data attrs | **A** Rename dropped (see Skeptic #1). |
| 2 | Workspace glob `apps/*` not recursive | **A** §1.1 — package relocated to `apps/brand/`. |
| 3 | `@white-owl/brand` install ordering | **A** §11 — phase-01 prerequisites named in order with gates. |
| 4 | Bundle-budget CI gate doesn't exist | **A** §7 — demoted to manual phase-5 check using `next build` console output + Lighthouse. |
| 5 | Build-time `href="#"` check unwritten | **A** §6 — replaced with eslint `no-restricted-syntax` + CI grep on `lib/certs.js`. |
| 6 | Carousel needs concrete CSS | **A** §4.6 — full sketch in spec. |
| 7 | `lib/content/*` becomes JSX-in-disguise | **A** §5.1 — content modules constrained to plain strings + arrays. |
| 8 | Drop `Processes` top-nav | **A** §2.2 — removed from primary nav; route preserved. |
| 9 | Drop `motif` prop | **A** §4.2 — see Skeptic #5. |
| 10 | Drop Tweaks namespace factory | **A** see Skeptic #7. |
| 11 | Defer `FamilyOfCompanies` to phase 5 | **A** §2.3 + §1.2. |
| 12 | Cut `StatsBand` entirely | **A** Non-goals + §3.1. |

### From Content Strategist
| # | Concern | Disposition |
| - | ------- | ----------- |
| 1 | Industrial Waste Treatment is the operating flagship, not Remediation | **A** §3.2 — `capabilities` variant for Treatment; Remediation keeps bespoke template; Treatment is card-1 on home services grid. |
| 2 | VBEC is a person, not an acronym | **A** §3.5 + §3.6 — dedicated "Vaughn Bullough story" section on About; treatment-facility hero says "named for…". |
| 3 | Home ordering buries VBEC | **A** §3.1 — VBEC promoted to step 4 (after services grid). |
| 4 | `ServiceDetailTemplate` Procrustean | **A** §3.2 — `compact` + `capabilities` variants; service variant declared in `lib/services.js`. |
| 5 | Processes top-nav indefensible | **A** §2.2 — folded; route preserved. |
| 6 | Careers needs narrative spine | **A** §3.7 — `CareersTemplate` replaces `IndexTemplate` for `/careers/`. |
| 7 | "Only in Canada" claim should repeat on regulated-service pages | **A** §5.4 — added to deliberate repetition list. |
| Voice | Industrial, declarative, institutional | **A** §5.5. |
| Repetition list | Centralise refrains in `lib/content/brand.js` | **A** §5.4 — table added. |
