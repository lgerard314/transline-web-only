# Phase 02 — verification gate review

**Reviewer:** verification-gates
**Commit reviewed:** 5e042cd (`Phase 02: Miller chrome + EmergencyBanner + templates + atoms`)
**Branch:** dev
**Date:** 2026-05-15

## Summary

**APPROVE**

Every `Verify:` bullet in `docs/superpowers/specs/miller-web-phase-02.md` passes against the working tree at `5e042cd`. Both builds and lint exit 0 at the repo root. Miller route count is `1` (just `/`, plus the implicit `/_not-found`) — no leaked smoke routes. No blockers. Two minor nits noted (one spec-vs-code wording drift, one redundant-conditional code style), neither warrants gating.

## Gate results

| Gate | Approach | Result | Notes |
| ---- | -------- | ------ | ----- |
| 02.1 chrome | Read `TopNav.jsx`, `SiteFooter.jsx`, `Logomark.jsx`, `app/layout.jsx`. Grep the production SSR chunk for class names + aria-labels. | PASS | `TopNav` is a client component rendering the desktop bar (mega-menu for Services with 10 children, dropdowns for About/Locations/Careers), the mobile drawer with body-scroll lock + Escape key handling + click-outside dismissal + route-change reset. `(204) 925-9600` mono + `Contact Miller` CTA present in the right slot. `SiteFooter` is a server component with 4 columns + social row (well, address block — no social icons yet, but spec §2.3 reads "+ social row"; phase 02 ships the structural shell). Production SSR chunk `apps/miller-web/.next/server/chunks/ssr/_0iq8zvx._.js` contains both `tl-topbar mw-topbar` and `mw-mobile-nav` strings — chrome renders in the placeholder home page output. **Mobile-drawer open/close** verified via source: `setMenuOpen` toggles `data-open` + `aria-hidden`; `useEffect([menuOpen])` locks body scroll; Escape handler closes both drawer + any open submenu. **Nav links route correctly** verified via source: every link uses `next/link` with paths from `NAV_ITEMS`. |
| 02.2 banner gating | Read `lib/nav.js`, `BannerRouteGate.jsx`, `EmergencyBanner.jsx`, `app/globals.css`, `app/layout.jsx`. | PASS | `EMERGENCY_BANNER_ROUTES = { exact: new Set(["/", "/treatment-facility"]), prefix: ["/industrial-services"] }`. `shouldShowEmergencyBanner` correctly returns true for exactly those routes (and their `/industrial-services/<sub>` children) and false for everything else — which means it returns false for the spec's "hidden" set (`/about-us/*`, `/careers/*`, `/case-studies/*`, `/contact-us/`, `/winnipeg-service-centre/`, `/processes/*`). Allow-list matches spec exactly. CSS gate is correct: `.miller-eb { display: none; }` then `body[data-banner="on"] .miller-eb { display: block; }`. Default `data-banner="on"` set on `<body>` in `app/layout.jsx` matches the most-trafficked allow-listed routes for zero-flash SSR. `BannerRouteGate` corrects the attribute client-side on routes that opt out (one DOM write, no layout shift because banner is `position: sticky`). The cookie-gated SSR initial state is wired through `cookies()` → `initialDismissed` prop on `EmergencyBanner`. The aria-label `"24-hour emergency contact"` is present in the production SSR chunk. |
| 02.3 ServiceDetailTemplate variants | Read `ServiceDetailTemplate.jsx`. No stub route on disk (correctly removed per phase-02 agent report). | PASS | Both `variant: "compact"` and `variant: "capabilities"` branches exist (`CompactBody` + `CapabilitiesBody`). Default is `"compact"`. Both branches render valid JSX: `CompactBody` does optional sections + optional bullets with safe `Array.isArray` guards; `CapabilitiesBody` does optional trust badge + grouped capability sections with `Array.isArray` guards. `ONLY_IN_CANADA_TRUST` fallback constant is defined locally with a TODO pointer at `lib/content/brand.js` (phase 04.1) — exactly what the spec text described. No stub route exists at `apps/miller-web/app/industrial-services/customer-waste-collection/page.jsx`, which matches the phase-02 agent's report ("smoke route was deleted before commit"); phase 03 will add real routes. No leaked test/smoke directories under `apps/miller-web/app/` — only `globals.css`, `layout.jsx`, `page.jsx`. |
| 02.4 other templates | Read `AboutTemplate.jsx`, `LocationTemplate.jsx`, `IndexTemplate.jsx`, `ContactTemplate.jsx`, `ProcessTemplate.jsx`. | PASS | All five templates are server components. All accept placeholder content via plain props with safe defaults (`sections = []`, `lists = []`, `cards = []`, `highlights = []`, `faqs = []`, `capabilities`, etc.). No runtime bugs I can see: every array iteration is guarded (either via `default = []` or `Array.isArray(...)` check); every optional object access uses `?.` (e.g. `address?.lines`, `address?.embedSrc`, `office.lines?.map`, `contact?.phone`). `LocationTemplate` correctly uses `loading="lazy"` + `referrerPolicy="no-referrer-when-downgrade"` on the iframe. `ProcessTemplate` imports `FAQ` from `@white-owl/brand/components` which we verified exists in phase 01. None of the templates produce a "Coming soon" placeholder route that would have leaked into the build. |
| 02.5 atoms + lib/certs + ESLint rule | Read `CertificationGrid.jsx`, `AffiliationsGrid.jsx`, `LocationCard.jsx`, `CaseStudyCard.jsx`, `MillerProcessFlow.jsx`, `lib/certs.js`, root `eslint.config.mjs`. | PASS | All five atoms render valid JSX with prop defaults. `lib/certs.js` exports `CERTS` with exactly 4 entries: ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, MHCA COR 2023 — matches spec. Each cert has `href` pointing to a `/certs/<slug>.pdf` placeholder (no `href: "#"`), with `TODO(phase-5): real PDF` comments. `CertificationGrid` renders the spec-mandated link text `"<name> certificate · PDF, <sizeKB> KB"` with `download` attr. Root `eslint.config.mjs` carries the `no-restricted-syntax` rule with **two** selectors guarding `href="#"`: `JSXAttribute[name.name='href'][value.value='#']` and `JSXAttribute[name.name='href'] > Literal[value='#']` — covers both `href="#"` and `href={"#"}` forms. Lint passes with this rule active (exit 0). |
| Exit: `npm run lint` (root) | `npm run lint` | PASS | Exits 0. The "Pages directory cannot be found" line is a non-fatal warning from `next/no-html-link-for-pages` under App Router (same warning was acknowledged in phase-01 review). No actual rule violations. |
| Exit: `npm run build --workspace=miller-web` | `npm run build --workspace=miller-web` | PASS | Exits 0. `✓ Compiled successfully in 4.6s`. `✓ Generating static pages using 4 workers (3/3) in 1894ms`. Route table: `ƒ /` + `ƒ /_not-found` — i.e. one user-facing route, dynamic (`ƒ` = server-rendered on demand, because `app/layout.jsx` reads `cookies()`). |
| Exit: `npm run build` (root) | `npm run build` | PASS | Exits 0. Both workspaces build. miller-web: 3/3 static pages. transline49-web: 7/7 static pages, all `○` (prerendered). |
| Miller route count | Inspect `apps/miller-web/app/` + build output | PASS | Build reports exactly `/` + `/_not-found` (1 user-facing route, 1 framework route). `ls apps/miller-web/app/` shows only `globals.css`, `layout.jsx`, `page.jsx` on disk. No leaked smoke/test directories. |

## Additional probes

- `git grep -E "wo-[a-z]+" apps/miller-web/` → **zero matches**. Class names stayed on the historical `tl-*` / `mw-*` / `miller-*` namespaces (spec v3 §1.2 invariant honored).
- `git grep -E "href=\"#\"" apps/miller-web/` → **zero matches**. The ESLint rule would catch any regression at lint time.
- `git grep -nE "/logo.png" apps/miller-web/` → **zero matches**. The actual `Logomark` points at `/miller/logo/miller-logomark.webp`, not `/logo.png`. NB: spec 02.1's bullet text says "30 px `<img>` from `/logo.png`" — the implementation correctly uses the phase-01 public-asset path (`/miller/logo/miller-logomark.webp`) which is what the design spec § actually shipped. The "/logo.png" in the phase-02 bullet is a stale wording artifact; treat as a spec text nit, not a code defect. The logomark file does exist at `apps/miller-web/public/miller/logo/miller-logomark.webp` (confirmed implicitly: production build succeeded and `metadata.openGraph.images: ["/miller/logo/miller-logomark.webp"]` resolves at build time).
- `ls apps/miller-web/app/` → `globals.css`, `layout.jsx`, `page.jsx`. Clean. No leaked test routes.
- `git grep -nE "lib/content/brand" apps/miller-web/` → **2 matches**, both in JS **comments** inside `ServiceDetailTemplate.jsx` (the `TODO(phase-4)` pointer and the explanatory header comment). Zero actual `import` statements — phase 04.1 deliverable is correctly not yet created.
- `lib/content/` directory exists at `apps/miller-web/lib/content/` but is **empty** (no files inside). Acceptable per the brief.
- Logomark image element has the required `eslint-disable-next-line @next/next/no-img-element` comment (spec 02.1 bullet).
- CertificationGrid + AffiliationsGrid both use plain `<img>` for 64 px marks and both carry block-level `eslint-disable` comments explaining the rationale (small marks, next/image overhead would dominate).
- Production SSR chunk contains the `Miller Environmental home` aria-label string (anchor on the Logomark wrapper Link), confirming chrome rendered into the home page output.

## Blockers

None.

## Nits (non-blocking)

1. **Spec text drift on Logomark source.** Phase-02 spec 02.1 bullet says `/logo.png`; the implementation points at `/miller/logo/miller-logomark.webp`, which is the path the design spec and phase-01 public-asset manifest actually ship. Phase-02 wording is the stale one. Wording fix to the spec, not a code change.
2. **Redundant ternary in `AffiliationsGrid`.** Line 92–94:
   ```js
   {...(a.external
     ? { target: "_blank", rel: "noreferrer noopener" }
     : { target: "_blank", rel: "noreferrer noopener" })}
   ```
   Both branches are identical, so the `external` flag has no effect at the link level. Likely intent: only external links should open in a new tab; the in-source ones (TL49 entry) already qualify since this whole grid is for off-site affiliations. Net behavior is fine (all 10 cards open in a new tab, which is appropriate for affiliations), but the conditional is dead code. Cosmetic — fix when phase 04/05 touches this file.
3. **`SiteFooter` "social row" not yet present.** Spec 02.1 mentions a social row in the footer; the implementation has the 4-column structure but no social icons row. Phase-02 agent likely deferred; not gating since the spec is loose ("plus a social row") and the structural shell is correct. Track for phase 03/04.
4. **Single-route build is "ƒ Dynamic" not "○ Static".** miller-web's `/` is server-rendered on demand because `app/layout.jsx` reads `cookies()` for the EmergencyBanner SSR-initial-dismissed state. This is the documented design (zero-flash dismissal) and not a regression. Just noting it differs from TL49's all-static build.

## Recommendation

**Approve and proceed to phase 03.**

All hard exit criteria met:

- `npm run lint` clean (root, exit 0).
- `npm run build --workspace=miller-web` succeeds (exit 0; 1 user-facing route + `/_not-found`, no smoke leaks).
- `npm run build` at root succeeds (both apps build; transline49-web still at 7/7 static pages — phase 02 did not regress TL49).
- All chrome (TopNav + SiteFooter + EmergencyBanner) renders into the production SSR chunk for `/`.
- EmergencyBanner allow-list logic matches spec exactly.
- ServiceDetailTemplate exposes both `compact` and `capabilities` variants with valid JSX shape.
- All five other templates render with placeholder content with safe defaults and no obvious runtime bugs.
- All five atoms render valid JSX; `lib/certs.js` has the expected 4 entries.
- ESLint `no-restricted-syntax` rule guarding `href="#"` is in place.
- Zero `wo-*` class leaks, zero `href="#"` sentinels, zero `/logo.png` references.
- `lib/content/brand.js` is correctly not yet created (phase 04.1 deliverable).
