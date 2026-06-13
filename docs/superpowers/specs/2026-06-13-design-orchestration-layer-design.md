# Spec — Design-workflow orchestration layer (execution shapes, independence gate, motion-aware integration)

**Status:** draft (brainstormed in-chat; awaiting logan's spec review)
**Date:** 2026-06-13
**Owner:** logan (ratifies)
**Predecessors:** builds on the design-governance stack — the `website-design` skill, the scope ladder + tier-gated section loop, the `design-auditor` agent + eval, the mechanical capture harness, the async-image HARD RULE (shipped `3b2ef3a`). Parking-lot source: `docs/superpowers/specs/PARKING-LOT-orchestration.md`.

## Problem

The section loop is single-agent and serial. For a full page (or several pages) that wastes wall-clock on independent section craft, accumulates one agent's context across the whole page, and gives the coordinator no structured way to fan work out safely. The risk that has kept us serial is **cross-section coherence**: parallel agents editing one page can ship sections that are individually great and collectively broken (seams, color continuity, and especially **motion handoffs** between sections, plus whole-page motion *pacing*). We now have the pieces to parallelize safely — a reusable auditor, per-section convergent probing, per-section CSS files — but no governing decision logic, no safety rail, and no convergence step that owns the whole-page bar.

Separately, four concrete gaps surfaced in design discussion: (1) spawned multi-page coordinators have no defined contract; (2) full-page jobs touch so much that they warrant a pre-execution stop-gate; (3) micro-commit-per-section must survive fan-out (parallel committers must not sweep each other); (4) motion is well-covered *within* a section but not *across* sections once work is split.

## Goals

1. Add **execution shape** as a derived, stated (and for big jobs, gated) axis of the work order — so the engine picks the right fan-out shape and the user keeps veto + override.
2. Make parallelism **safe by construction** via a checkable **independence gate** that decides what can go to different agents.
3. Define the **coordinator briefing template** so multi-page fan-out has a real contract (not a new agent — a documented briefing, per the agent-scope decision).
4. Make the **integration pass mandatory after any fan-out** and **motion-aware** — it judges seams, color continuity, motion handoffs, and whole-page motion pacing across the full scroll runway, with an engine-agnostic numeric check for perceptibility + continuity.
5. Carry **micro-commit-per-section** cleanly into fan-out (explicit-path staging).

## Non-goals

- **No motion-engine adoption** (Motion.dev / GSAP / CSS scroll-driven) and **no `getAnimations()` deterministic probing** — those are the highest-leverage motion-authoring/verification moves but they change how *every section* is built and the probing is *coupled* to the engine. They are **Spec 2** (see "Follow-on"). This spec uses only engine-agnostic verification.
- **No Style Dictionary / Theatre.js / VLM rubric grader** — Spec 2 (grading + tokens + authoring).
- **No new agent types.** The coordinator is a briefing; the integration judge is a new `scope` value on the existing `design-auditor`. (Per the recorded agent-scope decision: auditor yes; builder/scope/capture no.)
- **No per-section isolation preview routes** (rejected 2026-06-13; convergent probing + per-section CSS already cover the height-shift fear).
- **No nesting deeper than one level** (top coordinator → page-coordinators → section-builders; no further).

## Constraints (carried from repo operating rules)

- Repo-local only; everything under the repo's `.claude/`.
- Shared worktree, parallel agents → **stage by explicit path, never `git add -A`** (the CWC sweep lesson — load-bearing here, since fan-out means many concurrent committers).
- **Subagents inherit nothing** — every spawned agent (builder, auditor, coordinator) self-invokes the skill or is handed the rules; the 9-item checklist passes DOWN VERBATIM at every layer.
- **Model rule (checklist item 9):** judgment roles (builders, coordinators, the integration auditor) inherit the session model; mechanical roles (camera operators, image-gen subagents) may run sonnet.
- Micro-commit per section; conventional commits; CRLF warnings benign.
- One shared dev server; each agent owns its own fresh headless browser per run; never start/kill/restart the server or edit `next.config.*`.

## Workstream 1 — Execution-shape axis + decision tree

The execution shape is the **6th work-order axis**, derived not asked:

> execution shape = f(surface count, independence (WS2), depth)

**The four shapes:**
- **Solo loop** *(today's default)* — the coordinator IS the builder. For: 1 surface; a page whose sections are tightly coupled; or any "go slow" request.
- **Single-page section fan-out + integration** — one builder per independent section, then a mandatory motion-aware integration pass (WS4). The workhorse for page builds.
- **Pipelined audits** — orthogonal latency optimization (already half-sanctioned in process.md): a section's audit runs as a background agent while the builder moves ahead; findings are applied in a fixup pass before the section is called done. Safe only under the independence gate (a late fix to section N must not re-open N+1).
- **Multi-page fan-out** — one page-coordinator per page (WS3), each recursing into single-page fan-out. Independence gate applied at page level; nesting capped at one level.

**Decision tree (documented in orchestration.md):**
- 1 surface, any depth → **solo**.
- N sections, independence gate PASSES for all → **fan-out + integration**.
- N sections, gate FAILS between some → **group the coupled ones to one agent, parallelize the rest** + integration.
- N pages → **multi-page fan-out** (each page recurses through the above).
- "go slow" / explicit override → **solo** regardless.

**Gating (WS1's UX, per logan's decision — plan-summary for approval):**
- **Single section** → state the reading, **proceed** (no gate; today's behavior).
- **Full-page / multi-page** → present ONE **plan-summary** and **WAIT for go** before spawning anything: the work order + section lineup + chosen execution shape (+ one-line why) + the independence-gate result (which surfaces grouped, why) + the commit plan. logan approves, edits, or **overrides the shape by naming it** (override keywords: `solo` / `fan-out` / `multi-page`). This is a genuine stop-gate, justified because a full page touches a lot and fan-out spawns many agents (token cost).

Success: a reader (and the engine) can determine, for any ask, which shape applies and whether a stop-gate fires; full-page asks produce a plan-summary and halt for approval; single-section asks still flow without friction.

## Workstream 2 — The independence gate (the safety rail)

A checkable predicate evaluated between any two surfaces that would go to **different** agents. All four must hold to split them:

1. **Blast-radius-1 each** — `npm run template-map` confirms neither edit changes a shared template's default output in a way that touches the other (or other pages).
2. **No shared pin runway** between them (one's pin track doesn't span into the other).
3. **No continuous color field** across their seam (e.g. a dark band that flows unbroken from one into the next — VBEC walnut continuous with LifetimeReel is the canonical example).
4. **No motion handoff** — one section's exit choreography does not feed the next's entry.

If ANY fails between two surfaces → they go to **one** agent, not two. The gate runs at **section level** (within a page) and **page level** (where **shared templates** are the usual cross-page coupling). Its result is reported in the WS1 plan-summary. The gate is the single rule that keeps parallelism from breaking coherence; everything in WS1/WS3/WS4 depends on it.

Success: orchestration.md states the four-part predicate, both scopes (section + page), and that a failure forces grouping; the plan-summary shows the gate's grouping decision with reasons.

## Workstream 3 — Coordinator briefing template (multi-page)

Multi-page fan-out spawns page-coordinators. By the agent-scope decision a coordinator is **not** a new agent (its payload — the page work order — is volatile); it's a **documented briefing template** in process.md, sibling to the auditor briefing template + the 9-item checklist. Every spawned coordinator:

- **First action:** self-invoke the `website-design` skill (inherits nothing).
- Receives its page's **full work order + execution shape**.
- Runs the **independence gate** on its sections; spawns section builders, **passing the 9-item checklist down verbatim**.
- **Inherits the session model**; commits **by explicit path**; runs its page's **integration pass** (WS4); **returns the integration result up** to the top coordinator.
- **Nesting capped at one level** — a page-coordinator does NOT spawn further coordinators.

Success: process.md carries a coordinator briefing template; a spawned coordinator has an unambiguous contract for what it loads, propagates, commits, and returns; the "what do nested orchestrators use" gap is closed without minting an agent.

## Workstream 4 — Motion-aware integration pass (mandatory after fan-out)

Whenever fan-out happens, a fresh agent judges the **whole page** (or site) as one object. Implemented as a new **`scope: integration`** value on the existing `design-auditor` (reuse, don't reinvent — it already takes `scope: delta|full-section`).

`scope: integration` judges, across section boundaries:
- **Seams** — padding/rhythm consistency at each width.
- **Color continuity** — continuous fields read unbroken across boundaries.
- **Motion handoffs** — one section's exit choreography into the next's entry.
- **Whole-page motion pacing** — does motion feel evenly distributed across the full runway, or clumped; did one section's pin-runway length throw off the page's scroll feel.

Mechanics:
- The integration judge MUST do a **full-runway stepped scroll-walk** (not a rest-shot glance) — it walks the entire page top-to-bottom in increments, per the verification.md scroll-walk protocol, across the in-scope viewport classes.
- **Engine-agnostic numeric check (folded in from research):** **adjacent-frame continuity diffing** (odiff, a fast SIMD pixelmatch-compatible diff) over the stepped-walk frames encodes the two hardest motion rules as numbers: (a) **perceptible where the effect lives** — consecutive frames must differ in the effect's region; (b) **continuous across the runway, no early finish** — the per-step delta stays non-zero across the whole approach and doesn't flatline early. This works on screenshots regardless of the motion engine, so it ships now (the deterministic `getAnimations()` probe waits for Spec 2's engine adoption).
- A small helper (`scripts/motion-continuity.mjs`) wraps odiff for adjacent-frame + region deltas; it composes with the existing mechanical capture harness. **odiff is a new dev dependency** (the plan installs it; chosen over pixelmatch for SIMD speed across the frame matrix).
- The integration pass is added to the **page-level finish criteria**: a fan-out page is not "done" until its integration pass is clean.

Eval: `scope: integration` inherits the existing eval's canon-load guarantee (the agent still self-loads). A deeper integration-specific eval (cross-section fixtures) is **deferred** — noted as future work, not built now (keeping the eval honest rather than fabricating cross-section golden cases pre-emptively).

Success: `design-auditor` accepts `scope: integration`; orchestration.md + verification.md define the full-runway walk + the odiff continuity/perceptibility check; finish criteria require a clean integration pass after fan-out.

## Workstream 5 — Micro-commit carry-over (small)

Already enforced (process.md micro-commit discipline + section-loop step 5 + checklist item 8). The only addition: the fan-out section of orchestration.md **reiterates** that each builder commits its OWN section **by explicit path** — never `git add -A` — because fan-out means many concurrent committers on the shared worktree (the CWC sweep lesson). One paragraph; no mechanism change.

## Workstream 6 — Async-pattern consistency note

A one-paragraph note (orchestration.md) that fan-out, pipelined audits, and async image generation (imagery.md HARD RULE, shipped) are **the same pattern**: spawn the slow work, keep building, reconcile on return. Cross-reference so the three are recognized as one discipline, not three rules.

## Where it lands (files)

| File | Change |
|---|---|
| `.claude/skills/website-design/references/orchestration.md` | **NEW** — execution-shape model + decision tree (WS1), independence gate (WS2), coordinator briefing template (WS3), integration-pass definition (WS4), fan-out micro-commit reminder (WS5), async-pattern note (WS6). Loaded on demand for fan-out/multi-page work (progressive disclosure — keeps process.md lean). |
| `.claude/skills/website-design/references/process.md` | Work-order pre-flight gains the **execution-shape axis** (short, points to orchestration.md) + the full-page plan-summary stop-gate; finish criteria require a clean integration pass after fan-out. |
| `.claude/agents/design-auditor.md` | Add **`scope: integration`** to the contract (whole-page seams/color/motion-handoffs/pacing; full-runway walk). |
| `.claude/skills/website-design/references/verification.md` | Document the **adjacent-frame continuity/perceptibility** check (odiff) + the integration full-runway walk. |
| `.claude/skills/website-design/scripts/motion-continuity.mjs` | **NEW** (small) — odiff wrapper for adjacent-frame + region deltas over a stepped-walk frame sequence. |
| `.claude/skills/website-design/SKILL.md` | File-map row for orchestration.md. |
| `docs/superpowers/specs/PARKING-LOT-orchestration.md` | Update: mark items absorbed; record Spec 2 inputs (research top-3). |

## Sequencing & independence

Doc-first, same shape as the tier-calibration that shipped. Order: WS1+WS2 (the model + the gate, one orchestration.md) → WS3 (coordinator template) → WS4 (auditor `scope: integration` + verification + the odiff helper) → WS5/WS6 (small notes) → SKILL.md row. WS4's odiff helper is the only code; everything else is documentation + one agent-contract line. Each workstream is independently committable.

## Success criteria (whole spec)

- The work order has an execution-shape axis; full-page/multi-page asks produce a plan-summary and halt for approval (with shape override); single-section asks proceed unchanged.
- The independence gate is a stated four-part predicate at section + page scope; the plan-summary shows its grouping decision.
- A coordinator has a documented briefing contract (self-load, propagate checklist, explicit-path commit, return integration result, one-level nesting).
- `design-auditor` accepts `scope: integration`; the integration pass is mandatory after fan-out, does a full-runway walk, and uses the odiff continuity/perceptibility check; it's in the finish criteria.
- Micro-commit-per-section + explicit-path staging are reiterated for fan-out.
- The odiff helper exists and composes with the capture harness.
- Everything committed by explicit path, pushed; no other agent's work touched.

## Risks & mitigations

- **Parallel committers collide.** → Explicit-path staging is mandatory and reiterated (WS5); each builder owns exactly its section's paths.
- **Integration pass is hand-wavy / not real.** → The full-runway walk + odiff numeric continuity/perceptibility check give it teeth; it's in the finish criteria, not optional.
- **"Motion-aware" still misses cross-section feel.** → The gate forbids splitting handoff-coupled sections in the first place; the integration pass catches what slips. Two layers.
- **Coordinator drift in multi-page.** → Self-load + verbatim checklist propagation + one-level nesting cap; the integration pass per page is the backstop.
- **Scope creep into the motion engine.** → Hard non-goal; engine + `getAnimations()` + tokens + rubric grader are Spec 2. This spec uses only engine-agnostic verification (odiff).
- **process.md bloat.** → The model lives in a new orchestration.md (progressive disclosure); process.md gets only the axis stub + gate + finish clause.

## Follow-on (Spec 2 — motion authoring + deterministic verification + grading)

Captured from the 2026-06-13 research (full report in session transcript; top-3 below). Its own brainstorm → spec → plan, ideally after fan-out has run on a real page:
1. **`getAnimations()` progress probing** — deterministic `progress === 1.000`-at-anchor assertion (replaces eyeballing); coupled to #2.
2. **Motion (motion.dev) as default scroll engine** — `useScroll` `offset: ["start end","end start"]` IS our anchor language; WAAPI-backed (unlocks #1); `useReducedMotion` free degrade; zero aesthetic imposition. GSAP (now free) reserved for flagship pins; CSS scroll-driven for the cheap reveal tier.
3. **VLM rubric grader** — extend `design-auditor` into a scored "expensive-ness" signal (hierarchy/spacing/brand-adherence with justification), keeping the boolean verdict load-bearing.
   Plus: Style Dictionary (token single-source), Theatre.js (committed JSON timelines) — evaluate, likely defer.

## Decision log

- v1 includes **multi-page fan-out** (logan, 2026-06-13). [agreed]
- Full-page gate = **plan-summary for approval** with shape override, not an explicit menu-pick (logan, 2026-06-13). [agreed]
- Scope boundary: orchestration + **engine-agnostic** motion verification now; motion-engine + deterministic probing + tokens + rubric grader = **Spec 2** (logan approved two-spec split). [agreed]
- Coordinator = **briefing template, not an agent**; integration judge = **`scope: integration` on the existing auditor**, not a new agent (consistent with the recorded agent-scope decision). [derived]
- Per-section isolation routes **rejected**; convergent probing + per-section CSS suffice. [decided 2026-06-13]
