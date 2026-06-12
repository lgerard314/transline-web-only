# Verification — Playwright protocol, probes, and looking at pixels

## When to verify (and when not to)

Skip Playwright for changes whose outcome is obvious from the diff: copy/content swaps, typo/aria tweaks, one-token CSS nudges inside your assigned section. Run it — and actually look at the output — for new sections, layout/motion work, multi-page template changes, palette/type refactors, and before calling any substantial work "done."

## Shared dev-server rules (non-negotiable)

- One dev server per project directory (Next.js enforces this); other agents may be mid-verification on it. If a server is already running, you need a BROWSER, not a server — never start a second, never kill/restart the running one, never edit `next.config.*`. Only if NO server is running do you start one — then leave it up as the shared server.
- Launch your OWN fresh headless browser every run (`chromium.launch()` = private cookies/cache/viewport); never connect to or reuse a page/browser you didn't launch this run (scroll position is shared mutable state); close it after each response. Target whatever port the server is actually on. Browsers are per-agent ALWAYS — this is the rule that keeps parallel agents from corrupting each other's measurements.
- Worktree exception: inside your own isolated git worktree the project directory is yours, so you may start and own a dev server there (it can't collide with the main checkout's). The other rules don't relax: still your own browser per run, still never touch a server you didn't start.
- **ALL scratch artifacts — screenshots, probe scripts, manifests — go under `.scratch/<task-or-page>/` at the repo root, nowhere else.** That root is gitignored: scratch is never committed, never staged, never pushed (screenshots in git bloat every clone and slow every stage/push), and never written loose into the tree. Each agent uses its own subfolder. Run node scripts from the repo root the dependencies live in (cwd drift = phantom "module not found").

## Probe hygiene

- **Converge, don't precompute:** sticky headers and lazy content shift layout between top-of-page and mid-page, so loop scroll → re-measure → scroll until the target frame is actually reached, then read values.
- **Assert the frame before reading from it:** for motion anchors, assert p ≥ 0.999 with the anchor element at the viewport edge; for rest states, wait for reveals to settle (~700–900ms).
- **A red probe is REAL until re-run green at a proven frame** — and a probe that passes mid-transition is equally untrustworthy. Re-run; don't rationalize either direction.
- Standard page counters on every run: `pageerror` listener, 404 response listener, `scrollWidth − clientWidth` overflow check.
- Geometry claims get measured assertions (pairwise offsets, flush-to-gutter deltas, fill-front vs station-center), not adjective judgments.

## Scroll-motion walkthroughs (pins, sticky elements, scrubs) — REQUIRED

Any section with pinning, sticky positioning, or scroll-tied motion gets a SEQUENTIAL screenshot walk, not just rest/anchor shots: real scrolls in SHORT increments (~200–600px steps, with a settle wait after each) across the effect's entire runway, screenshotting every step, so you SEE the motion unfold frame by frame — entry, every mid-scrub pose, the anchor landing, and the release/unpin. Probes prove the variables moved; only the stepped walk proves the motion is perceptible, ordered, and continuous (motion.md: imperceptible = missing; finishing early = wrong). Walk it in both directions when reverse-scroll behavior matters, and re-walk after any fix.

## Look at the pixels

- Structural assertions prove the test ran, not that the design is good. **Read every screenshot** (the Read tool renders images) and walk each section component by component — eyebrow, heading, figures, borders, captions, paddings, seams to neighbors — not one gestalt glance.
- Exercise INTERACTION states per surface: hover, focus (`:focus-visible` ring visible and on-palette), active/selected, expanded, form error states (submit empty; verify invalid-wins-under-focus), then measure + screenshot each.
- "Looks a bit tight/off" is a bug until proven intended — A/B against a known-good width of the same component.
- Color audit: CSS/chrome/illustrations must be on-palette (grep misses image assets — load them); photographs are judged on realism and quality, never palette conformity.
- Subpixel artifact warning: small mono text often reads blue-ish in downscaled screenshots — verify the computed color before claiming a palette violation.
- Non-desktop captures use REAL device dimensions — width AND height — at the viewport-class canonical sizes (responsive.md table: phone 390×844 DPR 3, tablet-portrait 834×1194, tablet-landscape 1194×834, all with `isMobile`/`hasTouch`) — never a width-only window with an arbitrary height; cut-offs are judged against the true device viewport. Desktop reference frame: 1440×900.
- Screenshot-stitching artifacts (sticky nav baked mid-image on element shots of tall nodes) are capture artifacts, not page bugs — confirm with a viewport shot before "fixing."
- **On pages containing pinned/sticky sections, element/locator screenshots of tall sections are forbidden outright** — the pin track corrupts the stitch (worked failure: a 2050px history-section locator shot rendered as neighboring-section content plus a giant empty void). Use viewport `page.screenshot()` walks with stepped scrolls instead, and never `scrollIntoView` through a pinned runway — step through it.

## Capture subagents (parallel matrices)

**Approved-page reference shots are NEVER captured by agents** — the mechanical harness owns those (`.claude/skills/website-design/scripts/capture-home.mjs`, see approved/INDEX.md): run it in the background, review its report + pixels. Capture subagents are for IN-PROGRESS work only (sections being built/verified that have no manifest entries yet), and even there prefer writing a reusable probe script over burning agent turns on scroll-walking. For viewport matrices on in-progress work, spawn one capture agent per viewport — CAMERA OPERATORS ONLY: each launches its own fresh browser, captures the pose list (rest, anchor frames with settle-loop assertions, stepped mid-scrub frames, interaction states), writes files + a manifest of raw measurements, makes NO judgments. The main agent reads every screenshot and makes every quality call itself. Touch-emulation gotcha: `locator.screenshot()` on an element taller than the viewport silently kills `isMobile/hasTouch` for the rest of the context — use viewport `page.screenshot()` + scroll steps in touch runs.

## Audits are part of verification

Per-section fresh-agent audits (briefing template in process.md) catch what self-review can't — assume your own blind spots. Their findings are claims: re-probe what you apply, and reject with cause what contradicts locked patterns.
