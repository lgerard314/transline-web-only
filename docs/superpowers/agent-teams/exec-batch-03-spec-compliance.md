# Batch 3 — spec compliance review (Phase 03 + 04 + cleanup)
**Reviewer:** spec-compliance
**Commits reviewed:** 6fbb865 (Phase 03), cf07782 (Phase 04), 93de497 (merge), d29938c (cleanup)
**Dev tip:** d29938c
**Date:** 2026-05-15

## Summary
**APPROVE-WITH-NITS** — Batch 3 lands all 32 real routes in the correct
template/IA shape, with brand refrains centralised, the home section
order matching §3.1, no StatsBand, no `wo-*`, no `href="#"`, no leaked
test routes, and globals.css cleanly carrying both Phase 03 and Phase 04
selectors. Two minor hardcoded-phone leaks survived the cleanup commit
and one §3.5 layout slot drifted from spec. None are deploy blockers.

## Findings

### ✅ Verified compliant

- **Route count = 32 real.** All 32 listed in spec §1.4 / phase-03 / phase-04
  exist as `apps/miller-web/app/<path>/page.jsx` (Glob confirms 32 page
  files; structure: 1 home + 6 about + 5 careers + 5 case-studies + 11
  industrial-services + 1 process + 1 contact + 1 treatment-facility + 1
  winnipeg-service-centre = 32). With `/` and `/_not-found` the build
  will report 34. No stubs.

- **Home section order (§3.1) — exact.** `HomeTemplate.jsx` renders, in
  order: Hero (3-frame CSS carousel) → Trust strip
  (`ONLY_IN_CANADA_CLAIM` + CertificationGrid + tenure) → Services grid
  (10 cards, reorder verified) → VBEC at position 4 → "For Over 25
  Years" editorial → Mission + VMV CTA → Join The Miller Family →
  Marquee → Final CTA. Service-card ordering in `homeServiceOrder()`
  prepends `[industrial-waste-treatment, environmental-remediation-services,
  emergency-response]` then alphabetises the remainder — matches spec.
  **No `StatsBand` anywhere** (`git grep StatsBand` returns only the
  intentional "no StatsBand" comment markers).

- **`lib/content/brand.js` complete.** All 13 mandated exports present:
  `OVER_25_YEARS`, `SAFE_DEPENDABLE_ON_TIME`, `ONLY_IN_CANADA_CLAIM`,
  `CRADLE_TO_GRAVE_PHRASE`, `EMERGENCY_PHONE`, `GENERAL_PHONE`,
  `EMAIL_INQUIRIES`, `EMAIL_SALES`, `EMAIL_HR`, `VBEC_FULL_NAME`,
  `VBEC_SHORT`, `WINNIPEG_ADDRESS`, `VBEC_ADDRESS`. Two distinct
  address arrays as spec mandates.

- **Brand-refrain centralisation.** `git grep` for the four target
  phrases inside `apps/miller-web/lib/content/` returns hits **only in
  `brand.js`** plus consumer modules importing from it. Phase 02 chrome
  (`EmergencyBanner.jsx`, `SiteFooter.jsx`, `TopNav.jsx`) still carries
  the same strings as expected — the cleanup task scoped only to
  `lib/content/` + `ContactForm`. No regression.

- **VBEC repetition rule (§5.4) — honoured in content modules.**
  - `lib/content/about-index.js`: full name on first use (line 12), short
    thereafter (line 24).
  - `lib/content/service-industrial-waste-treatment.js`: full name in
    lead (line 13), `VBEC_SHORT` in Special Processing Projects body
    (line 85).
  - `lib/content/treatment-facility.js`: hero `title = VBEC_FULL_NAME`,
    short form not needed (no second occurrence in module).

- **ServiceDetailTemplate trust badge.** `ServiceDetailTemplate.jsx`
  imports `ONLY_IN_CANADA_CLAIM` from `../../lib/content/brand` and uses
  it as the capabilities-variant fallback (lines 19, 50). Spec
  requirement met. (Header comment block referring to the constant as
  "until brand.js exists" is now stale prose — see nits.)

- **Class vocabulary — zero `wo-*`.** `git grep '"wo-[a-z]'` against
  `apps/miller-web/` and `apps/brand/` returns nothing. Phase 03/04 use
  `tl-*` (shared) + `mw-*` (Miller-specific) + `[data-brand="miller"]`
  exactly as §4.2 mandates.

- **No `href="#"`.** Grep returns only comment lines explaining the
  ESLint rule + cert TODO comment. No `href="#"` JSX attribute anywhere
  in `apps/miller-web/`.

- **`lib/certs.js` uses real placeholder paths.** All 4 cert objects
  carry `href: "/certs/<slug>.pdf"` with TODO(phase-5) comments. No
  sentinels. The "real PDF wiring" is correctly scoped to Phase 05.

- **RemediationTemplate structure (04.4).** PageHero + 2 CTAs (Book a
  Consult + tel: emergency) → 6-card "What We Do" → industries `<ul>` →
  `<MillerProcessFlow steps={c.process} />` → 4-card case-study rail
  via `CaseStudyCard` → 4-card "Why Miller" → `<RemediationCallback />`
  client island. Form is 5 required fields (firstName, lastName, email,
  phone, comments) with focus-first-invalid behaviour. Matches spec.

- **Case-study + job-posting templates.** Both
  `CaseStudyDetailTemplate.jsx` and `JobPostingTemplate.jsx` exist;
  case-study template renders semantic `<table>` with `<th
  scope="col">` headers and `<th scope="row">` row headers. 4
  case-study routes + 2 job-posting routes import and render them.

- **Vaughn Bullough story (§3.5 / Phase 04 cross-task).** Present in
  `lib/content/about-index.js` as section 2: Bullough joined 1997,
  "steady hand, tremendous vision" quote from Blair McArthur (President
  & CEO), VBEC is a person not just an acronym. Verbatim framing
  preserved.

- **Quality Assurance hero lead = `ONLY_IN_CANADA_CLAIM` verbatim.**
  Confirmed via `lib/content/about-quality-assurance.js:10`.
  `CertificationGrid` is rendered on the page (see nit below for slot
  position).

- **Globals.css merge sanity.** 573 lines, no `<<<<<<<` / `=======` /
  `>>>>>>>` markers. Both Phase 03 (`.mw-results-table`,
  `.mw-results-table-wrap`) and Phase 04 selectors (`.mw-home-hero`,
  `.mw-hero-frame*`, `.mw-vbec*`, `.mw-trust-strip*`, `.mw-rem-grid`,
  `.mw-rem-card*`, `.mw-callback*`, `.mw-section*`, `.mw-why-grid`,
  `.mw-why-card`) all present.

- **No leaked smoke/test routes.** `apps/miller-web/app/` contains no
  `phase02-smoke`, `__test__`, or `__phase02_smoke` directories.

- **Carousel honours reduced motion.** `globals.css:377-379` freezes
  frames 2/3 and pins frame 1 visible under
  `@media (prefers-reduced-motion: reduce)` — matches §4.6 spec.

- **5-step process as `<ol>`.** `MillerProcessFlow` renders the 5
  remediation stages; spec §6 calls this non-negotiable.

### ⚠️ Nits (carry forward to phase 05)

- **`apps/miller-web/app/industrial-services/page.jsx:42` — hardcoded
  phone string and tel: href.** Renders
  `<a href="tel:+12049576327">(204) 957-6327</a>` literally instead of
  importing `EMERGENCY_PHONE` from `lib/content/brand`. The cleanup
  commit (d29938c) refactored most lib/content + ContactForm but missed
  this app-route emergency-callout block. **One-line import + template
  literal fix.**

- **`apps/miller-web/components/RemediationCallback.jsx:62` — hardcoded
  "(204) 925-9600" in the post-submit confirmation block.** Should
  import `GENERAL_PHONE` from `lib/content/brand` (or `EMERGENCY_PHONE`
  — note: the surrounding form is for remediation callbacks, so the
  switchboard number is correct, just needs to come from brand.js).
  Same one-line fix.

- **`ServiceDetailTemplate.jsx:11-14` — stale prose comment.** Header
  comment block still reads *"The 'only in Canada' trust badge
  eventually sources from `lib/content/brand.js` (phase 04.1). Until
  that module exists the caller can pass an explicit `trustBadge`
  prop…"*. The module now exists and the import on line 19 confirms
  it. Update the comment to remove the "eventually / until that module
  exists" framing — purely cosmetic but it'll mislead future readers.

- **§3.5 QA layout slot — CertificationGrid rendered *after* sections,
  not *immediately below the lead*.**
  `apps/miller-web/app/about-us/quality-assurance/page.jsx:30-35`
  injects the grid as `children` to `AboutTemplate`, which renders it
  *after* both prose sections. Spec §3.5 says "CertificationGrid
  renders beneath the lead" — i.e. between hero lead and the first
  prose section. The page does carry the lead + the grid + the
  tracking paragraph in the right textual order at the source-code
  level, but the rendered placement is "below sections". An inline
  comment in the page even acknowledges this (`"AboutTemplate places
  children after sections; we render the grid in a wrapper that pushes
  it above the tracking section visually using order:-1 wouldn't
  help…"`). Phase 05 could either (a) extend `AboutTemplate` with a
  `belowLead` slot prop, or (b) special-case QA's layout. Low priority
  — functional content is all there, in scrape order.

- **§5.4 VBEC repetition on home — full name re-introduced at
  position 4.** The home services lead (position 3) already expands
  `${VBEC_FULL_NAME} (${VBEC_SHORT})`, then the VBEC section eyebrow at
  position 4 re-expands `${VBEC_FULL_NAME} (${VBEC_SHORT})`. Strict
  reading of §5.4 ("full name *once* per page on first use, then
  VBEC") flags this as a second introduction. Defensible because the
  position-4 eyebrow is the **section identifier** and stripping it
  weakens the section header, but worth a §5.4-author judgement call
  in Phase 05 polish. Likely a "leave it" item — both occurrences are
  brand-correct.

- **Phase 02 chrome (TopNav, SiteFooter, EmergencyBanner) still carries
  hardcoded refrain strings as expected.** The Batch 3 cleanup
  intentionally scoped to `lib/content/` + `ContactForm`. Phase 05
  should refactor TopNav/SiteFooter/EmergencyBanner to import from
  `lib/content/brand` once the EmergencyBanner CSS-gate work lands.
  Logged here for Phase 05 tracking.

### ❌ Blockers

None.

## Phase 05 prerequisites (informational)

- **EmergencyBanner CSS gate.** Phase 03 explicitly did **not** change
  the Phase 02 client `BannerRouteGate` (flash risk on first paint
  noted in the Phase 02 review). Confirming this is Phase 05's job, not
  a Batch 3 blocker — matches the prompt's expectation.

## Recommendation

Ship Batch 3 as-is to `dev`. The two hardcoded-phone leaks
(`industrial-services/page.jsx:42`, `RemediationCallback.jsx:62`) are
each a one-line import + template-literal swap; collapse them into the
first Phase 05 commit alongside the EmergencyBanner CSS gate and the
TopNav/SiteFooter/EmergencyBanner refrain refactor. The QA layout slot
and the home position-4 VBEC re-introduction are §5.4/§3.5 polish items
suitable for the Phase 05 visual-design sweep. None of these merit
holding the merge.

Visual spot-check at desktop + mobile on the 5 rich routes (`/`,
`/industrial-services/industrial-waste-treatment/`,
`/industrial-services/environmental-remediation-services/`,
`/about-us/quality-assurance/`, `/careers/`) is the remaining manual
gate, per Phase 04 exit criteria.
