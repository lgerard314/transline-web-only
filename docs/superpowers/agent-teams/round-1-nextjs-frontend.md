# Round 1 — Next.js / Frontend Architect review

Reviewer lens: Next 16 + React 19 App Router, JSX, npm workspaces, ESLint flat config. Spec: `docs/superpowers/specs/2026-05-15-miller-web-design.md`. Sister app: `apps/transline49-web/`.

## Verdict

**Ship the architecture, but fix four wiring issues before phase 1 starts.** The shared-package idea is right, the route plan compiles cleanly to 32 static pages, and the server/client split is mostly correct — but four concrete details (`transpilePackages`, eslint scope, workspace root scripts, and one stateful component the spec misses) will bite during phase 1 if not nailed now.

## What's right

- **Source-shipped workspace package.** No build step in `@white-owl/brand` is the correct call for a Next 16 + React 19 monorepo with JSX. The consumer's SWC compiles it; no dual-package hazard, no CJS/ESM split, no `dist/` to keep in sync. Matches how the TL49 app already imports its own `components/*.jsx` today.
- **Static generation plan.** All listed routes are server components without dynamic data dependencies; both `[slug]` segments declare `generateStaticParams` returning closed enumerations. Next 16 will emit static HTML, not fallback. The 32-route total is realistic.
- **React 19 derived-state callout for `EmergencyBanner`** (spec §4.4). The author has already internalised the lesson from commit `0c948c5` — set state during render with a guard rather than `useEffect` for sessionStorage hydration. Correct pattern; same approach as `TopNav.jsx:20-24`.
- **Decision log entry #10** acknowledges the risk of an accidental stateful import pulling `"use client"` up the tree. That risk is real (see "What's wrong" #4).
- **Server-by-default discipline.** Templates as plain functions + data modules in `lib/content/` is how the existing TL49 app stays at 7 prerendered routes with zero forced-client pages.

## What's wrong

1. **`transpilePackages` is not configured.** `apps/miller-web/next.config.mjs` will need `transpilePackages: ["@white-owl/brand"]` (and TL49's config will need the same once it imports from the shared package). Without it, Next 16 will refuse to compile JSX from a `node_modules`-resolved workspace package even when symlinked. The spec describes the package shape but never writes this line. Add it to §1.2 or §1.3.

2. **ESLint flat config does not reach the shared package.** `apps/transline49-web/eslint.config.mjs` (lines 1-10) only ignores `.next/`, `node_modules/`, `out/` and runs from the app directory (`npm run lint` = `eslint .`). Linting `@white-owl/brand` requires either (a) an `eslint.config.mjs` at `apps/shared/brand/` with its own `lint` script, or (b) hoisting lint to the workspace root with a config that globs `apps/*/`. The spec is silent. Pick one — option (b) is cheaper because the rules are identical.

3. **Workspace root `package.json` hardcodes `transline49-web`.** Current scripts (`"dev": "npm run dev --workspace=transline49-web"`, same pattern for build/start/lint) will not run anything in `miller-web`. Spec §1.1 says "workspace root `package.json` already globs `apps/*`, so the new package picks up automatically" — true for `npm install`, false for these scripts. Need either per-app scripts (`dev:tl49`, `dev:miller`) or `npm run dev -ws --if-present`. Add to spec §1.1.

4. **One stateful primitive missing from §5's server/client list: the mobile nav drawer's body-scroll lock.** Spec lists "TopNav (menu open)" as client, which is correct, but the spec also implies Miller's TopNav adds the dropdown mega-menu (Services has 10 children, About has 5, etc. — §2.1). Dropdowns with hover-or-click open state are another client-state surface, and if implemented as a child component imported by TopNav they stay inside the same client boundary — fine. However, **`EmergencyBanner` rendered above `TopNav` in `layout.jsx` means the root layout imports a client component**, which is allowed (RSC can render client children) but every prop passed in must be serialisable. The spec is fine here, but flag for implementers: do not pass the dismiss handler or palette default as a function prop from the (server) layout.

5. **`PageHero` / `ServiceCard` in shared assume `next/link`.** Moving them to `@white-owl/brand` means the shared package depends on `next` at runtime. That's load-bearing for transpile and `peerDependencies` hygiene: declare `next`, `react`, `react-dom` as `peerDependencies` in `apps/shared/brand/package.json`, not regular `dependencies`. Otherwise both consuming apps risk pulling two React copies on a future `npm install` and "Invalid hook call" errors will surface. Worth one explicit line in §1.2.

6. **CSS shipping path.** Spec §1.2 lists `./styles/globals.css` as an export, and §1.3 says `apps/miller-web/app/globals.css` "re-exports" the shared file. Next 16 doesn't `@import` CSS from `node_modules` packages by default for Tailwind-less projects — the cleanest pattern is `import "@white-owl/brand/styles/globals.css"` at the top of each app's `app/layout.jsx` (replacing today's `import "./globals.css"`), and the app's `globals.css` adds **only** app-specific overrides. Spell that out so implementers don't try CSS `@import` and waste an hour.

7. **150 KB per-route JS budget.** Realistic for every page *except* TopNav-bearing routes (all of them) once the 10-child Services dropdown lands. The current TL49 TopNav is 124 lines with a single-level flat list; Miller's mega-menu + `EmergencyBanner` + dismiss-state will land closer to ~25-35 KB of client JS for the layout shell alone before any page code. Still under budget, but the spec's "All routes prerendered as static. No SSR overhead" (§7) is misleading — *prerendered HTML* is free, *client bundle* is not, and that's what the budget governs. No change to plan, just sharpen the wording.

## Open questions

1. **Should `tweaks/` ship from shared or stay per-app?** The defaults differ (TL49=`clay`, Miller=`deep`), the `TweaksPanel` activation gate uses `?tweaks=1` — fine to share — but the panel reads/writes `localStorage` under a single key today. Two sites sharing one localStorage key on different origins is a non-issue; if they ever cohabitate on a parent domain it becomes one. Worth a 5-minute decision: namespace the key (`tweaks:tl49` vs `tweaks:miller`) inside `useTweaks` before extracting, or accept the future risk.
2. **`jsconfig.json` paths for `@/` aliases inside the shared package?** TL49 uses `@/components/*`. If shared components reference each other via `@/...` they break the moment they're imported from `miller-web` (the alias resolves to the consumer's root). All intra-shared imports must be relative. Worth one sentence in §1.2.
3. **Does the spec want the workspace-root `lint` to run across all apps + the shared package in CI?** Implied yes by "lint/build gates" in phase 4, but not stated. Decide before phase 1 so the eslint config lands in the right place the first time.

## Relevant files

- `C:/Users/logan/Desktop/projects/apps/transline49-web/package.json` — workspace root scripts to update
- `C:/Users/logan/Desktop/projects/apps/transline49-web/apps/transline49-web/next.config.mjs` — needs `transpilePackages`
- `C:/Users/logan/Desktop/projects/apps/transline49-web/apps/transline49-web/eslint.config.mjs` — flat config scope decision
- `C:/Users/logan/Desktop/projects/apps/transline49-web/apps/transline49-web/components/TopNav.jsx:20-24` — derived-state pattern for `EmergencyBanner` to copy
- `C:/Users/logan/Desktop/projects/apps/transline49-web/apps/transline49-web/app/layout.jsx:1` — CSS import pattern to update once shared ships
