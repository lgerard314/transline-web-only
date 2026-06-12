# Repo guide

Monorepo with two brand sites (`apps/miller-web`, `apps/transline49-web`) sharing one design package (`apps/brand`, imported as `@white-owl/brand`).

## Scoped work — stay inside the section/template you were asked to touch

**Multiple agents work this repo in parallel on the same worktree at the same time.** When you are asked to work on a specific section, template, page, or component, that is your *only* writable surface. Treat every other section/template/page — and every edit another agent or an earlier commit made to them — as read-only and load-bearing, even if it looks wrong, stale, or half-finished to you.

- **Never undo, revert, or overwrite work outside your scope.** Do not `git checkout`/`git reset`/`git restore`/`git revert` a whole file, directory, or commit to "get back to a clean state" — that wipes other agents' in-flight work. Do not restore a file from a previous commit. Do not delete or rewrite a section you weren't asked to change. If you think something outside your scope is broken, **say so and stop — do not fix it.**
- **Keep edits surgically namespaced.** Change only the selectors, components, and content that belong to your assigned section (e.g. the `.mw-roster*` rules and `roster-collage-01.jsx` for the roster). Don't touch shared tokens, shared `tl-*` selectors, the home/page composition order, or another template's classes as a side effect. If a change you want *would* ripple beyond your section (a token, a shared template, `npm run template-map` shows other consumers), **stop and flag it instead of making it.**
- **One shared dev server; each agent uses its own browser/tab for Playwright.** Next.js 16 enforces a *single dev server per project directory* (lock in `.next/dev`) — you **cannot** start your own instance on your own port; a second `next dev` just detects the running one and exits. So **do not start a second server and do not try to use your own port.** Instead, point Playwright at the already-running shared dev server and **launch your own isolated headless browser/tab each time** (`chromium.launch()` is a fresh, private browser — your own cookies/cache/viewport, fully independent of other agents' browsers). **Never connect to, reuse, or drive a page/browser you didn't launch this run** — scroll position is shared mutable state, and two agents scrolling one page silently corrupt BOTH agents' scroll-tied measurements and screenshots. Be certain you're using *your own* freshly-launched browser/tab on every run, and **close it after each response.** Read-only navigation + screenshots don't disrupt anyone — but **never shut down, kill, or restart the dev server, and never edit `next.config.*`** (Next auto-restarts the shared server on config change), since other agents are likely mid-verification on it. Only if **no** server is running at all should you start one (then it becomes the shared server — leave it up); always target whatever port the shared server is actually on rather than assuming. Write screenshots to your own scratch folder.
- **Before any broad/destructive git or filesystem operation, assume another agent has uncommitted work and would lose it.** When in doubt, scope down or ask.

## Design system — read before any UI work

**`docs/DESIGN-SYSTEM.md` is the locked design/style baseline for BOTH apps.** There are two finished reference pages: the **Miller home page** (+ header `TopNav` + footer `SiteFooter`) is canonical for the overall language and marketing sections, and the **Miller emergency-response service page** (`/industrial-services/emergency-response`) is canonical for interior & service pages (its `mw-svc-*` sections — alert hero, response timeline, photo-card grid, hover-swap gallery, dark dispatch CTA, related rail — are the worked map in §13). Every page built or converted to the new look must match them. Read that doc before redesigning or building any page, and update it in the same change if you intentionally evolve a pattern.

Non-negotiables (full detail in the doc):

- **Warm clay palette only.** Everything is clay / terracotta / walnut / cream. No blue, teal, or turquoise anywhere. Token *names* are historical — `--c-navy` (`#3B2418`) is deep walnut and `--c-blue` (`#6E3D1A`) is mid clay-brown; trust the hex, not the name. `--c-accent` (`#A85A2C`) is the signature terracotta.
- **Type:** Barlow Condensed (`--font-condensed`/`--font-display`) UPPERCASE for display; IBM Plex Sans (`--font-sans`) for body/leads; IBM Plex Mono (`--font-mono`) for labels, eyebrows, and numbers.
- **Motifs:** the clay square "stamp" period on headings (`mw-stop`), the rotated-diamond eyebrow mark (`mw-section-tag`), the faint 49° paper-grain wash, numbered "article" framing, the `→` action arrow. Squared rectangles, not pills.
- **Namespacing:** `tl-*` = shared brand (both apps); `mw-*` = Miller-only. Put Miller-specific styling under `html[data-brand="miller"]` or in a new `mw-*` class — never on a bare `tl-*` selector in the brand package.
- **Motion:** one scroll-reveal (`data-reveal` / `data-reveal-stagger`); every animation ships a `prefers-reduced-motion` off-switch.
- **A11y:** visible clay focus ring, semantic landmarks, labelled sections, AA-tuned text tokens, live regions for cycling text.

## Page route structure

**miller-web is template-first.** Pages are **composed from the shared `components-v2` template library**, not hand-built section by section. The home page and all 6 redesigned service pages are thin `page.jsx` files that order a few `06_sections` templates and feed each a `content` object from `lib/content/`. The authoritative build guide is **`apps/miller-web/components-v2/README.md` — read it before building or changing any miller page or template.** Browse every template rendered at `/template-gallery`. Home section CSS lives in **`apps/miller-web/app/styles/home/`** (one file per section); iterate in isolation at **`/home-lab`**.

```
app/<route>/
  page.jsx              # metadata (+ any hero preload) + thin composition only:
                        #   import templates from @/components-v2/06_sections/…,
                        #   order them in JSX, feed each a `content` object.
```

Rules for miller-web:

- **`page.jsx` orchestrates only** — no section markup inline. Find a `06_sections` template that fits (check `/template-gallery`) before inventing anything.
- **Copy** lives in `lib/content/<page>.js` (service pages) or the home content modules — never duplicated inside `page.jsx`.
- **Do not reintroduce per-route `sections/NN-*.jsx` / `banners/` files or monolithic `*Template.jsx`** for miller pages — the template cutover removed them. Build by composition.
- **Changing a template is a shared, multi-page change.** Prefer adding a **config knob that defaults to current behavior** (existing callers must render byte-identically) over editing default output; add a new `*-02.jsx` template when the DOM structurally diverges; a "hard change" to default output touches every consumer. **Before changing a template, run `npm run template-map`** (in `apps/miller-web`) to see which pages it affects. Playwright-verify affected pages only when the change is visual (see **Verifying UI** below). Full protocol in the components-v2 README.
- **Building or converting a page = `docs/RESPONSIVE-PLAYBOOK.md` §7.** A page is a ONE-SESSION job: compose from the hardened templates, pick a light motion budget from the proven vocabulary up front, verify in ONE parallel capture pass + one fix round. The home page was the exploration; don't re-explore — any genuinely new pattern goes into the playbook + a template knob, never only into one page's CSS.

**transline49-web is still bespoke** — it has not adopted the templates yet, and we are **not** refactoring the library into a shared package right now. Build/convert TL49 pages by mirroring the Miller reference pages per `docs/DESIGN-SYSTEM.md` §14 (its own `tl49-*` layer or promoting truly-shared pieces to `tl-*`); do not import `@/components-v2` (miller-namespaced) into TL49. When TL49 adopts the templates we will revisit sharing.

## Verifying UI

**Playwright is not required for every edit.** Skip it for small, low-risk changes where the outcome is obvious from the diff alone — copy/content updates in `lib/content/`, typo fixes, aria/semantic tweaks, non-visual logic, or scoped CSS nudges (one token, one spacing value) inside a section you were already assigned. Trust the code change; don't spin up a browser pass just to rubber-stamp it.

**Run Playwright (and actually open the screenshots — structural assertions don't prove design quality) when the change is visually significant**, including:

- New sections, major layout/responsive rework, or animation/scroll/pin behavior
- Template **hard changes** or any edit whose `template-map` blast radius spans multiple pages
- Palette, typography, or cross-section visual refactors
- Finishing a new page or calling work "done" on a substantial redesign

When you do verify: load the affected route(s), capture desktop + mobile, **look at the screenshots**, and don't claim a UI is correct without seeing it rendered. Use the shared dev server rules in **Scoped work** above.

**How to verify responsive work (hard-won — a broken phone layout shipped because these weren't followed):**

**Before designing any responsive translation, read `docs/RESPONSIVE-PLAYBOOK.md` in full** — it carries the mandatory pre-edit process (desktop-intent inventory → per-surface translation plan → written motion contracts), the approved design vocabulary (rails/strips with peek, directional edge bleeds, white media cards, stagger rows, portrait type scale), the worked implementation recipes (pin gates, flow writers + var slices, `display:contents` re-composition, reversed scrollers, sticky-hover handling), and the §6 pre-ship checklist. The bullets below are the verification half; the playbook is the design half. If the `designing-responsive-sections` personal skill is available, invoke it at the start of any section design/optimization pass — it orchestrates the reading order, the companion skills, and the parallel per-viewport screenshot capture protocol.

- **Start from the DESKTOP design and derive downward.** logan designs on desktop — the desktop section IS the design intent. Before touching smaller viewports, review the section on desktop (rendered, not just code), name its components and what each is *for*, then ask "how does THIS design translate to this viewport, and how does its motion come along?" Never accept an existing mobile layout as the brief, and never reduce a designed composition to generic blocks (e.g. a curated one-open gallery must not become a wall of stacked images — purposeless image dumps are banned on every page).
- **Motion completion anchors are exact geometric events, and "in position by the time X passes" means landing AT that frame.** Anchor every scrub's start/end to rect events (section bottom == viewport bottom; title top == viewport bottom; band fully visible) rather than tuned thresholds, spread per-item slices across the full runway so assembly is visibly in progress the whole approach (finishing early is as wrong as finishing late), and derive ordering guarantees ("A before B") from geometry so they can't drift. Assert the anchor frame in the Playwright script (`p === 1.000` with the anchor element at the viewport edge).
- **Perceptible or it doesn't exist.** An effect whose variables provably change but which is invisible where the user actually looks (near-transparent layer animating, a draw completing below the fold) counts as missing — port the desktop choreography itself, give effects their own visibility arc, and judge motion BY EYE at mid-scrub frames, not only by probes.

- **Walk the section in its ENTIRETY, component by component, per viewport** — eyebrow, headings, figures, borders/frames, captions, paddings, and the handoffs to neighbouring sections — not one gestalt glance at a screenshot. Where geometry matters, assert it with measurements in the Playwright script (element-center offsets, "content fits inside shape" checks, computed-style probes for stray legacy rules), alongside the pixels.
- **Verify INTERACTION STATES per viewport, not just rest states.** Hover/active/selected/expanded poses must be exercised (tap/hover in the script, then measure + screenshot): a state that grows an element (scale, gather, expansion) must still fit the viewport, and sticky touch-`:hover` needs an explicit way OFF (outside-tap clear). A desktop-tuned active state (e.g. a 1.24× lattice grow) will overflow a phone column unless re-tuned.
- **When CSS re-orders a layout (`order`, `display:contents`, grid placement), reveal/motion sequences must follow the VISUAL order, not the DOM order** — sort animation targets by on-screen position (top, then left) so the cascade sweeps what the eye sees (worked example: `image-accordion-01.jsx`'s position-aware cascade). An element that sits above another must never animate in after it.
- **"Looks a bit tight/off" is a bug until proven intended.** Don't rationalize an odd render as acceptable; A/B-compare the suspicious viewport against a known-good size of the same component — structural disagreement means something is broken.
- **Test the in-between widths, not just round breakpoints:** ~430 (iPhone Pro Max class), the 600–720 band, portrait tablets (768/834/1024), landscape tablets, AND a fine-pointer ~650×950 window — logan tests with devtools responsive mode, which is **fine-pointer**, so `pointer: coarse` gates don't fire there. Behavior must be sane on both pointer types at every size.
- **Emulate touch correctly:** `browser.newContext({ viewport, isMobile: true, hasTouch: true })`. Gotcha: `locator.screenshot()` on an element TALLER than the viewport silently resets that emulation (pointer flips to fine) for the rest of the context — use viewport `page.screenshot()` + scroll steps in touch runs.
- **Before deleting CSS rules, grep what they were overriding.** Old fallback blocks are often only kept inert by later neutralizing rules; deleting the neutralizer re-activates the legacy block (exactly how the phone layout broke).
- **Pins on portrait are decided by the MOTION TEST, not banned outright.** A pin that holds an oversized STATIC composition (who-we-serve, lifetime, VBEC) never pins on portrait — any width, any pointer: gate every such pin on `(orientation: landscape)` + a sensible min-height + `prefers-reduced-motion: no-preference`, mirror the gate in the section's JS (`canPin`-style), and give the flowing surfaces explicit content insets (a panel edge and the content start often coincide by construction). But a choreography whose mechanism IS the hold — converging to a full-screen centred focal point, like the careers dive ("wait until the section fills the screen, then zoom into the screen") — **pins on every surface including portrait**; only its layout adapts. Full derivation rule in `docs/RESPONSIVE-PLAYBOOK.md` §0/§3.
