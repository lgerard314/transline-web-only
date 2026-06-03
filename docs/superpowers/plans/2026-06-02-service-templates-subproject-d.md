# Service Template Library — Sub-project D Implementation Plan (cutover + home promotion)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax. This is the DESTRUCTIVE phase — it edits the real pages and deletes the old bespoke code. Every page is golden-gated and everything is reversible via git.

**Goal:** Make all 7 redesigned pages (home + 6 service pages) actually *served by* the components-v2 templates at their real URLs, fold the sandbox content adapters into the real content files, resolve the home-route couplings, and decommission the sandboxes — with byte-identical golden verification per page.

**Architecture:** Each sandbox (`app/template-testing/<slug>/`) is already proven byte-identical to its real page. The cutover for each page is therefore mechanical: (1) capture a GOLDEN screenshot of the current real page; (2) fold the sandbox adapter's literal fields into the real `lib/content/service-<slug>.js`; (3) rewrite the real `page.jsx` to compose the components-v2 templates from the real content (the sandbox `page.jsx` is the proven composition to copy, minus noindex + the adapter); (4) assert the real route is byte-identical to the golden; (5) delete the old `sections/*`/`banners/*` and the sandbox route. Home is the same with extra coupling work.

**Tech Stack:** Next.js 16 RSC, Playwright, dev on 3001. `main` holds the pre-cutover known-good state; all D work is on `dev`.

**Reference:** Design spec `docs/superpowers/specs/2026-06-02-service-template-library-design.md` §7-D; the verified sandbox pages + adapters under `app/template-testing/<slug>/`; the parity specs under `tests/`.

**Hard constraints / safety:**
- Work on `dev`. Do NOT touch `apps/brand/**`. `app/styles/*` stays read-only (no design changes — cutover must be visually byte-identical to the golden).
- **Golden gate per page is mandatory:** capture the real page BEFORE any edit; after cutover the real route must be byte-identical (page body, desktop + mobile, reduced-motion, embeds masked where applicable) to that golden, or the task is not done. The agent LOOKS at before/after.
- Delete old section files ONLY after the page's golden gate passes.
- Carry the REAL metadata (NOT noindex) onto each cut-over page — the sandbox pages were noindex; production must keep each real page's original title/description/canonical.
- Never hard-wrap. Warm clay only.

**Page → sandbox composition (the proven source to copy):**
| Real route | Sandbox composition to copy | Old files to delete after gate |
|---|---|---|
| `app/industrial-services/emergency-response/` | `app/template-testing/emergency-response/{page.jsx,content.js}` | `sections/*` |
| `app/industrial-services/customer-waste-collection/` | `…/customer-waste-collection/…` | `sections/*` |
| `app/industrial-services/environmental-remediation-services/` | `…/environmental-remediation-services/…` | `sections/*` |
| `app/industrial-services/industrial-cleaning/` | `…/industrial-cleaning/…` | `sections/*` |
| `app/industrial-services/industrial-waste-treatment/` | `…/industrial-waste-treatment/…` | `sections/*` |
| `app/industrial-services/project-management/` | `…/project-management/…` | `sections/*` |
| `app/(home)/` (`/`) | `app/template-testing/{page.jsx}` + `lib/content/template-testing-home.js` | `app/(home)/sections/*`, `app/(home)/banners/*` |

---

## Task D1: Prep shared dependencies (do FIRST — unblocks home + normalizes templates)

**Files:** Move `apps/miller-web/app/(home)/sections/sector-stat-cycle.jsx` → a shared location `apps/miller-web/components-v2/05_widgets/cycles/sector-stat-cycle.jsx`; update importers (`components/WhyChooseStatCycle.jsx` and any home section that uses it). Normalize `components-v2/06_sections/pickers/video-picker-01.jsx` + `grids/numbered-card-grid-01.jsx` to read `content.titleId` (drop the hardcoded ids).

- [ ] **Step 1:** Grep for every importer of `sector-stat-cycle`. There are (at least) TWO: `components/WhyChooseStatCycle.jsx` (alias import) and `app/(home)/sections/03-sectors.jsx` (relative `./sector-stat-cycle`). Move the file to `components-v2/05_widgets/cycles/sector-stat-cycle.jsx` (interactive — keep its `"use client"`). Update BOTH importers to the new path — including `03-sectors.jsx`, even though it is deleted in D8: if its import dangles, the real `/` route 500s between D1 and D8 and corrupts the D8 golden capture. Re-confirm via grep that no importer still points at the old path.
- [ ] **Step 2:** Normalize `VideoPicker01` and `NumberedCardGrid01` to take `titleId` from `content` (matching every other template). Their REM/PM sandbox adapters must then supply the id (`rem-vid-title` / `pm-projects-title`).
- [ ] **Step 3:** Update the REM + PM sandbox adapters to supply those `titleId`s; re-run `tests/template-testing-environmental-remediation-services.spec.js` + `tests/template-testing-project-management.spec.js` → still byte-identical.
- [ ] **Step 4:** Run the FULL suite (all `tests/template-testing*`) → all pass. Commit: `git commit -m "refactor(miller-web): D1 — relocate sector-stat-cycle, normalize titleId props"`

---

## Tasks D2–D7: Cut over the 6 service pages (one task each)

Identical procedure per page (`<slug>` ∈ emergency-response, customer-waste-collection, environmental-remediation-services, industrial-cleaning, industrial-waste-treatment, project-management). Do them one at a time; commit each.

**Files (per page):** Modify `lib/content/service-<slug>.js` (add reconciled literal fields); rewrite `app/industrial-services/<slug>/page.jsx`; delete `app/industrial-services/<slug>/sections/*` (+ `banners/*` if any); delete `app/template-testing/<slug>/`.

- [ ] **Step 1 — GOLDEN:** With the dev server up, capture the CURRENT real `/industrial-services/<slug>` full-page screenshots (desktop 1280 + mobile 390, `prefers-reduced-motion: reduce`, lazy imgs forced). Save to a temp dir. This is the production baseline.
- [ ] **Step 2 — Reconcile content:** Open `app/template-testing/<slug>/content.js`. For every `// RECONCILE-IN-D:` field (titleIds, headMedia, hotlineNote, caption, etc.), add it as a real key in `lib/content/service-<slug>.js` (these are now first-class content). Structural remaps (e.g. `coverage.provides`→`items`) are handled inline in the new page.jsx, not by renaming content keys.
- [ ] **Step 3 — Rewrite page.jsx:** Replace `app/industrial-services/<slug>/page.jsx` so it composes the components-v2 templates exactly as the sandbox `page.jsx` does, but: import content from the page's REAL content module (use the EXACT import path the sandbox adapter uses — NOT a slug-derived name; e.g. environmental-remediation-services imports `@/lib/content/service-environmental-remediation`, not `…-services`) with the reconciled fields, instead of the sandbox adapter; keep the REAL metadata block (title/description/canonical from the current real page.jsx — do NOT make it noindex); reproduce any inline remaps the adapter did (e.g. `coverage.provides`→`items`). The composition + configs are copied verbatim from the verified sandbox page.jsx.
- [ ] **Step 4 — GOLDEN GATE:** Reload `/industrial-services/<slug>`; capture the same screenshots; assert byte-identical to the Step-1 golden (page body, desktop + mobile; mask `.mw-lyt`/`.mw-rel__track` for pages that have them, same as the sandbox spec). LOOK at before/after. If any diff beyond the masked embeds: root-cause and fix the content/page composition until byte-identical. (Diffs should be zero — the sandbox was already identical to this golden.)
- [ ] **Step 5 — Delete old code:** Remove `app/industrial-services/<slug>/sections/` (and `banners/` if present) and the sandbox route `app/template-testing/<slug>/`. Reload the real page once more → still byte-identical to golden, no missing-import errors.
- [ ] **Step 6 — Commit:** `git add -A && git commit -m "feat(miller-web): cut over <slug> to components-v2 templates"`

---

## Task D8: Cut over the home page (promote off /template-testing)

**Files:** Modify `lib/content/template-testing-home.js` → fold into `app/(home)/home.js` (or repoint); rewrite `app/(home)/page.jsx`; delete `app/(home)/sections/*` + `app/(home)/banners/*`; delete `app/template-testing/page.jsx` (+ the home sandbox content).

- [ ] **Step 1 — GOLDEN:** Capture current real `/` full-page screenshots (desktop + mobile, reduced-motion, lazy forced).
- [ ] **Step 2 — Reconcile content:** The home recreation sources from `lib/content/template-testing-home.js` (which imports the canonical HOME/SERVICES/CERTS/brand). **KEEP `lib/content/template-testing-home.js` in place — do NOT rename, move, or fold it.** The kept `/template-testing-variants` demo (D9) also imports it; renaming would orphan that import and break the build. The new `app/(home)/page.jsx` imports it as-is. Note: it imports `@/app/(home)/home` (i.e. `home.js`, which SURVIVES D8 — only `sections/*` + `banners/*` are deleted) and carries its own local `HOME_FIRST` copy (documentation comment, not a runtime coupling), so no decoupling is required beyond confirming the home templates pull `sector-stat-cycle` from its D1 shared location.
- [ ] **Step 3 — Rewrite page.jsx:** Replace `app/(home)/page.jsx` to compose the components-v2 home templates exactly as `app/template-testing/page.jsx` does, importing the reconciled home content, and keeping the REAL home metadata + the hero preload `<link>` (the real home page has one). NOT noindex.
- [ ] **Step 4 — GOLDEN GATE:** Reload `/`; capture; assert byte-identical to the Step-1 golden (desktop + mobile). LOOK at before/after. Fix until identical.
- [ ] **Step 5 — Delete old code:** Remove `app/(home)/sections/*`, `app/(home)/banners/*`, `app/template-testing/page.jsx` + home sandbox content. Reload `/` → still byte-identical, no errors.
- [ ] **Step 6 — Commit:** `git commit -m "feat(miller-web): promote home page to components-v2 templates"`

---

## Task D9: Decommission + restore

**Files:** `lib/nav.js`; the obsolete real-vs-sandbox parity specs; leftover sandbox artifacts.

- [ ] **Step 1:** Remove the now-obsolete real-vs-sandbox parity specs (`tests/template-testing-emergency-response.spec.js`, `-customer-waste-collection`, `-environmental-remediation-services`, `-industrial-cleaning`, `-industrial-waste-treatment`, `-project-management`, and `template-testing-banner-parity.spec.js`) — their sandbox targets no longer exist; correctness was golden-verified at cutover. **`tests/template-testing.spec.js` MUST be handled explicitly (not left to judgment):** its home-parity tests target `/template-testing` (the deleted home sandbox) and will 404 — remove those tests; its config/dark-scheme tests target `/template-testing-variants` (KEPT in Step 3) — retain those (e.g. by splitting them into `tests/template-testing-variants.spec.js`, or pruning `template-testing.spec.js` down to only the variants-targeted tests). After this step, no remaining test references a deleted sandbox route.
- [ ] **Step 2:** Restore `lib/nav.js`: remove `"/template-testing"` from BOTH the `exact` set and the `prefix` array (added during this program). Real service pages keep the banner via the `/industrial-services` prefix; home via `/`.
- [ ] **Step 3 — Variants demo decision:** KEEP `app/template-testing-variants/` + `app/template-testing/template-testing.css` as the living, noindex demo of the dark-scheme / config-knob system (preserves that delivered capability; no production page depends on it). Confirm it still builds after the home sandbox `page.jsx` deletion (it imports the css file, which remains, and the templates, which remain). If it imports anything now-deleted, fix or remove it.
- [ ] **Step 4:** Commit: `git commit -m "chore(miller-web): D9 — decommission sandboxes, restore nav.js"`

---

## Task D10: Final verification + branch finish

- [ ] **Step 1:** Production build: `cd apps/miller-web && npm run build` → succeeds with no errors (catches any dangling import from deleted files). If a build script differs, use the repo's build command.
- [ ] **Step 2:** Smoke-load all 7 real routes on the dev server → HTTP 200, no console/runtime errors, banner where expected (`/` and all 6 service pages), and each visually matches its golden (spot-check by eye).
- [ ] **Step 3:** Confirm no stray references to deleted paths: grep for `template-testing/<slug>`, `(home)/sections`, the deleted section component names → none remain.
- [ ] **Step 4:** Final Opus code-review across the entire D diff (`git diff <D-start>..HEAD`) — focus: real pages render byte-identically, no orphaned imports, content reconciliation preserved every string verbatim, the `sector-stat-cycle` relocation is clean.
- [ ] **Step 5:** Use `superpowers:finishing-a-development-branch` — merge `dev` → `main` (local fast-forward, keep `dev`, no push), per the user's standing preference.

---

## Notes for the executor
- The cutover is mechanical because each sandbox is already byte-identical to its real page — the golden gate exists to PROVE that, not to discover new work. If a golden gate shows a non-masked diff, something in the content reconciliation or composition differs from the sandbox; fix it to match the sandbox exactly.
- Dev server on 3001. Reduced-motion + lazy-force + mask `.mw-lyt`/`.mw-rel__track` exactly as the sandbox parity specs did.
- Reversibility: old section files live in git history until deleted; `main` holds the full pre-cutover state. If any page can't reach byte-parity, STOP and escalate rather than shipping a visual regression.
