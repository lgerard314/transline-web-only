# Batch 4 — spec compliance review (Phase 05 polish + FamilyOfCompanies)
**Reviewer:** spec-compliance
**Commit reviewed:** 9827fd9 (parent d29938c)
**Date:** 2026-05-15

## Summary
APPROVE

All Phase 05 tasks (05.1–05.5) plus the Batch 3 carry-forward nits are satisfied. Lint exits 0 at root, both apps build, miller-web emits all 32 real routes + `/_not-found` + `/robots.txt` + `/sitemap.xml`, TL49 diff is scoped to `SiteFooter.jsx` only. No new lint suppressions, no `wo-*` selectors, no `href="#"`, no StatsBand reintroduced.

## Findings

### Verified compliant

**05.1 SEO**
- `apps/miller-web/app/sitemap.js` enumerates exactly 32 real routes (1 home + 1 services index + 10 service details + 1 about-us index + 5 about-us subs + 1 careers index + 2 careers subs + 2 job postings + 1 case-studies index + 4 case studies + 1 contact + 2 locations + 1 process = 32). `/_not-found` correctly excluded.
- Priorities match spec: home `1.0`, services index + 10 details `0.8`, 4 case-study details + 2 job postings `0.6`, all others `0.5`.
- `apps/miller-web/app/robots.js`: `userAgent: "*"`, `allow: "/"`, `sitemap: "https://millerenvironmental.ca/sitemap.xml"`.
- `apps/miller-web/public/og.png` present (20,804 bytes). It is actually a WebP under the .png extension — spec explicitly calls this a placeholder seed and the commit message says so; acceptable for Phase 05.
- All 32 route page files + root layout export `metadata`. Spot-checked: treatment-facility, processes/disposal-of-inorganic-oxidizers, careers/plant-manager, case-studies/brandon-power-facility — each has a `title` (template format `%s · Miller Environmental` applied via root layout). Root layout supplies default title, description, metadataBase, OG, Twitter card, icons.

**05.2 a11y**
- Skip link present in both root layouts: TL49 (`apps/transline49-web/app/layout.jsx:61` → `#tl-main`) and Miller (`apps/miller-web/app/layout.jsx:74` → `#main`). Shared `.tl-skip` CSS in `apps/brand/styles/globals.css`.
- `EmergencyBanner` (`apps/miller-web/components/EmergencyBanner.jsx`) renders `<aside role="region" aria-label="24-hour emergency contact">` matching spec template verbatim.
- `MillerProcessFlow` renders `<ol className="mw-process">` with `<li>` children — semantic ordered list confirmed.
- `apps/miller-web/app/globals.css:376-380` contains a `@media (prefers-reduced-motion: reduce)` block targeting `.mw-hero-frame` (animation disabled; frame-1 forced visible; frames 2/3 hidden).
- Cert/licence link text in `CertificationGrid.jsx` reads `"<name> certificate · PDF, <sizeKB> KB"` — close to spec template `"<name> · PDF, <KB> KB"`; spec gates on no `href="#"`, which is satisfied (all `c.href` resolve to `/certs/...pdf` placeholder paths, no sentinels).
- Live axe/Lighthouse skipped (no available port per Batch 3 carry-forward). Static audit accepted.

**05.3 Perf**
- Only Geist + Geist Mono fonts ship — root layout `FONTS_HREF` builds a single Google Fonts URL with `family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap`. No other font families referenced.
- Third-party preconnects: only `fonts.googleapis.com` + `fonts.gstatic.com`. Nothing else.
- `next/image` not used in miller-web; hero photography goes through `HeroPhoto` (CSS background-image) and small marks/affiliations use `<img>` with explicit width/height. This is consistent with the design-spec performance decision (avoid `next/image` runtime cost for small marks and CSS-decorative photo backgrounds). Live Lighthouse skipped; static chunk audit accepted.

**05.4 Lint rule**
- `eslint.config.mjs` at repo root contains `no-restricted-syntax` blocking both `JSXAttribute[name.name='href'][value.value='#']` and `JSXAttribute[name.name='href'] > Literal[value='#']`, scoped to `apps/**/*.{js,jsx,mjs}`.
- `npm run lint` at repo root exits 0 (re-verified). The "Pages directory cannot be found" message is an informational note from `eslint-config-next`, not an error — preceding `eslint` invocation exited 0.
- `npm run build` at repo root re-verified: both apps compile and prerender successfully. Miller emits 36 build entries (32 real routes + `/_not-found` + `/robots.txt` + `/sitemap.xml`); TL49 emits 7 entries (6 real + `/_not-found`).

**05.5 FamilyOfCompanies**
- `apps/brand/components/FamilyOfCompanies.jsx` exists; exported via `apps/brand/components/index.js` line 15 (`export { FamilyOfCompanies } from "./FamilyOfCompanies";`).
- Renders three entries with id `miller` / `tl49` / `mws` and the exact labels: "Miller Environmental", "TransLine49° Environmental Services", "Miller Waste Systems".
- Header line: `"Part of the White Owl Family Office Group"` (verbatim).
- Wired into `apps/miller-web/components/SiteFooter.jsx` line 93 (`<FamilyOfCompanies current="miller" />`) and `apps/transline49-web/components/SiteFooter.jsx` (diff confirmed `current="tl49"`).
- Current site renders as `<strong className="tl-family__current" aria-current="page">`; non-current entries render as `<a target="_blank" rel="noreferrer noopener">` with cross-origin URLs.
- Styles added to `apps/brand/styles/globals.css` (`.tl-family*` selectors, 45 lines).

**Carry-forward nits**
- Phone literals: grep across `apps/miller-web/**/*.{js,jsx}` (excluding `.next/`) for `"(204) 957-6327"` / `"(204) 925-9600"` returns only `lib/content/brand.js` (the source of truth) and `components/TopNav.jsx` line 8 (a *comment* describing where the number comes from — not a hardcoded usage; the actual value is imported from `brand.js` on line 16). All five files mentioned (industrial-services landing, RemediationCallback, TopNav, SiteFooter, EmergencyBanner) now import `GENERAL_PHONE` / `EMERGENCY_PHONE` from `@/lib/content/brand` rather than inlining digits.
- `ServiceDetailTemplate.jsx`: no `"until brand.js exists"` lingering — grep for `until brand.js` / `TODO.*brand` / `FIXME.*brand` returns no matches in that file.
- EmergencyBanner per-route flash fix: `app/layout.jsx:59-61` reads `next-url` (and falls back to `x-invoke-path`) from `next/headers` server-side, computes `bannerOn` via `shouldShowEmergencyBanner`, and emits `data-banner="on"|"off"` on `<body>` for first-paint correctness. `BannerRouteGate` keeps the attribute in sync on client navigations.
- VBEC repetition: `apps/miller-web/lib/content/home.js:48` sets `vbec.eyebrow: VBEC_SHORT` (position 4); position 3 expanded the full name already.
- CertificationGrid placement decision: documented in inline comments — left in prose area; `eslint-disable @next/next/no-img-element` is pre-existing (also present in parent `d29938c`), not a new suppression.

**TL49 regression check**
- `git diff d29938c..9827fd9 -- apps/transline49-web/` shows only `SiteFooter.jsx`: one import added (`FamilyOfCompanies`) and one render line (`<FamilyOfCompanies current="tl49" />`). No other TL49 file touched.
- TL49 builds and prerenders all 7 routes (6 real + `/_not-found`).

**Route count invariant**
- Miller build output shows 36 `Route (app)` entries = 32 real routes + `/_not-found` + `/robots.txt` (○ static, metadata) + `/sitemap.xml` (○ static, metadata). All metadata files. Sitemap content itself enumerates 32 real routes, correctly excluding `/_not-found`, `/robots.txt`, `/sitemap.xml`.

**Hygiene**
- No `eslint-disable` / `eslint-ignore` introduced in Phase 05 (only the pre-existing `CertificationGrid` file-level disable for `@next/next/no-img-element`).
- No `wo-*` selectors anywhere in `apps/miller-web/`.
- No `href="#"` in source (ESLint guard active; would fail build otherwise). One untracked sandbox file `apps/miller-web/__phase05_lint_test.jsx` exists with `<a href="#">` but it is untracked (`git status`: `??`) and not part of the commit — it was likely used to validate the lint rule manually.
- No `StatsBand` component — only references are negative-assertion comments documenting "No StatsBand" in `HomeTemplate.jsx` and `home.js`.

### Nits
- `public/og.png` is a WebP under the `.png` extension. Acknowledged in commit message as a placeholder until a real OG asset is produced. Worth tracking as a follow-up so social cards render correctly on platforms that strictly validate magic bytes — but spec only requires the file exist, so non-blocking.
- Cert link text says `"<name> certificate · PDF, <KB> KB"` rather than the spec template `"<name> · PDF, <KB> KB"` (extra word "certificate"). Spec explicitly notes "close enough is OK — the spec gates on no `href=\"#\"`", so non-blocking.
- Untracked file `apps/miller-web/__phase05_lint_test.jsx` should probably be deleted or added to `.gitignore` to keep the worktree clean; not in the commit so non-blocking.

### Blockers
- None.

## Recommendation
Ship Batch 4 as-is. The commit lands all Phase 05 exit-criteria and resolves all Batch 3 carry-forward nits with no regressions to TL49 and no new lint suppressions, sentinel hrefs, or design-spec violations. Optional cleanup: replace the WebP-as-`og.png` placeholder with a real OG image, normalise cert link text to spec template, and delete the untracked `__phase05_lint_test.jsx` sandbox file.
