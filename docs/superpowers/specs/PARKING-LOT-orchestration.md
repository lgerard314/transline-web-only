# Parking lot — multi-agent design orchestration (NOT yet specced; capture only)

Deferred until after the tier-calibration + design-auditor plan executes AND the auditor has been run on at least one real section (vibe-code then harden; don't design the menu before running the system once). Owner: logan. Captured 2026-06-13.

These are raw ideas, not commitments. When ready, run a single `brainstorming → spec → plan` pass over the whole set, informed by a real run.

## Execution-style menu (the core idea)

A page/section build offers a choice of execution styles instead of one fixed loop:

- **(a) Single-agent section-by-section** — the current loop. Default.
- **(b) Parallel independent sections + integration pass** — fan out one agent per *structurally independent* section, then a mandatory whole-page integration review. Gated by the **independence gate** below.
- **(c) Pipelined executor** — executor does section N+1 without blocking on section N's reviewer; reviewer findings are applied in a later fixup pass. Latency win. Sharp edge: a late fix to section N can re-open N+1 if they share a surface → only safe under the independence gate.
- **(d) Multi-page fan-out** — subagents spawning subagents, multiple pages at once. Most powerful, most dangerous (context burn + coordination cost compound). Apply the independence gate at *page* level too. Defer hardest.

## Independence gate (governs b, c, d)

Only parallelize / pipeline surfaces that are genuinely independent: blast-radius-1 each (template-map confirms), AND no shared pin runway / no continuous color field / no motion handoff *between the specific surfaces being assigned to different agents*. If two candidates share a seam or continuous color, they go to one agent, not two. (Most home sections are blast-radius-1 per the home-composition memory — but seams/handoffs are the real constraint, not blast radius alone.)

## Mandatory integration pass (the half of the idea that's already gold)

After parallel/pipelined section work, a fresh agent (or one per viewport class) judges the WHOLE page as one object: seams, motion handoffs, color continuity (e.g. VBEC walnut continuous with LifetimeReel), total scroll runway. This is the thing isolated section work can NEVER catch and where "does this read as one expensive website" actually gets decided. Isolation (`/home-lab`, `/template-gallery`) is for iteration, NOT a substitute for in-context verification.

## Agent-finish reminder hook

Mostly already exists: `design-reminder.mjs` PostToolUse fires on subagent returns and re-anchors the rules. Could move to / add the dedicated `SubagentStop` event; reminder = "re-read the skill files / chat history if you've started to stray." Cheapest item — could ride along a future hook edit.

## Why NOT the per-section isolation-route system (decided 2026-06-13)

Rejected as a parallelism substrate. The height-shift fear is mostly neutralized by convergent geometric probing (anchors are section-rect-relative, not absolute scroll-Y — already mandated in verification.md). The real residual is HMR cross-talk, blunted by per-section CSS files (home already has them) + cheap re-runs. The cost — verifying sections OUT of context — breaks the hardest part of the bar (seams/handoffs/continuity). Use `/home-lab` for isolated iteration; keep verification in-context. Shelve the route-generator unless a real session proves convergent probing + per-section CSS isn't enough.

## Status (2026-06-13)

- **ABSORBED** into the orchestration spec+plan (shipped): the execution-style menu (now the derived execution-shape axis + decision tree), the independence gate, the mandatory integration pass (now `design-auditor` `scope: integration`, motion-aware), the coordinator briefing template, and the up-front motion budget. See `docs/superpowers/specs/2026-06-13-design-orchestration-layer-design.md` + the plan + `references/orchestration.md`.
- **REJECTED:** the per-section isolation-route system (above).
- **DEFERRED (explicit):** the `SubagentStop` finish-reminder hook. The current `design-reminder.mjs` fires on `Agent|Task` PostToolUse at the parent, which suffices for now; a true in-subagent `SubagentStop` re-anchor is a future hook edit, not part of the orchestration change.
- **Spec 2 inputs** (own brainstorm → spec → plan, ideally after fan-out runs on a real page): motion engine (Motion.dev / GSAP / CSS scroll-driven) + `getAnimations()` deterministic anchor probing + design tokens (Style Dictionary) + VLM rubric grader + a numeric motion-perceptibility check with a real region contract. Research top-3 recorded in the orchestration spec's "Follow-on" section.
