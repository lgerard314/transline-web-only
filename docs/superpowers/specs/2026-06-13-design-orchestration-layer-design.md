# Spec — Design-workflow orchestration layer (execution shapes, independence gate, motion-aware integration)

**Status:** finalized post spec-audit (adversarial Opus audit folded in; verdict was REWORK → all 4 blockers + 4 concerns + 3 nits applied, see Decision log). Awaiting logan's ratification before the plan.
**Date:** 2026-06-13
**Owner:** logan (ratifies)
**Predecessors:** builds on the design-governance stack — the `website-design` skill, the scope ladder + tier-gated section loop, the `design-auditor` agent + eval, the mechanical capture harness, the async-image HARD RULE (shipped `3b2ef3a`). Parking-lot source: `docs/superpowers/specs/PARKING-LOT-orchestration.md`.

## Problem

The section loop is single-agent and serial. For a full page (or several pages) that wastes wall-clock on independent section craft, accumulates one agent's context across the whole page, and gives the coordinator no structured way to fan work out safely. The risk that has kept us serial is **cross-section coherence**: parallel agents editing one page can ship sections that are individually great and collectively broken (seams, color continuity, and especially **motion handoffs** between sections, plus whole-page motion *pacing*). We now have the pieces to parallelize safely — a reusable auditor, per-section convergent probing, per-section CSS files — but no governing decision logic, no safety rail, and no convergence step that owns the whole-page bar.

Separately, four concrete gaps surfaced in design discussion: (1) spawned multi-page coordinators have no defined contract; (2) full-page jobs touch so much that they warrant a pre-execution stop-gate; (3) micro-commit-per-section must survive fan-out (parallel committers must not sweep each other); (4) motion is well-covered *within* a section but not *across* sections once work is split.

## Goals

1. Add **execution shape** as a derived, stated (and for big jobs, gated) axis of the work order — so the engine picks the right fan-out shape and the user keeps veto + override.
2. Make parallelism **safe by construction** via a checkable **independence gate** that decides what can go to different agents, plus a **motion budget decided once, up front** by the coordinator (pacing is a global property the pairwise gate cannot catch).
3. Define the **coordinator briefing template** so multi-page fan-out has a real contract (not a new agent — a documented briefing, per the agent-scope decision), including failure handling and aggregation.
4. Make the **integration pass mandatory after any fan-out** and **motion-aware** — a fresh judge does a full-runway scroll-walk and judges seams, color continuity, motion handoffs, and whole-page pacing — and ship it with its own **behavioral eval** (a new judgment scope without an eval is a rubber-stamp hole).
5. Carry **micro-commit-per-section** cleanly into fan-out (explicit-path staging).

## Non-goals

- **No motion-engine adoption** (Motion.dev / GSAP / CSS scroll-driven), **no `getAnimations()` deterministic probing**, and **no numeric motion-continuity check (odiff/SSIM)** — those change how every section is built and/or are coupled to the engine, and a screenshot-delta continuity check is flaky-by-construction against ambient/continuous devices (the rotating affiliates banner) without a region contract the engine would provide. They are **Spec 2** (see "Follow-on"). This spec's integration pass is motion-aware via **walk + judgment**, not a numeric probe.
- **No Style Dictionary / Theatre.js / VLM rubric grader** — Spec 2.
- **No new agent types.** The coordinator is a briefing; the integration judge is a new `scope` value on the existing `design-auditor`. (Per the recorded agent-scope decision: auditor yes; builder/scope/capture no.)
- **No per-section isolation preview routes** (rejected 2026-06-13).
- **No nesting deeper than one level** (top coordinator → page-coordinators → section-builders).
- **No new runtime dependency** (the odiff cut removes the only one this spec would have added).

## Constraints (carried from repo operating rules)

- Repo-local only; everything under the repo's `.claude/`.
- **Two apps, different build models:** `apps/miller-web` is template-first (`npm run template-map` exists); `apps/transline49-web` is bespoke (NO template library, NO `template-map`). Any rule that references templates MUST give the TL49 path too.
- Shared worktree, parallel agents → **stage by explicit path, never `git add -A`** (the CWC sweep lesson — load-bearing here, since fan-out means many concurrent committers).
- **Subagents inherit nothing** — every spawned agent self-invokes the skill or is handed the rules; the 9-item checklist passes DOWN VERBATIM at every layer.
- **Model rule (checklist item 9):** judgment roles (builders, coordinators, the integration auditor) inherit the session model; mechanical roles (camera operators, image-gen subagents) may run sonnet.
- Micro-commit per section; conventional commits; CRLF warnings benign.
- One shared dev server; each agent owns its own fresh headless browser per run; never start/kill/restart the server or edit `next.config.*`.

## Workstream 1 — Execution-shape axis + decision tree

The execution shape is the **6th work-order axis**, derived not asked:

> execution shape = f(surface count, independence (WS2), depth)

**The three shapes** (pipelined audits is an *optimization within* fan-out, not a co-equal shape — see below):
- **Solo loop** *(today's default)* — the coordinator IS the builder. For: 1 surface; a page whose sections are tightly coupled; or any "go slow" request.
- **Single-page section fan-out + integration** — one builder per independent section, then a mandatory motion-aware integration pass (WS4). The workhorse for page builds.
- **Multi-page fan-out** — one page-coordinator per page (WS3), each recursing into single-page fan-out. Independence gate applied at page level; nesting capped at one level.

**Pipelined audits (optimization within fan-out):** a section's audit may run as a background agent while the builder moves ahead (already half-sanctioned in process.md). It is permitted ONLY for sections the independence gate cleared as mutually independent, because a late audit-fix to section N must not re-open N+1. The coordinator does not attempt to detect runtime re-coupling; it simply does not pipeline audits across surfaces the gate coupled. Not a separate shape, not separately gated — a build-ahead detail of fan-out.

**Decision tree (documented in orchestration.md):**
- 1 surface, any depth → **solo**.
- N sections, independence gate PASSES for all → **fan-out + integration**.
- N sections, gate FAILS between some → **group the coupled ones to one agent, parallelize the rest** + integration.
- N pages → **multi-page fan-out** (each page recurses through the above).
- "go slow" / explicit override → **solo** regardless.

**Motion budget decided ONCE, up front (WS1+WS2 seam):** before any fan-out, the coordinator budgets the page's motion mix per process.md (mediums = backbone, smalls everywhere, larges rare/deliberate) and **assigns each section builder its motion class**. Builders do NOT each independently choose a LARGE. This makes whole-page pacing a coordinator decision (deterministic, pushed up) rather than an emergent property the integration pass discovers after the parallel work is already spent. The integration pass then *verifies the budget was honored* rather than discovering clumping late.

**Gating (per logan's decision — plan-summary for approval):**
- **Single section** → state the reading, **proceed** (no gate).
- **Full-page / multi-page** → present ONE **plan-summary** and **WAIT for go** before spawning anything: work order + section lineup + chosen execution shape (+ one-line why) + the independence-gate result (which surfaces grouped, why) + **the motion budget (per-section motion class)** + the commit plan. logan approves, edits, or **overrides the shape by naming it** (`solo` / `fan-out` / `multi-page`).

Success: a reader and the engine can determine which shape applies and whether a stop-gate fires; full-page asks produce a plan-summary (with motion budget) and halt; single-section asks flow without friction.

## Workstream 2 — The independence gate (the safety rail)

A checkable predicate evaluated between any two surfaces that would go to **different** agents. All four must hold to split them:

1. **Blast-radius-1 each — app-aware.** On **template-first apps (miller-web):** `npm run template-map` confirms neither edit changes a shared template's default output touching the other surface or other pages. On **bespoke apps (TL49):** there is no `template-map`; instead grep the surfaces' edits for shared selector prefixes (`tl-*`) and shared design tokens — if neither touches a shared `tl-*` selector/token that the other renders, blast-radius-1 holds. (TL49 is explicitly not on templates per CLAUDE.md.)
2. **No shared pin runway** between them (one's pin track doesn't span into the other).
3. **No continuous color field** across their seam (e.g. a dark band flowing unbroken from one into the next — VBEC walnut continuous with LifetimeReel is the canonical example).
4. **No motion handoff** — one section's exit choreography does not feed the next's entry.

If ANY fails between two surfaces → they go to **one** agent, not two. The gate runs at **section level** (within a page) and **page level** (shared templates / a shared `brand` package are the usual cross-page coupling). Its result is reported in the WS1 plan-summary.

**Known limit (handled elsewhere, stated here):** the gate is pairwise/local; **whole-page motion pacing is global** and the gate structurally cannot catch it — that is exactly why WS1 makes the motion budget a single up-front coordinator decision. The gate prevents *coupled* splits; the motion budget prevents *clumped* pacing; the integration pass catches what slips. Three layers.

Success: orchestration.md states the four-part predicate with BOTH app paths, both scopes (section + page), the grouping consequence, and the explicit pacing limit + its up-front-budget mitigation.

## Workstream 3 — Coordinator briefing template (multi-page)

Multi-page fan-out spawns page-coordinators. By the agent-scope decision a coordinator is **not** a new agent (its payload — the page work order — is volatile); it's a **documented briefing template** in process.md, sibling to the auditor briefing template + the 9-item checklist. Every spawned coordinator:

- **First action:** self-invoke the `website-design` skill (inherits nothing).
- Receives its page's **full work order + execution shape + motion budget**.
- Runs the **independence gate** on its sections; spawns section builders, **passing the 9-item checklist down verbatim** and handing each its assigned **motion class**.
- **Inherits the session model**; commits **by explicit path**; runs its page's **integration pass** (WS4).
- **Returns up a COMPACT result** — an integration verdict + finding list (not transcripts) — so the top coordinator's context stays scarce.
- **Nesting capped at one level** — a page-coordinator does NOT spawn further coordinators.

**Failure & aggregation handling (in the template):**
- **Partial section failure:** if a section builder fails or returns a broken section, the page-coordinator does NOT run the integration pass on a knowingly-incomplete page — it reports the failed section up and halts that page (the other sections' committed work stands; nothing is reverted).
- **Integration-fail:** if the page's integration pass returns blockers, the page-coordinator applies the boundary fixes itself (it owns the cross-section seam, which no single builder does) and re-walks; a seam fix that re-couples two sections is expected and fine (they were already one page's concern).
- **Top-coordinator aggregation:** the top coordinator collects per-page compact verdicts, **halts the spawn wave on any page blocker** (does not fan out the next pages into a known-broken state), and returns an aggregated report. A cross-PAGE integration pass is NOT in scope (pages are independent routes); aggregation is verdict collection, not a site-wide walk.

Success: a spawned coordinator has an unambiguous contract for what it loads, propagates, commits, returns, and does on failure; token use is bounded by compact returns + halt-on-blocker; the "what do nested orchestrators use" gap is closed without minting an agent.

## Workstream 4 — Motion-aware integration pass (mandatory after fan-out) + its eval

Whenever fan-out happens, a fresh agent judges the **whole page** as one object. Implemented as a new **`scope: integration`** value on the existing `design-auditor` (reuse, don't reinvent — per the agent-scope decision).

**`scope: integration` is a second input/return contract on the agent (not a one-line enum add):**
- **Added inputs:** the page route; the **ordered section list** (not one selector); the **continuous-field + motion-handoff map** (which boundaries carry a continuous color field or a motion handoff); the in-scope viewport classes; the **motion budget** (so it can verify the budget was honored). The existing `delta`/`full-section` "don't re-litigate unchanged geometry" rule does NOT apply — `integration` judges relationships *between* sections.
- **What it judges, across boundaries:** seams (padding/rhythm at each width); color continuity (continuous fields read unbroken); motion handoffs (one section's exit into the next's entry); whole-page motion pacing (was the budget honored — no clumped larges; motion evenly distributed).
- **Return shape:** findings keyed to **boundaries** (`between §N and §N+1`) or page-global, not file:line; verdict PASS | ISSUES with severities, echoing the scope judged.

**Frame source (corrects the audit's B4):** the integration agent does its OWN full-runway **stepped scroll-walk** into `.scratch/` (per verification.md's in-progress-capture rules — a page being built/fanned-out is in-progress by definition). It does NOT use `capture-home.mjs` (home-only). It walks the entire page top-to-bottom in increments across the in-scope viewport classes and READS every frame. Motion is judged BY EYE on the walked frames (the honest method; deterministic numeric motion verification waits for Spec 2's `getAnimations()`).

**The eval (gates `scope: integration`'s "done" — a NEW judgment scope must not ship evalless):**
- **`good-integration`:** feed the agent the **ordered list of real approved home shots** (e.g. the consecutive `references/approved/home/desktop/` section shots) and the section list → must verdict PASS / no blocker.
- **`broken-integration`:** the same ordered list with ONE shot replaced by a **seam-broken render** generated mechanically (a Playwright generator à la `make-broken-fixture.mjs` that recolors one section's background to break a continuous color field — e.g. VBEC's walnut → cream, breaking continuity with LifetimeReel — or injects a flagrant padding jump at a boundary) → must verdict ISSUES + a blocker citing seam/continuity.
- **Rubber-stamp regression:** the existing always-PASS stub must make `broken-integration` FAIL (reuse `run.mjs`'s `EVAL_SYSPROMPT` seam + case loop; add the two integration cases feeding `scope: integration`).
- Committed fixtures are reference data (exception like `approved/`).

The integration pass is added to the **page-level finish criteria**: a fan-out page is not "done" until its integration pass is clean.

Success: `design-auditor` accepts `scope: integration` with its added input/return contract; orchestration.md + verification.md define the full-runway `.scratch` walk + eye-judgment; the 2-case integration eval (plus rubber-stamp regression) passes; finish criteria require a clean integration pass after fan-out.

## Workstream 5 — Micro-commit carry-over (small)

Already enforced (process.md micro-commit discipline + section-loop step 5 + checklist item 8). The only addition: the fan-out section of orchestration.md **reiterates** that each builder commits its OWN section **by explicit path** — never `git add -A` — because fan-out means many concurrent committers on the shared worktree (the CWC sweep lesson). One paragraph; no mechanism change.

## Workstream 6 — Async-pattern consistency note

A one-paragraph note (orchestration.md) that fan-out, pipelined audits, and async image generation (imagery.md HARD RULE) are **the same pattern**: spawn the slow work, keep building, reconcile on return. Cross-reference so the three are recognized as one discipline.

## Where it lands (files)

| File | Change |
|---|---|
| `.claude/skills/website-design/references/orchestration.md` | **NEW** — execution-shape model + decision tree + motion-budget-up-front (WS1), independence gate with both app paths + pacing limit (WS2), coordinator briefing template + failure/aggregation (WS3), integration-pass definition + frame source (WS4), fan-out micro-commit reminder (WS5), async-pattern note (WS6). Loaded on demand (progressive disclosure). |
| `.claude/skills/website-design/references/process.md` | Work-order pre-flight gains the **execution-shape axis** (short, points to orchestration.md) + the full-page plan-summary stop-gate (incl. motion budget); finish criteria require a clean integration pass after fan-out. |
| `.claude/agents/design-auditor.md` | Add **`scope: integration`** with its added input + boundary-keyed return contract. |
| `.claude/skills/website-design/references/verification.md` | Document the integration full-runway `.scratch` walk + eye-judgment of handoffs/pacing. (No numeric/odiff check — that's Spec 2.) |
| `.claude/skills/website-design/scripts/eval/make-broken-integration-fixture.mjs` | **NEW** — Playwright generator: seam-broken render (recolor one section bg / padding jump). |
| `.claude/skills/website-design/scripts/eval/run.mjs` | Extend: two `scope: integration` cases (good-integration / broken-integration) + rubber-stamp regression. |
| `.claude/skills/website-design/scripts/eval/fixtures/` | **NEW** committed: the broken-integration render (good uses existing approved shots by path). |
| `.claude/skills/website-design/SKILL.md` | File-map row for orchestration.md. |
| `docs/superpowers/specs/PARKING-LOT-orchestration.md` | Update ledger: items absorbed; record Spec 2 inputs; explicitly defer the SubagentStop finish-reminder hook. |

## Sequencing & independence

Doc-first. Order: WS1+WS2 (model + gate + motion budget, one orchestration.md) → WS3 (coordinator template) → WS4 (auditor `scope: integration` + verification doc + the integration eval — the only code) → WS5/WS6 (small notes) → SKILL.md row → parking-lot ledger. WS4's eval is the single code deliverable; everything else is documentation + one agent-contract extension. Each workstream is independently committable. WS4 depends on the existing eval harness (extends `run.mjs`).

## Success criteria (whole spec)

- The work order has an execution-shape axis; full-page/multi-page asks produce a plan-summary (with motion budget) and halt for approval (with shape override); single-section asks proceed unchanged.
- The independence gate is a stated four-part predicate with BOTH app paths (miller `template-map`; TL49 shared-`tl-*` grep), at section + page scope; the pacing limit + up-front motion budget are stated.
- A coordinator has a documented briefing contract incl. failure/partial-failure/aggregation and compact returns; one-level nesting.
- `design-auditor` accepts `scope: integration` with its added input/return contract; the integration pass is mandatory after fan-out, does a full-runway `.scratch` walk, is in the finish criteria.
- The 2-case integration eval passes (good-integration PASS, broken-integration ISSUES+blocker) and the always-PASS stub fails broken-integration.
- Micro-commit-per-section + explicit-path staging are reiterated for fan-out.
- No new runtime dependency added.
- Everything committed by explicit path, pushed; no other agent's work touched.

## Risks & mitigations

- **Parallel committers collide.** → Explicit-path staging mandatory + reiterated (WS5); each builder owns exactly its section's paths.
- **Integration judge rubber-stamps (the new-scope hole).** → It ships with a 2-case behavioral eval + rubber-stamp regression (WS4); not deferred.
- **Whole-page motion pacing clumps despite the gate.** → Motion budget decided once, up front by the coordinator (WS1), so pacing is a deterministic decision, not an emergent discovery; integration pass verifies the budget held.
- **"Motion-aware" via eye-judgment isn't deterministic.** → Accepted for this spec; honest (the auditor judges pixels). Deterministic numeric motion verification is Spec 2's `getAnimations()`, which is real (engine-coupled) rather than the flaky screenshot-delta this spec deliberately cut.
- **Coordinator drift / context burn in multi-page.** → Self-load + verbatim checklist propagation + one-level nesting + compact returns + halt-on-blocker (WS3).
- **Scope creep into the motion engine.** → Hard non-goal; engine + `getAnimations()` + tokens + rubric grader + numeric motion checks are Spec 2.
- **process.md bloat.** → The model lives in a new orchestration.md (progressive disclosure); process.md gets only the axis stub + gate + finish clause.

## Follow-on (Spec 2 — motion authoring + deterministic verification + grading)

Captured from the 2026-06-13 research (full report in session transcript; top-3 below). Its own brainstorm → spec → plan, ideally after fan-out has run on a real page:
1. **`getAnimations()` progress probing** — deterministic `progress === 1.000`-at-anchor assertion; coupled to #2. (The real, non-flaky version of the motion-continuity check cut from this spec.)
2. **Motion (motion.dev) as default scroll engine** — `useScroll` `offset: ["start end","end start"]` IS our anchor language; WAAPI-backed (unlocks #1); `useReducedMotion` free degrade; zero aesthetic imposition. GSAP (now free) reserved for flagship pins; CSS scroll-driven for the cheap reveal tier.
3. **VLM rubric grader** — extend `design-auditor` into a scored "expensive-ness" signal, keeping the boolean verdict load-bearing.
   Plus: Style Dictionary (token single-source), Theatre.js (committed JSON timelines), and a numeric motion-perceptibility check **with a real region contract** (which the motion engine provides) — evaluate, likely the engine makes odiff unnecessary.

## Decision log

- v1 includes **multi-page fan-out** (logan, 2026-06-13). [agreed]
- Full-page gate = **plan-summary for approval** with shape override (logan, 2026-06-13). [agreed]
- Scope boundary: orchestration + walk-and-judge motion verification now; motion-engine + deterministic probing + tokens + rubric grader = **Spec 2** (logan approved two-spec split). [agreed]
- Coordinator = **briefing template, not an agent**; integration judge = **`scope: integration` on the existing auditor** (consistent with the recorded agent-scope decision). [derived]
- Per-section isolation routes **rejected**. [decided 2026-06-13]
- **Spec-audit (adversarial Opus) corrections [applied]:**
  - **B1** gate part 1 is **app-aware** (TL49 has no `template-map` → shared-`tl-*` grep path).
  - **B2** `scope: integration` ships **with a 2-case behavioral eval** + rubber-stamp regression (was: canon-load guarantee only — a rubber-stamp hole).
  - **B3** the **odiff numeric continuity check is CUT** (flaky against ambient motion, no region contract); integration motion is judged by **walk + eye**; deterministic numeric → Spec 2.
  - **B4** integration frames come from the agent's **own `.scratch` stepped-walk**, not the home-only `capture-home.mjs`.
  - **C1** `scope: integration` gets an **explicit added input + boundary-keyed return contract** (it is a second contract, not a one-line enum).
  - **C2** coordinator template gains **failure/partial-failure/aggregation + compact-return** clauses.
  - **C3** the coordinator **budgets the page's motion mix once, up front** (pacing is global; the pairwise gate can't catch it).
  - **N1** the **SubagentStop finish-reminder hook is explicitly DEFERRED** (parking-lot ledger), not absorbed here.
  - **N3** pipelined audits **demoted** from a co-equal shape to an optimization within fan-out.
  - Net effect: removed the only new runtime dependency + the flaky check; added the integration eval (the right code). Spine unchanged.
