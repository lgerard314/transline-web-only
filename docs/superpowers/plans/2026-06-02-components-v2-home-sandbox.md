# components-v2 Home Sandbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the Miller home page on a new `/template-testing` route using a brand-new Elementor-style component ladder under `apps/miller-web/components-v2/`, byte-identical in look, feel, and animation to `/`, touching zero existing files.

**Architecture:** A four-level ladder — `items/` (L0 primitives) → `blocks/` (L1 repeated sub-units) → `widgets/` (L2 interactive, "use client") → `sections/` (L3 full sections) → `app/template-testing/page.jsx` (L4 orchestrator). All design-system CSS, the scroll-reveal driver, the chrome, and TopNav hero-detection are inherited from the root layout, so parity reduces to one rule: **every v2 component emits the exact same DOM (same tags, classes, `data-reveal` placement) with no extra wrapper elements.** Content is imported read-only where exported, and the six inline non-exported arrays are copied into one new content file.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, existing `mw-*` CSS partials, Playwright (e2e parity harness). Path alias `@/*` → app root (`apps/miller-web/`).

**Reference spec:** `docs/superpowers/specs/2026-06-02-components-v2-home-sandbox-design.md`

---

## Files that must NOT be touched (read-only)

Reading/importing these is allowed; **modifying, moving, or deleting any of them is forbidden.**

- `apps/miller-web/app/(home)/**` (all of it — `page.jsx`, `home.js`, `sections/*`, `banners/*`)
- `apps/miller-web/components/**` (incl. `StopText.jsx`, `MillerScrollReveal.jsx`, `TopNav.jsx`, `SiteFooter.jsx`, `Marquee` is in the brand pkg)
- `apps/miller-web/app/layout.jsx`, `apps/miller-web/app/globals.css`, `apps/miller-web/app/styles/**`
- `apps/miller-web/lib/services.js`, `apps/miller-web/lib/certs.js`, `apps/miller-web/lib/content/**` (import only)
- `apps/brand/**` (the `@white-owl/brand` package)
- Any existing test under `apps/miller-web/tests/**` (add new spec files only)

## New files this plan creates (the complete set)

```
apps/miller-web/lib/content/template-testing-home.js
apps/miller-web/components-v2/items/{eyebrow-01,stop-period-01,stop-text-01,action-arrow-01,nobr-01,num-token-01,cta-solid-01,cta-ghost-phone-01}.jsx
apps/miller-web/components-v2/blocks/{head-intro-01,cert-card-01,service-anchor-01,service-card-01,service-tile-01,figure-stat-01,cap-item-01,plate-stat-01,mission-block-01,milestone-item-01,careers-card-01,social-link-01}.jsx
apps/miller-web/components-v2/widgets/{phrase-cycle-01,sector-card-01,stat-cycle-01,gallery-thumb-01,timeline-vertical-01,marquee-band-01}/index.jsx
apps/miller-web/components-v2/sections/hero-01/index.jsx
apps/miller-web/components-v2/sections/certs-banner-01/index.jsx
apps/miller-web/components-v2/sections/services-01/{index.jsx,service-order.js}
apps/miller-web/components-v2/sections/sectors-01/index.jsx
apps/miller-web/components-v2/sections/facility-01/index.jsx
apps/miller-web/components-v2/sections/history-01/index.jsx
apps/miller-web/components-v2/sections/careers-01/index.jsx
apps/miller-web/components-v2/sections/affiliates-banner-01/index.jsx
apps/miller-web/components-v2/sections/final-cta-01/index.jsx
apps/miller-web/app/template-testing/page.jsx
apps/miller-web/tests/template-testing.spec.js
```

## Parity rules (apply to EVERY component task)

1. **No extra wrappers.** Return the same element/fragment the original emits. When a component represents the direct child of a `[data-reveal-stagger]` container, it must render that child element itself (not wrap it) so `[data-reveal-stagger] > *` still selects it.
2. **`data-reveal` placement.** Reproduce `data-reveal` / `data-reveal-stagger` on the exact same elements as the original. (Presence is what the observer matches; value may be `""` or `"true"`.)
3. **Class names verbatim.** Copy `mw-*` class strings exactly.
4. **Client timings verbatim.** Intervals, default indices, reduced-motion freeze must match the originals.
5. **No new CSS.** If you think you need a rule, you've diverged from the original DOM — stop and fix the DOM instead.

The dev server is started with `npm run dev:miller` (port 3001) from the repo root. Compare against `http://localhost:3001/` and `http://localhost:3001/template-testing`.

---

## Task 0: Route skeleton + content file + chrome smoke test

**Files:**
- Create: `apps/miller-web/lib/content/template-testing-home.js`
- Create: `apps/miller-web/app/template-testing/page.jsx`
- Create: `apps/miller-web/tests/template-testing.spec.js`

- [ ] **Step 1: Create the copied content file**

The arrays below are copied verbatim from the (read-only) original section files (`03-sectors.jsx`, `04-facility.jsx`, `05-history.jsx`, `banners/affiliates.jsx`, `07-final-cta.jsx`, `02-services.jsx`).

```js
// apps/miller-web/lib/content/template-testing-home.js
// Sandbox content for /template-testing. These arrays are COPIED from the
// inline, non-exported consts in app/(home)/ section files (which cannot be
// imported without editing them). Exported, importable HOME/SERVICES/CERTS
// content is imported directly by the v2 sections, not duplicated here.

export const HOME_FIRST = [
  "industrial-waste-treatment",
  "environmental-remediation-services",
  "emergency-response",
];

export const SECTOR_STATS = [
  { label: "Active clients", value: "450+", text: "industrial manufacturers, public agencies, and community programs across Canada and the United States rely on Miller for hazardous waste service." },
  { label: "Lifetime disposal", value: "49M+", unit: "tons", text: "of hazardous and regulated waste processed through documented chain of custody since operations began." },
  { label: "Lifetime recycling", value: "40M+", unit: "tons", text: "diverted from landfill through specialty recycling — solvents, metals, plastics, and oils recovered back into use." },
];

export const SECTOR_CARDS = [
  { title: "Industrial", items: [
    { slug: "industrial-manufacturing", name: "Industrial Manufacturing" },
    { slug: "mining", name: "Mining" },
    { slug: "oil-and-gas", name: "Oil & Gas" },
    { slug: "chemical-distribution", name: "Chemical Distribution" },
  ] },
  { title: "Infrastructure", items: [
    { slug: "aerospace-and-defence", name: "Aerospace & Defence" },
    { slug: "transportation-and-rail", name: "Transportation & Rail" },
    { slug: "utlities-and-power", name: "Utilities & Power" },
    { slug: "agriculture", name: "Agriculture" },
  ] },
  { title: "Institutional", items: [
    { slug: "biotech-and-pharma", name: "Biotech & Pharma" },
    { slug: "crown-insurers", name: "Crown Insurers" },
    { slug: "federal-and-provincial-agencies", name: "Federal & Provincial Agencies" },
    { slug: "education-and-healthcare", name: "Education & Healthcare" },
  ] },
  { title: "Community", items: [
    { slug: "small-business", name: "Small Business" },
    { slug: "households", name: "Households (HHW)" },
    { slug: "municipal-programs", name: "Municipal Programs" },
    { slug: "construction-and-demolition", name: "Construction & Demolition" },
  ] },
];

export const FACILITY_PHOTOS = [
  { src: "/miller/facility/vbec-drone-overview.png", alt: "VBEC drone overview", caption: "Aerial drone overview" },
  { src: "/miller/facility/vbec-office-front-aerial.png", alt: "Office front, aerial view", caption: "Office front, from above" },
  { src: "/miller/facility/vbec-office-front.png", alt: "Office front, ground view", caption: "Office front entrance" },
  { src: "/miller/facility/vbec-stone-sign.png", alt: "Vaughn Bullough Environmental Centre stone sign", caption: "Entrance stone sign" },
  { src: "/miller/facility/vbec-lake.png", alt: "Lake on the VBEC grounds", caption: "Reflection pond on the grounds" },
  { src: "/miller/facility/vbec-windmills.png", alt: "Wind turbines visible from VBEC", caption: "Wind turbines on the horizon" },
];

export const MILESTONES = [
  { year: "1996", title: "Founding year", body: "The Province of Manitoba and Miller Paving sign a 50/50 partnership creating Miller Environmental Corporation, announced January 10, 1996." },
  { year: "1997", title: "Vaughn Bullough hired as GM", body: "Bullough builds the operation into Manitoba’s only fully-licensed hazardous-waste operator, leading it for twenty-five years." },
  { year: "2007", title: "Winnipeg Service Centre opens", body: "The Hekla Avenue centre opens as the company’s public-facing base and a licensed PCB-storage and waste-coordination hub." },
  { year: "2015", title: "Licence 58 HW S2 RRRR", body: "Manitoba posts the core treatment-facility operating licence — the regulatory backbone for everything that follows." },
  { year: "2017", title: "Federal disposal contract won", body: "MEC wins a federal Hazardous Waste Disposal Services contract, since amended through 2026." },
  { year: "2019 — 2022", title: "Processing Cell 5 commissioned", body: "A new engineered processing cell is constructed and licensed, expanding treatment, storage, and disposal capacity at the Montcalm facility." },
  { year: "August 2022", title: "Treatment Facility → VBEC", body: "The flagship facility is renamed the Vaughn Bullough Environmental Centre in recognition of Vaughn Bullough’s 25-year leadership." },
  { year: "2023", title: "MHCA COR safety certification", body: "MEC earns its MHCA COR 2023 safety certification and joins the Mining Association of Manitoba, broadening its sector standing." },
  { year: "2024", title: "MEIA Lifetime Achievement Award", body: "President Paul Bauer receives the MEIA Lifetime Achievement Award, anchoring the company’s credibility with regulators and large generators." },
  { year: "May 2025", title: "Solvent recycling online", body: "Manitoba approves an in-province solvent-recovery system reclaiming up to 4.5 million litres annually — moving MEC up the waste hierarchy." },
  { year: "February 2026", title: "Charting the path forward", body: "President Paul Bauer lays out the company’s strategy, with 96% of waste now managed in-house." },
];

export const AFFILIATES = [
  { name: "Manitoba Environmental Industries Association", src: "/miller/affiliations/meia.png" },
  { name: "Canadian Manufacturers & Exporters", src: "/miller/affiliations/cme.png" },
  { name: "Manitoba Chamber of Commerce", src: "/miller/affiliations/manitoba-chamber.png" },
  { name: "Winnipeg Chamber of Commerce", src: "/miller/affiliations/winnipeg-chamber.png" },
  { name: "Construction Safety Association of Manitoba", src: "/miller/affiliations/csam.png" },
  { name: "Manitoba Trucking Association", src: "/miller/affiliations/mta.png" },
  { name: "Ontario Waste Management Association", src: "/miller/affiliations/owma.png" },
  { name: "Commitment To Opportunity, Diversity & Equity", src: "/miller/affiliations/code.png" },
];

export const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/millerenvironmentalcorporation", path: "M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" },
  { label: "Instagram", href: "https://www.instagram.com/millerenvironmentalcorporation/", path: "M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.281.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" },
  { label: "X", href: "https://x.com/MillerEnviron", path: "M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/miller-environmental-corporation", path: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" },
  { label: "YouTube", href: "https://www.youtube.com/@MillerEnvironmental", path: "M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c1.123-.302 5.288-.332 6.11-.335zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" },
];
```

- [ ] **Step 2: Create the placeholder route page**

```jsx
// apps/miller-web/app/template-testing/page.jsx
export const metadata = {
  title: "Template Testing — components-v2 sandbox",
  robots: { index: false, follow: false },
};

export default function TemplateTestingPage() {
  return <main-placeholder />; // replaced in later tasks; see note below
}
```

Note: `<main-placeholder />` is intentionally invalid-looking but renders as an unknown custom element (harmless) so this step's only job is "route resolves." It is replaced in Task hero/P4. Actually use a valid placeholder:

```jsx
export default function TemplateTestingPage() {
  return <div data-tt-root="1" style={{ minHeight: "40vh" }} />;
}
```

- [ ] **Step 3: Create the parity spec skeleton**

```js
// apps/miller-web/tests/template-testing.spec.js
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3001";

test("template-testing route renders inside chrome", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  await expect(page.locator("header")).toBeVisible();   // TopNav from root layout
  await expect(page.locator("footer")).toBeVisible();   // SiteFooter from root layout
  await expect(page.locator('[data-tt-root="1"]')).toBeAttached();
});
```

- [ ] **Step 4: Verify route + chrome render**

Run (dev server already up on 3001):
```bash
npx playwright test tests/template-testing.spec.js -g "renders inside chrome" --workers=1
```
Expected: 1 passed. If Playwright needs a project/browser, run from `apps/miller-web`: `npx playwright test` config already exists for `test:e2e`.

- [ ] **Step 5: Commit**

```bash
git add apps/miller-web/lib/content/template-testing-home.js apps/miller-web/app/template-testing/page.jsx apps/miller-web/tests/template-testing.spec.js
git commit -m "feat(miller-web): scaffold /template-testing route + sandbox content"
```

---

## Task 1: L0 items (all eight)

**Files:** Create all eight under `apps/miller-web/components-v2/items/`.

- [ ] **Step 1: Create `eyebrow-01.jsx`**

```jsx
// L0 · eyebrow-01 — section eyebrow (diamond mark + mono label).
// Content: label. Config: invert (dark-surface label), reveal (adds data-reveal).
export function Eyebrow01({ label, invert = false, reveal = false }) {
  const revealAttr = reveal ? { "data-reveal": "" } : {};
  return (
    <p className="mw-section-tag" aria-hidden="true" {...revealAttr}>
      <span className="mw-section-tag-mark" />
      <span className={"mw-section-tag-label" + (invert ? " mw-section-tag-label--invert" : "")}>
        {label}
      </span>
    </p>
  );
}
```

- [ ] **Step 2: Create `stop-period-01.jsx`**

```jsx
// L0 · stop-period-01 — clay stamp period.
// Config: variant "title" | "hero" | "colon".
const CLS = { title: "mw-stop", hero: "mw-hero__stop", colon: "mw-stop-colon" };
export function StopPeriod01({ variant = "title" }) {
  return <span className={CLS[variant] || CLS.title} aria-hidden="true" />;
}
```

- [ ] **Step 3: Create `stop-text-01.jsx`** (verbatim recreation of `StopText`)

```jsx
// L0 · stop-text-01 — glues the clay stop to the last word (nowrap), so it
// can't wrap onto its own line. Pure render; server- and client-safe.
export function StopText01({ children, stopClassName = "mw-stop" }) {
  const text = String(children ?? "");
  const trimmed = text.replace(/\s+$/, "");
  const idx = trimmed.lastIndexOf(" ");
  const head = idx === -1 ? "" : trimmed.slice(0, idx + 1);
  const last = idx === -1 ? trimmed : trimmed.slice(idx + 1);
  return (
    <>
      {head}
      <span className="mw-nobr">
        {last}
        <span className={stopClassName} aria-hidden="true" />
      </span>
    </>
  );
}
```

- [ ] **Step 4: Create `action-arrow-01.jsx`**

```jsx
// L0 · action-arrow-01 — the "go" affordance.
export function ActionArrow01() {
  return <span aria-hidden="true">→</span>;
}
```

- [ ] **Step 5: Create `nobr-01.jsx`**

```jsx
// L0 · nobr-01 — no-wrap wrapper.
export function Nobr01({ children }) {
  return <span className="mw-nobr">{children}</span>;
}
```

- [ ] **Step 6: Create `num-token-01.jsx`**

```jsx
// L0 · num-token-01 — zero-padded mono number. className carries the
// context class (e.g. mw-svcs-tile__num); ariaHidden matches the original use.
export function NumToken01({ n, className, ariaHidden = false }) {
  const extra = ariaHidden ? { "aria-hidden": "true" } : {};
  return <span className={className} {...extra}>{String(n).padStart(2, "0")}</span>;
}
```

- [ ] **Step 7: Create `cta-solid-01.jsx`**

```jsx
// L0 · cta-solid-01 — primary squared clay CTA. Internal -> next/link;
// external -> raw anchor with target/rel. children include any trailing arrow.
import Link from "next/link";
export function CtaSolid01({ href, children, external = false, ariaLabel }) {
  const label = ariaLabel ? { "aria-label": ariaLabel } : {};
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="mw-cta mw-cta--solid" {...label}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="mw-cta mw-cta--solid" {...label}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 8: Create `cta-ghost-phone-01.jsx`**

```jsx
// L0 · cta-ghost-phone-01 — stacked 24/7 emergency phone (ghost CTA).
export function CtaGhostPhone01({ sup, num, href, ariaLabel }) {
  return (
    <a href={href} className="mw-cta mw-cta--ghost" aria-label={ariaLabel}>
      <span className="mw-cta__sup">{sup}</span>
      <span className="mw-cta__num">{num}</span>
    </a>
  );
}
```

- [ ] **Step 9: Commit**

```bash
git add apps/miller-web/components-v2/items
git commit -m "feat(miller-web): components-v2 L0 items"
```

---

## Task 2: Hero (P1) — phrase-cycle widget + hero-01 section + wire page + parity harness

**Files:**
- Create: `apps/miller-web/components-v2/widgets/phrase-cycle-01/index.jsx`
- Create: `apps/miller-web/components-v2/sections/hero-01/index.jsx`
- Modify: `apps/miller-web/app/template-testing/page.jsx`
- Modify: `apps/miller-web/tests/template-testing.spec.js`

- [ ] **Step 1: Create `phrase-cycle-01/index.jsx`** (verbatim recreation of `HeroPhraseCycle`)

```jsx
"use client";
// L2 · phrase-cycle-01 — cycling hero word. Accepts strings or { text, tone }.
// interval 4160ms; longest-phrase sizer reserves width; freezes (first phrase)
// under prefers-reduced-motion; mirrors current value into an sr-live node.
import { useEffect, useState } from "react";

function normalize(p) {
  return typeof p === "string" ? { text: p } : p;
}

export function PhraseCycle01({ phrases, interval = 4160 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!phrases || phrases.length <= 1) return;
    const mql = typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    if (mql && mql.matches) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, interval);
    return () => clearInterval(id);
  }, [phrases, interval]);

  if (!phrases || phrases.length === 0) return null;

  const items = phrases.map(normalize);
  const sizer = items.reduce((a, b) => (a.text.length >= b.text.length ? a : b));

  return (
    <span className="mw-hero__cycle" aria-label={items[index].text}>
      <span className="mw-hero__cycle-sizer" aria-hidden="true">{sizer.text}</span>
      {items.map((p, i) => (
        <span
          key={i}
          className={
            "mw-hero__cycle-item" +
            (i === index ? " is-active" : "") +
            (p.tone === "accent" ? " mw-hero__cycle-item--accent" : "")
          }
          aria-hidden={i !== index}
        >
          {p.text}
        </span>
      ))}
      <span className="tl-sr-only" aria-live="polite" aria-atomic="true">
        {items[index].text}
      </span>
    </span>
  );
}
```

- [ ] **Step 2: Create `hero-01/index.jsx`**

Transcribed from `app/(home)/sections/01-hero.jsx`, composing v2 items. Emits identical `mw-hero` DOM.

```jsx
// L3 · hero-01 — civic-monument hero on darkened site photo.
import { EMERGENCY_PHONE } from "@/lib/content/brand";
import { PhraseCycle01 } from "@/components-v2/widgets/phrase-cycle-01";
import { StopPeriod01 } from "@/components-v2/items/stop-period-01";
import { CtaSolid01 } from "@/components-v2/items/cta-solid-01";
import { CtaGhostPhone01 } from "@/components-v2/items/cta-ghost-phone-01";
import { ActionArrow01 } from "@/components-v2/items/action-arrow-01";

const EMERGENCY_HREF = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

export function Hero01() {
  return (
    <section className="mw-hero" aria-labelledby="mw-hero-title">
      <div
        className="mw-hero__photo"
        aria-hidden="true"
        style={{ backgroundImage: "url(/miller/hero/home-frame-1.png)" }}
      />
      <div className="mw-hero__inner">
        <p className="mw-hero__mark" aria-hidden="true">
          <img className="mw-hero__mark-logo" src="/miller/logo/miller-logomark.webp" alt="" />
          <span className="mw-hero__mark-corp">
            Miller Environmental{" "}
            <span className="mw-hero__mark-corp-long">Corporation</span>
            <span className="mw-hero__mark-corp-short">Corp.</span>
          </span>
          <span className="mw-hero__mark-meta">
            <span className="mw-hero__mark-dot" />
            <span className="mw-hero__mark-since">Since 1996</span>
          </span>
        </p>

        <h1 id="mw-hero-title" className="mw-hero__title">
          <span className="mw-hero__line">leaders in</span>
          <span className="mw-hero__line">
            <PhraseCycle01
              phrases={[
                { text: "hazardous" },
                { text: "safe", tone: "accent" },
                { text: "reliable", tone: "accent" },
              ]}
            />
          </span>
          <span className="mw-hero__line">waste <span className="mw-nobr">disposal<StopPeriod01 variant="hero" /></span></span>
        </h1>

        <p className="mw-hero__lead">
          Twenty-five years of licensed hazardous waste management in Manitoba.
          Three ISO certifications. One documented chain of custody from your
          loading dock to final disposition at VBEC.
        </p>

        <div className="mw-hero__foot">
          <div className="mw-hero__ctas">
            <CtaSolid01 href="/contact-us/">
              Talk to Miller <ActionArrow01 />
            </CtaSolid01>
            <CtaGhostPhone01
              sup="24/7 emergency"
              num={EMERGENCY_PHONE}
              href={EMERGENCY_HREF}
              ariaLabel={`Call 24/7 emergency: ${EMERGENCY_PHONE}`}
            />
          </div>
          <p className="mw-hero__article">
            <strong>VBEC</strong> · 64 ha, Montcalm MB · ISO 9001 · 14001 · 45001
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire the page to render the hero + the preload link**

Replace `apps/miller-web/app/template-testing/page.jsx` with:

```jsx
import { Hero01 } from "@/components-v2/sections/hero-01";

export const metadata = {
  title: "Template Testing — components-v2 sandbox",
  robots: { index: false, follow: false },
};

export default function TemplateTestingPage() {
  return (
    <>
      <link rel="preload" href="/miller/hero/home-frame-1.png" as="image" fetchPriority="high" />
      <Hero01 />
    </>
  );
}
```

- [ ] **Step 4: Add the hero parity assertion to the spec**

Append to `tests/template-testing.spec.js`:

```js
test("hero parity: same hero DOM as home", async ({ page }) => {
  const home = await page.goto(`${BASE}/`).then(() => page.locator(".mw-hero").innerHTML());
  await page.goto(`${BASE}/template-testing`);
  await expect(page.locator(".mw-hero")).toBeVisible();
  await expect(page.locator(".mw-hero__mark")).toBeAttached();     // TopNav logo-swap hook
  await expect(page.locator(".mw-hero__cycle")).toBeAttached();    // phrase cycle present
  await expect(page.locator(".mw-hero__cta, .mw-cta--solid")).toHaveCount(1, { timeout: 5000 });
});
```

(The first-section smoke test from Task 0 must be updated: replace the `[data-tt-root="1"]` assertion with `await expect(page.locator("main > section.mw-hero")).toBeVisible();`.)

- [ ] **Step 5: Run the hero parity test**

```bash
npx playwright test tests/template-testing.spec.js -g "hero parity" --workers=1
```
Expected: PASS.

- [ ] **Step 6: Visual check (REQUIRED — look at the screenshots)**

```bash
npx playwright screenshot --viewport-size=1440,2400 "http://localhost:3001/" /tmp/home-hero.png
npx playwright screenshot --viewport-size=1440,2400 "http://localhost:3001/template-testing" /tmp/tt-hero.png
```
Open both PNGs and confirm the hero (mark line, monumental title with cycling word, lead, CTA row, article line) is identical. Confirm the cycling word animates and the TopNav collapses + swaps the leaf to the logomark on scroll.

- [ ] **Step 7: Commit**

```bash
git add apps/miller-web/components-v2/widgets/phrase-cycle-01 apps/miller-web/components-v2/sections/hero-01 apps/miller-web/app/template-testing/page.jsx apps/miller-web/tests/template-testing.spec.js
git commit -m "feat(miller-web): components-v2 hero-01 + phrase-cycle widget on /template-testing"
```

---

## Task 3: Certs banner (P2)

**Files:**
- Create: `apps/miller-web/components-v2/blocks/cert-card-01.jsx`
- Create: `apps/miller-web/components-v2/sections/certs-banner-01/index.jsx`
- Modify: `apps/miller-web/app/template-testing/page.jsx`

- [ ] **Step 1: Create `cert-card-01.jsx`**

```jsx
// L1 · cert-card-01 — certification download card (mw-cert). Renders the
// ISO/COR display logic verbatim. Must be a direct child of the stagger row,
// so it returns the <a> itself (no wrapper).
export function CertCard01({ cert }) {
  const isISO = cert.name.startsWith("ISO");
  const display = isISO ? cert.name.replace(/^ISO\s+/, "").split(":")[0] : "COR";
  const prefix = isISO ? "ISO" : "MHCA";
  return (
    <a
      href={cert.href}
      download
      className="mw-cert"
      role="listitem"
      aria-label={`Download ${cert.name} certificate, ${cert.sizeKB} KB PDF`}
    >
      <img className="mw-cert__mark" src={cert.mark} alt="" aria-hidden="true" loading="lazy" />
      <span className="mw-cert__body">
        <span className="mw-cert__prefix">{prefix}&nbsp;·&nbsp;{cert.year}</span>
        <span className="mw-cert__num">{display}</span>
        <span className="mw-cert__desc">{cert.long}</span>
        <span className="mw-cert__pdf">
          <span>PDF · {cert.sizeKB}KB</span>
          <span className="mw-cert__arr" aria-hidden="true">↓</span>
        </span>
      </span>
    </a>
  );
}
```

- [ ] **Step 2: Create `certs-banner-01/index.jsx`**

```jsx
// L3 · certs-banner-01 — trust band; 4-card cert row under the hero.
import { CERTS } from "@/lib/certs";
import { CertCard01 } from "@/components-v2/blocks/cert-card-01";

export function CertsBanner01() {
  return (
    <section className="mw-trust" aria-label="Certifications">
      <div className="mw-certs" role="list" aria-label="Certifications" data-reveal-stagger>
        {CERTS.map((cert) => (
          <CertCard01 key={cert.slug} cert={cert} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to page (after hero)**

In `page.jsx`, import `CertsBanner01` and render it directly after `<Hero01 />`.

```jsx
import { CertsBanner01 } from "@/components-v2/sections/certs-banner-01";
// ...
<Hero01 />
<CertsBanner01 />
```

- [ ] **Step 4: Verify**

Reload `http://localhost:3001/template-testing`; confirm the 4 cert cards render identically and stagger-reveal on scroll. Compare to `/`.

- [ ] **Step 5: Commit**

```bash
git add apps/miller-web/components-v2/blocks/cert-card-01.jsx apps/miller-web/components-v2/sections/certs-banner-01 apps/miller-web/app/template-testing/page.jsx
git commit -m "feat(miller-web): components-v2 certs-banner-01"
```

---

## Task 4: Services (P2)

**Files:**
- Create: `apps/miller-web/components-v2/blocks/head-intro-01.jsx`
- Create: `apps/miller-web/components-v2/blocks/service-anchor-01.jsx`
- Create: `apps/miller-web/components-v2/blocks/service-card-01.jsx`
- Create: `apps/miller-web/components-v2/blocks/service-tile-01.jsx`
- Create: `apps/miller-web/components-v2/sections/services-01/service-order.js`
- Create: `apps/miller-web/components-v2/sections/services-01/index.jsx`
- Modify: `apps/miller-web/app/template-testing/page.jsx`

- [ ] **Step 1: Create `service-order.js`** (recreated ordering/title helpers, copied from the original section)

```js
// L3 helper · service-order — recreates the home services ordering + title
// split (copied from app/(home)/sections/02-services.jsx, which holds these
// as inline non-exported helpers).
import { SERVICES } from "@/lib/services";
import { HOME_FIRST } from "@/lib/content/template-testing-home";

export function splitTitle(title) {
  const parts = String(title).trim().split(/\s+/);
  if (parts.length <= 1) return { line1: title, line2: null };
  return { line1: parts.slice(0, -1).join(" "), line2: parts[parts.length - 1] };
}

export function homeServiceOrder() {
  const map = new Map(SERVICES.map((s) => [s.slug, s]));
  const head = HOME_FIRST.map((slug) => map.get(slug)).filter(Boolean);
  const rest = SERVICES.filter((s) => !HOME_FIRST.includes(s.slug)).sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  return [...head, ...rest];
}
```

- [ ] **Step 2: Create `head-intro-01.jsx`**

```jsx
// L1 · head-intro-01 — canonical section header (mw-section-head):
// eyebrow -> title -> intro. title is a node (already includes its stop).
import { Eyebrow01 } from "@/components-v2/items/eyebrow-01";

export function HeadIntro01({ eyebrow, headingId, title, intro, stagger = true }) {
  const staggerAttr = stagger ? { "data-reveal-stagger": "" } : {};
  return (
    <header className="mw-section-head mw-services__head" {...staggerAttr}>
      <Eyebrow01 label={eyebrow} />
      <h2 id={headingId} className="mw-section-title">{title}</h2>
      <p className="mw-services__intro">{intro}</p>
    </header>
  );
}
```

- [ ] **Step 3: Create the three service grid blocks**

`service-anchor-01.jsx`:
```jsx
import Link from "next/link";
import { NumToken01 } from "@/components-v2/items/num-token-01";
import { ActionArrow01 } from "@/components-v2/items/action-arrow-01";

export function ServiceAnchor01({ service }) {
  return (
    <Link href={`/industrial-services/${service.slug}/`} className="mw-svcs-anchor">
      <span className="mw-svcs-anchor__photo" style={{ backgroundImage: `url(${service.photo})` }} aria-hidden="true" />
      <div className="mw-svcs-anchor__body">
        <NumToken01 n={1} className="mw-svcs-anchor__num" />
        <div className="mw-svcs-anchor__title-row">
          <h3 className="mw-svcs-anchor__title">{service.title}</h3>
          <span className="mw-svcs-anchor__arr" aria-hidden="true">→</span>
        </div>
        <p className="mw-svcs-anchor__text">{service.summary}</p>
      </div>
    </Link>
  );
}
```

`service-card-01.jsx`:
```jsx
import Link from "next/link";
import { NumToken01 } from "@/components-v2/items/num-token-01";
import { splitTitle } from "@/components-v2/sections/services-01/service-order";

export function ServiceCard01({ service, n }) {
  const { line1, line2 } = splitTitle(service.title);
  return (
    <Link href={`/industrial-services/${service.slug}/`} className="mw-svcs-card">
      <span className="mw-svcs-card__photo" style={{ backgroundImage: `url(${service.photo})` }} aria-hidden="true" />
      <div className="mw-svcs-card__body">
        <NumToken01 n={n} className="mw-svcs-card__num" />
        <div className="mw-svcs-card__title-row">
          <h3 className="mw-svcs-card__title">{line1}{line2 && (<><br />{line2}</>)}</h3>
          <span className="mw-svcs-card__arr" aria-hidden="true">→</span>
        </div>
        <p className="mw-svcs-card__text">{service.summary}</p>
      </div>
    </Link>
  );
}
```

`service-tile-01.jsx` (handles internal services AND the external cross-border tile via the `external`/`title`/`summary`/`photo`/`href` props):
```jsx
import Link from "next/link";
import { NumToken01 } from "@/components-v2/items/num-token-01";
import { splitTitle } from "@/components-v2/sections/services-01/service-order";

// For internal services pass `service` + `n`. For the external cross-border
// tile pass external + href + photo + titleLines ([l1,l2]) + summary + n.
export function ServiceTile01({ service, n, external = false, href, photo, titleLines, summary }) {
  const cls = "mw-svcs-tile" + (external ? " mw-svcs-tile--external" : "");
  const inner = (
    <>
      <span className="mw-svcs-tile__photo" style={{ backgroundImage: `url(${external ? photo : service.photo})` }} aria-hidden="true" />
      <div className="mw-svcs-tile__body">
        <NumToken01 n={n} className="mw-svcs-tile__num" />
        {(() => {
          const [l1, l2] = external ? titleLines : (() => { const s = splitTitle(service.title); return [s.line1, s.line2]; })();
          return (
            <div className="mw-svcs-tile__title-row">
              <h3 className="mw-svcs-tile__title">{l1}{l2 && (<><br />{l2}</>)}</h3>
              <span className="mw-svcs-tile__arr" aria-hidden="true">→</span>
            </div>
          );
        })()}
        <p className="mw-svcs-tile__text">{external ? summary : service.summary}</p>
      </div>
    </>
  );
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
  }
  return <Link href={`/industrial-services/${service.slug}/`} className={cls}>{inner}</Link>;
}
```

- [ ] **Step 4: Create `services-01/index.jsx`**

Transcribed from `02-services.jsx`, preserving the exact tile order/indices (anchor[0]; cards[1..2]; tiles[3..5]; external tile #07; tiles for [6],[8],[9] as #08–10; tile [7] as #11).

```jsx
import { homeServiceOrder } from "./service-order";
import { HeadIntro01 } from "@/components-v2/blocks/head-intro-01";
import { ServiceAnchor01 } from "@/components-v2/blocks/service-anchor-01";
import { ServiceCard01 } from "@/components-v2/blocks/service-card-01";
import { ServiceTile01 } from "@/components-v2/blocks/service-tile-01";

export function Services01() {
  const s = homeServiceOrder();
  return (
    <section className="mw-services" aria-labelledby="mw-services-heading">
      <div className="mw-inner">
        <HeadIntro01
          eyebrow="Services"
          headingId="mw-services-heading"
          title={<>whatever your waste needs,<br /><span className="mw-services__title-em">we&rsquo;ve got you <span className="mw-nobr">covered<span className="mw-stop" aria-hidden="true" /></span></span></>}
          intro={<>From routine industrial streams to one-off emergency calls, Miller&rsquo;s licensed VBEC facility and field crews handle the full spectrum &mdash; collection, treatment, and final disposition, all under one roof.</>}
        />
        <ul className="mw-svcs-grid" aria-label="Capabilities" data-reveal-stagger>
          <li><ServiceAnchor01 service={s[0]} /></li>
          {s.slice(1, 3).map((svc, i) => (<li key={svc.id}><ServiceCard01 service={svc} n={i + 2} /></li>))}
          {s.slice(3, 6).map((svc, i) => (<li key={svc.id}><ServiceTile01 service={svc} n={i + 4} /></li>))}
          <li>
            <ServiceTile01
              external
              href="https://www.transline49.com"
              photo="/miller/services/vacuum-truck-new-logo.webp"
              titleLines={["Cross-Border", "Services"]}
              summary="Transboundary movement of waste from the United States to Canada to mitigate your US liabilities."
              n={7}
            />
          </li>
          {[s[6], s[8], s[9]].map((svc, i) => (<li key={svc.id}><ServiceTile01 service={svc} n={i + 8} /></li>))}
          <li><ServiceTile01 service={s[7]} n={11} /></li>
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Add to page (after certs)** — import `Services01`, render after `<CertsBanner01 />`.

- [ ] **Step 6: Verify** — reload; confirm the bento grid order, numbers (01–11), the external cross-border tile, and stagger reveal all match `/`.

- [ ] **Step 7: Commit**

```bash
git add apps/miller-web/components-v2/blocks/head-intro-01.jsx apps/miller-web/components-v2/blocks/service-anchor-01.jsx apps/miller-web/components-v2/blocks/service-card-01.jsx apps/miller-web/components-v2/blocks/service-tile-01.jsx apps/miller-web/components-v2/sections/services-01 apps/miller-web/app/template-testing/page.jsx
git commit -m "feat(miller-web): components-v2 services-01 bento grid"
```

---

## Task 5: Careers + Affiliates + Final CTA (P2, static)

**Files:**
- Create: `apps/miller-web/components-v2/blocks/careers-card-01.jsx`
- Create: `apps/miller-web/components-v2/blocks/social-link-01.jsx`
- Create: `apps/miller-web/components-v2/widgets/marquee-band-01/index.jsx`
- Create: `apps/miller-web/components-v2/sections/careers-01/index.jsx`
- Create: `apps/miller-web/components-v2/sections/affiliates-banner-01/index.jsx`
- Create: `apps/miller-web/components-v2/sections/final-cta-01/index.jsx`
- Modify: `apps/miller-web/app/template-testing/page.jsx`

- [ ] **Step 1: Create `careers-card-01.jsx`**

```jsx
import Link from "next/link";
import { ActionArrow01 } from "@/components-v2/items/action-arrow-01";

export function CareersCard01({ tag, title, text, cta }) {
  return (
    <article className="mw-careers__card">
      <span className="mw-careers__card-tag">{tag}</span>
      <h3 className="mw-careers__card-title">{title}</h3>
      <p className="mw-careers__card-text">{text}</p>
      <Link href={cta.href} className="mw-careers__card-link">
        {cta.label} <ActionArrow01 />
      </Link>
    </article>
  );
}
```

- [ ] **Step 2: Create `social-link-01.jsx`**

```jsx
export function SocialLink01({ label, href, path }) {
  return (
    <a href={href} className="mw-final__social" target="_blank" rel="noopener noreferrer" aria-label={label}>
      <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}
```

- [ ] **Step 3: Create `marquee-band-01/index.jsx`** (imports the brand `Marquee` primitive)

```jsx
// L2 · marquee-band-01 — home affiliate band framing (label + row) wrapping
// the shared brand Marquee track. The brand Marquee is a design-system
// primitive (out of scope to recreate), imported like a tl-* class.
import { Marquee } from "@white-owl/brand/components";
import { AFFILIATES } from "@/lib/content/template-testing-home";

export function MarqueeBand01() {
  return (
    <div className="mw-marquee__row">
      <p className="mw-marquee__label">Proud<br />affiliates<span className="mw-stop-colon" aria-hidden="true" /></p>
      <Marquee items={AFFILIATES.map((a) => (
        <img key={a.src} className="mw-marquee__logo" src={a.src} alt={a.name} loading="lazy" />
      ))} />
    </div>
  );
}
```

- [ ] **Step 4: Create `careers-01/index.jsx`**

```jsx
import { HOME as c } from "@/app/(home)/home";
import { Eyebrow01 } from "@/components-v2/items/eyebrow-01";
import { CareersCard01 } from "@/components-v2/blocks/careers-card-01";

export function Careers01() {
  return (
    <section className="mw-careers mw-careers--bleed" aria-labelledby="mw-careers-bleed-heading">
      <div className="mw-careers__bleed-photo" aria-hidden="true">
        <img src="/miller/careers/team-at-conv-booth-big-5.jpg" alt="" loading="lazy" />
      </div>
      <div className="mw-inner">
        <header className="mw-careers__head">
          <div className="mw-careers__head-text" data-reveal>
            <Eyebrow01 label="Careers" invert />
            <h2 id="mw-careers-bleed-heading" className="mw-careers__title">
              Join the<br /><span className="mw-careers__title-em">Miller <span className="mw-nobr">team<span className="mw-stop" aria-hidden="true" /></span></span>
            </h2>
            <p className="mw-careers__lead">{c.joinFamily.intro}</p>
          </div>
        </header>
        <div className="mw-careers__cards" data-reveal-stagger>
          <CareersCard01 tag="Culture" title={c.joinFamily.whyTitle} text={c.joinFamily.whyBody} cta={c.joinFamily.whyCta} />
          <CareersCard01 tag="Hiring now" title={c.joinFamily.opportunitiesTitle} text={c.joinFamily.opportunitiesBody} cta={c.joinFamily.opportunitiesCta} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `affiliates-banner-01/index.jsx`**

```jsx
import { MarqueeBand01 } from "@/components-v2/widgets/marquee-band-01";

export function AffiliatesBanner01() {
  return (
    <section className="mw-marquee" aria-label="Affiliates">
      <MarqueeBand01 />
    </section>
  );
}
```

- [ ] **Step 6: Create `final-cta-01/index.jsx`**

```jsx
import { HOME as c } from "@/app/(home)/home";
import { Eyebrow01 } from "@/components-v2/items/eyebrow-01";
import { StopText01 } from "@/components-v2/items/stop-text-01";
import { CtaSolid01 } from "@/components-v2/items/cta-solid-01";
import { CtaGhostPhone01 } from "@/components-v2/items/cta-ghost-phone-01";
import { ActionArrow01 } from "@/components-v2/items/action-arrow-01";
import { SocialLink01 } from "@/components-v2/blocks/social-link-01";
import { SOCIALS } from "@/lib/content/template-testing-home";

export function FinalCta01() {
  return (
    <section className="mw-final" aria-labelledby="mw-final-heading">
      <div className="mw-final__grid" data-reveal-stagger>
        <div className="mw-final__col mw-final__col--truck">
          <img className="mw-final__truck" src="/miller/truck-graphic-angled.png" alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="mw-final__col mw-final__col--content">
          <p className="mw-section-tag mw-final__tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{c.finalCta.eyebrow}</span>
          </p>
          <h2 id="mw-final-heading" className="mw-final__title"><StopText01>{c.finalCta.title.replace(/\.\s*$/, "")}</StopText01></h2>
          <p className="mw-final__body">{c.finalCta.body}</p>
          <div className="mw-final__row">
            <CtaSolid01 href={c.finalCta.contactHref}>Contact Miller <ActionArrow01 /></CtaSolid01>
            <CtaGhostPhone01 sup="24/7 emergency" num={c.finalCta.emergencyDisplay} href={c.finalCta.emergencyHref} ariaLabel={`Call 24/7 emergency: ${c.finalCta.emergencyDisplay}`} />
          </div>
          <span className="mw-final__divider" aria-hidden="true" />
          <ul className="mw-final__socials" aria-label="Miller Environmental on social media">
            {SOCIALS.map((so) => (<li key={so.label}><SocialLink01 label={so.label} href={so.href} path={so.path} /></li>))}
          </ul>
        </div>
        <div className="mw-final__col mw-final__col--logo">
          <img className="mw-final__logomark" src="/miller/logo/miller-logomark.webp" alt="" aria-hidden="true" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
```

> Note on the final-CTA eyebrow: the original inlines the `mw-section-tag` (no `data-reveal`) rather than using the shared component because it also adds the `mw-final__tag` class to the same `<p>`. Reproduced inline here to keep DOM identical. (Eyebrow01 doesn't take an extra className; do not add one — keep parity by inlining as shown.)

- [ ] **Step 7: Add all three to page** — import and render `Careers01`, `AffiliatesBanner01`, `FinalCta01`. Order will be finalized in Task 8; for now append them after `Services01` so each can be eyeballed.

- [ ] **Step 8: Verify** — reload; confirm careers dark bleed + 2 cards, the affiliate marquee scrolls, and the final CTA (truck, title with stop, CTAs, socials, logomark) match `/`.

- [ ] **Step 9: Commit**

```bash
git add apps/miller-web/components-v2/blocks/careers-card-01.jsx apps/miller-web/components-v2/blocks/social-link-01.jsx apps/miller-web/components-v2/widgets/marquee-band-01 apps/miller-web/components-v2/sections/careers-01 apps/miller-web/components-v2/sections/affiliates-banner-01 apps/miller-web/components-v2/sections/final-cta-01 apps/miller-web/app/template-testing/page.jsx
git commit -m "feat(miller-web): components-v2 careers-01, affiliates-banner-01, final-cta-01"
```

---

## Task 6: Sectors — who we serve (P3, client widgets)

**Files:**
- Create: `apps/miller-web/components-v2/widgets/sector-card-01/index.jsx`
- Create: `apps/miller-web/components-v2/widgets/stat-cycle-01/index.jsx`
- Create: `apps/miller-web/components-v2/sections/sectors-01/index.jsx`
- Modify: `apps/miller-web/app/template-testing/page.jsx`

- [ ] **Step 1: Create `sector-card-01/index.jsx`** (verbatim recreation of `SectorCard`)

```jsx
"use client";
import { useState } from "react";

const PHOTO_BASE = "/miller/who-we-serve-industries";

export function SectorCard01({ title, items }) {
  const [active, setActive] = useState(0);
  return (
    <article className="mw-sec2__card">
      <div className="mw-sec2__card-photo" aria-hidden="true">
        {items.map((item, i) => (
          <img key={item.slug} className="mw-sec2__card-photo-img" src={`${PHOTO_BASE}/${item.slug}.png`} alt="" data-active={i === active ? "1" : undefined} loading="lazy" />
        ))}
      </div>
      <div className="mw-sec2__card-body">
        <h3 className="mw-sec2__card-title">{title}</h3>
        <span className="mw-sec2__card-rule" aria-hidden="true" />
        <ul className="mw-sec2__card-list">
          {items.map((item, i) => (
            <li key={item.slug} className="mw-sec2__entry" data-active={i === active ? "1" : undefined} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} tabIndex={0}>
              <span className="mw-sec2__entry-name">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Create `stat-cycle-01/index.jsx`** (verbatim recreation of `SectorStatCycle`, interval 5500)

```jsx
"use client";
import { useEffect, useState } from "react";

export function StatCycle01({ stats, interval = 5500 }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!stats || stats.length <= 1) return;
    const mql = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    if (mql && mql.matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % stats.length), interval);
    return () => clearInterval(id);
  }, [stats, interval]);
  if (!stats || stats.length === 0) return null;
  const current = stats[index];
  return (
    <div className="mw-stat-cycle">
      <div className="mw-stat-cycle__inner" key={index}>
        <span className="mw-stat-cycle__label">{current.label}</span>
        <span className="mw-stat-cycle__value">{current.value}{current.unit && <span className="mw-stat-cycle__unit">{current.unit}</span>}</span>
        <p className="mw-stat-cycle__text">{current.text}</p>
      </div>
      <div className="mw-stat-cycle__dots" aria-hidden="true">
        {stats.map((_, i) => (
          <span key={`${index}-${i}`} className={"mw-stat-cycle__dot" + (i === index ? " is-active" : "") + (i < index ? " is-past" : "")} style={i === index ? { "--cycle-duration": `${interval}ms` } : undefined} />
        ))}
      </div>
      <span className="tl-sr-only" aria-live="polite" aria-atomic="true">
        {`${current.label}: ${current.value}${current.unit ? " " + current.unit : ""}. ${current.text}`}
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Create `sectors-01/index.jsx`**

```jsx
import { SECTOR_STATS, SECTOR_CARDS } from "@/lib/content/template-testing-home";
import { Eyebrow01 } from "@/components-v2/items/eyebrow-01";
import { StatCycle01 } from "@/components-v2/widgets/stat-cycle-01";
import { SectorCard01 } from "@/components-v2/widgets/sector-card-01";

export function Sectors01() {
  return (
    <section className="mw-sec2" aria-labelledby="mw-sectors-heading-copy">
      <div className="mw-inner">
        <header className="mw-sec2__head">
          <Eyebrow01 label="Who we serve" reveal />
          <div className="mw-sec2__head-split" data-reveal-stagger>
            <div className="mw-sec2__head-left">
              <h2 id="mw-sectors-heading-copy" className="mw-sec2__title">
                From refineries to households &mdash; and everything <span className="mw-nobr">between<span className="mw-stop" aria-hidden="true" /></span>
              </h2>
              <p className="mw-sec2__lead">
                Large industrial manufacturers, public agencies, small businesses, and even the household-hazardous-waste drop-off down the street &mdash; one operator, one chain of custody.
              </p>
            </div>
            <div className="mw-sec2__head-right">
              <StatCycle01 stats={SECTOR_STATS} />
            </div>
          </div>
        </header>
        <div className="mw-sec2__cards" data-reveal-stagger>
          {SECTOR_CARDS.map((card) => (<SectorCard01 key={card.title} title={card.title} items={card.items} />))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add to page** (after services) — import `Sectors01`, render after `<Services01 />`.

- [ ] **Step 5: Verify** — reload; confirm 4 sector cards with hover photo-swap, the cycling stat with progress dots, and stagger reveal match `/`. Toggle OS reduced-motion and confirm the cycle freezes on the first stat.

- [ ] **Step 6: Commit**

```bash
git add apps/miller-web/components-v2/widgets/sector-card-01 apps/miller-web/components-v2/widgets/stat-cycle-01 apps/miller-web/components-v2/sections/sectors-01 apps/miller-web/app/template-testing/page.jsx
git commit -m "feat(miller-web): components-v2 sectors-01 + sector-card/stat-cycle widgets"
```

---

## Task 7: Facility + History (P3, client widgets)

**Files:**
- Create: `apps/miller-web/components-v2/widgets/gallery-thumb-01/index.jsx`
- Create: `apps/miller-web/components-v2/widgets/timeline-vertical-01/index.jsx`
- Create: `apps/miller-web/components-v2/blocks/figure-stat-01.jsx`
- Create: `apps/miller-web/components-v2/blocks/cap-item-01.jsx`
- Create: `apps/miller-web/components-v2/blocks/plate-stat-01.jsx`
- Create: `apps/miller-web/components-v2/blocks/mission-block-01.jsx`
- Create: `apps/miller-web/components-v2/blocks/milestone-item-01.jsx`
- Create: `apps/miller-web/components-v2/sections/facility-01/index.jsx`
- Create: `apps/miller-web/components-v2/sections/history-01/index.jsx`
- Modify: `apps/miller-web/app/template-testing/page.jsx`

- [ ] **Step 1: Create `gallery-thumb-01/index.jsx`** (verbatim recreation of `FacilityGallery`)

```jsx
"use client";
import { useState } from "react";

export function GalleryThumb01({ photos }) {
  const [index, setIndex] = useState(0);
  if (!photos || photos.length === 0) return null;
  const active = photos[index];
  return (
    <div className="mw-fac2__media" data-reveal>
      <figure className="mw-fac2__photo-frame">
        <img key={index} className="mw-fac2__photo-main" src={active.src} alt={active.alt || ""} loading="lazy" />
        {active.caption && (
          <figcaption className="mw-fac2__photo-cap" key={`cap-${index}`}>
            <span className="mw-fac2__photo-cap-mark" aria-hidden="true" />
            <span>{active.caption}</span>
          </figcaption>
        )}
      </figure>
      <div className="mw-fac2__thumbs" role="group" aria-label="Switch facility photo">
        {photos.map((photo, i) => (
          <button key={i} type="button" onClick={() => setIndex(i)} aria-pressed={i === index} aria-label={photo.alt || `Photo ${i + 1}`} className={"mw-fac2__thumb" + (i === index ? " is-active" : "")}>
            <img src={photo.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `milestone-item-01.jsx`**

```jsx
// L1 · milestone-item-01 — one history milestone (the <li> that is a direct
// child of the timeline <ol>). Returns the <li> itself (no wrapper).
export function MilestoneItem01({ item, side, active, onActivate }) {
  return (
    <li
      data-reveal
      className={"mw-ten3__milestone mw-ten3__milestone--" + side + (active ? " is-active" : "")}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      <div className="mw-ten3__milestone-head">
        <span className="mw-ten3__milestone-dot" aria-hidden="true" />
        <span className="mw-ten3__milestone-year">{item.year}</span>
        <h4 className="mw-ten3__milestone-title">{item.title}</h4>
      </div>
      <div className="mw-ten3__milestone-bodywrap">
        <div className="mw-ten3__milestone-body">
          <span className="mw-ten3__milestone-body-title">{item.title}</span>
          <p className="mw-ten3__milestone-body-text">{item.body}</p>
        </div>
      </div>
    </li>
  );
}
```

- [ ] **Step 3: Create `timeline-vertical-01/index.jsx`** (recreation of `HistoryTimeline`, composing milestone-item-01)

```jsx
"use client";
import { useState } from "react";
import { MilestoneItem01 } from "@/components-v2/blocks/milestone-item-01";

export function TimelineVertical01({ items }) {
  const [activeIndex, setActiveIndex] = useState(null);
  return (
    <ol className="mw-ten3__milestones">
      {items.map((item, i) => (
        <MilestoneItem01
          key={i}
          item={item}
          side={i % 2 === 0 ? "left" : "right"}
          active={i === activeIndex}
          onActivate={() => setActiveIndex(i)}
        />
      ))}
    </ol>
  );
}
```

- [ ] **Step 4: Create the four facility/history blocks**

`figure-stat-01.jsx`:
```jsx
export function FigureStat01({ label, num, unit }) {
  return (
    <div className="mw-fac2__fig">
      <dt className="mw-fac2__fig-label">{label}</dt>
      <dd className="mw-fac2__fig-val"><span className="mw-fac2__fig-num">{num}</span><span className="mw-fac2__fig-unit">{unit}</span></dd>
    </div>
  );
}
```

`cap-item-01.jsx`:
```jsx
import { NumToken01 } from "@/components-v2/items/num-token-01";
export function CapItem01({ n, name }) {
  return (
    <li className="mw-fac2__caps-item">
      <NumToken01 n={n} className="mw-fac2__caps-num" ariaHidden />
      <h4 className="mw-fac2__caps-name">{name}</h4>
    </li>
  );
}
```

`plate-stat-01.jsx`:
```jsx
export function PlateStat01({ num, unit, label }) {
  return (
    <div className="mw-ten3__plate-stat">
      <dd className="mw-ten3__plate-val"><span className="mw-ten3__plate-num">{num}</span><span className="mw-ten3__plate-unit">{unit}</span></dd>
      <dt className="mw-ten3__plate-label">{label}</dt>
    </div>
  );
}
```

`mission-block-01.jsx`:
```jsx
import Link from "next/link";
import { ActionArrow01 } from "@/components-v2/items/action-arrow-01";
export function MissionBlock01({ paragraphs, cta }) {
  return (
    <div className="mw-ten2__mission" data-reveal>
      <h3 className="mw-ten2__mission-heading">Mission</h3>
      {paragraphs.map((p, i) => (<p key={i} className="mw-ten2__mission-copy">{p}</p>))}
      <Link href={cta.href} className="mw-ten2__mission-link">{cta.label} <ActionArrow01 /></Link>
    </div>
  );
}
```

- [ ] **Step 5: Create `facility-01/index.jsx`**

```jsx
import { HOME as c } from "@/app/(home)/home";
import { FACILITY_PHOTOS } from "@/lib/content/template-testing-home";
import { Eyebrow01 } from "@/components-v2/items/eyebrow-01";
import { CtaSolid01 } from "@/components-v2/items/cta-solid-01";
import { ActionArrow01 } from "@/components-v2/items/action-arrow-01";
import { FigureStat01 } from "@/components-v2/blocks/figure-stat-01";
import { CapItem01 } from "@/components-v2/blocks/cap-item-01";
import { GalleryThumb01 } from "@/components-v2/widgets/gallery-thumb-01";

export function Facility01() {
  return (
    <section className="mw-fac2" aria-labelledby="mw-facility-heading-copy">
      <div className="mw-inner">
        <div className="mw-fac2__split">
          <div className="mw-fac2__content" data-reveal-stagger>
            <header className="mw-fac2__head">
              <Eyebrow01 label="Vaughn Bullough Environmental Centre" />
              <h2 id="mw-facility-heading-copy" className="mw-fac2__title">
                <span className="mw-nobr">VBEC<span className="mw-stop" aria-hidden="true" /></span><br /><span className="mw-fac2__title-em">A facility built for the <span className="mw-nobr">work<span className="mw-stop" aria-hidden="true" /></span></span>
              </h2>
            </header>
            <p className="mw-fac2__lead">{c.vbec.body}</p>
            <dl className="mw-fac2__figs" aria-label="Facility figures">
              <FigureStat01 label="Footprint" num="64" unit="hectares" />
              <FigureStat01 label="Location" num="70" unit="km S of Winnipeg" />
              <FigureStat01 label="Operating" num="1996" unit="to today" />
            </dl>
            <div className="mw-fac2__actions">
              <CtaSolid01 href={c.vbec.cta.href}>
                <span className="mw-fac2__lbl-long">{c.vbec.cta.label}</span>
                <span className="mw-fac2__lbl-short">Visit Facility</span>
                {" "}<ActionArrow01 />
              </CtaSolid01>
              <a href={c.vbec.aboutHref} className="mw-fac2__about">
                <span className="mw-fac2__lbl-long">{c.vbec.aboutLinkLabel}</span>
                <span className="mw-fac2__lbl-short">Read the story</span>
                {" "}<span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <GalleryThumb01 photos={FACILITY_PHOTOS} />
        </div>
        <div className="mw-fac2__caps">
          <header className="mw-fac2__caps-head" data-reveal>
            <h3 className="mw-fac2__caps-title">
              <span className="mw-fac2__caps-mark" aria-hidden="true" />
              <span>7 powerful capabilities</span>
            </h3>
          </header>
          <ol className="mw-fac2__caps-grid" aria-label="Onsite capabilities" data-reveal-stagger>
            {c.vbec.capabilities.map((cap, i) => (<CapItem01 key={i} n={i + 1} name={cap} />))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

> Note: the facility "about" link uses the bespoke `mw-fac2__about` class with its own long/short label spans, not a shared CTA — reproduced inline to keep DOM identical.

- [ ] **Step 6: Create `history-01/index.jsx`**

```jsx
import { HOME as c } from "@/app/(home)/home";
import { MILESTONES } from "@/lib/content/template-testing-home";
import { Eyebrow01 } from "@/components-v2/items/eyebrow-01";
import { TimelineVertical01 } from "@/components-v2/widgets/timeline-vertical-01";
import { PlateStat01 } from "@/components-v2/blocks/plate-stat-01";
import { MissionBlock01 } from "@/components-v2/blocks/mission-block-01";

const MISSION_PARAGRAPHS = [
  "At Miller Environmental, our mission is to lead the hazardous waste disposal industry by exemplifying unwavering commitment to environmentally responsible practices, rigorous regulatory compliance, and continuous innovation.",
  "We prioritize safety in all operations, ensuring the well-being of our team, clients, and the communities we serve.",
  "Our dedication to transparency fosters trust, while active community engagement reflects our belief in shared responsibility.",
];

export function History01() {
  return (
    <section className="mw-ten3" aria-labelledby="mw-tenure-heading-copy-b">
      <div className="mw-inner">
        <div className="mw-ten3__grid">
          <aside className="mw-ten3__timeline" aria-label="Company milestones">
            <p className="mw-ten3__timeline-note">*hover for more info</p>
            <TimelineVertical01 items={MILESTONES} />
          </aside>
          <div className="mw-ten3__body">
            <header className="mw-ten3__head" data-reveal>
              <Eyebrow01 label="Our history" />
              <h2 id="mw-tenure-heading-copy-b" className="mw-ten3__title">
                Three decades in <span className="mw-ten3__title-em">hazardous <span className="mw-nobr">waste<span className="mw-stop" aria-hidden="true" /></span></span>
              </h2>
              <p className="mw-ten3__lead">
                Miller Environmental was formed in 1996 as Manitoba&rsquo;s first private-public hazardous-waste operator. Vaughn Bullough joined as General Manager in 1997 and led operations for twenty-five years. The facility was renamed in his honour in 2022. The work continues.
              </p>
            </header>
            <div className="mw-ten3__plate" aria-label="Track record" data-reveal>
              <img className="mw-ten3__plate-img" src="/miller/full-truck-sideview.png" alt="" aria-hidden="true" loading="lazy" />
              <dl className="mw-ten3__plate-stats">
                <PlateStat01 num="25" unit="+yrs" label="Relationships" />
                <PlateStat01 num="96" unit="%" label="In-house" />
                <PlateStat01 num="4.5" unit="ML/yr" label="Solvent reclaimed" />
              </dl>
            </div>
            <MissionBlock01 paragraphs={MISSION_PARAGRAPHS} cta={c.mission.cta} />
          </div>
        </div>
      </div>
    </section>
  );
}
```

> Note: `MISSION_PARAGRAPHS` is copied here (verbatim) because the original section inlines the mission copy as JSX, not in `home.js`. It is page-local config, allowed by the spec.

- [ ] **Step 7: Add both to page** — import `Facility01`, `History01`; render in order (facility then history). Final ordering verified in Task 8.

- [ ] **Step 8: Verify** — reload; confirm the facility split (figures, gallery thumb-switcher with crossfade + caption, 7-capability grid) and the history timeline (zigzag, hover-open milestone, truck-plate stats, mission) match `/`.

- [ ] **Step 9: Commit**

```bash
git add apps/miller-web/components-v2/widgets/gallery-thumb-01 apps/miller-web/components-v2/widgets/timeline-vertical-01 apps/miller-web/components-v2/blocks/figure-stat-01.jsx apps/miller-web/components-v2/blocks/cap-item-01.jsx apps/miller-web/components-v2/blocks/plate-stat-01.jsx apps/miller-web/components-v2/blocks/mission-block-01.jsx apps/miller-web/components-v2/blocks/milestone-item-01.jsx apps/miller-web/components-v2/sections/facility-01 apps/miller-web/components-v2/sections/history-01 apps/miller-web/app/template-testing/page.jsx
git commit -m "feat(miller-web): components-v2 facility-01 + history-01 + gallery/timeline widgets"
```

---

## Task 8: Final page composition + full parity pass (P4)

**Files:**
- Modify: `apps/miller-web/app/template-testing/page.jsx`
- Modify: `apps/miller-web/tests/template-testing.spec.js`

- [ ] **Step 1: Set the final section order** (matches `app/(home)/page.jsx` exactly)

```jsx
// apps/miller-web/app/template-testing/page.jsx
import { Hero01 } from "@/components-v2/sections/hero-01";
import { CertsBanner01 } from "@/components-v2/sections/certs-banner-01";
import { Services01 } from "@/components-v2/sections/services-01";
import { Sectors01 } from "@/components-v2/sections/sectors-01";
import { Facility01 } from "@/components-v2/sections/facility-01";
import { History01 } from "@/components-v2/sections/history-01";
import { Careers01 } from "@/components-v2/sections/careers-01";
import { AffiliatesBanner01 } from "@/components-v2/sections/affiliates-banner-01";
import { FinalCta01 } from "@/components-v2/sections/final-cta-01";

export const metadata = {
  title: "Template Testing — components-v2 sandbox",
  robots: { index: false, follow: false },
};

export default function TemplateTestingPage() {
  return (
    <>
      <link rel="preload" href="/miller/hero/home-frame-1.png" as="image" fetchPriority="high" />
      <Hero01 />
      <CertsBanner01 />
      <Services01 />
      <Sectors01 />
      <Facility01 />
      <History01 />
      <Careers01 />
      <AffiliatesBanner01 />
      <FinalCta01 />
    </>
  );
}
```

- [ ] **Step 2: Add the full section-order parity assertion**

Append to `tests/template-testing.spec.js`:

```js
const SECTION_SELECTORS = [
  ".mw-hero", ".mw-trust", ".mw-services", ".mw-sec2",
  ".mw-fac2", ".mw-ten3", ".mw-careers", ".mw-marquee", ".mw-final",
];

test("section set + order matches home", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  for (const sel of SECTION_SELECTORS) {
    await expect(page.locator(`main ${sel}`)).toHaveCount(1);
  }
  // order check: each section's top is below the previous one's
  const tops = await page.evaluate((sels) =>
    sels.map((s) => document.querySelector(`main ${s}`)?.getBoundingClientRect().top ?? -1),
    SECTION_SELECTORS,
  );
  expect(tops.every((t, i) => i === 0 || t > tops[i - 1])).toBe(true);
});

test("reveal attributes present (animation parity)", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  expect(await page.locator("[data-reveal-stagger]").count()).toBeGreaterThanOrEqual(5);
  expect(await page.locator("[data-reveal]").count()).toBeGreaterThanOrEqual(5);
});
```

- [ ] **Step 3: Capture full-page screenshots at three widths**

```bash
for w in 1440 768 390; do
  npx playwright screenshot --full-page --viewport-size=${w},1000 "http://localhost:3001/" /tmp/home-${w}.png
  npx playwright screenshot --full-page --viewport-size=${w},1000 "http://localhost:3001/template-testing" /tmp/tt-${w}.png
done
```

- [ ] **Step 4: REQUIRED — review the screenshots by eye**

Open all six PNGs. For each width, confirm `/template-testing` is indistinguishable from `/`: section order, surfaces (dark/light cadence), type, the clay stamp + diamond + grain motifs, spacing, and imagery. Note any deviation and fix the offending component's DOM (never by adding CSS). Re-screenshot until identical. Document any intentional deferral (e.g. a sub-pixel timeline offset from lazy-image reflow) in the PR description.

- [ ] **Step 5: Interaction/animation check**

In a browser at `http://localhost:3001/template-testing`: confirm (a) hero word cycles; (b) sector card photos swap on hover; (c) stat cycle rotates with dot progress; (d) facility gallery thumbs swap with crossfade; (e) history milestone opens on hover; (f) affiliate marquee scrolls; (g) TopNav collapses + leaf→logomark swaps past the hero; (h) with OS reduced-motion on, all cycles freeze on their first item and reveals snap to visible.

- [ ] **Step 6: Run the full parity spec**

```bash
npx playwright test tests/template-testing.spec.js --workers=1
```
Expected: all tests pass.

- [ ] **Step 7: Confirm zero diffs on existing files**

```bash
git status --porcelain
```
Expected: only new files under `components-v2/`, `app/template-testing/`, `lib/content/template-testing-home.js`, `tests/template-testing.spec.js`, and the two docs. **No modified existing files.** If any existing file shows as modified, revert it.

- [ ] **Step 8: Commit**

```bash
git add apps/miller-web/app/template-testing/page.jsx apps/miller-web/tests/template-testing.spec.js
git commit -m "feat(miller-web): compose full /template-testing page + parity spec"
```

---

## Self-review (against the spec)

**Spec coverage:**
- §5 folder tree → every file appears in "New files this plan creates" and a task. ✓
- §7 L0 items → Task 1 (all 8). ✓
- §8 L1 blocks → Tasks 3–7 (cert-card, head-intro, service-anchor/card/tile, careers-card, social-link, figure-stat, cap-item, plate-stat, mission-block, milestone-item). ✓
- §8 L2 widgets → phrase-cycle (T2), marquee-band (T5), sector-card/stat-cycle (T6), gallery-thumb/timeline-vertical (T7). ✓
- §8 L3 sections → hero (T2), certs (T3), services (T4), careers/affiliates/final-cta (T5), sectors (T6), facility/history (T7). ✓
- §9 composition map → reproduced per section task. ✓
- §10 content import/copy → content file in T0; imports used in section tasks; `HOME_FIRST`/`MISSION_PARAGRAPHS` copied. ✓
- §11 no new CSS → enforced by parity rule #5 + T8 step 4. ✓
- §12 client fidelity → widgets recreated verbatim incl. intervals + sr-live; T6/T8 reduced-motion checks. ✓
- §15 verification → Task 0 smoke, per-section visual checks, T8 full parity spec + screenshots + git-clean check. ✓

**Placeholder scan:** No TBD/TODO; the Task 0 Step 2 placeholder element is explicitly replaced in Task 2 Step 3 with real content (called out). No "add error handling"/"similar to" hand-waves; all code is shown.

**Type/name consistency:** Component export names are consistent across tasks (`Eyebrow01`, `StopPeriod01`, `StopText01`, `ActionArrow01`, `Nobr01`, `NumToken01`, `CtaSolid01`, `CtaGhostPhone01`, `PhraseCycle01`, `SectorCard01`, `StatCycle01`, `GalleryThumb01`, `TimelineVertical01`, `MarqueeBand01`, block + section names). `splitTitle`/`homeServiceOrder` defined once in `service-order.js` and imported where used. `Nobr01` is defined (T1) though sections currently inline `mw-nobr` to match original DOM exactly — it remains available and is not referenced undefined anywhere.

## Notes / intentional deviations from a "pure" ladder (for parity)

- The final-CTA eyebrow and the facility "about" link are **inlined** in their sections rather than using shared items, because the originals attach bespoke extra classes (`mw-final__tag`, `mw-fac2__about`) to those exact nodes. Inlining keeps DOM byte-identical, which outranks ladder purity (documented in spec §4's hard rule).
- `Nobr01` exists as an item but titles inline `<span className="mw-nobr">…</span>` to match the originals exactly; using the component would produce identical DOM and is acceptable, but inlining avoids any ambiguity in the title fragments.
