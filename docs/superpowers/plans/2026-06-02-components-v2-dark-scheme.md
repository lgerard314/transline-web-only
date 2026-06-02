# Fully-General `dark` Scheme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `config.scheme = "dark"` produce a complete, on-brand dark inversion of any of the 7 light v2 sections, by extending the existing `[data-scheme="dark"]` rule in `template-testing.css` with a full §12 token rebind plus the few per-section literal overrides, verified by rendering each section dark.

**Architecture:** Two layers, both in the one route-scoped `apps/miller-web/app/template-testing/template-testing.css`: (1) a complete token rebind under `[data-scheme="dark"]` that flips every token-driven surface/text/border in the 7 light sections; (2) scoped `[data-scheme="dark"] .mw-…` overrides for hardcoded light literals (known: history's white milestone body), with remaining stragglers found via a render-dark→screenshot→fix loop per section. No section component files change (the `data-scheme` wiring already exists); default render is unaffected because the rules only apply under `[data-scheme="dark"]`.

**Tech Stack:** Next.js 16 App Router, existing warm-clay design tokens, Playwright. Dev server on http://localhost:3001.

**Reference spec:** `docs/superpowers/specs/2026-06-02-components-v2-dark-scheme-design.md`

---

## Scope / do-not-touch
- Changes confined to: `apps/miller-web/app/template-testing/template-testing.css`, `apps/miller-web/app/template-testing-variants/page.jsx` (extend the fixture), `apps/miller-web/tests/template-testing.spec.js`.
- **Do NOT** edit `app/styles/*`, any section component file, `app/(home)/`, brand, or anything else. If a section can only be darkened via a base partial, instead use a more specific `[data-scheme="dark"] .mw-…` selector in `template-testing.css`.
- Clay-only (no blue/teal). Reuse the §12 dark values below.
- `scheme:"dark"` on hero/careers is a no-op (already dark) — not in scope.

## The 7 light sections + their root selectors
certs-banner `.mw-trust`/`.mw-certs`/`.mw-cert` · services `.mw-services`/`.mw-svcs-*` · sectors `.mw-sec2` · facility `.mw-fac2` · history `.mw-ten3`/`.mw-ten2` · affiliates `.mw-marquee` · final-cta `.mw-final`.

---

## Task 1: Complete the `[data-scheme="dark"]` token rebind + known literal override

**Files:** Modify `apps/miller-web/app/template-testing/template-testing.css`.

- [ ] **Step 1: Replace the existing `[data-scheme="dark"]` block** with the full §12 rebind + the history milestone override:

```css
/* dark scheme — complete §12 walnut/cream rebind. Flips every token-driven
   surface/text/border in the 7 light sections; per-section overrides below
   handle the few hardcoded light literals the rebind can't reach. Clay-only. */
[data-scheme="dark"] {
  --c-bg: var(--c-navy);
  --c-surface-warm: var(--c-navy);
  --c-surface: var(--c-navy-2);
  --c-ink: #ffffff;
  --c-ink-2: rgba(250, 243, 229, 0.91);
  --c-ink-3: rgba(245, 230, 203, 0.72);
  --c-line: var(--c-navy-2);
  --c-line-2: rgba(245, 230, 203, 0.12);
  --c-grain-on-light: var(--c-grain-on-dark);
}

/* per-section literal overrides (hardcoded light values the rebind can't reach) */
[data-scheme="dark"] .mw-ten3__milestone-body {
  background: rgba(245, 230, 203, 0.035);   /* was #ffffff (04-home.css:934) */
  box-shadow: none;
}
```
(Keep the existing `[data-scheme="cream"]` and `[data-scheme="warm"]` blocks and the reverse-`@media` rules exactly as they are.)

- [ ] **Step 2: Verify default parity unaffected** — the dark rules only apply under `[data-scheme="dark"]`, which `/template-testing` never emits.
```bash
cd apps/miller-web
npx playwright test tests/template-testing.spec.js --workers=1   # all still pass
curl -s http://localhost:3001/template-testing | grep -c "data-scheme" || echo 0   # expect 0 in <main>
```

- [ ] **Step 3: Commit**
```bash
git add apps/miller-web/app/template-testing/template-testing.css
git commit -m "feat(miller-web): complete dark-scheme token rebind + history literal override"
```
(PowerShell tool; no --no-verify; Co-Authored-By trailer for Claude Opus 4.8.)

---

## Task 2: Dark fixture for all 7 light sections + per-section artifact fix loop

**Files:** Modify `apps/miller-web/app/template-testing-variants/page.jsx` and `apps/miller-web/app/template-testing/template-testing.css`.

- [ ] **Step 1: Render all 7 light sections dark in the fixture.** Replace the body of `app/template-testing-variants/page.jsx` so it renders each light section with `config={{ scheme: "dark" }}`, fed its real content object. Keep the existing reverse/token demos too. Example shape (import the content objects + sections; keep `noindex` metadata + the CSS import):

```jsx
import "./../template-testing/template-testing.css";
import { TallStaticBanner01 } from "@/components-v2/06_sections/banners/tall-static-banner-01";
import { BentoGrid01 } from "@/components-v2/06_sections/grids/bento-grid-01";
import { HoverCardGrid01 } from "@/components-v2/06_sections/grids/hover-card-grid-01";
import { MediaSplit01 } from "@/components-v2/06_sections/splits/media-split-01";
import { TimelineSplit01 } from "@/components-v2/06_sections/splits/timeline-split-01";
import { RotatingBanner01 } from "@/components-v2/06_sections/banners/rotating-banner-01";
import { MultiColumnCta01 } from "@/components-v2/06_sections/callouts/multi-column-cta-01";
import { CERTS_BANNER, SERVICES_GRID, SECTORS, FACILITY, HISTORY, AFFILIATES_BANNER, FINAL_CTA } from "@/lib/content/template-testing-home";

export const metadata = { title: "TT variants", robots: { index: false, follow: false } };
const dark = { scheme: "dark" };

export default function P() {
  return (
    <>
      <TallStaticBanner01 content={CERTS_BANNER} config={dark} />
      <BentoGrid01 content={SERVICES_GRID} config={dark} />
      <HoverCardGrid01 content={SECTORS} config={dark} />
      <MediaSplit01 content={FACILITY} config={dark} />
      <TimelineSplit01 content={HISTORY} config={dark} />
      <RotatingBanner01 content={AFFILIATES_BANNER} config={dark} />
      <MultiColumnCta01 content={FINAL_CTA} config={dark} />
    </>
  );
}
```
(Keep the prior token/scheme/reverse demo sections from the existing file too, so the Phase-2 variant tests still pass — append the dark ones, don't delete the existing fixtures. If the existing tests select by `.mw-fac2[data-scheme="cream"]` etc., make sure those instances still exist.)

- [ ] **Step 2: Render-dark → screenshot → fix loop, one section at a time.** For EACH of the 7 sections, capture a screenshot of `/template-testing-variants` (reduced-motion, full-page, 1440px) and inspect that section for **light artifacts** — any element that is still light-toned (white/cream card body, light wash, light hairline, dark-on-dark text). Capture script (run from `apps/miller-web`, then delete it):
```bash
cat > shot.mjs <<'EOF'
import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const p = await ctx.newPage();
await p.goto("http://localhost:3001/template-testing-variants", { waitUntil: "networkidle" });
await p.evaluate(() => new Promise((r) => setTimeout(r, 600)));
await p.screenshot({ path: "C:/Users/logan/AppData/Local/Temp/tt-dark.png", fullPage: true });
await b.close(); console.log("done");
EOF
node shot.mjs; rm -f shot.mjs
```
Open `C:/Users/logan/AppData/Local/Temp/tt-dark.png` and look. For each light artifact found, add a scoped override to `template-testing.css` under `[data-scheme="dark"] .mw-<section>__<element>` setting the dark equivalent (surface → `var(--c-navy)`/`var(--c-navy-2)`; card body → `rgba(245,230,203,0.035)` with `1px solid rgba(245,230,203,0.12)` border per §12; text → it should already follow `--c-ink*`; if a text color is a literal, set it to `#fff`/`rgba(250,243,229,0.91)`). Re-screenshot until that section is a clean dark inversion with AA-readable text.

  **Known seed (already added in Task 1):** history `.mw-ten3__milestone-body`. Likely candidates to check specifically while looking: the cert cards (`.mw-cert` surface/border), the services tiles/cards (`.mw-svcs-card`/`.mw-svcs-tile` photo-body split + any white body), the sector cards (`.mw-sec2__card` body/photo frame), the facility gallery frame + figure rules, the affiliate marquee logos (PNG logos on dark — if a logo needs a light chip behind it, leave the marquee light OR add a subtle chip; note in report if affiliates can't go cleanly dark because the logos are dark-on-transparent).

- [ ] **Step 3: Note any section that cannot cleanly invert.** If a section has an irreducible light dependency (most plausibly the **affiliates marquee** — third-party PNG logos that may be dark-ink on transparent and become invisible on walnut), do NOT hack the logos. Stop and report it as DONE_WITH_CONCERNS describing the specific limitation, so the controller can decide (e.g. affiliates keeps a light logo chip, or is excluded from dark).

- [ ] **Step 4: Verify build + parity + commit**
```bash
cd apps/miller-web
npx next build 2>&1 | tail -12     # clean
npx playwright test tests/template-testing.spec.js --workers=1   # existing pass
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/template-testing-variants   # 200
```
```bash
git add apps/miller-web/app/template-testing-variants/page.jsx apps/miller-web/app/template-testing/template-testing.css
git commit -m "feat(miller-web): render all 7 light sections dark + per-section dark overrides"
```

---

## Task 3: Automated dark assertions

**Files:** Modify `apps/miller-web/tests/template-testing.spec.js`.

- [ ] **Step 1: Add dark-scheme tests** (assert resolved colors, not attribute presence):

```js
test("dark scheme: section surface + text invert to walnut/cream", async ({ page }) => {
  await page.goto(`${BASE}/template-testing-variants`);
  // history section rendered with scheme:"dark"
  const sec = page.locator('.mw-ten3[data-scheme="dark"]').first();
  await expect(sec).toBeAttached();
  const navy = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--c-navy").trim());
  const surface = await sec.evaluate((el) => getComputedStyle(el).getPropertyValue("--c-surface-warm").trim());
  expect(surface).toBe(navy);   // token rebind took effect on the section subtree
});

test("dark scheme: history milestone body is no longer white", async ({ page }) => {
  await page.goto(`${BASE}/template-testing-variants`);
  const body = page.locator('.mw-ten3[data-scheme="dark"] .mw-ten3__milestone-body').first();
  await expect(body).toBeAttached();
  const bg = await body.evaluate((el) => getComputedStyle(el).backgroundColor);
  // not white: rgb(255,255,255) / rgba(255,255,255,*) must NOT be the resolved bg
  expect(bg).not.toMatch(/255,\s*255,\s*255/);
});

test("dark scheme: default /template-testing still emits no scheme attr (parity)", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  expect(await page.locator('main [data-scheme]').count()).toBe(0);
});
```

- [ ] **Step 2: Run the full spec** → all pass.
```bash
cd apps/miller-web && npx playwright test tests/template-testing.spec.js --workers=1
```

- [ ] **Step 3: Commit**
```bash
git add apps/miller-web/tests/template-testing.spec.js
git commit -m "test(miller-web): dark-scheme resolved-color assertions"
```

---

## Self-Review (against the spec)

**1. Spec coverage:** §2a full token rebind → Task 1 Step 1; §2b per-section literal overrides → Task 1 (known history seed) + Task 2 (render-fix loop for stragglers); §2c left-alone shadows/overlays → not touched (correct); §3 scope/constraints (only template-testing.css + fixture + tests; default unaffected) → Tasks honor it + Task 1 Step 2 verifies parity; §4 verification (per-section dark screenshots + automated + default-parity) → Task 2 Step 2 + Task 3. No gaps.

**2. Placeholder scan:** The per-section straggler overrides in Task 2 are intentionally discovery-driven (render → see → fix) — this is a real, gated loop with the known seed provided and concrete override values to apply, not a hand-wave. The affiliates-marquee risk is explicitly surfaced with an escalation path (Task 2 Step 3). No "TBD"/"similar to".

**3. Type/selector consistency:** token names (`--c-navy`, `--c-navy-2`, `--c-ink*`, `--c-line*`, `--c-surface*`, `--c-grain-on-*`) match the design system and the existing `template-testing.css`; section selectors (`.mw-trust`/`.mw-services`/`.mw-sec2`/`.mw-fac2`/`.mw-ten3`/`.mw-marquee`/`.mw-final`) match the components; the fixture imports match the content-object export names from the prior phase.

## Known traps
- **Don't touch `app/styles/*`** — every dark override goes in `template-testing.css` with a `[data-scheme="dark"] .mw-…` selector (more specific than the base rule, so it wins without `!important` in most cases; use `!important` only if a base `id`/compound selector outranks it, and note it).
- **Affiliates marquee** is the most likely "can't cleanly invert" case (dark-ink PNG logos on walnut) — surface it, don't hack the assets.
- **Heredoc + Windows paths:** the screenshot script uses forward-slash paths (`C:/Users/...`) — backslashes get mangled by the shell heredoc.
- **Keep the existing variant fixtures** (cream-on-fac2, reverse, token override) in `/template-testing-variants` so the Phase-2 tests that select them keep passing.
