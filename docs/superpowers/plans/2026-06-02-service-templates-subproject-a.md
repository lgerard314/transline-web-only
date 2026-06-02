# Service Template Library — Sub-project A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 9 foundation service-section templates and pixel-recreate the two reviewed pages — emergency-response (ER) and customer-waste-collection (CWC) — on new sandbox routes, verified against the real pages with Playwright, touching no existing page.

**Architecture:** Each template is a thin server component under `apps/miller-web/components-v2/06_sections/*` that emits DOM byte-identical to an existing `mw-svc-*`/`mw-*` section, pulls all copy from a `content` prop, reuses existing `mw-*` CSS (read-only) and existing shared client components (read-only), and composes a swappable sub-component for variant cards. Sandbox routes at `app/template-testing/<slug>/` compose these templates with the existing `lib/content/service-*.js` content and are diffed full-page against the real `/industrial-services/<slug>` pages. The only existing-file edit is one line in `lib/nav.js` so sandbox routes inherit the same emergency banner as the real service pages.

**Tech Stack:** Next.js 16 App Router (RSC), React 19, Turbopack dev on port 3001, Playwright (chromium) for parity. Path alias `@/*` → `apps/miller-web/`.

**Reference:** Design spec `docs/superpowers/specs/2026-06-02-service-template-library-design.md`. Read it before starting. The home migration proved this pattern at `app/template-testing/` (see `page.jsx`, `template-testing.css`, `components-v2/section-config.js`, `components-v2/06_sections/heroes/monument-hero-01.jsx`).

**Hard constraints (from the spec — violating any fails the task):**
- Do NOT edit `app/styles/*`, the real page routes (`app/industrial-services/**`, `app/(home)/**`), the real content files (`lib/content/service-*.js`), `components/**` (client components are reused read-only), or `apps/brand/**`. Sole exception: the one-line `lib/nav.js` edit in Task 0.
- Warm clay palette only — no blue/teal/turquoise.
- Reproduce the source section's **own literal classes and mechanism** (e.g. `mw-svc-cta--dark`, `mw-svc-cta__grid--reverse`, `mw-svc-cov--serve`, `mw-svc-hero--photo-50`). Do NOT route dark/reverse/ratio through the home `[data-scheme]`/`data-layout`/`template-testing.css` token-rebind path.
- For the default service render, `sectionProps(config)` must emit nothing (no stray `data-scheme`/`style`).
- Preserve every `data-reveal`/`data-reveal-stagger` placement, `aria-labelledby` id, `loading="lazy"`, and `aria-live` exactly as in source.
- Never hard-wrap prose in any file.

**Source-of-truth rule:** For every template, the authoritative DOM is the cited existing section file. Open it, reproduce its markup verbatim into the template, and replace only literal copy with `content.*` lookups. Do not paraphrase class names or structure.

**Shared client component APIs (reused verbatim, imported from `@/components/…`):**
- `RelatedServices` — props `{ currentSlug, titleId }` (+ optional label/heading/allHref/allLabel; ER/CWC pass only currentSlug + titleId).
- `CoverageGallery` — props `{ eyebrow, title, lead, items, cta, titleId, phoneHref, phoneDisplay }`. `items[]` carry `{ text, photo, caption, bigAnchor, thumbAnchor, default }` — pass through unchanged (the `default` flag sets the initial active photo; `*Anchor` set object-position).
- `FlowRoute` — props `{ eyebrow, title, lead, route, steps, notifications, titleId, interval }` (default interval 3400).
- `ResponseTimeline` — props `{ eyebrow, title, lead, steps, notifications, titleId, interval }` (default 3000; ER passes 4200).
- `ContactForm` — props `{ showOptionalFields }` (ER passes `false`).
- `ScheduleForm` — no props.
- `StopText` — splits a title so the last word gets the clay stop; used by hero/cta titles.

---

## File structure (Sub-project A)

Created under `apps/miller-web/`:

- `components-v2/06_sections/heroes/service-hero-01.jsx` — `ServiceHero01`
- `components-v2/06_sections/rails/related-rail-01.jsx` — `RelatedRail01`
- `components-v2/06_sections/grids/photo-card-grid-01.jsx` — `PhotoCardGrid01` (section shell)
- `components-v2/03_cards/ind/ind-thumb-card-01.jsx` — `IndThumbCard01` (`mw-svc-ind`)
- `components-v2/03_cards/ind/ind-gallery-card-01.jsx` — `IndGalleryCard01` (`mw-ind-card`)
- `components-v2/06_sections/pickers/picker-gallery-01.jsx` — `PickerGallery01`
- `components-v2/06_sections/callouts/dispatch-cta-01.jsx` — `DispatchCta01`
- `components-v2/06_sections/flows/response-timeline-01.jsx` — `ResponseTimeline01`
- `components-v2/06_sections/flows/process-flow-01.jsx` — `ProcessFlow01`
- `components-v2/06_sections/grids/capacity-ladder-01.jsx` — `CapacityLadder01`
- `components-v2/06_sections/callouts/schedule-cta-01.jsx` — `ScheduleCta01`
- `app/template-testing/emergency-response/page.jsx` + `content.js` (adapter, only if needed)
- `app/template-testing/customer-waste-collection/page.jsx` + `content.js` (adapter, only if needed)
- `app/template-testing/service-templating.css` — route-scoped variant CSS (e.g. `split`-ratio rules), imported by the sandbox pages. New, parallel to `template-testing.css`. Only created if a `split` ratio rule is actually needed; ER/CWC default ratios should require none.
- `tests/template-testing-emergency-response.spec.js`
- `tests/template-testing-customer-waste-collection.spec.js`

Modified (one line): `lib/nav.js`.

Reused read-only: `components-v2/section-config.js` (`sectionProps`), all `app/styles/*`, all `components/*` client components, all `lib/content/service-*.js`.

---

## Task 0: Emergency-banner chrome parity (nav.js)

**Files:**
- Modify: `apps/miller-web/lib/nav.js` (the `EMERGENCY_BANNER_ROUTES.prefix` array)
- Test: `apps/miller-web/tests/template-testing-banner-parity.spec.js`

- [ ] **Step 1: Read `lib/nav.js`** and locate `EMERGENCY_BANNER_ROUTES` and `shouldShowEmergencyBanner`. Confirm `prefix` currently is `["/industrial-services"]` (or similar) and how matching works (`pathname === exact` OR `pathname.startsWith(prefix)` / segment match). Note the exact matching semantics — the fix and test depend on it.

- [ ] **Step 2: Write the failing test**

```js
// apps/miller-web/tests/template-testing-banner-parity.spec.js
import { test, expect } from "@playwright/test";
import { shouldShowEmergencyBanner } from "../lib/nav.js";

test("sandbox service routes get the same emergency banner as the real service pages", () => {
  // real service pages show the banner via the /industrial-services prefix
  expect(shouldShowEmergencyBanner("/industrial-services/emergency-response")).toBe(true);
  expect(shouldShowEmergencyBanner("/industrial-services/customer-waste-collection")).toBe(true);
  // sandbox recreations must match
  expect(shouldShowEmergencyBanner("/template-testing/emergency-response")).toBe(true);
  expect(shouldShowEmergencyBanner("/template-testing/customer-waste-collection")).toBe(true);
  // home sandbox still on
  expect(shouldShowEmergencyBanner("/template-testing")).toBe(true);
});
```

(If `shouldShowEmergencyBanner` is not exported, export it in this step — it is a pure helper; exporting it is non-breaking. If the file cannot be imported under the Playwright runner due to Next-only imports, instead assert via page rendering: load `/template-testing/emergency-response` after Task 7 exists and assert the banner element is present. Prefer the unit import if it works.)

- [ ] **Step 3: Run test to verify it fails**

Run: `cd apps/miller-web && npx playwright test tests/template-testing-banner-parity.spec.js --reporter=line`
Expected: FAIL — `/template-testing/...` returns false.

- [ ] **Step 4: Make the fix** — add `"/template-testing"` to the `prefix` array in `EMERGENCY_BANNER_ROUTES`. Keep all existing entries. Verify the matcher then returns true for `/template-testing/<slug>` and that this does not flip any unintended route (note the effect on `/template-testing-variants` — acceptable: it is a noindex fixture; if the existing dark-scheme variant tests assert banner absence, adjust only the test expectation, not behavior, and call it out).

- [ ] **Step 5: Run test to verify it passes** — same command. Expected: PASS. Also run the existing suite to confirm no regression: `npx playwright test tests/template-testing.spec.js --reporter=line` → 12 passed.

- [ ] **Step 6: Commit**

```bash
git add apps/miller-web/lib/nav.js apps/miller-web/tests/template-testing-banner-parity.spec.js
git commit -m "fix(miller-web): sandbox service routes inherit emergency banner (nav prefix)"
```

---

## Task 1: ServiceHero01

**Files:**
- Create: `apps/miller-web/components-v2/06_sections/heroes/service-hero-01.jsx`
- Source of truth: `app/industrial-services/emergency-response/sections/01-hero.jsx` (media `transparent-png`, `--alert`, ghost-phone + solid CTA, NO `data-reveal`) AND `app/industrial-services/customer-waste-collection/sections/01-hero.jsx` (`--alert --photo-50`, solid CTA only, has `data-reveal`).

- [ ] **Step 1: Read both source hero files** and `components/StopText.jsx`. List the exact differences (the spec §3 ServiceHero row enumerates them): media slot (`mw-svc-hero__bleed-photo` div vs — for ER — a transparent-png `<img class="mw-svc-hero__photo">`), `--photo-50` class presence, ghost-phone CTA presence, and per-element `data-reveal` presence.

- [ ] **Step 2: Build `ServiceHero01`** as a server component:

```jsx
import { sectionProps } from "@/components-v2/section-config";
import { StopText } from "@/components/StopText";

export function ServiceHero01({ content, config = {} }) {
  const { media = "photo-bleed", alert = false, photoHalf = false, reveal = false } = config;
  // Reproduce the source DOM verbatim. Outer section classes:
  //   mw-svc-hero + (alert ? " mw-svc-hero--alert") + (photoHalf ? " mw-svc-hero--photo-50")
  // Content lookups: content.eyebrow, content.title + content.titleEm (via StopText),
  //   content.lead, content.emergencyDisplay/emergencyHref (ghost-phone CTA, render only if present),
  //   content.secondaryCta {label,labelShort,href} (solid link), content.photo.
  // Media slot per `media`: "photo-bleed"/"transparent-png" → the source's photo markup;
  //   "video" is added in Sub-project B (not used here).
  // Place data-reveal attributes ONLY when reveal===true, on the exact elements CWC marks.
  // Apply {...sectionProps(config)} on the <section> (emits nothing for default).
}
```

Reproduce the markup exactly from the source files; the skeleton above only fixes the signature and config contract. The ghost-phone CTA block (`mw-cta mw-cta--ghost` with `mw-cta__sup`/`mw-cta__num` + `mw-svc-hero__cta-label`) renders only when `content` provides the emergency phone (ER) and is omitted for CWC.

- [ ] **Step 3: Verify render in isolation** — temporarily render `<ServiceHero01 content={emergencyResponse.hero} config={{ media:"transparent-png", alert:true }} />` and `<ServiceHero01 content={customerWasteCollection.hero} config={{ alert:true, photoHalf:true, reveal:true }} />` on a scratch route or directly in the ER/CWC sandbox page (built in Tasks 7/12). Run the dev server (port 3001) and confirm both render without errors. Full pixel-parity is asserted in Tasks 8/13.

- [ ] **Step 4: Commit**

```bash
git add apps/miller-web/components-v2/06_sections/heroes/service-hero-01.jsx
git commit -m "feat(miller-web): ServiceHero01 template (service-page hero)"
```

---

## Task 2: RelatedRail01

**Files:**
- Create: `apps/miller-web/components-v2/06_sections/rails/related-rail-01.jsx`
- Source of truth: `app/industrial-services/emergency-response/sections/06-related.jsx` (identical shape in CWC's `06-related.jsx`).

- [ ] **Step 1: Read the source** — it is a thin `<section className="mw-svc-related-sec"><div className="mw-svc-related-sec__inner mw-inner"><RelatedServices currentSlug=… titleId=… /></div></section>`.

- [ ] **Step 2: Build `RelatedRail01`**:

```jsx
import { RelatedServices } from "@/components/RelatedServices";
import { sectionProps } from "@/components-v2/section-config";

export function RelatedRail01({ content, config = {} }) {
  return (
    <section className="mw-svc-related-sec" {...sectionProps(config)}>
      <div className="mw-svc-related-sec__inner mw-inner">
        <RelatedServices currentSlug={content.currentSlug} titleId={content.titleId} />
      </div>
    </section>
  );
}
```

Confirm the source's exact attribute set (any `aria-*`) and reproduce. `content` carries `{ currentSlug, titleId }`.

- [ ] **Step 3: Verify** the import path `@/components/RelatedServices` resolves and the component renders on the dev server.

- [ ] **Step 4: Commit**

```bash
git add apps/miller-web/components-v2/06_sections/rails/related-rail-01.jsx
git commit -m "feat(miller-web): RelatedRail01 template (wraps RelatedServices)"
```

---

## Task 3: PhotoCardGrid01 + IndThumbCard01 + IndGalleryCard01

**Files:**
- Create: `apps/miller-web/components-v2/06_sections/grids/photo-card-grid-01.jsx`
- Create: `apps/miller-web/components-v2/03_cards/ind/ind-thumb-card-01.jsx`
- Create: `apps/miller-web/components-v2/03_cards/ind/ind-gallery-card-01.jsx`
- Source of truth: `app/industrial-services/emergency-response/sections/03-incidents.jsx` (`mw-svc-inds--photo`, `mw-svc-ind` cards, `mw-svc-inds__head-media` PNG head) AND `app/industrial-services/customer-waste-collection/sections/04-industries.jsx` (`mw-svc-inds--gallery`, `mw-ind-card` cards, plain split head, trailing `mw-ind-cta-cell`).

- [ ] **Step 1: Read both source sections.** Note: ER head has a decorative PNG (`mw-svc-inds__head-media`) whose path is a literal in the file (surface it through content/adapter, not hardcoded in the template). CWC has the trailing CTA cell. Both share `mw-svc-inds`, `mw-svc-inds__inner`, `mw-svc-inds__head`, `mw-svc-inds__grid`.

- [ ] **Step 2: Build the two card sub-components**, each reproducing exactly one source's `<li>` markup:
  - `IndThumbCard01({ item })` → `mw-svc-ind` (thumb + `__name` overlay + `__text` with `__tick` + `__desc`). Fields from `item`: name, blurb, photo.
  - `IndGalleryCard01({ item })` → `mw-ind-card` (`__media` photo + `__body` with `__name` + `__tick` + `__blurb`). Fields from `item`: name, blurb, photo.

- [ ] **Step 3: Build `PhotoCardGrid01`** — the shared section shell that composes a card sub-component:

```jsx
import { sectionProps } from "@/components-v2/section-config";
import { IndThumbCard01 } from "@/components-v2/03_cards/ind/ind-thumb-card-01";
import { IndGalleryCard01 } from "@/components-v2/03_cards/ind/ind-gallery-card-01";

const CARD = { thumb: IndThumbCard01, gallery: IndGalleryCard01 };

export function PhotoCardGrid01({ content, config = {} }) {
  const { cardStyle = "thumb", head = "split", trailingCta = false } = config;
  const Card = CARD[cardStyle];
  // Reproduce mw-svc-inds shell verbatim. Modifier: --photo (thumb) vs --gallery.
  // Head: "media-split" renders content.headMedia PNG (ER); "split" renders lead in right col (CWC).
  // Grid: content.items.map(item => <Card key=… item={item} />).
  // trailingCta: when true, append the mw-ind-cta-cell link from content.cta (CWC).
  // data-reveal / data-reveal-stagger placed exactly as in each source.
}
```

Reproduce both head variants and the modifier class from source. ER incidents → `config={{ cardStyle:"thumb", head:"media-split" }}`; CWC industries → `config={{ cardStyle:"gallery", head:"split", trailingCta:true }}`.

- [ ] **Step 4: Verify** both configs render on the dev server without error.

- [ ] **Step 5: Commit**

```bash
git add apps/miller-web/components-v2/06_sections/grids/photo-card-grid-01.jsx apps/miller-web/components-v2/03_cards/ind/
git commit -m "feat(miller-web): PhotoCardGrid01 + ind card sub-components"
```

---

## Task 4: PickerGallery01

**Files:**
- Create: `apps/miller-web/components-v2/06_sections/pickers/picker-gallery-01.jsx`
- Source of truth: `app/industrial-services/emergency-response/sections/04-coverage.jsx` + `components/CoverageGallery.jsx`.

- [ ] **Step 1: Read the source** — `<section className="mw-svc-cov"><div className="mw-inner"><CoverageGallery …/></div></section>` (ER, base ratio). REM uses `mw-svc-cov mw-svc-cov--serve` (wider photo) — not in Sub-project A but the `serve` knob is built now.

- [ ] **Step 2: Build `PickerGallery01`**:

```jsx
import { CoverageGallery } from "@/components/CoverageGallery";
import { sectionProps } from "@/components-v2/section-config";

export function PickerGallery01({ content, config = {} }) {
  const { serve = false } = config; // column-ratio variant via existing modifier class
  const cls = "mw-svc-cov" + (serve ? " mw-svc-cov--serve" : "");
  return (
    <section className={cls} {...sectionProps(config)}>
      <div className="mw-inner">
        <CoverageGallery
          eyebrow={content.eyebrow} title={content.title} lead={content.lead}
          items={content.items} cta={content.cta} titleId={content.titleId}
          phoneHref={content.phoneHref} phoneDisplay={content.phoneDisplay}
        />
      </div>
    </section>
  );
}
```

Confirm the exact prop names against `components/CoverageGallery.jsx` and the exact wrapper markup against the source section. Pass `items` (with `default`/`thumbAnchor`/`bigAnchor`) through untouched.

- [ ] **Step 3: Verify** render; confirm the initial active photo matches (the `default` item) and the caption `aria-live` is present.

- [ ] **Step 4: Commit**

```bash
git add apps/miller-web/components-v2/06_sections/pickers/picker-gallery-01.jsx
git commit -m "feat(miller-web): PickerGallery01 template (wraps CoverageGallery)"
```

---

## Task 5: DispatchCta01

**Files:**
- Create: `apps/miller-web/components-v2/06_sections/callouts/dispatch-cta-01.jsx`
- Source of truth: `app/industrial-services/emergency-response/sections/05-cta.jsx` + `components/ContactForm.jsx`.

- [ ] **Step 1: Read the source.** Note: darkness comes from the literal `mw-svc-cta--dark` class and reverse from `mw-svc-cta__grid--reverse` (NOT token-rebind/`data-layout`). The hotline note is a literal string in the source — surface it through content. ER passes `showOptionalFields={false}` to `ContactForm`.

- [ ] **Step 2: Build `DispatchCta01`**:

```jsx
import { ContactForm } from "@/components/ContactForm";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

export function DispatchCta01({ content, config = {} }) {
  const { reverse = true } = config; // ER/REM/IC/IWT/PM all use the reversed grid
  // Emit literal classes: section "mw-svc-cta mw-svc-cta--dark";
  //   grid "mw-svc-cta__grid" + (reverse ? " mw-svc-cta__grid--reverse").
  // Form column: ContactForm with showOptionalFields={content.showOptionalFields ?? false}.
  // Content column: eyebrow, title via StopText (content.title/titleEm/titleAfter), body,
  //   dispatch row (logomark + hotline tel: link from content.emergencyHref/Display + hotline note literal from content).
  // {...sectionProps(config)} on the section (emits nothing by default).
}
```

Reproduce the dispatch/hotline markup verbatim. `content` carries `{ eyebrow, title, titleEm, titleAfter, body, formTitle, formNote, emergencyHref, emergencyDisplay, hotlineNote, showOptionalFields }`.

- [ ] **Step 3: Verify** render — dark walnut surface, cream form card, hotline block; confirm it does NOT rely on any `[data-scheme]` attribute.

- [ ] **Step 4: Commit**

```bash
git add apps/miller-web/components-v2/06_sections/callouts/dispatch-cta-01.jsx
git commit -m "feat(miller-web): DispatchCta01 template (dark dispatch CTA)"
```

---

## Task 6: ResponseTimeline01

**Files:**
- Create: `apps/miller-web/components-v2/06_sections/flows/response-timeline-01.jsx`
- Source of truth: `app/industrial-services/emergency-response/sections/02-timeline.jsx` + `components/ResponseTimeline.jsx`.

- [ ] **Step 1: Read the source** — `<section className="mw-svc-tl-sec mw-svc-tl-sec--v1"><div className="mw-svc-tl-sec__inner mw-inner"><ResponseTimeline …/></div></section>`, passing `interval={4200}` and a `titleId`.

- [ ] **Step 2: Build `ResponseTimeline01`**:

```jsx
import { ResponseTimeline } from "@/components/ResponseTimeline";
import { sectionProps } from "@/components-v2/section-config";

export function ResponseTimeline01({ content, config = {} }) {
  return (
    <section className="mw-svc-tl-sec mw-svc-tl-sec--v1" {...sectionProps(config)}>
      <div className="mw-svc-tl-sec__inner mw-inner">
        <ResponseTimeline
          eyebrow={content.eyebrow} title={content.title} lead={content.lead}
          steps={content.steps} notifications={content.notifications}
          titleId={content.titleId} interval={content.interval ?? 4200}
        />
      </div>
    </section>
  );
}
```

Confirm exact prop names against `components/ResponseTimeline.jsx` and the wrapper markup/`--v1` modifier against source.

- [ ] **Step 3: Verify** render; under reduced-motion confirm the notification cycle freezes deterministically (step 0).

- [ ] **Step 4: Commit**

```bash
git add apps/miller-web/components-v2/06_sections/flows/response-timeline-01.jsx
git commit -m "feat(miller-web): ResponseTimeline01 template (wraps ResponseTimeline)"
```

---

## Task 7: Emergency-response sandbox page + assembly

**Files:**
- Create: `apps/miller-web/app/template-testing/emergency-response/page.jsx`
- Create (only if a prop reshape is needed): `apps/miller-web/app/template-testing/emergency-response/content.js`
- Reference: `app/industrial-services/emergency-response/page.jsx` (the real composition + metadata + hero preload link), `lib/content/service-emergency-response.js`.

- [ ] **Step 1: Read the real `page.jsx`** — note the section order (hero, timeline, incidents, coverage, cta, related), any `<link rel="preload">` hero hint, and the metadata.

- [ ] **Step 2: Build the content mapping.** Map `emergencyResponse` keys to each template's `content` prop. Prefer consuming the export directly; create `content.js` only for genuine shape gaps, and there preserve every string/id/anchor/literal verbatim (incl. the dispatch hotline note and the incidents head-media PNG path; `titleId`s like `er-cov-title`; `phoneHref`/`phoneDisplay` from `hero`). Enumerate any adapter field in a comment header `// RECONCILE-IN-D:` so sub-project D can fold it back.

- [ ] **Step 3: Build the sandbox `page.jsx`** composing, in the real order:

```jsx
export const metadata = { title: "TT — emergency-response", robots: { index: false, follow: false } };
// reproduce the real hero preload <link> if present
// <ServiceHero01 content={…hero} config={{ media:"transparent-png", alert:true }} />
// <ResponseTimeline01 content={…timeline (titleId, interval:4200)} />
// <PhotoCardGrid01 content={…incidents (+headMedia)} config={{ cardStyle:"thumb", head:"media-split" }} />
// <PickerGallery01 content={…coverage (titleId, phoneHref/Display)} />
// <DispatchCta01 content={…cta (+hotlineNote, showOptionalFields:false)} />
// <RelatedRail01 content={{ currentSlug:"emergency-response", titleId:"…" }} />
```

Use the exact `currentSlug` and `titleId` strings the real page uses.

- [ ] **Step 4: Verify** — dev server up on 3001; load `http://localhost:3001/template-testing/emergency-response`; confirm it renders all 6 sections with the emergency banner present (Task 0 fix) and no console errors.

- [ ] **Step 5: Commit**

```bash
git add "apps/miller-web/app/template-testing/emergency-response/"
git commit -m "feat(miller-web): emergency-response sandbox page (components-v2)"
```

---

## Task 8: Emergency-response parity verification

**Files:**
- Create: `apps/miller-web/tests/template-testing-emergency-response.spec.js`

- [ ] **Step 1: Write the parity spec** comparing `/industrial-services/emergency-response` (real) vs `/template-testing/emergency-response` (sandbox):

```js
import { test, expect } from "@playwright/test";
const REAL = "http://localhost:3001/industrial-services/emergency-response";
const TT = "http://localhost:3001/template-testing/emergency-response";

async function prep(page, url) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
    const imgs = [...document.querySelectorAll("img")];
    imgs.forEach(im => { im.loading = "eager"; if (!im.complete) im.src = im.src; });
    await Promise.all(imgs.map(im => im.complete ? 0 : im.decode().catch(() => {})));
  });
  await page.waitForTimeout(400);
}

test("ER: section set + order + reveal-attr placement parity", async ({ page }) => {
  await prep(page, TT);
  // assert section roots in order
  const roots = await page.$$eval("main > *, body > section", els => els.map(e => e.className));
  expect(roots.join("|")).toContain("mw-svc-hero");
  // assert reveal-attribute placement matches (count + on which classes)
  const ttReveals = await page.$$eval("[data-reveal],[data-reveal-stagger]", els => els.map(e => e.className).sort());
  await prep(page, REAL);
  const realReveals = await page.$$eval("[data-reveal],[data-reveal-stagger]", els => els.map(e => e.className).sort());
  expect(ttReveals).toEqual(realReveals);
});

test("ER: no stray variant attributes on the sandbox", async ({ page }) => {
  await prep(page, TT);
  const stray = await page.$$eval("[data-scheme],[data-layout]", els => els.length);
  expect(stray).toBe(0);
});

test("ER: full-page visual parity desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await prep(page, REAL); const real = await page.screenshot({ fullPage: true });
  await prep(page, TT); const tt = await page.screenshot({ fullPage: true });
  expect(Buffer.compare(real, tt)).toBe(0); // byte-identical gold standard; if it fails, fall through to pixel review in Step 4
});

test("ER: full-page visual parity mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await prep(page, REAL); const real = await page.screenshot({ fullPage: true });
  await prep(page, TT); const tt = await page.screenshot({ fullPage: true });
  expect(Buffer.compare(real, tt)).toBe(0);
});
```

- [ ] **Step 2: Run it** — `cd apps/miller-web && npx playwright test tests/template-testing-emergency-response.spec.js --reporter=line`. The structural + no-stray tests must pass.

- [ ] **Step 3: If a visual test fails, capture both screenshots and LOOK at them.** Write a throwaway script saving `real-er-*.png` and `tt-er-*.png` (desktop + mobile) to a temp dir, open each with the Read tool, and diff by eye. Fix the responsible template until pixel-identical. Re-run. Byte-identity is the bar; any residual delta must be explained and resolved (not waived).

- [ ] **Step 4: Opus review** — dispatch an Opus reviewer to compare the screenshots and the template DOM vs source for ER, confirming pixel + behavioral parity. Address findings.

- [ ] **Step 5: Commit**

```bash
git add apps/miller-web/tests/template-testing-emergency-response.spec.js
git commit -m "test(miller-web): emergency-response sandbox parity spec"
```

---

## Task 9: ProcessFlow01

**Files:**
- Create: `apps/miller-web/components-v2/06_sections/flows/process-flow-01.jsx`
- Source of truth: `app/industrial-services/customer-waste-collection/sections/03-process.jsx` + `components/FlowRoute.jsx`.

- [ ] **Step 1: Read the source** — thin wrapper `<section className="mw-flow"><div className="mw-flow__inner mw-inner"><FlowRoute …/></div></section>` (CWC base; REM uses `mw-flow mw-flow--wide`).

- [ ] **Step 2: Build `ProcessFlow01`**:

```jsx
import { FlowRoute } from "@/components/FlowRoute";
import { sectionProps } from "@/components-v2/section-config";

export function ProcessFlow01({ content, config = {} }) {
  const { wide = false } = config;
  const cls = "mw-flow" + (wide ? " mw-flow--wide" : "");
  return (
    <section className={cls} {...sectionProps(config)}>
      <div className="mw-flow__inner mw-inner">
        <FlowRoute
          eyebrow={content.eyebrow} title={content.title} lead={content.lead}
          route={content.route} steps={content.steps} notifications={content.notifications}
          titleId={content.titleId} interval={content.interval ?? 3400}
        />
      </div>
    </section>
  );
}
```

Confirm exact prop names against `components/FlowRoute.jsx` and the wrapper markup against source.

- [ ] **Step 3: Verify** render; reduced-motion freezes the cycle at step 0.

- [ ] **Step 4: Commit**

```bash
git add apps/miller-web/components-v2/06_sections/flows/process-flow-01.jsx
git commit -m "feat(miller-web): ProcessFlow01 template (wraps FlowRoute)"
```

---

## Task 10: CapacityLadder01

**Files:**
- Create: `apps/miller-web/components-v2/06_sections/grids/capacity-ladder-01.jsx`
- Source of truth: `app/industrial-services/customer-waste-collection/sections/02-scale.jsx`.

- [ ] **Step 1: Read the source** — `mw-vol` 2-col grid: header panel (eyebrow + title + lead + decorative photo) + `<ol class="mw-vol__ladder">` of tiers, each `<li class="mw-vol__tier">` with an inline SVG glyph, name+spec, a `mw-vol__gauge` with `mw-vol__fill` whose `width` is an inline style, and a note. The glyph SVGs are inlined in the source.

- [ ] **Step 2: Build `CapacityLadder01`** reproducing the `mw-vol` markup verbatim, mapping `content` to: eyebrow, title, lead, headPhoto, and `tiers[]` `{ name, spec, fill, note }` (+ glyph). Keep the glyph SVGs in the template (they are presentation, not copy) or accept a `glyph` key per tier — match whatever the source does (likely an index→SVG map in the section file; reproduce it in the template). The `mw-vol__fill` width comes from the tier's fill value as an inline `style={{ width }}`. Apply `{...sectionProps(config)}`.

- [ ] **Step 3: Verify** render — gauge bars at the correct widths, glyphs present.

- [ ] **Step 4: Commit**

```bash
git add apps/miller-web/components-v2/06_sections/grids/capacity-ladder-01.jsx
git commit -m "feat(miller-web): CapacityLadder01 template (mw-vol capacity ladder)"
```

---

## Task 11: ScheduleCta01

**Files:**
- Create: `apps/miller-web/components-v2/06_sections/callouts/schedule-cta-01.jsx`
- Source of truth: `app/industrial-services/customer-waste-collection/sections/05-cta.jsx` + `components/ScheduleForm.jsx`.

- [ ] **Step 1: Read the source** — `mw-sched` full-bleed section with `mw-sched__bg`, 2-col grid: walnut panel (eyebrow + title via StopText + body + numbered `mw-sched__steps` "what happens next" `<ol>`) and form col (dark-glass `mw-sched__card` wrapping `<ScheduleForm />`).

- [ ] **Step 2: Build `ScheduleCta01`** reproducing the `mw-sched` markup verbatim, mapping `content`: eyebrow, title, titleEm, body, `next[]` (steps with name+text), formTitle. `<ScheduleForm />` takes no props. Apply `{...sectionProps(config)}`.

- [ ] **Step 3: Verify** render — panel + form card over the truck bg; the form's done-state swap still works (it is internal to `ScheduleForm`).

- [ ] **Step 4: Commit**

```bash
git add apps/miller-web/components-v2/06_sections/callouts/schedule-cta-01.jsx
git commit -m "feat(miller-web): ScheduleCta01 template (mw-sched scheduling CTA)"
```

---

## Task 12: Customer-waste-collection sandbox page + assembly

**Files:**
- Create: `apps/miller-web/app/template-testing/customer-waste-collection/page.jsx`
- Create (only if needed): `apps/miller-web/app/template-testing/customer-waste-collection/content.js`
- Reference: `app/industrial-services/customer-waste-collection/page.jsx`, `lib/content/service-customer-waste-collection.js`.

- [ ] **Step 1: Read the real `page.jsx`** — order (hero, scale, process, industries, cta, related), hero preload, metadata.

- [ ] **Step 2: Build the content mapping** (direct, or `content.js` adapter for genuine gaps; preserve strings/ids/literals verbatim; mark `// RECONCILE-IN-D:`). The industries trailing CTA comes from `customerWasteCollection.industries.cta`; the process `route` string from `process.route`.

- [ ] **Step 3: Build the sandbox `page.jsx`** composing in real order:

```jsx
export const metadata = { title: "TT — customer-waste-collection", robots: { index: false, follow: false } };
// reproduce hero preload <link> if present
// <ServiceHero01 content={…hero} config={{ alert:true, photoHalf:true, reveal:true }} />
// <CapacityLadder01 content={…scale} />
// <ProcessFlow01 content={…process (route, titleId)} />
// <PhotoCardGrid01 content={…industries (+cta)} config={{ cardStyle:"gallery", head:"split", trailingCta:true }} />
// <ScheduleCta01 content={…cta} />
// <RelatedRail01 content={{ currentSlug:"customer-waste-collection", titleId:"…" }} />
```

Use the exact `currentSlug`/`titleId` strings the real page uses.

- [ ] **Step 4: Verify** — load `http://localhost:3001/template-testing/customer-waste-collection`; all 6 sections render, banner present, no console errors.

- [ ] **Step 5: Commit**

```bash
git add "apps/miller-web/app/template-testing/customer-waste-collection/"
git commit -m "feat(miller-web): customer-waste-collection sandbox page (components-v2)"
```

---

## Task 13: Customer-waste-collection parity verification

**Files:**
- Create: `apps/miller-web/tests/template-testing-customer-waste-collection.spec.js`

- [ ] **Step 1: Write the parity spec** — identical structure to Task 8's spec, with `REAL = ".../industrial-services/customer-waste-collection"` and `TT = ".../template-testing/customer-waste-collection"`. Keep all four checks: section/order + reveal-attr placement parity, no stray variant attributes, full-page desktop byte parity, full-page mobile byte parity.

- [ ] **Step 2: Run it** — `cd apps/miller-web && npx playwright test tests/template-testing-customer-waste-collection.spec.js --reporter=line`. Structural + no-stray must pass.

- [ ] **Step 3: If a visual test fails, capture both screenshots and LOOK at them** (throwaway script → temp PNGs → Read each → diff by eye), fix the responsible template/sub-component until pixel-identical, re-run. Byte-identity is the bar.

- [ ] **Step 4: Opus review** — dispatch an Opus reviewer to compare CWC screenshots + template DOM vs source. Address findings.

- [ ] **Step 5: Commit**

```bash
git add apps/miller-web/tests/template-testing-customer-waste-collection.spec.js
git commit -m "test(miller-web): customer-waste-collection sandbox parity spec"
```

---

## Final verification (after all tasks)

- [ ] Run the whole sandbox suite: `cd apps/miller-web && npx playwright test tests/template-testing.spec.js tests/template-testing-banner-parity.spec.js tests/template-testing-emergency-response.spec.js tests/template-testing-customer-waste-collection.spec.js --reporter=line`. All pass.
- [ ] Confirm the real pages are byte-unchanged: `git status` shows no modifications under `app/industrial-services/**`, `app/styles/**`, `lib/content/service-*.js`, `components/**` (only `lib/nav.js` changed, +1 line).
- [ ] Dispatch a final Opus code-review across the whole Sub-project A diff (per subagent-driven-development), then proceed to `superpowers:finishing-a-development-branch`.

## Notes for the executor

- Dev server runs on port 3001 (start it if down: `cd apps/miller-web && npm run dev`). Playwright `BASE` is `http://localhost:3001`.
- Scroll-reveals only fire under IntersectionObserver; one-shot screenshots must emulate `prefers-reduced-motion: reduce` (snaps reveals visible) — already baked into the `prep()` helper.
- When a template wraps a client component, the template stays a server component; do not add `"use client"`.
- If pixel-diff reveals a difference that can only be fixed by changing `app/styles/*` or a `components/*` client component, STOP and escalate — that violates the constraints and means the template's DOM/class output is wrong, not the CSS.
