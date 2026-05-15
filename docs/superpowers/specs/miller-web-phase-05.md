# Phase 05 — Polish, gates, commit

**Theme:** Final verification + SEO + accessibility + performance review + commit.

**Parallelism:** **Sequential** — each step verifies the previous. Estimated total: one engineer, ~half a day.

**Companion:** Spec v3 §6, §7, §8 + the rest of the spec for compliance.

## Tasks

### 05.1 SEO + metadata + sitemap + robots

- For each Miller route, ensure `export const metadata = { title, description }` is present and sourced from `lib/content/*` (single source — copy edits flow).
- Add `apps/miller-web/app/sitemap.js`:
  - Enumerate the 26 real routes (NOT the 6 stubs — they're shells with no real content; better to omit from sitemap until they're filled).
  - Each entry has `url`, `lastModified` (build time), `changeFrequency: "monthly"`, `priority` (home = 1.0, services = 0.8, others = 0.5).
- Add `apps/miller-web/app/robots.js` allowing all.
- Add `apps/miller-web/public/og.png` (placeholder until real asset).
- Verify: build, hit `/sitemap.xml` + `/robots.txt`, eyeball.

### 05.2 Accessibility audit

- Run `npx @axe-core/cli http://localhost:3001/` against each of the 26 real routes (or use the Lighthouse a11y panel — pick whichever is faster). Fix any violations.
- Keyboard pass: tab through `/` and `/industrial-services/environmental-remediation-services/`. Verify:
  - Skip link is first focusable; `Enter` jumps to `#main`.
  - `EmergencyBanner` phone link is in tab order before `<main>` on the allow-list routes.
  - Mobile drawer (use viewport ≤sm) traps focus; Esc closes; body scroll locks.
  - Remediation callback form: submit empty; first invalid input gets focused; SR receives the announce via `role="alert"`.
- Confirm `<ol>` semantics on `MillerProcessFlow` (DOM inspector or `npx axe`).
- Confirm reduced-motion: `chrome --emulate-prefers-reduced-motion=reduce` (or browser flag) ⇒ no carousel rotation, no scroll-reveal opacity transitions.
- Confirm cert/licence links: each card's link text reads `"<name> · PDF, <KB> KB"`. ESLint rule `no-restricted-syntax` already bars `href="#"`; add a CI grep on `lib/certs.js`:
  ```bash
  ! grep -E 'href:\s*"#"' apps/miller-web/lib/certs.js
  ```
  (exit-1 on match.)

### 05.3 Performance measurement

- `npm run build --workspace=miller-web` — read Next's per-route first-load JS column from the console output. Record numbers.
  - Targets (not gates) from spec §7: thin pages ~120 KB, rich pages ~180 KB. Anything materially above is a fix candidate.
- Run Lighthouse mobile preset (Moto G Power, Slow 4G) on `http://localhost:3001/` and `http://localhost:3001/industrial-services/environmental-remediation-services/`. Record LCP.
  - Target ≤ 2.5 s. > 3.0 s is a fix item.
- If a route is materially over budget, the usual suspects: hero photo too large (force `?w=1600` cap), needless client component (audit `"use client"` directives), font payload (verify only Geist + Geist Mono ship in prod via DevTools Network tab).

### 05.4 Lint clean + custom ESLint rule for `href="#"`

- Add to `<repo root>/eslint.config.mjs`:
  ```js
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: "JSXAttribute[name.name='href'][value.value='#']", message: "Placeholder href. Wire a real URL." }
      ]
    }
  }
  ```
- Run `npm run lint` at root. Exit 0 required.
- Run `npm run build` at root. Both apps build. All 26 real + 6 stub routes prerender for Miller.

### 05.5 `FamilyOfCompanies` footer module + local commit

- Build `apps/brand/components/FamilyOfCompanies.jsx` (shared, exported from `@white-owl/brand/components`). Renders three brand entries (Miller Environmental · TransLine49° Environmental Services · Miller Waste Systems) under a "Part of the White Owl Family Office Group" header line. Current site is `data-current=""`, styled bolded.
- Add to both `apps/transline49-web/components/SiteFooter.jsx` (above social row) and `apps/miller-web/components/SiteFooter.jsx`. Each footer passes `current="tl49"` or `current="miller"`.
- Rebuild both apps; verify the strip renders, current site is bolded.
- **Local commit only** — three commits across all phases, or squashed into one — user has explicitly said NO push to origin, NO deploy:
  - Phase 01: "Phase 01: extract @white-owl/brand, scaffold miller-web skeleton"
  - Phases 02-04 (squash recommended): "Phases 02-04: Miller-web — components, templates, 26 routes + stubs"
  - Phase 05: "Phase 05: SEO + a11y + perf gates + FamilyOfCompanies"
- Run `git log --oneline -5` to confirm history.

## Exit criteria

- `npm run lint` + `npm run build` clean at root.
- All 26 real + 6 stub Miller routes prerender.
- Lighthouse mobile LCP ≤ 2.5 s on `/` and Remediation.
- Axe reports zero serious/critical violations on each route.
- `FamilyOfCompanies` renders in both apps' footers.
- Three local commits (or one squash), nothing pushed.
