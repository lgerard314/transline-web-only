# components-v2 Content-Agnostic + Config-Driven Templates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every `components-v2` section template content-agnostic (all text/data via a `content` prop, sourced from `lib/content/template-testing-home.js`) and config-driven (`scheme` / `layout` / `tokens` knobs), while keeping `/template-testing` byte-identical to `/` under default config.

**Architecture:** Each section becomes `Section({ content, config = {} })`. The page config file assembles one content object per section (the only module importing HOME/SERVICES/CERTS/brand). Motif (clay stop, `…__title-em`, `mw-nobr`, `<br>`) stays in the template; content holds only words — the existing `StopText01` item applies the nobr+stop to a title's last word. Config knobs are emitted as `data-scheme`/`data-layout` attributes + inline CSS-variable `style` **only when non-default**, so default DOM is unchanged; one new route-scoped CSS file holds the variant rules. Built in two phases: **Phase 1** content extraction (parity-safe, zero new CSS), **Phase 2** config knobs + CSS.

**Tech Stack:** Next.js 16 App Router, React 19, alias `@/*` → `apps/miller-web/`. Dev server on http://localhost:3001.

**Reference spec:** `docs/superpowers/specs/2026-06-02-components-v2-content-and-config-design.md`

---

## Scope / do-not-touch

- Changes confined to: `apps/miller-web/components-v2/06_sections/**`, the `MarqueeBand01` widget, `apps/miller-web/lib/content/template-testing-home.js`, `apps/miller-web/app/template-testing/page.jsx`, `apps/miller-web/components-v2/06_sections/grids/bento-grid-order.js`, the new `apps/miller-web/app/template-testing/template-testing.css`, and `apps/miller-web/tests/template-testing.spec.js`.
- **Do not touch** `app/(home)/**`, `components/**`, `app/styles/**`, `app/layout.jsx`, `app/globals.css`, `lib/services.js`, `lib/certs.js`, `lib/content/brand.js`, `lib/nav.js`, `apps/brand/**`.
- **No render-output change under default config.** Strings must be reproduced verbatim, including unicode `—` (em dash) and `’` (curly apostrophe) where the JSX used `&mdash;` / `&rsquo;`.
- Leaf items/blocks/other widgets are already prop-driven — do not modify them (except `MarqueeBand01`).

## Helper de-cycle (do first, Task 1)

`bento-grid-order.js` currently exports `splitTitle` **and** `homeServiceOrder`, and `homeServiceOrder` imports `HOME_FIRST` from `template-testing-home.js`. The content file must compute the ordered services itself, which would create a cycle (config → bento-grid-order → config). Resolution: **move the ordering into the content file** and **trim `bento-grid-order.js` to `splitTitle` only** (a pure presentation helper the feature cards keep importing). `bento-grid-01` stops importing the order helper entirely (it receives `content.services`).

---

# PHASE 1 — Content extraction (parity-safe)

## Task 1: Build the page content file + trim the order helper

**Files:**
- Modify: `apps/miller-web/lib/content/template-testing-home.js` (add imports, ordering, 9 content objects; keep existing arrays)
- Modify: `apps/miller-web/components-v2/06_sections/grids/bento-grid-order.js` (remove `homeServiceOrder`, keep `splitTitle`)

- [ ] **Step 1: Trim `bento-grid-order.js` to just `splitTitle`**

```js
// L3 helper · bento-grid-order — splits a service title into two display lines.
export function splitTitle(title) {
  const parts = String(title).trim().split(/\s+/);
  if (parts.length <= 1) return { line1: title, line2: null };
  return { line1: parts.slice(0, -1).join(" "), line2: parts[parts.length - 1] };
}
```

- [ ] **Step 2: Add imports + ordering + content objects to `template-testing-home.js`**

At the TOP of the file (above the existing `export const HOME_FIRST`), add:

```js
import { HOME } from "@/app/(home)/home";
import { SERVICES } from "@/lib/services";
import { CERTS } from "@/lib/certs";
import { EMERGENCY_PHONE } from "@/lib/content/brand";

const EMERGENCY_HREF = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

function orderedServices() {
  const map = new Map(SERVICES.map((s) => [s.slug, s]));
  const head = HOME_FIRST.map((slug) => map.get(slug)).filter(Boolean);
  const rest = SERVICES.filter((s) => !HOME_FIRST.includes(s.slug)).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
  return [...head, ...rest];
}
```

(Keep the existing `HOME_FIRST`, `SECTOR_STATS`, `SECTOR_CARDS`, `FACILITY_PHOTOS`, `MILESTONES`, `AFFILIATES`, `SOCIALS` exactly as they are. `HOME_FIRST` must be declared before `orderedServices` uses it — since it's `export const HOME_FIRST` already near the top, place the import block above it and the `orderedServices`/`EMERGENCY_HREF` consts just below the `HOME_FIRST` declaration, or keep `orderedServices` as a function (hoisted) so order doesn't matter. Functions are hoisted, so the function form above is safe anywhere.)

At the BOTTOM of the file, add the 9 content objects:

```js
export const HERO = {
  titleId: "mw-hero-title",
  photoSrc: "/miller/hero/home-frame-1.png",
  mark: {
    logoSrc: "/miller/logo/miller-logomark.webp",
    name: "Miller Environmental",
    corpLong: "Corporation",
    corpShort: "Corp.",
    since: "Since 1996",
  },
  title: {
    line1: "leaders in",
    cyclePhrases: [{ text: "hazardous" }, { text: "safe", tone: "accent" }, { text: "reliable", tone: "accent" }],
    line3: "waste disposal",
  },
  lead: "Twenty-five years of licensed hazardous waste management in Manitoba. Three ISO certifications. One documented chain of custody from your loading dock to final disposition at VBEC.",
  primaryCta: { label: "Talk to Miller", href: "/contact-us/" },
  ghostPhone: { sup: "24/7 emergency", num: EMERGENCY_PHONE, href: EMERGENCY_HREF },
  article: { strong: "VBEC", rest: " · 64 ha, Montcalm MB · ISO 9001 · 14001 · 45001" },
};

export const CERTS_BANNER = { ariaLabel: "Certifications", certs: CERTS };

export const SERVICES_GRID = {
  headingId: "mw-services-heading",
  eyebrow: "Services",
  title: { lead: "whatever your waste needs,", em: "we’ve got you covered" },
  intro: "From routine industrial streams to one-off emergency calls, Miller’s licensed VBEC facility and field crews handle the full spectrum — collection, treatment, and final disposition, all under one roof.",
  services: orderedServices(),
  externalTile: {
    href: "https://www.transline49.com",
    photo: "/miller/services/vacuum-truck-new-logo.webp",
    titleLines: ["Cross-Border", "Services"],
    summary: "Transboundary movement of waste from the United States to Canada to mitigate your US liabilities.",
  },
};

export const SECTORS = {
  headingId: "mw-sectors-heading-copy",
  eyebrow: "Who we serve",
  title: "From refineries to households — and everything between",
  lead: "Large industrial manufacturers, public agencies, small businesses, and even the household-hazardous-waste drop-off down the street — one operator, one chain of custody.",
  stats: SECTOR_STATS,
  cards: SECTOR_CARDS,
};

export const FACILITY = {
  headingId: "mw-facility-heading-copy",
  eyebrow: "Vaughn Bullough Environmental Centre",
  title: { top: "VBEC", em: "A facility built for the work" },
  lead: HOME.vbec.body,
  figures: [
    { label: "Footprint", num: "64", unit: "hectares" },
    { label: "Location", num: "70", unit: "km S of Winnipeg" },
    { label: "Operating", num: "1996", unit: "to today" },
  ],
  capsTitle: "7 powerful capabilities",
  capabilities: HOME.vbec.capabilities,
  primaryCta: { longLabel: HOME.vbec.cta.label, shortLabel: "Visit Facility", href: HOME.vbec.cta.href },
  aboutLink: { longLabel: HOME.vbec.aboutLinkLabel, shortLabel: "Read the story", href: HOME.vbec.aboutHref },
  photos: FACILITY_PHOTOS,
};

export const HISTORY = {
  headingId: "mw-tenure-heading-copy-b",
  eyebrow: "Our history",
  title: { lead: "Three decades in", em: "hazardous waste" },
  lead: "Miller Environmental was formed in 1996 as Manitoba’s first private-public hazardous-waste operator. Vaughn Bullough joined as General Manager in 1997 and led operations for twenty-five years. The facility was renamed in his honour in 2022. The work continues.",
  timelineNote: "*hover for more info",
  milestones: MILESTONES,
  plate: {
    imgSrc: "/miller/full-truck-sideview.png",
    stats: [
      { num: "25", unit: "+yrs", label: "Relationships" },
      { num: "96", unit: "%", label: "In-house" },
      { num: "4.5", unit: "ML/yr", label: "Solvent reclaimed" },
    ],
  },
  mission: {
    heading: "Mission",
    paragraphs: [
      "At Miller Environmental, our mission is to lead the hazardous waste disposal industry by exemplifying unwavering commitment to environmentally responsible practices, rigorous regulatory compliance, and continuous innovation.",
      "We prioritize safety in all operations, ensuring the well-being of our team, clients, and the communities we serve.",
      "Our dedication to transparency fosters trust, while active community engagement reflects our belief in shared responsibility.",
    ],
    cta: HOME.mission.cta,
  },
};

export const CAREERS = {
  headingId: "mw-careers-bleed-heading",
  bleedPhotoSrc: "/miller/careers/team-at-conv-booth-big-5.jpg",
  eyebrow: "Careers",
  title: { lead: "Join the", em: "Miller team" },
  lead: HOME.joinFamily.intro,
  cards: [
    { tag: "Culture", title: HOME.joinFamily.whyTitle, text: HOME.joinFamily.whyBody, cta: HOME.joinFamily.whyCta },
    { tag: "Hiring now", title: HOME.joinFamily.opportunitiesTitle, text: HOME.joinFamily.opportunitiesBody, cta: HOME.joinFamily.opportunitiesCta },
  ],
};

export const AFFILIATES_BANNER = { ariaLabel: "Affiliates", label: ["Proud", "affiliates"], items: AFFILIATES };

export const FINAL_CTA = {
  headingId: "mw-final-heading",
  truckImgSrc: "/miller/truck-graphic-angled.png",
  logoImgSrc: "/miller/logo/miller-logomark.webp",
  eyebrow: HOME.finalCta.eyebrow,
  title: HOME.finalCta.title,
  body: HOME.finalCta.body,
  primaryCta: { label: "Contact Miller", href: HOME.finalCta.contactHref },
  ghostPhone: { sup: "24/7 emergency", num: HOME.finalCta.emergencyDisplay, href: HOME.finalCta.emergencyHref },
  socials: SOCIALS,
};
```

- [ ] **Step 3: Verify the config compiles + no cycle** — `cd apps/miller-web && node -e "require('@babel/register'); " ` is not available; instead rely on the dev server: after Task 2's first section wiring it will compile. For now just confirm no syntax error by `npx eslint lib/content/template-testing-home.js` (eslint is configured). Expected: no parse errors. (feature-card/feature-tile still import `splitTitle` from bento-grid-order — unaffected.)

- [ ] **Step 4: Commit**

```bash
git add apps/miller-web/lib/content/template-testing-home.js apps/miller-web/components-v2/06_sections/grids/bento-grid-order.js
git commit -m "feat(miller-web): add per-section content objects to template-testing config"
```
(PowerShell tool; no --no-verify; Co-Authored-By trailer for Claude Opus 4.8.)

---

## Task 2: monument-hero — content-driven

**Files:** Modify `apps/miller-web/components-v2/06_sections/heroes/monument-hero-01.jsx` and `app/template-testing/page.jsx`.

- [ ] **Step 1: Replace the file with the content-driven version**

```jsx
// L3 · monument-hero-01 — civic-monument hero on darkened site photo.
import { PhraseCycle01 } from "@/components-v2/05_widgets/cycles/phrase-cycle-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { GhostPhoneCta01 } from "@/components-v2/02_buttons/ghost/ghost-phone-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";

export function MonumentHero01({ content, config = {} }) {
  const { mark, title, lead, primaryCta, ghostPhone, article, photoSrc, titleId } = content;
  return (
    <section className="mw-hero" aria-labelledby={titleId}>
      <div className="mw-hero__photo" aria-hidden="true" style={{ backgroundImage: `url(${photoSrc})` }} />
      <div className="mw-hero__inner">
        <p className="mw-hero__mark" aria-hidden="true">
          <img className="mw-hero__mark-logo" src={mark.logoSrc} alt="" />
          <span className="mw-hero__mark-corp">
            {mark.name}{" "}
            <span className="mw-hero__mark-corp-long">{mark.corpLong}</span>
            <span className="mw-hero__mark-corp-short">{mark.corpShort}</span>
          </span>
          <span className="mw-hero__mark-meta">
            <span className="mw-hero__mark-dot" />
            <span className="mw-hero__mark-since">{mark.since}</span>
          </span>
        </p>

        <h1 id={titleId} className="mw-hero__title">
          <span className="mw-hero__line">{title.line1}</span>
          <span className="mw-hero__line"><PhraseCycle01 phrases={title.cyclePhrases} /></span>
          <span className="mw-hero__line"><StopText01 stopClassName="mw-hero__stop">{title.line3}</StopText01></span>
        </h1>

        <p className="mw-hero__lead">{lead}</p>

        <div className="mw-hero__foot">
          <div className="mw-hero__ctas">
            <SolidCta01 href={primaryCta.href}>{primaryCta.label} <ActionArrow01 /></SolidCta01>
            <GhostPhoneCta01 sup={ghostPhone.sup} num={ghostPhone.num} href={ghostPhone.href} ariaLabel={`Call 24/7 emergency: ${ghostPhone.num}`} />
          </div>
          <p className="mw-hero__article"><strong>{article.strong}</strong>{article.rest}</p>
        </div>
      </div>
    </section>
  );
}
```

> Note: `StopText01` renders `waste <span class="mw-nobr">disposal<span class="mw-hero__stop"/></span>` — byte-identical to the original hero line 3. The original `mw-hero__title` had no `data-reveal`; none added.

- [ ] **Step 2: Wire the page** — in `app/template-testing/page.jsx` add to imports `import { HERO } from "@/lib/content/template-testing-home";` and change `<MonumentHero01 />` → `<MonumentHero01 content={HERO} />`.

- [ ] **Step 3: Verify** — `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/template-testing` → 200. Visually confirm the hero is unchanged (mark line, monument title with cycling word + clay stop, lead, CTAs, article).

- [ ] **Step 4: Commit**

```bash
git add apps/miller-web/components-v2/06_sections/heroes/monument-hero-01.jsx apps/miller-web/app/template-testing/page.jsx
git commit -m "feat(miller-web): monument-hero-01 renders from content prop"
```

---

## Task 3: tall-static-banner — content-driven

**Files:** Modify `…/banners/tall-static-banner-01.jsx` + page.

- [ ] **Step 1: Replace file**

```jsx
// L3 · tall-static-banner-01 — trust band; download-card row under the hero.
import { DownloadCard01 } from "@/components-v2/03_cards/download/download-card-01";

export function TallStaticBanner01({ content, config = {} }) {
  return (
    <section className="mw-trust" aria-label={content.ariaLabel}>
      <div className="mw-certs" role="list" aria-label={content.ariaLabel} data-reveal-stagger>
        {content.certs.map((cert) => (<DownloadCard01 key={cert.slug} cert={cert} />))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire page** — import `CERTS_BANNER`; `<TallStaticBanner01 content={CERTS_BANNER} />`.
- [ ] **Step 3: Verify** route 200; 4 cert cards unchanged.
- [ ] **Step 4: Commit** `feat(miller-web): tall-static-banner-01 renders from content prop`

---

## Task 4: bento-grid — content-driven

**Files:** Modify `…/grids/bento-grid-01.jsx` + page.

- [ ] **Step 1: Replace file** (note: `homeServiceOrder` no longer imported — services come from `content.services`; title built here with `StopText01`)

```jsx
import { HeadIntro01 } from "@/components-v2/04_blocks/heads/head-intro-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { FeatureAnchor01 } from "@/components-v2/03_cards/feature/feature-anchor-01";
import { FeatureCard01 } from "@/components-v2/03_cards/feature/feature-card-01";
import { FeatureTile01 } from "@/components-v2/03_cards/feature/feature-tile-01";

export function BentoGrid01({ content, config = {} }) {
  const s = content.services;
  const t = content.title;
  const ext = content.externalTile;
  return (
    <section className="mw-services" aria-labelledby={content.headingId}>
      <div className="mw-inner">
        <HeadIntro01
          eyebrow={content.eyebrow}
          headingId={content.headingId}
          className="mw-services__head"
          title={<>{t.lead}<br /><span className="mw-services__title-em"><StopText01>{t.em}</StopText01></span></>}
          intro={content.intro}
        />
        <ul className="mw-svcs-grid" aria-label="Capabilities" data-reveal-stagger>
          <li><FeatureAnchor01 service={s[0]} /></li>
          {s.slice(1, 3).map((svc, i) => (<li key={svc.id}><FeatureCard01 service={svc} n={i + 2} /></li>))}
          {s.slice(3, 6).map((svc, i) => (<li key={svc.id}><FeatureTile01 service={svc} n={i + 4} /></li>))}
          <li><FeatureTile01 external href={ext.href} photo={ext.photo} titleLines={ext.titleLines} summary={ext.summary} n={7} /></li>
          {[s[6], s[8], s[9]].map((svc, i) => (<li key={svc.id}><FeatureTile01 service={svc} n={i + 8} /></li>))}
          <li><FeatureTile01 service={s[7]} n={11} /></li>
        </ul>
      </div>
    </section>
  );
}
```

> `StopText01` on `t.em` ("we’ve got you covered") renders `we’ve got you <span class="mw-nobr">covered<span class="mw-stop"/></span>` inside the `mw-services__title-em` span — byte-identical. `HeadIntro01` already accepts a `title` node + `intro` (string or node).

- [ ] **Step 2: Wire page** — import `SERVICES_GRID`; `<BentoGrid01 content={SERVICES_GRID} />`.
- [ ] **Step 3: Verify** route 200; grid order/numbers/external tile unchanged.
- [ ] **Step 4: Commit** `feat(miller-web): bento-grid-01 renders from content prop`

---

## Task 5: hover-card-grid — content-driven

**Files:** Modify `…/grids/hover-card-grid-01.jsx` + page.

- [ ] **Step 1: Replace file**

```jsx
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { StatCycle01 } from "@/components-v2/05_widgets/cycles/stat-cycle-01";
import { HoverCard01 } from "@/components-v2/05_widgets/galleries/hover-card-01";

export function HoverCardGrid01({ content, config = {} }) {
  return (
    <section className="mw-sec2" aria-labelledby={content.headingId}>
      <div className="mw-inner">
        <header className="mw-sec2__head">
          <Eyebrow01 label={content.eyebrow} reveal />
          <div className="mw-sec2__head-split" data-reveal-stagger>
            <div className="mw-sec2__head-left">
              <h2 id={content.headingId} className="mw-sec2__title"><StopText01>{content.title}</StopText01></h2>
              <p className="mw-sec2__lead">{content.lead}</p>
            </div>
            <div className="mw-sec2__head-right">
              <StatCycle01 stats={content.stats} />
            </div>
          </div>
        </header>
        <div className="mw-sec2__cards" data-reveal-stagger>
          {content.cards.map((card) => (<HoverCard01 key={card.title} title={card.title} items={card.items} />))}
        </div>
      </div>
    </section>
  );
}
```

> `StopText01` on the full title string stops the last word ("between") — byte-identical (the title has no `title-em`, just the trailing nobr+stop).

- [ ] **Step 2: Wire page** — import `SECTORS`; `<HoverCardGrid01 content={SECTORS} />`.
- [ ] **Step 3: Verify** route 200; sectors head + 4 cards + stat cycle unchanged.
- [ ] **Step 4: Commit** `feat(miller-web): hover-card-grid-01 renders from content prop`

---

## Task 6: media-split — content-driven

**Files:** Modify `…/splits/media-split-01.jsx` + page.

- [ ] **Step 1: Replace file**

```jsx
import Link from "next/link";
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { FigureStat01 } from "@/components-v2/04_blocks/stats/figure-stat-01";
import { CapItem01 } from "@/components-v2/04_blocks/stats/cap-item-01";
import { ThumbGallery01 } from "@/components-v2/05_widgets/galleries/thumb-gallery-01";

export function MediaSplit01({ content, config = {} }) {
  const { eyebrow, title, lead, figures, capsTitle, capabilities, primaryCta, aboutLink, headingId, photos } = content;
  return (
    <section className="mw-fac2" aria-labelledby={headingId}>
      <div className="mw-inner">
        <div className="mw-fac2__split">
          <div className="mw-fac2__content" data-reveal-stagger>
            <header className="mw-fac2__head">
              <Eyebrow01 label={eyebrow} />
              <h2 id={headingId} className="mw-fac2__title">
                <StopText01>{title.top}</StopText01><br /><span className="mw-fac2__title-em"><StopText01>{title.em}</StopText01></span>
              </h2>
            </header>
            <p className="mw-fac2__lead">{lead}</p>
            <dl className="mw-fac2__figs" aria-label="Facility figures">
              {figures.map((f) => (<FigureStat01 key={f.label} label={f.label} num={f.num} unit={f.unit} />))}
            </dl>
            <div className="mw-fac2__actions">
              <SolidCta01 href={primaryCta.href}>
                <span className="mw-fac2__lbl-long">{primaryCta.longLabel}</span>
                <span className="mw-fac2__lbl-short">{primaryCta.shortLabel}</span>
                {" "}<ActionArrow01 />
              </SolidCta01>
              <Link href={aboutLink.href} className="mw-fac2__about">
                <span className="mw-fac2__lbl-long">{aboutLink.longLabel}</span>
                <span className="mw-fac2__lbl-short">{aboutLink.shortLabel}</span>
                {" "}<span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <ThumbGallery01 photos={photos} />
        </div>
        <div className="mw-fac2__caps">
          <header className="mw-fac2__caps-head" data-reveal>
            <h3 className="mw-fac2__caps-title">
              <span className="mw-fac2__caps-mark" aria-hidden="true" />
              <span>{capsTitle}</span>
            </h3>
          </header>
          <ol className="mw-fac2__caps-grid" aria-label="Onsite capabilities" data-reveal-stagger>
            {capabilities.map((cap, i) => (<CapItem01 key={i} n={i + 1} name={cap} />))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

> `FACILITY.photos` (= `FACILITY_PHOTOS`) is already present in the Task 1 object. The two `StopText01` calls reproduce `VBEC.` and the `title-em` "A facility built for the work." exactly.

- [ ] **Step 2: Wire page** — import `FACILITY`; `<MediaSplit01 content={FACILITY} />`.
- [ ] **Step 3: Verify** route 200; facility split (title, figures, gallery, 7 caps, both CTA links) unchanged.
- [ ] **Step 4: Commit** `feat(miller-web): media-split-01 renders from content prop`

---

## Task 7: timeline-split — content-driven

**Files:** Modify `…/splits/timeline-split-01.jsx` + page.

- [ ] **Step 1: Replace file**

```jsx
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { VerticalTimeline01 } from "@/components-v2/05_widgets/timelines/vertical-timeline-01";
import { PlateStat01 } from "@/components-v2/04_blocks/stats/plate-stat-01";
import { MissionBlock01 } from "@/components-v2/04_blocks/prose/mission-block-01";

export function TimelineSplit01({ content, config = {} }) {
  const { eyebrow, title, lead, timelineNote, milestones, plate, mission, headingId } = content;
  return (
    <section className="mw-ten3" aria-labelledby={headingId}>
      <div className="mw-inner">
        <div className="mw-ten3__grid">
          <aside className="mw-ten3__timeline" aria-label="Company milestones">
            <p className="mw-ten3__timeline-note">{timelineNote}</p>
            <VerticalTimeline01 items={milestones} />
          </aside>
          <div className="mw-ten3__body">
            <header className="mw-ten3__head" data-reveal>
              <Eyebrow01 label={eyebrow} />
              <h2 id={headingId} className="mw-ten3__title">
                {title.lead} <span className="mw-ten3__title-em"><StopText01>{title.em}</StopText01></span>
              </h2>
              <p className="mw-ten3__lead">{lead}</p>
            </header>
            <div className="mw-ten3__plate" aria-label="Track record" data-reveal>
              <img className="mw-ten3__plate-img" src={plate.imgSrc} alt="" aria-hidden="true" loading="lazy" />
              <dl className="mw-ten3__plate-stats">
                {plate.stats.map((st) => (<PlateStat01 key={st.label} num={st.num} unit={st.unit} label={st.label} />))}
              </dl>
            </div>
            <MissionBlock01 paragraphs={mission.paragraphs} cta={mission.cta} heading={mission.heading} />
          </div>
        </div>
      </div>
    </section>
  );
}
```

> Two adjustments needed for byte-identity:
> 1. The original title is `Three decades in <span class="mw-ten3__title-em">hazardous <span class="mw-nobr">waste<stop/></span></span>` — note the SPACE after "in". The JSX above renders `{title.lead} <span…>` (space between `{title.lead}` and the span) → matches. Good.
> 2. `MissionBlock01` currently hardcodes the `Mission` heading. **Update `MissionBlock01`** (`04_blocks/prose/mission-block-01.jsx`) to accept a `heading` prop: `export function MissionBlock01({ heading, paragraphs, cta })` and render `<h3 className="mw-ten2__mission-heading">{heading}</h3>`. This is a block edit (allowed — it's a v2 block, and the heading is content). Pass `heading={mission.heading}`.

- [ ] **Step 2: Update `MissionBlock01`** to take `heading` (per note above).
- [ ] **Step 3: Wire page** — import `HISTORY`; `<TimelineSplit01 content={HISTORY} />`.
- [ ] **Step 4: Verify** route 200; history timeline, title, lead, plate stats, mission unchanged.
- [ ] **Step 5: Commit** `feat(miller-web): timeline-split-01 renders from content prop`

---

## Task 8: photo-bleed-cards — content-driven

**Files:** Modify `…/callouts/photo-bleed-cards-01.jsx` + page.

- [ ] **Step 1: Replace file**

```jsx
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { NoteCard01 } from "@/components-v2/03_cards/note/note-card-01";

export function PhotoBleedCards01({ content, config = {} }) {
  const { bleedPhotoSrc, eyebrow, title, lead, cards, headingId } = content;
  return (
    <section className="mw-careers mw-careers--bleed" aria-labelledby={headingId}>
      <div className="mw-careers__bleed-photo" aria-hidden="true">
        <img src={bleedPhotoSrc} alt="" loading="lazy" />
      </div>
      <div className="mw-inner">
        <header className="mw-careers__head">
          <div className="mw-careers__head-text" data-reveal>
            <Eyebrow01 label={eyebrow} invert />
            <h2 id={headingId} className="mw-careers__title">
              {title.lead}<br /><span className="mw-careers__title-em"><StopText01>{title.em}</StopText01></span>
            </h2>
            <p className="mw-careers__lead">{lead}</p>
          </div>
        </header>
        <div className="mw-careers__cards" data-reveal-stagger>
          {cards.map((card) => (<NoteCard01 key={card.tag} tag={card.tag} title={card.title} text={card.text} cta={card.cta} />))}
        </div>
      </div>
    </section>
  );
}
```

> `{title.lead}<br/>` has NO space (original: `Join the<br/>`), matching the original exactly.

- [ ] **Step 2: Wire page** — import `CAREERS`; `<PhotoBleedCards01 content={CAREERS} />`.
- [ ] **Step 3: Verify** route 200; careers dark bleed + 2 cards unchanged.
- [ ] **Step 4: Commit** `feat(miller-web): photo-bleed-cards-01 renders from content prop`

---

## Task 9: rotating-banner + MarqueeBand01 — content-driven

**Files:** Modify `…/banners/rotating-banner-01.jsx`, `…/05_widgets/marquees/marquee-band-01.jsx`, + page.

- [ ] **Step 1: Make `MarqueeBand01` prop-driven** (`05_widgets/marquees/marquee-band-01.jsx`)

```jsx
// L2 · marquee-band-01 — label + moving brand Marquee track.
import { Marquee } from "@white-owl/brand/components";

export function MarqueeBand01({ label, items }) {
  return (
    <div className="mw-marquee__row">
      <p className="mw-marquee__label">{label}<span className="mw-stop-colon" aria-hidden="true" /></p>
      <Marquee items={items.map((a) => (
        <img key={a.src} className="mw-marquee__logo" src={a.src} alt={a.name} loading="lazy" />
      ))} />
    </div>
  );
}
```

> **Byte-identity note:** the original label was `Proud<br />affiliates<span class="mw-stop-colon"/>` — a hard `<br>` between "Proud" and "affiliates". To preserve this exactly, the `AFFILIATES_BANNER.label` content must carry that break. Change the content (Task 1) to `label: ["Proud", "affiliates"]` (array of lines) and render `{label.map((ln, i) => (<span key={i}>{i > 0 && <br />}{ln}</span>))}` — OR keep `label: "Proud affiliates"` and split on space in the template. **Decision: use `label: ["Proud", "affiliates"]`** and render lines joined by `<br/>`:
> ```jsx
> <p className="mw-marquee__label">{label.map((ln, i) => (<span key={i}>{i > 0 ? <br /> : null}{ln}</span>))}<span className="mw-stop-colon" aria-hidden="true" /></p>
> ```
> Wrapping each line in a `<span>` adds elements vs the original bare-text+`<br>`. To stay TRULY byte-identical, instead render with a fragment and no extra spans:
> ```jsx
> <p className="mw-marquee__label">{label.flatMap((ln, i) => (i === 0 ? [ln] : [<br key={i} />, ln]))}<span className="mw-stop-colon" aria-hidden="true" /></p>
> ```
> Use this fragment form. `AFFILIATES_BANNER.label` is already `["Proud", "affiliates"]` in the Task 1 object.

- [ ] **Step 2: Make `rotating-banner-01` content-driven**

```jsx
import { MarqueeBand01 } from "@/components-v2/05_widgets/marquees/marquee-band-01";

export function RotatingBanner01({ content, config = {} }) {
  return (
    <section className="mw-marquee" aria-label={content.ariaLabel}>
      <MarqueeBand01 label={content.label} items={content.items} />
    </section>
  );
}
```

- [ ] **Step 3: Wire page** — import `AFFILIATES_BANNER`; `<RotatingBanner01 content={AFFILIATES_BANNER} />`.
- [ ] **Step 4: Verify** route 200; affiliate marquee + "Proud / affiliates:" label + scrolling logos unchanged.
- [ ] **Step 5: Commit** `feat(miller-web): rotating-banner-01 + marquee-band-01 render from content`

---

## Task 10: multi-column-cta — content-driven

**Files:** Modify `…/callouts/multi-column-cta-01.jsx` + page.

- [ ] **Step 1: Replace file**

```jsx
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { GhostPhoneCta01 } from "@/components-v2/02_buttons/ghost/ghost-phone-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { IconLink01 } from "@/components-v2/03_cards/icon-link/icon-link-01";

export function MultiColumnCta01({ content, config = {} }) {
  const { truckImgSrc, logoImgSrc, eyebrow, title, body, primaryCta, ghostPhone, socials, headingId } = content;
  return (
    <section className="mw-final" aria-labelledby={headingId}>
      <div className="mw-final__grid" data-reveal-stagger>
        <div className="mw-final__col mw-final__col--truck">
          <img className="mw-final__truck" src={truckImgSrc} alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="mw-final__col mw-final__col--content">
          <p className="mw-section-tag mw-final__tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{eyebrow}</span>
          </p>
          <h2 id={headingId} className="mw-final__title"><StopText01>{title.replace(/\.\s*$/, "")}</StopText01></h2>
          <p className="mw-final__body">{body}</p>
          <div className="mw-final__row">
            <SolidCta01 href={primaryCta.href}>{primaryCta.label} <ActionArrow01 /></SolidCta01>
            <GhostPhoneCta01 sup={ghostPhone.sup} num={ghostPhone.num} href={ghostPhone.href} ariaLabel={`Call 24/7 emergency: ${ghostPhone.num}`} />
          </div>
          <span className="mw-final__divider" aria-hidden="true" />
          <ul className="mw-final__socials" aria-label="Miller Environmental on social media">
            {socials.map((so) => (<li key={so.label}><IconLink01 label={so.label} href={so.href} path={so.path} /></li>))}
          </ul>
        </div>
        <div className="mw-final__col mw-final__col--logo">
          <img className="mw-final__logomark" src={logoImgSrc} alt="" aria-hidden="true" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
```

> The eyebrow stays inlined (it carries the extra `mw-final__tag` class) — this is correct. The unused `Eyebrow01` import is removed (it was dead). `StopText01` keeps the trailing-period strip.

- [ ] **Step 2: Wire page** — import `FINAL_CTA`; `<MultiColumnCta01 content={FINAL_CTA} />`.
- [ ] **Step 3: Verify** route 200; final CTA (truck, title with stop, body, CTAs, socials, logo) unchanged.
- [ ] **Step 4: Commit** `feat(miller-web): multi-column-cta-01 renders from content prop`

---

## Task 11: Phase 1 parity gate

**Files:** none (verification + content-leak check).

- [ ] **Step 1: Grep for residual baked content** — every section file should now have NO hardcoded human-readable sentence. Run:
```bash
cd apps/miller-web
grep -rnE "Twenty-five years|chain of custody|refineries to households|A facility built|Three decades|Join the|Proud|Cross-Border|powerful capabilities|Talk to Miller|Contact Miller|24/7 emergency|Who we serve|Our history" components-v2/06_sections components-v2/05_widgets/marquees || echo "no baked content ✓"
```
Expected: `no baked content ✓` (these strings now live only in `lib/content/template-testing-home.js`). Class names, aria roles, and the `Call 24/7 emergency:` aria-label template (derived from `ghostPhone.num`) are acceptable — but the standalone content strings above must be gone.

- [ ] **Step 2: Full build + parity tests**
```bash
npx next build 2>&1 | tail -15      # no Module-not-found
npx playwright test tests/template-testing.spec.js --workers=1   # 5 passed
```

- [ ] **Step 3: Reduced-motion screenshot parity** — capture `/` vs `/template-testing` at 1440 (reduced-motion) and confirm identical (controller reviews). Document any drift.

- [ ] **Step 4: Confirm scope** — `git status` shows only the in-scope files changed; nothing under app/(home)/, components/ (except the v2 widget/blocks), styles/.

(No new commit — Phase 1 commits already landed per task. This is a gate before Phase 2.)

---

# PHASE 2 — Config knobs (scheme / layout / tokens)

## Task 12: Shared config helper + the variant CSS file

**Files:**
- Create: `apps/miller-web/components-v2/section-config.js` (tiny helper that turns `config` into DOM props)
- Create: `apps/miller-web/app/template-testing/template-testing.css`
- Modify: `apps/miller-web/app/template-testing/page.jsx` (import the CSS once)

- [ ] **Step 1: Create the config→props helper** so every section applies knobs identically

```js
// components-v2/section-config.js
// Turns a section `config` object into the extra DOM props a section root needs.
// Emits attributes/inline-style ONLY for non-default values, so default config
// leaves the DOM byte-identical.
export function sectionProps(config = {}) {
  const props = {};
  if (config.scheme) props["data-scheme"] = config.scheme;
  if (config.layout) props["data-layout"] = config.layout;
  if (config.tokens && Object.keys(config.tokens).length) props.style = { ...config.tokens };
  return props;
}
```

- [ ] **Step 2: Create `template-testing.css`** (variant rules only; existing tokens; reverse gated to each split's multi-column breakpoint)

```css
/* /template-testing variant styles — opt-in via config; default render unaffected.
   Surface-tone schemes re-bind core palette tokens on the section subtree, so all
   descendant mw-* color rules follow. Tokens are the existing warm-clay set. */

[data-scheme="dark"] {
  --c-bg: var(--c-navy);
  --c-surface-warm: var(--c-navy);
  --c-surface: var(--c-navy-2);
  --c-ink: #ffffff;
  --c-ink-2: rgba(250, 243, 229, 0.91);
  --c-ink-3: rgba(250, 243, 229, 0.7);
  --c-line: var(--c-navy-2);
}
[data-scheme="cream"] {
  --c-surface-warm: var(--c-bg);
}
[data-scheme="warm"] {
  --c-bg: var(--c-surface-warm);
}

/* Column reversal — desktop only. Breakpoints MUST match each section's own
   multi-column query in app/styles/04-home.css (read them and fill in below).
   Below the breakpoint the section is stacked; we leave natural order intact. */
@media (min-width: var(--FAC2_BP)) {  /* facility split */
  .mw-fac2__split[data-layout="reverse"] { flex-direction: row-reverse; }
}
@media (min-width: var(--SEC2_BP)) {  /* sectors head split */
  .mw-sec2__head-split[data-layout="reverse"] { flex-direction: row-reverse; }
}
@media (min-width: var(--FINAL_BP)) { /* final-cta grid */
  .mw-final__grid[data-layout="reverse"] { direction: rtl; }
  .mw-final__grid[data-layout="reverse"] > * { direction: ltr; }
}
```

> **Implementer must replace `var(--FAC2_BP)` / `--SEC2_BP` / `--FINAL_BP`** with the literal `min-width` values found in `app/styles/04-home.css` for `.mw-fac2__split`, `.mw-sec2__head-split`, and `.mw-final__grid` (search those selectors for their `@media (min-width: …)` / flex-vs-block switch). CSS `@media` cannot use `var()` — these are placeholders to fill with literals (e.g. `900px`). Also confirm whether each split is flex or grid; if grid, reverse via `direction`/`order` instead of `flex-direction` (the `data-layout` attribute goes on the split container, which the templates set in Task 13).

- [ ] **Step 3: Import the CSS in the page** — add `import "./template-testing.css";` at the top of `app/template-testing/page.jsx`.

- [ ] **Step 4: Verify default unaffected** — route 200; no `[data-scheme]`/`[data-layout]` present yet (no section passes config), so render is unchanged. Commit:
```bash
git add apps/miller-web/components-v2/section-config.js apps/miller-web/app/template-testing/template-testing.css apps/miller-web/app/template-testing/page.jsx
git commit -m "feat(miller-web): add section-config helper + variant CSS scaffold"
```

## Task 13: Apply `sectionProps` to every section root + `data-layout` on split containers

**Files:** all 9 section files.

- [ ] **Step 1: Spread `sectionProps(config)` on each `<section>`** — e.g. monument-hero: `<section className="mw-hero" aria-labelledby={titleId} {...sectionProps(config)}>`. Import `{ sectionProps } from "@/components-v2/section-config"` in each. Do this for all 9 sections.

- [ ] **Step 2: Put `data-layout` on the split CONTAINER for the 3 reversible sections** (the scheme/tokens go on the section root; the *layout* attribute must sit on the element the CSS targets):
  - media-split: `<div className="mw-fac2__split" data-layout={config.layout}>` (renders nothing when undefined).
  - hover-card-grid: `<div className="mw-sec2__head-split" data-reveal-stagger data-layout={config.layout}>`.
  - multi-column-cta: `<div className="mw-final__grid" data-reveal-stagger data-layout={config.layout}>`.
  (`data-layout={undefined}` emits no attribute — default safe.)

- [ ] **Step 3: Verify default still byte-identical** — no config passed anywhere yet ⇒ no attributes. route 200; 5 parity tests pass.
- [ ] **Step 4: Commit** `feat(miller-web): sections accept scheme/layout/tokens config`

## Task 14: Variant tests

**Files:** Modify `apps/miller-web/tests/template-testing.spec.js`.

- [ ] **Step 1: Add a scratch variant route OR test via direct prop render.** Simplest within the existing harness: add a temporary query-driven variant is overkill — instead assert the mechanism with a focused unit-style DOM test using a tiny inline fixture page is out of scope. Use this approach: add a Playwright test that navigates to `/template-testing`, then in-page checks that passing config would work by asserting the helper contract via evaluating `sectionProps`. Since the page doesn't pass config, assert instead the **negative parity guarantee** + a **positive variant** via a dedicated scratch route:

  Create `apps/miller-web/app/template-testing-variants/page.jsx` (new, noindex) that renders three sections with non-default config:
  ```jsx
  import "./../template-testing/template-testing.css";
  import { MediaSplit01 } from "@/components-v2/06_sections/splits/media-split-01";
  import { MonumentHero01 } from "@/components-v2/06_sections/heroes/monument-hero-01";
  import { FACILITY, HERO } from "@/lib/content/template-testing-home";
  export const metadata = { title: "TT variants", robots: { index: false, follow: false } };
  export default function P() {
    return (<>
      <MonumentHero01 content={HERO} config={{ scheme: "cream", tokens: { "--c-accent": "#7a3d12" } }} />
      <MediaSplit01 content={FACILITY} config={{ layout: "reverse" }} />
    </>);
  }
  ```

- [ ] **Step 2: Add tests**
```js
test("config: scheme emits data-scheme + token override applies", async ({ page }) => {
  await page.goto(`${BASE}/template-testing-variants`);
  await expect(page.locator('.mw-hero[data-scheme="cream"]')).toBeAttached();
  const accent = await page.evaluate(() => getComputedStyle(document.querySelector(".mw-hero")).getPropertyValue("--c-accent").trim());
  expect(accent).toBe("#7a3d12");
});

test("config: default page emits no variant attributes (parity)", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  expect(await page.locator("main [data-scheme], main [data-layout]").count()).toBe(0);
});

test("config: reverse layout flips facility split above breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${BASE}/template-testing-variants`);
  const dir = await page.evaluate(() => getComputedStyle(document.querySelector(".mw-fac2__split[data-layout='reverse']")).flexDirection);
  expect(dir).toBe("row-reverse");   // adjust to the actual reverse mechanism chosen in Task 12
});
```

- [ ] **Step 3: Run** `npx playwright test tests/template-testing.spec.js --workers=1` → all pass (8 total).
- [ ] **Step 4: Commit** `test(miller-web): variant config tests + scratch variants route`

---

## Self-Review (against the spec)

**1. Spec coverage:** §2 signature → every section task; §3 single content source → Task 1; §4 motif-in-template (StopText01) → Tasks 2,4,5,6,7,8,10; §5 config knobs → Tasks 12–13 (scheme/layout/tokens/id/reveal — `id` already via `headingId` content, `reveal` already supported); §6 per-section shapes → Task 1 objects; §7 CSS (one new file) → Task 12; §8 parity + variant tests → Tasks 11 + 14; §9 phasing → Phase 1 / Phase 2 split. No gaps. (Fixed inline: added `photos: FACILITY_PHOTOS` to FACILITY; changed AFFILIATES_BANNER.label to `["Proud","affiliates"]` for the `<br>`; added `heading` prop to MissionBlock01.)

**2. Placeholder scan:** No "TBD"/"similar to". The only deferred literals are the three reverse-column breakpoints in Task 12 — explicitly flagged as "read from 04-home.css and replace these named placeholders," with the exact selectors to read. That is a genuine read-the-existing-value instruction, not a hand-wave.

**3. Identifier consistency:** content object names (HERO, CERTS_BANNER, SERVICES_GRID, SECTORS, FACILITY, HISTORY, CAREERS, AFFILIATES_BANNER, FINAL_CTA) match between Task 1 and the per-section wiring; field names used in each template match the Task-1 object shape; `sectionProps` signature consistent across Tasks 12–13; `MarqueeBand01({label, items})` matches its caller; `MissionBlock01({heading,paragraphs,cta})` matches its caller.

## Known traps for the implementer

- **Unicode, not entities:** content strings use `—` (em dash) and `’` (curly apostrophe) directly — never `&mdash;`/`&rsquo;` (those only work inside JSX, not JS string literals). Mismatch = visible text drift.
- **`StopText01` is the title workhorse** — it wraps the last word in `mw-nobr` + the stop; pass `stopClassName="mw-hero__stop"` only for the hero. Everywhere else the default `mw-stop` is correct.
- **`data-layout` goes on the split container, scheme/tokens on the `<section>` root.** Don't put `data-layout` on the section.
- **`@media` can't use `var()`** — the breakpoint placeholders in Task 12 must become literals.
- **Atomicity:** Phase 1 is per-section and each task leaves the page working (a section gets its content object in Task 1 before it's wired). Phase 2 default render stays byte-identical because attributes are emitted only when config is passed (only the scratch variants route passes config).
