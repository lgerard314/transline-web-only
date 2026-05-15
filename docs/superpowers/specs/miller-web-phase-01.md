# Phase 01 — Foundation

**Theme:** Extract the shared brand package, rewire the workspace, scaffold the new app.

**Parallelism:** **Sequential.** Each task gates the next. Estimated total: one engineer, ~half a day.

**Companion:** [`2026-05-15-miller-web-design.md`](2026-05-15-miller-web-design.md) §1, §11.

## Tasks (in order, with verification gates)

### 01.1 Relocate brand to `apps/brand/` and create the package skeleton

- Create `apps/brand/` with subdirs `styles/`, `components/`, `tweaks/`.
- Write `apps/brand/package.json`:
  - `"name": "@white-owl/brand"`, `"version": "0.1.0"`, `"private": true`.
  - `"exports"` for `./styles/globals.css`, `./components`, `./tweaks`.
  - `"peerDependencies"`: `next ^16`, `react ^19`, `react-dom ^19`.
- **Verify:** `cat apps/brand/package.json | jq .` shows the expected shape. Workspace glob in root `package.json` (`apps/*`) already covers it — no glob edit needed.

### 01.2 Move CSS + generic components into `@white-owl/brand`

Move (`git mv`, preserve history):

- `apps/transline49-web/app/globals.css` → `apps/brand/styles/globals.css`
- These generic components from `apps/transline49-web/components/` → `apps/brand/components/`:
  - `ParallelRule.jsx`, `Marquee.jsx`, `SectionHead.jsx`, `FAQ.jsx`, `TrustBar.jsx`, `Icon.jsx`, `HeroPhoto.jsx`, `PageHero.jsx`, `ServiceCard.jsx`, `ScrollReveal.jsx`
  - Extract `FormField` from `apps/transline49-web/app/contact/ContactClient.jsx` (it's an inline helper) and move to `apps/brand/components/FormField.jsx`. Update `ContactClient.jsx` to import it from `@white-owl/brand/components`.
- Write `apps/brand/components/index.js` that re-exports each. **Use relative imports inside the package** (no `@/` alias — it resolves to the consumer's root).
- Add a one-line comment at the top of `globals.css`: `/* Class prefix is historical (tl-*); shared package owns the vocabulary. */`
- **Do NOT rename `tl-*` to `wo-*`.** Spec v3 §1.2 + §12 Skeptic #1 + Pragmatist #1.
- **Verify:** `ls apps/brand/components/` lists 11 files (10 + `index.js`).

### 01.3 Wire TL49 to consume `@white-owl/brand` and pass build

- Add `"@white-owl/brand": "*"` to `apps/transline49-web/package.json` `dependencies`.
- Add `transpilePackages: ["@white-owl/brand"]` to `apps/transline49-web/next.config.mjs`.
- In `apps/transline49-web/app/layout.jsx`, replace `import "./globals.css"` with `import "@white-owl/brand/styles/globals.css"`.
- Update all relative imports in TL49 that referenced the moved files (e.g. `import { PageHero } from "@/components/PageHero"` → `import { PageHero } from "@white-owl/brand/components"`).
- `npm install` at repo root. Verify symlink: `ls apps/transline49-web/node_modules/@white-owl/brand`.
- **Verify:** `npm run build --workspace=transline49-web` exits 0; all 7 TL49 routes still prerender.
- **Visual diff:** run `npm run dev --workspace=transline49-web`, hit each of the 5 routes at desktop + mobile widths, eyeball-compare to deployed site. No spacing/animation regressions.

### 01.4 Hoist ESLint to repo root + move Tweaks into the shared package

ESLint hoist:
- Move `eslint` + `eslint-config-next` from `apps/transline49-web/package.json` `devDependencies` to root `package.json` `devDependencies`.
- Move `apps/transline49-web/eslint.config.mjs` → `<repo root>/eslint.config.mjs`. Update its `ignores` to `[".next/**", "**/node_modules/**", "**/out/**", "**/dist/**"]`.
- Delete `apps/transline49-web/eslint.config.mjs`. Delete its per-app `"lint": "eslint ."` script.
- Update root `package.json`'s `lint` script to `"eslint apps/**/*.{js,jsx,mjs}"`.
- **Verify:** `npm run lint` at root exits 0.

Tweaks extraction:
- Move `apps/transline49-web/components/tweaks/` → `apps/brand/tweaks/`.
- Write `apps/brand/tweaks/index.js` re-exporting `useTweaks`, `TweaksPanel`, `TweakSection`/`Radio`/`Select`, `SiteTweaksProvider`.
- Modify `SiteTweaksProvider` to hard-code its `localStorage` key from a prop (`namespace`) — TL49 passes `"tweaks:tl49"`, Miller will pass `"tweaks:miller"`. **No factory.** Just a string prop.
- In `apps/transline49-web/app/layout.jsx`, change the Tweaks import to **import-site gated**:
  ```js
  const SiteTweaksProvider =
    process.env.NODE_ENV !== "production"
      ? (await import("@white-owl/brand/tweaks")).SiteTweaksProvider
      : null;
  // …
  {SiteTweaksProvider && <SiteTweaksProvider namespace="tweaks:tl49" />}
  ```
- **Verify zero-prod-bytes:** `npm run build --workspace=transline49-web`, then `grep -r "twk-" apps/transline49-web/.next/static/chunks/` returns nothing.

### 01.5 Scaffold `apps/miller-web/` skeleton

- Create `apps/miller-web/{package.json, next.config.mjs, jsconfig.json, .gitignore, README.md}` mirroring TL49's shapes.
  - `package.json` `name: "miller-web"`. `dependencies`: `next ^16`, `react ^19`, `react-dom ^19`, `"@white-owl/brand": "*"`.
  - `next.config.mjs` includes `transpilePackages: ["@white-owl/brand"]`.
  - `jsconfig.json` aliases `@/*` to `./*`.
- Create `apps/miller-web/app/{layout.jsx, page.jsx, globals.css}`:
  - `layout.jsx` imports `@white-owl/brand/styles/globals.css`, sets `<html lang="en" data-brand="miller" data-palette="deep">`, includes only `<TopNav />`/footer placeholders for now, ScrollReveal, dev-gated SiteTweaksProvider (`namespace="tweaks:miller"`).
  - `page.jsx` renders a one-line "Miller Environmental — coming soon" placeholder.
  - `globals.css` is empty (room for Miller-only overrides later).
- Update root `package.json` scripts:
  ```json
  "dev": "npm run dev:tl49",
  "dev:tl49": "npm run dev --workspace=transline49-web",
  "dev:miller": "npm run dev --workspace=miller-web",
  "build": "npm run build --workspaces --if-present",
  "lint": "eslint apps/**/*.{js,jsx,mjs}"
  ```
- **Verify:**
  - `npm run dev:miller` boots, browser hits `http://localhost:3001` (or `3000` if free) and shows the placeholder.
  - `npm run build` at root builds both apps, exits 0.
  - `npm run lint` at root exits 0.
- Local-only commit: **"Phase 01: extract @white-owl/brand, scaffold miller-web skeleton"**.

## Exit criteria

- `@white-owl/brand` exists at `apps/brand/`.
- TL49 consumes it; its 7 routes still build + match visually.
- `apps/miller-web/` boots in dev and builds in production.
- Lint + build pass at the repo root.
- Tweaks bundle is zero bytes in production.
