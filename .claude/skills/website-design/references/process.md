# Page production process

The end-to-end workflow for building, redesigning, or converting a page. The home-page exploration already paid for these patterns — a page is a ONE-SESSION job; if it's becoming an expedition, something is being re-explored that shouldn't be.

## Phase 0 — context before concept

1. Read the repo canon in order (see design-language.md). Re-read it even if remembered — canon evolves between sessions, and stale session notes have caused real regressions (the imposed-photo-grade incident survived two sessions because old notes outranked the actual brief in practice).
2. Read the existing page (v1) and its content module — the copy is the source of truth for what the service/subject IS, even when every pixel gets replaced.
2a. **Look at the approved reference screenshots** ([approved/INDEX.md](approved/INDEX.md)) for any device you plan to reuse or any section type similar to what you're building — they are the rendered-pixel bar for spacing, type scale, motion poses, and section handoffs. Consulting them BEFORE building is mandatory for any work that touches a registered device.
3. Check the user's brief for explicit instructions and re-read it before locking any policy into prompts or docs. The brief outranks memory, playbooks, and this skill.

## Phase 1 — the design brief (before any code)

- **Contextual fit:** name WHO lands on this page and what they need; pick a register that serves them (e.g. utilitarian-excellent for an operator's working site, not a startup splash page). Unique, but never straying from what the company does or who it serves.
- **A named concept** distinct from sibling pages (e.g. "logistics manifest" vs "project dossier" vs "company creed" vs "site file"). Sibling pages must differ STRUCTURALLY — different hero architecture, different section devices — not be re-skins with barely noticeable differences.
- **Section lineup** with: at most one dark anchor (zero is fine; vary its placement across sibling pages), light hero per canon, the close before the footer never dark, a motion mix budgeted by size (motion.md — mediums are the backbone, smalls everywhere, larges rare and deliberate), and at least one EDGE-SPANNING element (screen edge → opposite body-content boundary; design-language.md) so the page breaks the content column at least once. No new motion mechanics on interior pages — flag novel mechanisms to the user instead.
- **Imagery list** (see imagery.md) — at the START, fire ALL image generation into BACKGROUND subagents and keep building. **HARD RULE (imagery.md): never request an image inline and wait** — delegate to a background subagent, placeholder the slot, continue, swap on return. Images are always the long pole; blocking on them serially is the biggest time-sink there is.
- **Architecture rules:** thin `page.jsx` composition only; copy in a `lib/content/<page>.js` module; dedicated per-page templates when the repo is template-first; page-scoped CSS namespace that cannot collide with existing token prefixes (grep before naming); shared components composed, never forked; changing a shared template requires the blast-radius check and a default-preserving knob.
- **Scope per the scope ladder (next section):** an unscoped redo ask defaults to Rebuild — never assume a lighter tier than logan named.
- **Identify shared-template sections vs page-unique sections.** Some sections are cross-page templates by nature (e.g. the "other services"/related rail reused by ALL service pages): design those once, harden them, and reuse — page-unique compositions get their own templates. Misclassifying a shared section as page-unique forks it; misclassifying a unique section as shared couples pages that should diverge.
- If direction is genuinely ambiguous, ask up to ~5 multiple-choice questions UP FRONT — never mid-build.

## The scope ladder — how deep does a redo go?

A page is four nested layers; **opening a layer opens everything beneath it**, so a scope names only the HIGHEST open layer:

| Scope word | Highest open layer | Kept | Redone |
|---|---|---|---|
| **Rebuild** | Concept — page architecture | nothing | named concept, section lineup/order, devices, composition, execution |
| **Recast** | Device — section types | concept, lineup, each section's job | each section's device (chosen from vocabulary.md) and everything below |
| **Restructure** | Composition — section-internal architecture | lineup + devices | the section's internal layout/geometry + execution; motion contracts RE-DERIVED (the geometry changed) |
| **Refine** | Execution — treatment | lineup + devices + composition | spacing/type application, motion tuning, hover grammar; anchors re-probed at existing geometry |

- **Default: any unscoped redo ask ("update this page", "full page modification", "make it better") = Rebuild.** Never assume a lighter tier on your own; logan scoping it narrower is the only downgrade path. (This subsumes the old "full page modification means FULL redo" rule.)
- Scope is set per page with per-section overrides — "Restructure the page, Rebuild the hero" is a valid brief.
- When logan's words sit between two ADJACENT tiers ("redo the design" — Restructure or Refine?), that's a pre-flight question (below), never a silent pick of the cheaper reading.

## Pre-flight — page/section asks open with a stated WORK ORDER

For any ask bigger than a specific edit (a page, a whole section, "make X better"), the FIRST response opens with the work order — a short stated reading, BEFORE any work, covering whichever of these five axes deviate from defaults or could be misread (2–6 lines total; don't recite defaults):

1. **Surfaces** — which page(s)/section(s) are writable; everything else is read-only.
2. **Depth** — the scope-ladder tier per surface (unscoped redo = Rebuild).
3. **Viewport classes** — which named classes are in scope (desktop / phone / tablet-portrait / tablet-landscape — definitions + canonical dimensions in responsive.md; default: desktop only). Depth applies within the classes in scope ("Restructure the timeline for phone" leaves desktop untouched).
4. **Media & copy** — photos regenerate vs keep (imposed filters never, either way); copy rewritten vs treated as source-of-truth.
5. **Stop point** — default is through per-section audits + the page finish criteria. A critique/audit-only ask produces a REPORT and ZERO edits. The extraction pass and approved/ reference shots are never in scope without logan's done-rating.
6. **Execution shape** — for any ask touching MORE THAN ONE section, state the shape (solo / single-page fan-out / multi-page fan-out), DERIVED per orchestration.md (`shape = f(surfaces, independence, depth)`). A single section proceeds solo. A FULL PAGE or MULTIPLE PAGES is a STOP-GATE: present the plan-summary (lineup + shape + why + independence-gate grouping + the up-front motion budget + commit plan) and WAIT for logan's go before spawning anything (orchestration.md). logan may override the shape by name.

Plus: the model plan (judgment inherits the session model; mechanical sonnet — checklist item 9) and per-section audits ON or waived. Then PROCEED — **confirm by stating, not by asking**; logan interrupts if the reading is wrong. Questions are reserved for genuine ambiguity (adjacent-tier scope reads, conflicting instructions, an axis his words genuinely don't settle) and are batched up front per Phase 1 — never mid-build, never as permission theater on a clear ask.

Per-section audits default ON. Only logan can waive them — the agent NEVER skips an audit on its own initiative ("this section is simple" is the predictable rationalization, not a reason). A waived audit is recorded in that section's commit message so the retro can correlate waived sections with later corrections.

## Phase 2 — the section loop

For EACH section, in order:

1. **Build / edit (tier-led):** **Refine** → make the treatment change in place (spacing/type/motion-tuning/hover). **Restructure** → rebuild the section's internal composition + CSS. **Recast** → swap the section's device. **Rebuild** → build the template + content + CSS fresh. (See the tier×step table below for which later steps run.) Any imagery this section needs is fired into a BACKGROUND subagent up front and built around with a placeholder — never wait on it (imagery.md async HARD RULE).
2. **Self-probe:** Playwright script asserting the section's geometry at proven frames (anchor frames for motion, pairwise offsets for compositions, overflow/404/pageerror counters) AND screenshots you actually Read. Fix what you see before involving anyone else.
3. **Fresh audit subagent** (see briefing template below) — a fresh-eyed model judges the rendered pixels against the bar: "exceptional, high-end, expensive-looking."
4. **Act on findings:** apply what's right; REJECT WITH CAUSE what contradicts the **auditor don't-flag list** (process.md) or proposes a **forbidden device** (vocabulary.md) (keep a rejection list — auditors repeatedly re-flag deliberate house patterns). Re-probe every applied fix.
5. **Commit per section** with a message recording what was verified — the work must be traceable section by section.
6. **If the section is APPROVED (listed in approved/INDEX.md) and your change alters its rendered appearance: refresh its reference screenshots + INDEX rows in the SAME commit — MECHANICALLY.** Run the capture harness in the background (`node .claude/skills/website-design/scripts/capture-home.mjs --section <NN> --class all`) and keep working while it runs; your only manual duties are reading the capture-report's converged flags, LOOKING at the changed shots, and updating the INDEX rows. NEVER hand-walk captures with an agent or spawn capture subagents for approved-page shots — that pattern is retired for token cost. If your change altered the section's choreography, update its manifest predicate (`scripts/capture-home-manifest.mjs`) in the same change. Shipping a visual change with stale reference shots is a process failure — the stale shot teaches every future agent the wrong target.

### The loop is tier-gated — run only what the scope tier requires

The scope ladder sets depth; this table sets which loop steps actually run. Read your tier's row before running the loop — do not run the full Rebuild procedure for a lighter tier (a Refine that runs the full loop is the documented waste this table exists to stop). Urgency is real: the mechanical capture harness removed the token cost of re-capture, but the JUDGMENT cost (a judgment-tier auditor re-judging unchanged geometry) survives until you scope by tier.

| Tier | template-map (step 0) | audit scope (step 3) | motion contracts | re-capture (step 6) |
|---|---|---|---|---|
| **Rebuild** | run if a shared template's default output changes | full-section — brief the auditor `scope: full-section` | write fresh | only if an approved section's appearance changed → run the harness |
| **Recast** | run if the section's device is a shared template | full-section | per the new device | same |
| **Restructure** | run if a shared template changes | full-section | **MUST re-derive** (geometry changed) | same |
| **Refine** | **skip** when no shared template is touched | **delta — brief the auditor `scope: delta`** (judge the change, not the whole section) | re-probe at existing geometry | same |

Tier-scoping the audit is NOT waiving it — a Refine still gets an audit, just scoped to the delta. The agent never self-waives (only logan waives; a waiver is recorded in the commit).

## Micro-commit discipline (applies to ALL passes, not just builds)

Every major change is its own commit: one per section when building, one per section (or per view/viewport, when that's the unit of work) when optimizing or running an update pass, one per audit-fix round, one per rule/doc change. The goal is that logan can trace and bisect any section's evolution from the log — a day of work squashed into one blob commit is a process failure. Imagery, content modules, and CSS for a section ride in that section's commit.

Worktrees: when work runs in an isolated git worktree (parallel agents mutating files concurrently is the main reason), the same per-section commit cadence applies inside it, and the worktree's branch must be merged back promptly when the work lands — never strand finished work on an unmerged branch. Default remains the shared worktree with surgically scoped edits.

Independent sections' audits may run in parallel as background agents while you build ahead — but every report gets acted on before its section is called done, and if the user asked you to go slow, build strictly one section at a time instead.

## Subagents do NOT inherit this skill — brief it in

Spawned subagents (builders, auditors, capture agents) do not automatically load this skill or its references. Every design-work subagent prompt must either instruct the agent to invoke the `website-design` skill via the Skill tool, or inline the specific rules it needs (protocol, locked rules, contracts) directly in the briefing — the templates below do the latter. Never assume a subagent knows the grammar.

## Subagent briefing checklist — run it on EVERY design-work spawn

Before sending any builder / auditor / capture / verify / fix subagent, confirm the prompt contains all nine. A briefing missing any item is the weakest link in the whole governance stack — thirty seconds here beats an unanchored agent.

1. **Scope:** exact route(s) + section selector(s) + the writable surface; everything else explicitly read-only — no `git revert`/`reset`/`checkout` of work outside scope, flag instead of fix.
2. **Server/browser:** shared dev server on its ACTUAL port (state it) — never start/kill/restart it, never edit `next.config.*`; own fresh `chromium.launch()` per run, closed when done.
3. **Artifacts:** all screenshots/scripts under the gitignored `.scratch/<task>/`; writes to `references/approved/` only via the INDEX protocol.
4. **Rules in the prompt:** instruct the agent to invoke the `website-design` skill, or inline the locked rules the task touches (palette/type/motifs, stop-glyph periods, no leading numbers on stacked lists, neutral photos generated ASYNC — background subagent, placeholder, never block, motion adjusted never stripped, uniform heading-stack gaps). Subagents inherit NOTHING.
5. **Auditor don't-flag list (process.md)** — the deliberate house patterns auditors must not flag — plus the expectation that the coordinator may reject findings with cause.
6. **Motion + viewport contracts** when relevant: progress source and geometric anchors in words; any non-desktop capture at REAL device dimensions (width AND height, responsive.md).
7. **Return format:** verdict/data, per-finding severity + pixel evidence + file paths; camera operators return raw facts only, never judgments.
8. **Commit ownership:** state whether the agent commits (per-section micro-commits) or the coordinator does — never both, never batched.
9. **Model:** judgment roles (builders, section auditors, anything making a design call or quality verdict) inherit the session model — OMIT the model parameter unless logan directs otherwise. Mechanical roles (camera operators, file sweeps, chunk extractors) may run sonnet. Never downgrade an auditor or builder for cost on your own initiative.

Two coordinator-side rules that ride with the checklist: a NESTED coordinator (an agent spawning its own subagents) passes this checklist down verbatim — every layer re-briefs, because no layer inherits; and the coordinator personally Reads every returned screenshot before acting on a visual claim — subagent reports are claims until verified.

## Auditor briefing template

Give every section auditor: the exact route + section selector; the design intent AND motion contract in words; the verification protocol (own fresh headless browser against the already-running shared dev server — NEVER start/kill/restart it; own subfolder under the gitignored `.scratch/` root; close the browser after); what to capture (rest + interaction states + seams + 2–3 widths, and for motion the mid-scrub frames + anchor frame); the **auditor don't-flag list** (process.md, DF-*) they must not flag; required return format (verdict + per-finding severity/pixel-evidence/concrete-fix/screenshot-path). Tell them to READ every screenshot, not just probe.

**Auditor don't-flag list** (deliberate house patterns auditors must NOT raise as defects — distinct from vocabulary.md's *forbidden devices*, which must not be BUILT). Cite by ID when rejecting a finding (extend per repo):
- `DF-1` sentence-case body-CTA labels
- `DF-2` inverted stamp colors on accent text
- `DF-3` the dev-overlay badge in screenshots
- `DF-4` per-field form error messages
- `DF-5` small mono text reading blue-ish in downscaled screenshots (subpixel artifact — verify computed color before claiming a palette violation)

### Why a design-auditor agent but not a builder / scope / capture agent

Reusable AGENTS are for stable, repeated contracts. The **auditor** qualifies: its payload is mostly stable contract + a pointer to canon, it fires every section → it's a `.claude/agents/` definition (see design-auditor). The others do not: a **builder's** payload is mostly the per-page work order (concept, lineup, copy, namespace) — volatile, so it stays a per-task briefing, not an agent. **Scope** (Rebuild/Recast/Restructure/Refine) is a PARAMETER threaded through the loop table, not an agent type — minting one agent per tier would be four drifting near-duplicates. **Capture** is a deterministic script (scripts/capture-home.mjs), not a judgment role — an agent there would re-introduce the token cost the harness removed. If you feel the pull to "add a builder agent for symmetry," that's consistency in the wrong direction.

## Finish criteria (page level)

- Seam rhythm consistent across all sections at each width (probe the padding values).
- **If the page was built by fan-out: its integration pass is clean** — a fresh `design-auditor` with `scope: integration` (orchestration.md) did a full-runway walk judging seams, color continuity, motion handoffs, and whole-page pacing (motion budget honored). A fan-out page is NOT done until it passes.
- Zero page errors, zero horizontal overflow, zero 404s at every checked width.
- Reduced-motion: every rest state fully settled/complete; clocks frozen.
- Final section walk with screenshots you have personally read.
- Deliver representative screenshots to the user; update memory/docs with anything hard-won (new patterns go into the playbook canon + template knobs, never only into one page's CSS).
- **Extraction pass when the user declares a page DONE:** walk every section of the finished page and update vocabulary.md — add new devices as approved (his done-rating is the approval), update reuse guidance on existing entries the page exercised, and harvest any corrections he made during the build into the forbidden list. New devices built mid-page enter vocabulary.md as `pending` immediately; only his done-rating promotes them. The extraction pass ALSO captures the page's approved reference screenshots (per the protocol in [approved/INDEX.md](approved/INDEX.md)) — for the viewport classes logan actually rated, and ONLY those (per-class approval, responsive.md): rest shot per section + mid/settled poses for motion-defined sections + signature hover poses (fine-pointer classes only), indexed with capture commit + probe facts, every shot personally Read before it lands. Mechanically: author the new page's shots as manifest entries (pose predicates) in `scripts/capture-home-manifest.mjs`-style harness config and run the capture script in the background — the one-time predicate authoring is the agent work; the pixels come from the script, forever after. After the extraction pass, logan may run the `design-retro` skill (`.claude/skills/design-retro`) — it harvests the session TRANSCRIPT for corrections that in-session memory missed and folds them into these files under its own classification rules.
