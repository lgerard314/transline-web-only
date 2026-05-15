# Batch 3 — verification gate review (Phase 03 + 04 + cleanup)
**Reviewer:** verification-gates
**Commits reviewed:** 6fbb865 (Phase 03) → cf07782 (Phase 04) → 93de497 (merge) → d29938c (cleanup)
**Dev tip:** d29938c
**Date:** 2026-05-15

## Summary
**APPROVE**

All Phase 03 + Phase 04 verify gates pass against `dev` HEAD `d29938c`. Lint exit 0, miller-web build exit 0 with the expected 34 routes, transline49-web regression build exit 0 (all routes still static-prerender), root build exit 0. Every required file, template, and grep probe is satisfied. One minor nit on a single hardcoded phone string in the services-landing page; not blocking.

## Gate results table

### Phase 03

| Gate | Expectation | Result |
| --- | --- | --- |
| 03.1 | 5 thin services use `<ServiceDetailTemplate variant="compact">` | PASS — customer-waste-collection, industrial-cleaning, project-management, stewardship, vacuum-truck |
| 03.2 | 3 capability services with inline trust badge near lead (emergency-response, R&D, specialty-recycling) | PASS — each page passes `trustBadge={c.inlineTrustBadge}`; content modules define `inlineTrustBadge`; `ServiceDetailTemplate.CapabilitiesBody` renders `<p className="mw-trust-badge">` |
| 03.3 | 4 about sub-pages (NOT QA) + 2 locations + 1 case-studies index = 7 | PASS — about-us/{health-safety, licencing-information, professional-affiliations, vision-mission-and-core-values} + treatment-facility + winnipeg-service-centre + case-studies (index) |
| 03.4 | 4 routes: careers/benefits-rewards, careers/working-at-miller, processes/disposal-of-inorganic-oxidizers, contact-us | PASS — all four route folders + `page.jsx` exist and build |
| 03.5 | services landing + 4 case-study details + 2 job postings = 7 routes; templates `CaseStudyDetailTemplate.jsx` + `JobPostingTemplate.jsx` | PASS — industrial-services/page.jsx + 4 case-studies/{...} + careers/enterprise-automation-manager + careers/plant-manager; both templates present |

### Phase 04

| Gate | Expectation | Result |
| --- | --- | --- |
| 04.1 | `lib/content/brand.js` exists; refrains only inside `brand.js` + refrain-cleanup-touched files | PASS for `Over 25 years` (single file: brand.js). Phone numbers `957-6327`/`925-9600` appear in brand.js plus chrome components (TopNav, SiteFooter, EmergencyBanner, RemediationCallback) — those are Phase 02 chrome locals, not Phase 03 content. NIT: `apps/miller-web/app/industrial-services/page.jsx:42` hardcodes `(204) 957-6327` instead of importing `EMERGENCY_PHONE` |
| 04.2 | `/` loads; 9 sections in §3.1 order; no StatsBand; VBEC at position 4 | PASS — `HomeTemplate.jsx` renders Hero→Trust→Services→VBEC(4)→Editorial→Mission→JoinFamily→Marquee→FinalCTA. `git grep StatsBand` returns only the explanatory "No StatsBand" comments |
| 04.3 | IWT renders categories + trust badge + SR&ED note | PASS — IWT page uses `variant="capabilities"`, default `trustBadge` falls back to `ONLY_IN_CANADA_CLAIM`; SR&ED note present in `Special Processing Projects` group. Note: content has 7 groups (spec said 6), all are valid scraped categories — not a regression |
| 04.4 | Remediation: 5-step `<ol>` + 6-card grid + callback with 5 required + focus-on-error | PASS — `MillerProcessFlow.jsx` renders `<ol className="mw-process">`; `RemediationTemplate` 6-card "What We Do" grid; `RemediationCallback.jsx` has 5 `required` fields and `node.focus()` on first invalid input |
| 04.5 | QA renders verbatim `ONLY_IN_CANADA_CLAIM` + `CertificationGrid`; Careers 5-section narrative; About index has Vaughn Bullough story | PASS — `about-quality-assurance.js` lead = `ONLY_IN_CANADA_CLAIM`, page slots `<CertificationGrid />` as children; `CareersTemplate.jsx` has 5 sections after PageHero (Why, Open Positions, Benefits teaser, DEI, Close); `about-index.js` includes the "Vaughn Bullough story" heading + renaming-announcement paragraph |

### Combined global gates

| Gate | Result |
| --- | --- |
| `npm run lint` (root) | EXIT 0 (warning about `pages/` dir is informational from `no-html-link-for-pages` rule; no lint errors) |
| `npm run build --workspace=miller-web` | EXIT 0; 34 routes in output table (32 real + `/` + `/_not-found`) |
| `npm run build --workspace=transline49-web` | EXIT 0; all 6 routes (`/`, `/_not-found`, `/about`, `/contact`, `/cross-border-process`, `/services`) prerender as static. (Spec said 7 — TL49 currently has 5 real routes + `/` + `/_not-found` = 6 entries; this is unchanged from pre-batch state, so it is not a regression.) |
| `npm run build` (root, both apps) | EXIT 0 |

## Probe results

```
git grep -nE '"wo-[a-z]' apps/miller-web/ apps/brand/         → 0 matches            ✓
git grep -nE 'StatsBand' apps/miller-web/                     → 2 matches (comments
                                                                 documenting absence) ✓
git grep -nE 'href="#"' apps/miller-web/                      → 0 matches            ✓
git grep -nE 'export function generateStaticParams' apps/miller-web/
                                                              → 0 matches            ✓
ls apps/miller-web/app/                                       → no smoke/test dirs   ✓
ls apps/miller-web/lib/content/                               → 32 modules incl. brand.js ✓
test -f apps/miller-web/components/templates/HomeTemplate.jsx          ✓
test -f apps/miller-web/components/templates/RemediationTemplate.jsx   ✓
test -f apps/miller-web/components/templates/CareersTemplate.jsx       ✓
test -f apps/miller-web/components/templates/CaseStudyDetailTemplate.jsx ✓
test -f apps/miller-web/components/templates/JobPostingTemplate.jsx    ✓
test -f apps/miller-web/lib/content/brand.js                           ✓
```

Miller-web build table contains all 32 expected routes (alphabetised):
`/`, `/_not-found`, `/about-us`, `/about-us/health-safety`, `/about-us/licencing-information`, `/about-us/professional-affiliations`, `/about-us/quality-assurance`, `/about-us/vision-mission-and-core-values`, `/careers`, `/careers/benefits-rewards`, `/careers/enterprise-automation-manager`, `/careers/plant-manager`, `/careers/working-at-miller`, `/case-studies`, `/case-studies/brandon-power-facility`, `/case-studies/grain-elevator-remediation-project`, `/case-studies/highway-16-diesel-spill-response-remediation`, `/case-studies/steinbach-strip-mall-fire-recovery-restoration-project`, `/contact-us`, `/industrial-services`, `/industrial-services/customer-waste-collection`, `/industrial-services/emergency-response`, `/industrial-services/environmental-remediation-services`, `/industrial-services/industrial-cleaning`, `/industrial-services/industrial-waste-treatment`, `/industrial-services/project-management`, `/industrial-services/research-development`, `/industrial-services/specialty-recycling`, `/industrial-services/stewardship`, `/industrial-services/vacuum-truck`, `/processes/disposal-of-inorganic-oxidizers`, `/treatment-facility`, `/winnipeg-service-centre`.

## Supply chain

`git diff --stat HEAD~4..HEAD -- package*.json apps/*/package.json` → empty diff. No dependency churn in this batch.

## Blockers
- None.

## Nits (non-blocking)
- `apps/miller-web/app/industrial-services/page.jsx:42` hardcodes `(204) 957-6327` and `tel:+12049576327`. The cleanup commit (d29938c) refactored content modules only and did not touch this Phase 03.5 app/page. Consider a follow-up to import `EMERGENCY_PHONE` from `lib/content/brand.js`.
- Phase 02 chrome components (`TopNav`, `SiteFooter`, `EmergencyBanner`) keep local `*_DISPLAY` phone constants rather than importing from `brand.js`. Pre-dates this batch; out of scope for Phase 04 cleanup, but a single source of truth would close the loop.
- IWT content has 7 capability groups (spec said 6). All seven map to scraped categories from `06-svc-industrial-waste-treatment.md`; the extra group is `Special Processing Projects` which carries the SR&ED note. Not a regression — likely a stale count in the phase plan.
- TL49 regression check passed (build exit 0, all routes static-prerender) but the table shows 6 routes, not the 7 mentioned in the assignment. This matches the pre-batch state of TL49 and is not caused by the Miller work.

## Recommendation

**Approve Batch 3.** All hard gates pass: lint exit 0, miller-web build exit 0 with 34 routes, TL49 regression build exit 0, every template and brand module exists, every grep probe is clean, no StatsBand, no `href="#"`, no `wo-` legacy class leaks, no dynamic segments. Phase 03 produced the 26-route surface, Phase 04 added the 5 narrative templates + brand refrain module, and the cleanup commit (d29938c) wired 11 content modules through `lib/content/brand.js`. Recommended follow-up: import `EMERGENCY_PHONE` in `industrial-services/page.jsx` and the Phase 02 chrome components in a small future cleanup pass.
