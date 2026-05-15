# Phase 04 — Rich pages

**Theme:** The 5 routes that carry the most narrative weight or use bespoke templates.

**Parallelism:** **Fully parallel** — page-per-task once phase 02 + 03 land. Each task is one agent. Cross-page consistency is enforced by the deliberate-repetition list in `lib/content/brand.js` (defined here).

**Companion:** Spec v3 §3.1, §3.2, §3.3, §3.5, §3.7 + §5.4 + §5.5.

## Tasks

### 04.1 `lib/content/brand.js` — centralised refrains

(Foundational task, run first. The other four tasks pick up its exports.)

- Create `apps/miller-web/lib/content/brand.js` exporting:
  - `OVER_25_YEARS` — `"Over 25 years"`
  - `SAFE_DEPENDABLE_ON_TIME` — `"Safe, dependable, and on-time service"`
  - `ONLY_IN_CANADA_CLAIM` — verbatim string from QA scrape
  - `CRADLE_TO_GRAVE_PHRASE` — `"cradle to grave"`
  - `EMERGENCY_PHONE` — `"(204) 957-6327"`
  - `GENERAL_PHONE` — `"(204) 925-9600"`
  - `EMAIL_INQUIRIES`, `EMAIL_SALES`, `EMAIL_HR`
  - `VBEC_FULL_NAME`, `VBEC_SHORT`
  - `WINNIPEG_ADDRESS`, `VBEC_ADDRESS` (two distinct constants)
- Update any phase 03 page that hardcoded one of these to import from this module.
- **Verify:** `grep -r "Over 25 years\|957-6327\|925-9600" apps/miller-web/lib/content/ apps/miller-web/app/` returns these strings only inside `brand.js` or imports of it.

### 04.2 Home page — `HomeTemplate` with reordered sections

- Build `apps/miller-web/components/templates/HomeTemplate.jsx` (server) implementing the full §3.1 sequence:
  1. Hero with 3-frame CSS carousel (use the CSS sketch in §4.6).
  2. Trust strip — `ONLY_IN_CANADA_CLAIM` eyebrow + `CertificationGrid` + `OVER_25_YEARS`.
  3. **Services grid — 10 cards.** Reorder: `industrial-waste-treatment`, `environmental-remediation-services`, `emergency-response`, then the rest alphabetical.
  4. **Our Facility (VBEC)** — promoted from step 6. Eyebrow names VBEC full + "named for the General Manager who built it" with a link to `/about-us/`. 7-capability bullet list. CTA to `/treatment-facility/`.
  5. "For Over 25 Years" editorial block (verbatim from `00-homepage.md`).
  6. "Our Mission" + CTA to `/about-us/vision-mission-and-core-values/`.
  7. "Join The Miller Family" — recruitment block.
  8. `Marquee` with the brand refrains.
  9. Final CTA.
- **No `StatsBand`.** Section is omitted entirely.
- Write `lib/content/home.js` with section copy.
- `app/page.jsx` imports content + renders `<HomeTemplate />`.
- **Verify:** route loads, all 9 sections render in order, no `StatsBand`, VBEC at position 4.

### 04.3 Industrial Waste Treatment — `capabilities` variant (the flagship)

- Write `lib/content/service-industrial-waste-treatment.js` with the 6 processing-category sections from scrape file `06-svc-industrial-waste-treatment.md`:
  - Specialty Soil, Sludges & Solids Treatment (with treatable materials sub-list)
  - Inorganic Waste Processing
  - Liquid Organic Waste Processing
  - Solid Organic Waste Processing
  - Special Waste Processing
  - Miscellaneous Processing & Recycling
  - Special Processing Projects (SR&ED mention)
- Each category renders as a heading + bullet list. Inline trust badge near the lead uses `ONLY_IN_CANADA_CLAIM` from `brand.js`.
- Mention VBEC by full name on first use; "VBEC" thereafter (per §5.4 repetition rule).
- `app/industrial-services/industrial-waste-treatment/page.jsx` imports the content module and renders `<ServiceDetailTemplate variant="capabilities" content={…} />`.
- **Verify:** the 6 categories render, the trust badge appears near the lead, the SR&ED line surfaces in "Special Processing Projects".

### 04.4 Environmental Remediation — bespoke `RemediationTemplate`

- Write `components/templates/RemediationTemplate.jsx` (mostly server; the callback form is client):
  1. `PageHero` + 2 CTAs.
  2. 6-card "What We Do" grid.
  3. Industries served bullet list.
  4. `<MillerProcessFlow>` — 5-step `<ol>`.
  5. Case-study rail (4 `CaseStudyCard`s).
  6. "Why Choose Miller" 4-card grid.
  7. Callback form (`FormField` from shared; focus-on-error; 5 required fields per scrape file 04).
- Write `lib/content/service-environmental-remediation.js`.
- Route `app/industrial-services/environmental-remediation-services/page.jsx`.
- **Verify:** form validates; submit shows confirmation; 5-step process is semantically `<ol>` (inspect DOM).

### 04.5 Quality Assurance + Careers narrative

**Quality Assurance** (`/about-us/quality-assurance/`):
- Hero `lead` = `ONLY_IN_CANADA_CLAIM` verbatim.
- `<CertificationGrid />` rendered immediately below the lead.
- Tracking-database paragraph (uses `CRADLE_TO_GRAVE_PHRASE` from brand.js).
- Render via `<AboutTemplate content={…} />` extended with a `<CertificationGrid />` slot.

**Careers index** (`/careers/`) — `CareersTemplate` (new):
- Build `components/templates/CareersTemplate.jsx`.
- Sequence: PageHero → "Why Miller" 4-card (the four core values from `24-careers-working-at-miller.md`) → "Open Positions" 2-card → benefits teaser linking to `/careers/benefits-rewards/` → DEI block (verbatim from scrape) → "Send your resume to hr@" close.
- Write `lib/content/careers.js`.
- `app/careers/page.jsx` renders `<CareersTemplate />`.
- **Verify:** route loads; all five sections present; positions link to the stub `[position]/page.jsx`.

### Cross-task: About `/about-us/` itself — Vaughn Bullough story

(Done as part of 04.5 if time, otherwise rolled into phase 03 retroactively.) Add to `lib/content/about-index.js` a dedicated **"The Vaughn Bullough story"** section preserving `13-about.md`'s renaming-announcement framing: Bullough joined as GM in 1997, "steady hand, tremendous vision", Blair McArthur signs as President & CEO.

## Exit criteria

- All 5 rich pages render correctly.
- Home shows the reordered sequence with VBEC at position 4, no StatsBand.
- Industrial Waste Treatment renders the 6 capability groups + inline trust badge.
- Remediation renders the 5-step `<ol>`, the 6-card grid, and the callback form.
- QA hero shows the verbatim "only in Canada" claim with CertificationGrid.
- Careers route shows the narrative spine (4 sections + close).
- `npm run lint`, `npm run build` clean at root.
- All 26 real + 6 stub routes prerender.
