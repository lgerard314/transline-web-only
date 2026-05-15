# Round 1 — Brand & IA review of `2026-05-15-miller-web-design.md`

## Verdict
**Revise.** The skeleton is sound and the verbatim-port discipline is right, but the IA collapses three very different user journeys into one undifferentiated nav, and the brand-bridge decisions (decisions #2 and #3) leave Miller looking like a TransLine49° re-skin rather than the senior sister brand it actually is.

## What's right
- §1.2 extraction of `apps/shared/brand/` as a workspace package is the correct call — drift between two sites under one parent compounds fast. Worth the phase-1 cost.
- §3.1 expanding the homepage grid from 9 to 10 cards to include Environmental Remediation (the flagship in `04-svc-environmental-remediation.md`). The live site under-promotes its richest page; don't replicate that mistake.
- Decision #4 — refusing to invent stats counter values. The live `0+` is broken-CMS leakage; making them up would be dishonest. Placeholder is right.
- Decision #7 — prerendered stubs for the 4 case-study and 2 job-posting slugs via `generateStaticParams`. Cheap to ship, prevents 404s on internal links, leaves a real shell to fill later.
- §1.4 1:1 route preservation. Miller has live inbound links and Google Business / affiliation references; route stability protects SEO equity earned over 25+ years.
- §3.2 splitting `RemediationTemplate` out from `ServiceDetailTemplate` rather than overloading flags. The Remediation page has 6 distinct blocks the other 10 services don't share — forking is correct.

## What's wrong / what to change

### 1. The nav treats three audiences as one. Split the journeys.
**Issue.** §2.1 gives one flat primary nav (Services · Processes · About · Locations · Case Studies · Careers · Contact). But the scrape reveals three radically different journeys: (a) a 24/7 spill-response caller in panic mode, (b) industrial procurement evaluating a vendor over weeks (ISO certs, licencing, case studies, VBEC capabilities), (c) a job seeker.

**Why it matters.** Spill caller doesn't need a 10-item Services dropdown; they need the red number, period. Procurement won't trust a vendor without finding ISO 9001:2015 / 14001:2015 / 45001:2018 and the VBEC license — those live four clicks deep behind About → Licencing today, and the spec preserves that burial.

**Change.** Keep §2.2's `EmergencyBanner` (it solves journey A). For journey B, surface a **"Why Miller"** or **"Credentials"** anchor on the home page — above-the-fold strip of ISO badges + "Over 25 Years" + "Licensed Hazardous Waste Treatment Facility (VBEC)" — and reorder home sections in §3.1 so Certifications moves from position 5 to position 2 (right after the hero, before the services grid). The trust signals are the *reason* a procurement buyer reads the services list.

### 2. Decision #3 (`deep` palette) makes Miller look like a TL49 variant.
**Issue.** Miller is the senior brand — 25+ years, the operational partner TL49 references on its own homepage (`apps/transline49-web/app/page.jsx:52`, `page.jsx:166`). Inheriting TL49's design system and re-skinning with a different palette inverts the actual brand hierarchy. The `deep` palette in `globals.css:108-111` only redefines `--c-navy`, `--c-blue`, `--c-accent`, `--c-amber` — it leaves `--c-bg` and `--c-ink` from the `clay` defaults, so Miller will render on the same warm-cream body background as TL49 with a teal accent stuck on top. That's a re-skin, not a sibling brand.

**Why it matters.** Procurement buyers compare vendors side-by-side. If the homepage chrome, type stack, parallel-rule eyebrow motif, and body background all match TL49 exactly, Miller reads as the junior partner of its own subsidiary.

**Change.** Either (a) extend `[data-palette="deep"]` in `apps/shared/brand/styles/globals.css` to override the full `--c-bg`/`--c-surface`/`--c-ink*`/`--c-line*` set with a cool industrial neutral (e.g. `#F2F4F6` body, near-black ink), so Miller is *visually* a separate brand expression of one system; or (b) drop the inherited 49°-parallel motif on Miller — the `tl-parallel__tick` and `tl-hero__rule` in `PageHero.jsx:18-24` literally encode TL49's positioning ("49°N cross-border"). It's TL49-specific iconography on a company that doesn't operate cross-border. Replace with a Miller-specific eyebrow rule (suggest: ISO/cert tick or VBEC coordinate).

### 3. Decision #2 (keep `tl-*` class names) leaks brand into the markup.
**Issue.** Spec accepts `tl-*` selectors as the shared vocabulary "because renaming churns TL49 for zero user benefit." User-benefit, yes. But every Miller page's DOM inspector will read `class="tl-display tl-hero__title"` on a company that has nothing to do with TransLine49°. Anyone auditing the source (competitors, partners, journalists, the parent group's PR team) sees the inversion immediately.

**Why it matters.** Cheap to fix now (one find-and-replace in the shared package before Miller imports it), expensive to fix later (every `lib/content/*` module + every component override).

**Change.** Rename to `wo-*` (white owl) in `apps/shared/brand/` *before* Miller starts importing. Patch TL49 in the same PR — it's mechanical. Decision #2's churn estimate is wrong: the work is 1 sed pass + lint, not a refactor.

### 4. `EmergencyBanner` is right, but the spec under-specifies its scope.
**Issue.** §2.2 puts it sitewide, dismissable per-session. Good. But on Careers, Contact, About sub-pages, and the Treatment Facility page, a panic spill caller is not the journey — and the banner steals visual weight from those pages' actual CTAs (Apply Now, Contact form, VBEC directions). The Remediation page (`04-svc-environmental-remediation.md`) already has its *own* "For our 24/7 spill response team" footer block — the banner duplicates it.

**Why it matters.** A persistent red strip on every page trains buyers to filter it out within two clicks. By the time they reach Contact, the banner is invisible — defeating its purpose for the one journey it serves.

**Change.** Show `EmergencyBanner` on `/`, all `/industrial-services/*`, `/processes/*`, and `/treatment-facility/`. Hide on `/about-us/*`, `/careers/*`, `/case-studies/*`, `/contact-us/`. On Contact, surface the 24/7 number as a co-equal card next to the form instead — that matches `25-contact.md`'s "Secondary callout" exactly. Keep the dismissable session-storage logic; just gate the route set.

### 5. Missing: the VBEC story is buried.
**Issue.** Spec lists `/treatment-facility/` as a generic `LocationTemplate` (§3.5). But the VBEC rename announcement is the dominant story on `/about-us/` (see `13-about.md` — it leads the page) and VBEC is the *only* licensed hazardous waste treatment facility in Manitoba (`19-location-treatment-facility.md`). That's the single strongest competitive moat Miller has, and it's not surfaced on the home page at all.

**Why it matters.** "Over 25 years" is brand poetry. "We own the only licensed hazardous waste treatment facility in the province, 64 hectares, 70 km south of Winnipeg" is the procurement-decision fact.

**Change.** Add an explicit "Our Facility (VBEC)" section to `HomeTemplate` (§3.1) between Mission and Certifications — pull the 7 capabilities list from `19-location-treatment-facility.md` lines 7-14, plus a CTA to `/treatment-facility/`. Verbatim, no invented copy.

### 6. Missing: the TransLine49° cross-link.
**Issue.** `16-about-professional-affiliations.md` line 17 lists TL49 as affiliation #10, with a build note "Render a cross-link." Spec mentions cross-link intent in §1.1 and §4.1 rationale but doesn't say where it surfaces in the IA. It can't only live buried under About → Professional Affiliations.

**Change.** Add a small "Family of companies" footer module (shared component candidate — `FamilyOfCompanies` in `apps/shared/brand/`), rendered above the social row in `SiteFooter`. Lists Miller + TL49 + Miller Waste Systems (also on the affiliations page line 16) under the White Owl ownership line. Same module renders on both sites with the current site marked. That's how the bridge becomes visible without a banner or nav item.

## Open questions for next round

1. Should the 10 services in `lib/services.js` be reordered so Environmental Remediation and Emergency Response surface first (flagship + 24/7 anchor), rather than the alphabetical-ish order on the live site?
2. Is "Processes" worth keeping as a top-level nav item with one child page? It reads like a placeholder for future SEO landing pages; if no others are planned in 2026, fold it under Services as a tag or move it to a related-content rail on Industrial Waste Treatment.
3. Brand asset gap: spec references `public/logo.png` as a placeholder. Who confirms the actual Miller logomark + ISO cert PDFs ship before launch? That's a content-readiness blocker, not a code blocker, but it determines whether decision #4's "data unavailable" placeholder applies to the trust strip too.
4. Should `apps/shared/brand/`'s `[data-palette]` system formally distinguish "brand identity palette" (locked per-app) from "tweaks-panel preview palettes" (designer-only)? Right now the tweaks panel can switch a production visitor's Miller render to `clay`, which would defeat decision #3 entirely.
