# Phase 01 — spec compliance review
**Reviewer:** spec-compliance
**Commit reviewed:** bc19a15
**Date:** 2026-05-15

## Summary
APPROVE

The commit implements every load-bearing requirement of `miller-web-phase-01.md` and design spec v3 §1, §11, §12. Build passes both apps. Lint passes at root with exit 0. Tweaks zero-prod-bytes invariant verified empirically. Class-rename hazard avoided. No Phase-02+ overreach.

## Findings

### Verified compliant

**Task 01.1 — brand skeleton**
- `apps/brand/` exists with `styles/`, `components/`, `tweaks/` subdirs.
- `apps/brand/package.json` exactly matches spec v3 §1.2 shape: `name: "@white-owl/brand"`, `version: "0.1.0"`, `private: true`, `exports` block covers `./styles/globals.css`, `./components`, `./tweaks`, and `peerDependencies` lists `next ^16`, `react ^19`, `react-dom ^19`. No regular `dependencies` block — peer-only, which prevents the dual-React-copy hazard the spec calls out.
- Root workspaces glob remains `apps/*` (non-recursive). Brand is at `apps/brand/`, satisfying §1.1 and §12 Pragmatist #2.

**Task 01.2 — CSS + components moved**
- `git mv`-style rename detected for all 10 generic components (`FAQ.jsx`, `HeroPhoto.jsx`, `Icon.jsx`, `Marquee.jsx`, `PageHero.jsx`, `ParallelRule.jsx`, `ScrollReveal.jsx`, `SectionHead.jsx`, `ServiceCard.jsx`, `TrustBar.jsx`). History preserved (R070 rename score for PageHero, the only one with a content delta).
- `apps/brand/components/index.js` re-exports all 11 names (10 moved + `FormField`).
- `FormField` extracted from `ContactClient.jsx` into `apps/brand/components/FormField.jsx`. The 22-line inline helper is removed from `ContactClient.jsx`, replaced with an import from `@white-owl/brand/components`. `useId` import correctly removed from `ContactClient.jsx` since it's no longer used there.
- `apps/brand/styles/globals.css` is the moved `globals.css` (99% similarity) with the spec-mandated comment `/* Class prefix is historical (tl-*); shared package owns the vocabulary. */` on line 1.
- Intra-package imports are relative (e.g. `import { HeroPhoto } from "./HeroPhoto"` inside `PageHero.jsx`). No `@/` alias usage inside `apps/brand/`.
- **Class rename did NOT happen.** `tl-*` survives — 211 selectors prefixed `.tl-` in `apps/brand/styles/globals.css`. Zero `wo-*` tokens anywhere under `apps/`. Spec v3 §1.2 + §12 Skeptic #1 + Pragmatist #1 honored.

**Task 01.3 — TL49 consumes shared package**
- `apps/transline49-web/package.json` `dependencies` lists `"@white-owl/brand": "*"`.
- `apps/transline49-web/next.config.mjs` includes `transpilePackages: ["@white-owl/brand"]`.
- `apps/transline49-web/app/layout.jsx` imports `@white-owl/brand/styles/globals.css` — the local `./globals.css` import is gone and the file itself was moved (not duplicated).
- All relative imports for moved components updated to `@white-owl/brand/components`. Grep confirms zero remaining `@/components/(PageHero|SectionHead|…)` imports in `apps/transline49-web/`. `BorderMap`, `ProcessFlow`, `SiteFooter`, `TopNav`, `ChromeWindow`, `Logomark` correctly stay app-local.
- `npm run build --workspaces --if-present` exits 0; TL49 prerenders 5 real routes (`/`, `/about`, `/contact`, `/cross-border-process`, `/services`) plus `/_not-found`. Note: phase plan's exit criterion says "7 routes" but TL49's `app/` directory only contains 5 real routes (`d8fcded` "promote stubs to real routes" already covered route count); the implementation correctly matches what was actually there pre-Phase-01. This is a spec-internal inconsistency between Task 01.3 ("5 routes at desktop+mobile") and Exit Criteria ("7 routes"), not an implementation bug.

**Task 01.4 — ESLint hoist + Tweaks extraction**
- `apps/transline49-web/eslint.config.mjs` deleted; root `eslint.config.mjs` created with flat-config import of `eslint-config-next/core-web-vitals` and `ignores: [".next/**", "**/.next/**", "**/node_modules/**", "**/out/**", "**/dist/**"]`. (Minor: the spec lists 4 ignore globs; the implementation includes both `.next/**` and `**/.next/**` — defensive duplication, harmless.)
- `eslint` and `eslint-config-next` moved to root `devDependencies`; gone from `apps/transline49-web/package.json`.
- Per-app `lint` script removed from `apps/transline49-web/package.json`. Root `lint` script is `eslint apps/**/*.{js,jsx,mjs}`.
- `npm run lint` at root exits 0 (a `no-html-link-for-pages` informational warning prints but does not fail).
- `apps/transline49-web/components/tweaks/` is gone; contents live at `apps/brand/tweaks/` with `index.js` re-exporting `useTweaks`, `TweaksPanel`, `TweakSection`, `TweakRadio`, `TweakSelect`, `SiteTweaksProvider`.
- `SiteTweaksProvider` takes a plain string `namespace` prop (default `"tweaks:default"`). No factory pattern. `useTweaks(defaults, namespace)` threads the namespace through `localStorage`, `postMessage`, and custom events. Matches §1.2 + §12 Skeptic #7 + Pragmatist #10.
- `apps/transline49-web/app/layout.jsx` uses top-level `await import("@white-owl/brand/tweaks")` gated on `process.env.NODE_ENV !== "production"`, and renders `<SiteTweaksProvider namespace="tweaks:tl49" />`. Verbatim form prescribed by Task 01.4.
- **Zero-prod-bytes verified empirically**: ripgrep against `apps/transline49-web/.next/static/chunks/` for `twk-`, `SiteTweaks`, `TweaksPanel` all return zero files. §11 invariant holds.

**Task 01.5 — miller-web skeleton**
- `apps/miller-web/{package.json, next.config.mjs, jsconfig.json, .gitignore, README.md, app/{layout.jsx, page.jsx, globals.css}}` all present.
- `package.json`: `name: "miller-web"`, dependencies `next ^16.2.6`, `react ^19.2.6`, `react-dom ^19.2.6`, `@white-owl/brand: "*"`.
- `next.config.mjs` includes `transpilePackages: ["@white-owl/brand"]`.
- `jsconfig.json` aliases `@/*` to `./*`.
- `app/layout.jsx`: imports `@white-owl/brand/styles/globals.css`, sets `<html lang="en" data-brand="miller" data-palette="deep" data-type="utility" data-density="regular">`, includes placeholder header/footer (explicitly commented as phase-02 work), `ScrollReveal`, dev-gated `SiteTweaksProvider namespace="tweaks:miller"`. Uses real Miller logomark `/miller/logo/miller-logomark.webp` in metadata as the phase plan note prescribes. `<main id="main" tabIndex={-1}>` is set up for the skip link (§6 prep).
- `app/page.jsx`: minimal "Miller Environmental — coming soon" placeholder. No Phase 02+ work leaked in.
- `app/globals.css`: empty comment-only file per spec.
- `public/miller/` already in place (from `d8fcded`), 83 images.
- Root `package.json` scripts updated to spec verbatim: `dev`, `dev:tl49`, `dev:miller`, `build`, `start`, `lint`.
- `npm run build` at root builds both workspaces, exits 0. Miller prerenders `/` + `/_not-found`.

**Git hygiene**
- Single commit `bc19a15` on `dev`, message exact: `Phase 01: extract @white-owl/brand, scaffold miller-web skeleton`. Matches the wording in Task 01.5's "Local-only commit" line.
- `git reflog` shows ordinary commit progression. No `rebase`, no `reset --hard`, no `push --force`, no checkouts back into ancestors.
- `dev` branch tracks `origin/dev` but the local `bc19a15` is presumed unpushed (assignment says inspect local only; I did not fetch or compare against remote).

**Scope discipline**
- No new Miller routes beyond `/`. No phase-02 components (`TopNav`, `EmergencyBanner`, `MillerProcessFlow`, etc.) created.
- No `lib/` directory inside `miller-web/` — phase 02 work, correctly absent.
- TL49 routes unchanged in shape; the only edits to TL49 page files are import-path rewrites for the moved components.

### Nits (not blocking)

- **`PageHero` widened in scope.** The shared `PageHero` was modified to take a new `mapSlot` render-prop, replacing the previous direct `BorderMap` import (which would have made the shared package depend on a TL49-only component — a real problem). The change is correct architecturally and necessary to make `PageHero` shareable, but it is not called out in Task 01.2's "Move (`git mv`, preserve history)" list, which reads as a pure relocation. Suggest documenting the small API change in a future phase-plan errata. No TL49 callsite uses `variant="map"` today (grep returns zero), so the change is dormant in TL49 and ready for Miller.
- **`useTweaks.js` is a rewrite, not a rename.** The 27-line TL49 version was deleted and a 54-line version was created at `apps/brand/tweaks/useTweaks.js` adding the `namespace` parameter, `localStorage` persistence, `postMessage` host hook, and a `tweakchange` custom event. Git records this as add+delete (no rename), so file history doesn't follow. This is acceptable — the spec mandates a behavior change (namespace prop) — but it's worth noting that "preserve history" was not literally achieved for this one file.
- **Symlink verification command in phase plan is layout-naive.** The plan says `ls apps/transline49-web/node_modules/@white-owl/brand`; npm workspaces hoists the symlink to the repo-root `node_modules/@white-owl/brand`. The build succeeds, so resolution works. The verification command in the plan should be updated for future phases.
- **`tl-*` survives in `apps/miller-web/app/layout.jsx`** (`tl-shell`, `tl-skip`, `tl-container`). This is correct per §1.2 (shared vocabulary), but worth flagging that Miller's "deep" palette has not yet been added under `[data-palette="deep"]` in `apps/brand/styles/globals.css` — spec v3 §4.1 mandates a full token override; the existing tweaks panel lists "deep" as one of five palettes, so this may already exist. Not in scope for phase 01; verify before phase 02 starts.
- **Lint emits a `no-html-link-for-pages` warning** when run at repo root because ESLint resolves rule context from the repo root, where there is no `pages/` or `src/pages/`. Exit code is 0 so it does not block, but cleaning this up in a future ESLint config tweak would silence noise.
- **Exit-criteria route count mismatch** in the phase plan (5 vs 7 routes). Implementation matches reality (5 real routes + `_not-found`); the phase plan should be reconciled.

### Blockers (must fix before phase 02)

None.

## Recommendation

Approve as-is and proceed to phase 02. The work is faithful to the spec on all load-bearing items: shared package at `apps/brand/`, package name `@white-owl/brand`, `peerDependencies` (not `dependencies`) for the React/Next trio, `tl-*` class vocabulary preserved, `SiteTweaksProvider` takes a string `namespace` prop with no factory, top-level-await import-site gating yields a verifiably zero-byte production tweaks payload, and miller-web boots in dev + builds in prod without overreaching into phase-02 territory. The nits are documentation/process drift in the phase plan, not implementation defects.
