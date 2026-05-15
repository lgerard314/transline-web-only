# Phase 03 — Thin pages

**Theme:** Stand up the 20 routes that share existing templates with minimal extra work.

**Parallelism:** **Fully parallel** — page-per-task. Each task can be a separate agent. No inter-page dependencies once phase 02 templates land.

**Companion:** Spec v3 §3 + the scrape verbatim under `docs/superpowers/miller-scrape/`.

## Tasks

### 03.1 Thin service pages — 6 routes (compact variant)

Pages: `customer-waste-collection`, `industrial-cleaning`, `project-management`, `stewardship`, `vacuum-truck`.

For each:
- Write `apps/miller-web/lib/content/service-<slug>.js` with `{ hero, sections, bullets, relatedSlugs }` — **plain strings + arrays only, no JSX**.
- Write the route `apps/miller-web/app/industrial-services/<slug>/page.jsx` that imports the content module and renders `<ServiceDetailTemplate variant="compact" content={…} />`.
- Source copy verbatim from `docs/superpowers/miller-scrape/02..10` (skip Treatment + R&D + Specialty Recycling — those are capabilities variant, in 03.2).
- Add `metadata` export with the page title.

**Verify:** all 5 routes load and pass lint.

### 03.2 Capability service pages — 3 routes (capabilities variant, excluding Treatment + Remediation)

Pages: `emergency-response`, `research-development`, `specialty-recycling`.

For each:
- Write `lib/content/service-<slug>.js` with `{ hero, sections: [{ heading, bullets }, …], inlineTrustBadge, relatedSlugs }`.
- Each page includes the deliberate "only in Canada" trust badge near the lead.
- Render `<ServiceDetailTemplate variant="capabilities" content={…} />`.
- Source copy verbatim from scrape files 03 (Emergency Response), 08 (R&D), 09 (Specialty Recycling).

**Verify:** all 3 routes load; inline trust badge appears near the lead on each.

### 03.3 About sub-pages + Locations + Case Studies index — 8 routes

About sub-pages (5 routes): `/about-us/health-safety/`, `/about-us/licencing-information/`, `/about-us/professional-affiliations/`, `/about-us/quality-assurance/` (basic version — full hero polish in phase 04), `/about-us/vision-mission-and-core-values/`.

Each:
- Write `lib/content/about-<slug>.js` (plain strings + arrays).
- Render via `<AboutTemplate content={…} />`.
- Licencing Information: 3 cert/license cards declare `{ name, code, href, sizeKB }`.
- Professional Affiliations: render `<AffiliationsGrid />` with the 10 orgs.
- VMV: 4-card core-values grid.

Locations (2 routes): `/treatment-facility/`, `/winnipeg-service-centre/`.

Each:
- Write `lib/content/<slug>.js`.
- `<LocationTemplate content={…} />`.
- Treatment facility headline uses full **"Vaughn Bullough Environmental Centre"** with the one-line "named for…" subhead.

Case Studies index (1 route): `/case-studies/`.
- `lib/content/case-studies.js` with the 4 case-study summaries.
- `<IndexTemplate cards={…} />`.

**Verify:** 8 routes load, all lint-clean.

### 03.4 Careers sub-pages + Process + Contact — 4 routes

- `/careers/benefits-rewards/` and `/careers/working-at-miller/` — `<AboutTemplate>`. Source from scrape files 23 + 24.
- `/processes/disposal-of-inorganic-oxidizers/` — `<ProcessTemplate>`. Source from scrape file 12. Includes FAQ.
- `/contact-us/` — `<ContactTemplate>` shell + `<ContactForm>` client child (single-step form, fields per scrape file 25: First Name *, Last Name *, Email *, Phone *, Company, Title, Comment/Question *). On submit-with-errors, focus the first invalid input. On successful submit, swap to a confirmation block (same pattern as TL49).

**Verify:** 4 routes load; form validates and submits to local state confirmation.

### 03.5 Services landing + 4 case-study detail pages + 2 job postings (REAL CONTENT)

- `/industrial-services/` — render `<ServicesLandingPage />` (simple 10-card grid driven by `lib/services.js`). No hero copy — matches the scraped live site.
- `/case-studies/brandon-power-facility/page.jsx` — Brandon Power lime dust remediation case study. Source: scrape file `26-case-brandon-power.md`. Layout: `PageHero` + Problem section + Approach section (3 subheadings) + Results table.
- `/case-studies/grain-elevator-remediation-project/page.jsx` — Source: `27-case-grain-elevator.md`. Same layout shape.
- `/case-studies/highway-16-diesel-spill-response-remediation/page.jsx` — Source: `28-case-hwy16-diesel.md`. Same layout shape.
- `/case-studies/steinbach-strip-mall-fire-recovery-restoration-project/page.jsx` — Source: `29-case-steinbach-fire.md`. Same layout shape.
- `/careers/plant-manager/page.jsx` — Source: `30-careers-plant-manager.md`. Layout: `PageHero` + Role Summary + Responsibilities (`<ul>`) + Requirements (`<ul>`) + Benefits + "Apply Now: email hr@…" CTA.
- `/careers/enterprise-automation-manager/page.jsx` — Source: `31-careers-enterprise-automation-manager.md`. Same shape.

> Earlier draft assumed these 6 would be stubs via `generateStaticParams`. The second scrape pass on 2026-05-15 captured their full content, so they ship as real static pages. This brings the route count to **32 real prerendered routes, zero stubs**.

For consistency, define two simple shared templates in this task:
- `<CaseStudyDetailTemplate>` — hero (with case-study image), Problem (h2 + prose), Approach (h2 + nested h3 + prose blocks), Results table (`<table>` semantically), CTA footer.
- `<JobPostingTemplate>` — hero, role summary, Responsibilities `<ul>`, Requirements `<ul>`, Compensation/Benefits, "Apply by email" CTA.

**Verify:** `npm run build --workspace=miller-web` reports **32 prerendered routes**.

## Exit criteria

- 26 of the 32 real Miller routes ship working — 20 from 03.1-03.4 plus 6 from 03.5 (services landing + 4 case studies + 2 job postings). The remaining 6 (home + 5 rich pages) land in phase 04.
- `npm run build` at root succeeds; prerender count matches expected.
- `npm run lint` clean.
- Visual spot-check of each route at desktop + mobile (~30 min).
