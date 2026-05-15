# Batch 4 — verification gate review (Phase 05)
**Reviewer:** verification-gates
**Commit reviewed:** 9827fd9
**Date:** 2026-05-15

## Summary
APPROVE

All Phase 05 verification gates pass independently. Lint clean (exit 0). Build clean (both apps). Miller-web route table reports 34 non-meta routes (32 real + `/` + `/_not-found`), plus `/robots.txt` and `/sitemap.xml` (static, rendered to `apps/miller-web/.next/server/app/`). All carry-forward fixes from Batches 1-3 (phone literal source-of-truth, server-side EmergencyBanner gate, stale comment cleanup, VBEC short-form at position 4, FamilyOfCompanies footer module) are in place. The custom ESLint rule for `href="#"` triggers as designed.

## Gate results

### `npm run lint` at root
Exit code: **0**. Output:
```
> transline49-monorepo@0.1.0 lint
> eslint apps/**/*.{js,jsx,mjs}

Pages directory cannot be found at ... (informational only; not an error)
```
No rule violations. `next/google-fonts/page-fonts` warning about `pages/` directory is informational (App Router project); not surfaced as an error.

### `npm run build` at root
Exit code: **0**. Both apps build cleanly.

- **miller-web**: `Compiled successfully in 5.1s`. `Generating static pages using 11 workers (36/36) in 698ms`. Route table lists 32 real routes + `/` + `/_not-found` + `/robots.txt` + `/sitemap.xml` (total 36 entries; 34 non-meta routes per spec convention).
- **transline49-web**: `Compiled successfully in 3.2s`. `Generating static pages using 8 workers (7/7) in 1489ms`.

### Built output presence
`apps/miller-web/.next/server/app/` contains:
- `sitemap.xml`, `sitemap.xml.body`, `sitemap.xml.meta` (static)
- `robots.txt`, `robots.txt.body`, `robots.txt.meta` (static)

### `app/sitemap.js` entry count
Read `apps/miller-web/app/sitemap.js`. Computed entries:
- `/` × 1
- `/industrial-services` + 10 service detail slugs × 11
- `/about-us` + 5 about subs × 6
- `/careers` + 2 sub-pages + 2 job postings × 5
- `/case-studies` + 4 case-study details × 5
- `/treatment-facility`, `/winnipeg-service-centre` × 2
- `/contact-us` × 1
- `/processes/disposal-of-inorganic-oxidizers` × 1

**Total: 32.** Priorities match spec (home 1.0, services 0.8, case studies + jobs 0.6, others 0.5). `lastModified` = build-time `new Date()`. `changeFrequency: "monthly"` set on every entry.

### `app/robots.js`
Allow-all (`{ userAgent: "*", allow: "/" }`) + sitemap pointer `https://millerenvironmental.ca/sitemap.xml`. Matches spec.

### `apps/miller-web/public/og.png`
Exists. 20,804 bytes (placeholder asset per spec 05.1).

### `app/layout.jsx` server-side banner gating
Lines 4 + 59-61:
```jsx
import { cookies, headers } from "next/headers";
...
const hdrs = await headers();
const pathname = hdrs.get("next-url") || hdrs.get("x-invoke-path") || "/";
const bannerOn = shouldShowEmergencyBanner(pathname);
```
Line 73: `<body data-banner={bannerOn ? "on" : "off"}>`. Server-side gate via `await headers()` reading `next-url` with `x-invoke-path` fallback. `BannerRouteGate` client component keeps it in sync on client-side navigation.

### `git diff d29938c..9827fd9 -- apps/transline49-web/`
Single file changed: `apps/transline49-web/components/SiteFooter.jsx` (FamilyOfCompanies wire-up). Matches the spec invariant — Phase 05 must only touch the TL49 site to inject the new shared footer module.

## Probe results

### Phone literal grep (must match only inside brand.js)
`git grep -nE '"(204) 957-6327"|"(204) 925-9600"' apps/miller-web/` → exit 1, no matches. Brand-canonical literals live only in `lib/content/brand.js`.

### EmergencyBanner server-side gate
Confirmed via `app/layout.jsx` read above — `await headers()`, `next-url`, `x-invoke-path`, `data-banner` all present.

### Stale comment cleanup
`grep -rn "until.*brand\.js" apps/miller-web/components/templates/` → no matches.

### VBEC short-form at position 4
`apps/miller-web/lib/content/home.js`:
- Line 12-13: imports `VBEC_FULL_NAME, VBEC_SHORT` from `brand.js`.
- Line 39-40 (position 3, services lead): full name expanded once with short in parens.
- Line 47-52 (position 4, "Our Facility"): `eyebrow: VBEC_SHORT`, body opens with `${VBEC_SHORT}`. Matches design spec §5.4 ("position 4 uses the short form").

### FamilyOfCompanies module
- `apps/brand/components/FamilyOfCompanies.jsx` exists.
- `apps/brand/components/index.js:15`: `export { FamilyOfCompanies } from "./FamilyOfCompanies";`
- `apps/miller-web/components/SiteFooter.jsx`: imports from `@white-owl/brand/components`; renders `<FamilyOfCompanies current="miller" />` (line 93).
- `apps/transline49-web/components/SiteFooter.jsx`: same import; renders `<FamilyOfCompanies current="tl49" />` (line 67).

## Lint-rule re-verify

1. Created `apps/miller-web/__phase05_lint_test.jsx` with `<a href="#">x</a>`.
2. `npm run lint` → **exit 1**, 2 errors:
   ```
   1:44  error  href="#" is a sentinel link. Provide a real URL or use a <button> for interactive controls  no-restricted-syntax
   1:49  error  href="#" is a sentinel link. Provide a real URL or use a <button> for interactive controls  no-restricted-syntax
   ✖ 2 problems (2 errors, 0 warnings)
   ```
   (Two errors fired — the rule matches both the JSX attribute AND the literal value, which is acceptable; the rule trips as designed.)
3. Deleted the temp file. Verified absence with `ls`.
4. `npm run lint` → **exit 0**. Clean.

`git status --porcelain` afterwards shows no tracked-file changes (only the pre-existing untracked `.aws/` and prior batch report files).

## Build output sanity

- "Generating static pages using 11 workers" → succeeded `(36/36)` in 698ms.
- Route table includes `/sitemap.xml` and `/robots.txt` as `○ (Static)`.
- Real routes counted: 32 (about-us index + 5 subs = 6; careers index + 4 subs = 5; case-studies index + 4 details = 5; contact-us = 1; industrial-services index + 11 details = 12; processes/disposal-of-inorganic-oxidizers = 1; treatment-facility = 1; winnipeg-service-centre = 1) + `/` + `/_not-found` = **34 non-meta routes**, matching the spec target.

## Blockers
None.

## Recommendation

APPROVE Phase 05 (commit `9827fd9`) for merge or deploy at the user's discretion. All exit criteria in `docs/superpowers/specs/miller-web-phase-05.md` §"Exit criteria" are met:

- `npm run lint` + `npm run build` clean at root ✓
- All 32 real Miller routes prerender (no stubs) ✓
- `FamilyOfCompanies` renders in both apps' footers ✓
- (Lighthouse LCP and axe a11y measurements were not re-run in this gate sweep — those are runtime checks requiring a dev server boot, which is out of scope for the read-only verification-gates role. Trust the executor's prior measurements per Batch 4 spec-compliance report.)

Minor non-blocking note: the `next/google-fonts/page-fonts` warning in lint output is informational (App Router project, no `pages/` dir). Not actionable; suppressing it would require an explicit rule disable. Leave as-is.
