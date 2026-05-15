# Phase 02 — spec compliance review
**Reviewer:** spec-compliance
**Commit reviewed:** 5e042cd
**Date:** 2026-05-15

## Summary
APPROVE-WITH-NITS

Commit 5e042cd lands every cluster (02.1-02.5) called out in `miller-web-phase-02.md` and respects the design-spec invariants in `2026-05-15-miller-web-design.md` §3 / §4.5 / §6 / §11 / §12. Verification gates pass: `npm run lint` exits 0 at root, `npm run build --workspace=miller-web` produces exactly the two expected routes (`/` and `/_not-found`), and no throwaway test routes are committed. The only items that move this from APPROVE to APPROVE-WITH-NITS are minor code-hygiene snags, none of which break the spec or the build.

## Findings

### Verified compliant

**Logomark imagery (focus area 1)**
- `apps/miller-web/components/Logomark.jsx:9` uses `src="/miller/logo/miller-logomark.webp"`. Not `/logo.png`.
- `apps/miller-web/components/AffiliationsGrid.jsx:63,69` reference `/miller/logo/miller-waste-systems-cross-link.webp` and `/miller/logo/transline49-cross-link.webp` — local cross-link logos, not third-party.
- All 8 other affiliation marks resolve under `/miller/affiliations/*.webp`. Files actually exist on disk (confirmed against `public/miller/affiliations/`).
- `apps/miller-web/app/layout.jsx:30,33` use the local logomark for OG image + favicon.

**EmergencyBanner allow-list (focus area 2)**
- `apps/miller-web/lib/nav.js:91-100` exports `EMERGENCY_BANNER_ROUTES` and `shouldShowEmergencyBanner(pathname)`.
- Exact set `{"/", "/treatment-facility"}` + prefix `["/industrial-services"]` matches spec §2.4 verbatim: shown on `/`, `/industrial-services/*`, `/treatment-facility/`.
- Hidden routes (`/about-us/*`, `/careers/*`, `/case-studies/*`, `/contact-us/`, `/winnipeg-service-centre/`, `/processes/*`) all correctly fall through to `false`.

**EmergencyBanner SSR initial state (focus area 3)**
- `apps/miller-web/app/layout.jsx:52-53` uses `next/headers` `cookies()` server-side and passes `initialDismissed` to the banner. No first-paint flash for the dismiss state.
- `apps/miller-web/components/EmergencyBanner.jsx:21-32` writes the cookie on dismiss and returns `null` when `dismissed` is true.

**ServiceDetailTemplate (focus area 4)**
- `apps/miller-web/components/templates/ServiceDetailTemplate.jsx:25-91` dispatches on `variant: "compact" | "capabilities"` via `CapabilitiesBody` / `CompactBody`.
- `lib/content/brand.js` does NOT exist (confirmed via `git ls-tree 5e042cd apps/miller-web/lib/`). The trust badge phrase lives as a local constant `ONLY_IN_CANADA_TRUST` (lines 22-23) with the explicit `// TODO(phase-4): replace with import from lib/content/brand.js once that module lands.` marker. Exactly the contract the focus area asked for.
- `apps/miller-web/lib/services.js` is a 10-entry registry with `{ id, slug, title, summary, icon, photo, variant }` for every service. `variant` values match spec §3.2: `industrial-waste-treatment` → `capabilities`, `environmental-remediation-services` → `bespoke`, plus 4 more `capabilities` + 5 `compact`.

**Cert/affiliation patterns (focus area 5)**
- Root `eslint.config.mjs:21-33` adds the new `no-restricted-syntax` rule with two selectors (`JSXAttribute[name.name='href'][value.value='#']` and `JSXAttribute[name.name='href'] > Literal[value='#']`). Both cover the static-string and JSX-expression forms.
- `apps/miller-web/lib/certs.js:20,29,38,47` uses non-`#` placeholder hrefs (`/certs/<slug>.pdf`) with `// TODO(phase-5): real PDF` markers. Files do not yet exist on disk; spec §5.2 / §10.1 explicitly defers the existence check to phase 05.
- Grep for `href="#"` returns only doc-comment mentions, no live JSX.

**Class vocabulary (focus area 6)**
- Grep for `wo-` across all of `apps/miller-web/**`: zero hits in source, CSS, or lib files. Confirmed empty.
- New Miller selectors all live under `mw-*` (mega-menu, footer eyebrow, cert/aff/loc/cs/process atoms) or `miller-eb-*` (banner). `data-brand="miller"` attribute on `<html>` set in `app/layout.jsx:56`.
- `tl-*` reuse is heavy and intentional (`tl-topbar`, `tl-skip`, `tl-container`, `tl-mobile-nav`, etc.) — that's spec-blessed in §1.2 + §12.

**No phase 03/04 leakage (focus area 7)**
- `npm run build --workspace=miller-web` output: `Route (app) ┌ ƒ / └ ƒ /_not-found`. Exactly the two expected routes.
- No throwaway `phase02-smoke`, `__phase02_smoke`, `__test`, or similar routes in `app/`. Tree only contains `app/page.jsx`, `app/layout.jsx`, `app/globals.css`.
- No `lib/content/*` files in the commit (`git ls-tree 5e042cd apps/miller-web/lib/` shows only `certs.js`, `nav.js`, `services.js`).
- No `RemediationTemplate`, no `CareersTemplate`, no pages — all correctly deferred to phase 03/04.

**a11y on chrome (focus area 8)**
- `EmergencyBanner.jsx:35-39`: `<aside role="region" aria-label="24-hour emergency contact">`.
- Mobile-collapse aria-label on phone link: `aria-label={\`Call 24/7 emergency: ${EMERGENCY_DISPLAY}\`}` (line 44). Matches spec §2.4 verbatim.
- `Logomark.jsx:11`: `alt="Miller Environmental"` — non-empty.
- `TopNav.jsx:38-45`: body-scroll lock effect (`document.body.style.overflow = "hidden"` while drawer open, restored on cleanup).
- `TopNav.jsx:48-56`: window-level Escape handler closes both mobile drawer and any open desktop submenu.
- `TopNav.jsx:30-35`: route-change reset using React 19's render-time setState pattern.
- `app/layout.jsx:65,70`: skip link `<a className="tl-skip" href="#main">` first focusable; `<main id="main" tabIndex={-1}>` as target.

**Server vs client components (focus area 9)**
- Client: `TopNav.jsx:1` (`"use client"`), `EmergencyBanner.jsx:1`, `BannerRouteGate.jsx:1`, `MillerProcessFlow.jsx:1` — all expected.
- Server (no `"use client"`): `SiteFooter.jsx`, `Logomark.jsx`, `CertificationGrid.jsx`, `AffiliationsGrid.jsx`, `LocationCard.jsx`, `CaseStudyCard.jsx`, and all 6 templates (`AboutTemplate`, `LocationTemplate`, `IndexTemplate`, `ContactTemplate`, `ProcessTemplate`, `ServiceDetailTemplate`). Matches the matrix in spec §1.2 + §5.1.

**No spec drift (focus area 10)**
- `apps/brand/package.json` still has only the three `exports` lines and `peerDependencies` — no build step, no `prepare` hook, no `dist/`. Source-shipped, exactly as spec §1.2 mandates.
- No factories, no namespace plumbing. `SiteTweaksProvider` still consumed with the hard-coded `namespace="tweaks:miller"` per spec §1.2.

### Nits

**N1 — `lib/content/` is a tracked-empty local artifact (not in commit, will warn newcomers).** `ls apps/miller-web/lib/content/` returns an empty directory on disk, but `git ls-tree 5e042cd apps/miller-web/lib/` confirms only `certs.js`, `nav.js`, `services.js` are tracked. The empty dir is presumably left over from setup. Not a spec violation (spec calls `lib/content/` a phase-04 deliverable), and it doesn't get committed because git ignores empty dirs. Recommend running `rmdir apps/miller-web/lib/content` to avoid confusion when the directory is recreated in phase 04 — or add a `.gitkeep` if intentional.

**N2 — AffiliationsGrid `external` flag has identical branches.** `apps/miller-web/components/AffiliationsGrid.jsx:92-94`:
```
{...(a.external
  ? { target: "_blank", rel: "noreferrer noopener" }
  : { target: "_blank", rel: "noreferrer noopener" })}
```
Both branches are identical, so every link opens in a new tab regardless of the `external` flag. Spec §4.5 only required external = "new tab"; behaviour is acceptable for all-external affiliations but the conditional is dead code. Either collapse to an unconditional spread or actually differentiate the non-external (currently unused) case.

**N3 — `Logomark.jsx` source comment is now stale relative to spec wording.** Phase 02.1 spec line 15 still says "30 px `<img>` from `/logo.png` with eslint-disable comment." The implementation correctly uses `/miller/logo/miller-logomark.webp` (matching the focus area + the asset manifest), but the spec text wasn't updated. The component itself is correct; this is a spec-doc mismatch the team-lead may want to record so future readers don't get confused.

**N4 — TopNav comment claims focus trap but doesn't actually implement one.** `TopNav.jsx:5-6` reads "Mobile drawer mirrors the TL49 pattern (focus trap behaviour, body-scroll lock, Escape close)." Body-scroll lock and Escape close are real; there is no Tab/Shift+Tab cycling, no initial-focus-into-drawer, no return-focus-to-trigger on close. TL49's own TopNav lacks this too — so Miller does "inherit" the TL49 pattern verbatim. Spec §6 lists "Mobile nav drawer. Inherits TL49's focus trap + body-scroll lock." which is similarly aspirational. Recommend either adding a real trap (focus the first link on open, trap Tab cycle, return focus to trigger on close) before the phase 05 WCAG audit, or rewording the inline comment so it doesn't promise behaviour the code doesn't deliver. Not a phase 02 blocker.

**N5 — Per-route `data-banner="off"` writes are deferred to client (`BannerRouteGate`), so non-allow-listed routes will flash-show the banner once they exist.** `app/layout.jsx:64` defaults `<body data-banner="on">`, and `BannerRouteGate.jsx:18-25` corrects to `off` after mount via `useEffect`. Phase 02 has only `/` (an allow-listed route) so this is invisible today. Spec §2.4 / 02.2 actually preferred a route-segment layout approach for zero-JS gating; the agent's diff includes the route-gate client island instead. The commit message acknowledges this trade-off ("CSS gates visibility, so the banner is rendered unconditionally and per-route work is one DOM attribute write"). Once phase 03 adds `/about-us/*` etc., either (a) those route segments must set `data-banner="off"` via their own segment layouts to fully kill the flash, or (b) the SSR layout must read pathname (via `next/headers` `headers()` `x-pathname`) and seed `data-banner` server-side. Flag for phase 03 owners — not a phase 02 fix.

**N6 — `EmergencyBanner` returns `null` post-mount when dismissed, which could shift layout.** `EmergencyBanner.jsx:32` returns `null` when `dismissed` is true. Because the banner uses `position: sticky; top: 0` inside a wrapper with `min-block-size: 56px` (`globals.css:18-26`), removing it on dismiss collapses 56 px from the top of the page. Spec §7 says "CLS budget < 0.05" and `EmergencyBanner uses position: sticky; top: 0 inside a wrapper with reserved min-block-size and dvh units to absorb iOS address-bar shifts." The sticky-with-reserved-height pattern is implemented, but on dismiss the banner is fully unmounted rather than visually collapsed in a CLS-safe way. Phase 05 a11y/perf audit (or a CSS-only collapse to `display:none` while preserving wrapper height) can address this; not a phase 02 blocker since the initial paint is correct.

### Blockers
None.

## Recommendation

Approve commit `5e042cd` as phase 02 completion. The five clusters are all delivered, the verification gates the agent claimed (lint clean, build = 2 routes) reproduce locally, and every focus-area invariant holds. Nits N1-N3 are cosmetic; N4-N6 are real but explicitly belong to later phases (N4/N6 → phase 05 a11y/perf audit, N5 → phase 03 route owners). Recommend the team-lead:

1. Note N4 + N5 + N6 as carry-overs in the phase 03/05 trackers.
2. Either drop the empty `lib/content/` directory or add a `.gitkeep` so it's visible (N1).
3. Update spec line 15 of `miller-web-phase-02.md` to say `/miller/logo/miller-logomark.webp` instead of `/logo.png` so the spec matches the asset reality (N3).
4. Decide whether to fix the dead conditional in `AffiliationsGrid` now (5-line change) or roll it into a phase 05 sweep (N2).
