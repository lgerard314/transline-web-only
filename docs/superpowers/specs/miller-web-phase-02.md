# Phase 02 — Miller components + page templates

**Theme:** Build everything that Miller pages will consume. Pages themselves come in phase 03/04.

**Parallelism:** **Fully parallel** — five independent task clusters, each ownable by a separate agent. No inter-task dependencies once phase 01 lands.

**Companion:** Spec v3 §3 (templates) + §4.5 (components) + §6 (a11y).

## Tasks

### 02.1 Miller chrome — `TopNav` + `SiteFooter` + `Logomark`

- `apps/miller-web/components/TopNav.jsx` (client). Mega-menu pattern for Services (10 children), dropdown for About (5) + Locations (2) + Careers (2). Mobile drawer inherits TL49's focus trap + body-scroll lock pattern. Right slot: `(204) 925-9600` mono + "Contact Miller" CTA.
- `apps/miller-web/components/SiteFooter.jsx` (server). 4 columns (Services / Company / Locations / Contact) + social row. Use `next/link` for internal links.
- `apps/miller-web/components/Logomark.jsx` (server). 30 px `<img>` from `/logo.png` with eslint-disable comment.
- `apps/miller-web/lib/nav.js` — exports `NAV_ITEMS`, `pageIdFromPath`, and the `EMERGENCY_BANNER_ROUTES` allow-list.
- **Verify:** layout renders chrome on the placeholder home page; mobile drawer opens/closes; nav links route correctly.

### 02.2 `EmergencyBanner` + route-scoped rendering

- `apps/miller-web/components/EmergencyBanner.jsx` (client). `<aside role="region" aria-label="24-hour emergency contact">` with `tel:` link first, dismiss button second. Cookie-gated SSR initial state (`miller_eb_dismissed=1` ⇒ banner closed on first paint, no hydration flash). Sticky `position: sticky; top: 0`. Wrapper uses `min-block-size` and `dvh` units to absorb iOS Safari address-bar shifts.
- Mobile-collapse to icon button at ≤sm with `aria-label="Call 24/7 emergency: (204) 957-6327"`.
- In `app/layout.jsx`, read pathname (via a thin client wrapper since the layout itself is server) OR pass route allow-list as data attr + CSS `:has` selector. Decide based on what produces less JS — likely the CSS approach: render the banner unconditionally, gate visibility with `body[data-banner="on"] .miller-eb { display: block; }` and set `data-banner` per-route from each page (small per-route layout segment, no client JS for the gate).
- **Verify:** banner visible on `/`, `/industrial-services/*`, `/treatment-facility/`. Hidden on `/about-us/*`, `/careers/*`, `/case-studies/*`, `/contact-us/`, `/winnipeg-service-centre/`, `/processes/*`.

### 02.3 `ServiceDetailTemplate` — compact + capabilities variants

- `apps/miller-web/components/templates/ServiceDetailTemplate.jsx` (server). Dispatches on `variant: "compact" | "capabilities"`.
- **compact:** PageHero + lead paragraph + 1-2 prose sections + optional bullet list + related-services 3-card rail.
- **capabilities:** PageHero (optional CTA row) + lead paragraph + inline "only in Canada" trust badge (sourced from `lib/content/brand.js`) + grouped capability sections (each a heading + bullet list) + related-services rail.
- `apps/miller-web/lib/services.js` — single source of truth: `[{ id, slug, title, summary, icon, photo, variant }]` for all 10 services.
- **Verify:** stub `app/industrial-services/customer-waste-collection/page.jsx` renders without errors using compact variant + dummy content.

### 02.4 Other templates — `AboutTemplate`, `LocationTemplate`, `IndexTemplate`, `ContactTemplate`, `ProcessTemplate`

- `AboutTemplate` (server): PageHero + prose blocks + optional list slots. Used for `/about-us/`, `/about-us/health-safety/`, `/about-us/licencing-information/`, `/about-us/quality-assurance/`, `/about-us/vision-mission-and-core-values/`, `/about-us/professional-affiliations/`, plus `/careers/benefits-rewards/` + `/careers/working-at-miller/`.
- `LocationTemplate` (server): PageHero with facility imagery + address card + `<iframe>` map (`loading="lazy"`, `referrerPolicy="no-referrer-when-downgrade"`) + capabilities list + contact card.
- `IndexTemplate` (server): PageHero + 4-card grid. Used for `/case-studies/` only.
- `ContactTemplate` (server) — shell with PageHero + 3 cards (Phone / Office / Project Intake). Form is a client child (phase 03).
- `ProcessTemplate` (server): PageHero + 4-card highlights + descriptive prose + FAQ + CTA.
- **Verify:** each template renders with placeholder content without runtime errors.

### 02.5 Reusable Miller-specific atoms — `CertificationGrid`, `AffiliationsGrid`, `LocationCard`, `CaseStudyCard`, `MillerProcessFlow`

- `CertificationGrid` (server): 4 cards (ISO 9001 / 14001 / 45001 / MHCA COR 2023). Each card reads from `lib/certs.js`. Link text: `"<name> · PDF, <sizeKB> KB"`, `<a download>`. ESLint rule `no-restricted-syntax` will forbid `href="#"` at lint time (rule lands in this task: add to root `eslint.config.mjs`).
- `AffiliationsGrid` (server): 10-card org grid. TL49 entry uses an `external` flag → opens in new tab.
- `LocationCard` (server): used for the homepage Locations cross-link.
- `CaseStudyCard` (server): used on Remediation + Case Studies. Each card has title + location + read-more link.
- `MillerProcessFlow` (client, but minimal state): renders as `<ol>` for Remediation. Scroll-driven step highlighting can lift TL49's `ProcessFlowAdvanced` pattern.
- `apps/miller-web/lib/certs.js` — exports `CERTS = [{ name, year, slug, href, sizeKB }, …]`. Phase 1 ships with placeholder hrefs flagged with `// TODO(phase-5): real PDF` — the ESLint rule still bars `href: "#"`, so use `href: "/certs/iso-9001-2015.pdf"` (file doesn't exist yet) and let phase 5 turn on the strict `fs.existsSync` check in CI.
- **Verify:** each atom renders in a Storybook-like throwaway test page or directly inside an unused route.

## Exit criteria

- All Miller components + templates compile.
- `npm run lint` clean at root.
- `npm run build --workspace=miller-web` succeeds (page count will be ≤ 2 — just the home placeholder + any throwaway test routes).
- Each template can be instantiated with placeholder content without runtime warnings.
