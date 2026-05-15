# Phase 01 — verification gate review

**Reviewer:** verification-gates
**Commit reviewed:** bc19a15 (`Phase 01: extract @white-owl/brand, scaffold miller-web skeleton`)
**Branch:** dev (ahead of origin/dev by 1)
**Date:** 2026-05-15

## Summary

**APPROVE**

Every explicit Verify bullet in `docs/superpowers/specs/miller-web-phase-01.md` passes against the working tree at `bc19a15`. No blockers. Two cosmetic nits noted (see below) — neither warrants gating.

## Gate results

| Gate | Command | Result | Notes |
| ---- | ------- | ------ | ----- |
| 01.1 | `cat apps/brand/package.json` | PASS | Exact expected shape: `name "@white-owl/brand"`, `version 0.1.0`, `private true`, exports `./styles/globals.css`, `./components`, `./tweaks`, peerDeps `next ^16`, `react ^19`, `react-dom ^19`. Workspace glob `apps/*` already covers it (root `package.json`). |
| 01.2 | `ls apps/brand/components/` | PASS | 11 files present: ParallelRule, Marquee, SectionHead, FAQ, TrustBar, Icon, HeroPhoto, PageHero, ServiceCard, ScrollReveal, FormField, plus `index.js`. `index.js` re-exports all ten primitives via relative paths. `globals.css` carries the required `/* Class prefix is historical (tl-*); shared package owns the vocabulary. */` header. |
| 01.3 | `npm run build --workspace=transline49-web` | PASS | Exits 0. `✓ Generating static pages using 8 workers (7/7)`. All 7 TL49 routes prerender as static. Symlink: `node_modules/@white-owl/brand -> apps/brand` exists at the hoisted root (npm-workspace default; functionally equivalent to a per-app symlink — Node resolves the package from `apps/transline49-web/`). TL49 `layout.jsx` correctly imports `@white-owl/brand/styles/globals.css`. `next.config.mjs` includes `transpilePackages: ["@white-owl/brand"]`. |
| 01.4 (lint) | `npm run lint` (root) | PASS | Exits 0. ESLint flat config at `<repo root>/eslint.config.mjs`; per-app `apps/transline49-web/eslint.config.mjs` is gone; root `devDependencies` carry `eslint ^9` + `eslint-config-next ^16.2.6`; TL49 `package.json` has **no** `devDependencies` and **no** `lint` script. The "Pages directory cannot be found" line is a non-fatal warning from `next/no-html-link-for-pages` under App Router — exit code is 0. |
| 01.4 (zero-prod-bytes) | `grep -rl "twk-" apps/transline49-web/.next/static/` | PASS | No matches. Wider probe `grep -rl "SiteTweaksProvider\|TweaksPanel\|useTweaks" apps/transline49-web/.next/static/` also returns nothing. Top-level-await import gate in `app/layout.jsx` is doing its job. |
| 01.5 (build root) | `npm run build` (root) | PASS | Both workspaces build. miller-web: 3/3 static pages (`/`, `/_not-found`, and one prerendered route). transline49-web: 7/7 static pages. |
| 01.5 (lint root) | `npm run lint` (root) | PASS | Same as 01.4. |
| 01.5 (dev:miller boot) | `npm run dev:miller` | SKIPPED (rule-compliant) | Per the assignment's hard rule, dev was not booted: it would leave a long-lived background process I am forbidden to kill. The `dev:miller` script is correctly wired (`npm run dev --workspace=miller-web`); `apps/miller-web/package.json` exposes a `dev: "next dev"` script; the production build of miller-web succeeded (3/3 static pages), which exercises the same module graph. Relying on `npm run build` per the assignment's explicit escape hatch. |

## Additional probes

- `grep -rn "wo-" apps/transline49-web/` → **zero matches**. Class names were not renamed (spec v3 §1.2 invariant honored).
- `grep -rn "apps/shared" docs/superpowers/specs/` → 3 matches, all in `2026-05-15-miller-web-design.md` (lines 51, 53, 703). All three are **explanatory** context (e.g. "The package goes to `apps/brand/`, not `apps/shared/brand/`. The workspace glob is not recursive…"). They are not stale paths — they explain the decision. The phase-01 doc itself uses `apps/brand/` exclusively. **NIT only.**
- Stale `@/components/<moved>` imports in TL49 → **zero matches** for `ParallelRule|Marquee|SectionHead|FAQ|TrustBar|Icon|HeroPhoto|PageHero|ServiceCard|ScrollReveal|FormField`. All migrated to `@white-owl/brand/components`. Confirmed: 10 TL49 source files import from `@white-owl/brand` (`app/layout.jsx`, `app/page.jsx`, `app/about/page.jsx`, `app/services/page.jsx`, `app/cross-border-process/page.jsx`, `app/contact/ContactClient.jsx`, `components/ProcessFlow.jsx`, `components/SiteFooter.jsx`, `next.config.mjs` for transpilePackages, `package.json` as a dependency).
- Residual TL49-local components in `apps/transline49-web/components/`: `BorderMap.jsx`, `ChromeWindow.jsx`, `Logomark.jsx`, `ProcessFlow.jsx`, `SiteFooter.jsx`, `TopNav.jsx`. All correctly retained as TL49-specific (not generic).
- miller-web layout dev-gates SiteTweaksProvider via the same top-level-await pattern with `namespace="tweaks:miller"`. `data-brand="miller" data-palette="deep"` set on `<html>` as required.
- Root `package.json` scripts match the spec verbatim (`dev`, `dev:tl49`, `dev:miller`, `build`, `lint`).
- 11 chunk files in `apps/transline49-web/.next/static/chunks/` from the production build — fresh artifact.

## Blockers

None.

## Nits (non-blocking)

1. **Symlink location.** Spec 01.3 verify bullet asks for `apps/transline49-web/node_modules/@white-owl/brand`. npm workspaces hoists the symlink to the root `node_modules/@white-owl/brand -> apps/brand` instead. This is the default and correct behavior for npm 7+ workspaces — Node still resolves `@white-owl/brand` from inside `apps/transline49-web/` via parent-lookup. If the spec wants per-app symlinks, that requires `nohoist` config, which would be a regression. Treat as a wording fix to the verify bullet, not a code fix.
2. **`apps/shared` mentions in design spec.** Three contextual mentions in `2026-05-15-miller-web-design.md` (lines 51, 53, 703). They are explanatory ("why apps/brand/ and not apps/shared/brand/"), not stale TODOs. Could be left as-is.
3. **dev:miller not actually booted.** The build succeeded which proves the module graph; the hard rule against killing processes means a live dev probe isn't safe in this environment. Flagging so the team-lead knows this single sub-bullet was satisfied via the documented escape hatch rather than a live HTTP hit.

## Recommendation

**Approve and merge to main.** All hard exit criteria met:

- `@white-owl/brand` exists at `apps/brand/` with the expected shape.
- TL49 consumes it; 7 routes still build (visual diff not part of this gate review — that's the round-1 reviewers' job).
- `apps/miller-web/` builds in production (`3/3` static pages).
- Lint + build pass at the repo root.
- Tweaks bundle is zero bytes in production (no `twk-` / Tweaks symbols in shipped chunks).

Phase 02 may proceed.
