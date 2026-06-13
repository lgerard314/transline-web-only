# Orchestration — execution shapes, the independence gate, the integration pass

Load this when a build/redesign touches MORE THAN ONE section (a full page or multiple pages). A single section uses the process.md section loop directly — no orchestration. This file governs how work fans out across agents and how it converges back into one coherent page.

## The execution-shape axis (6th work-order axis)

Execution shape is DERIVED, not asked: `shape = f(surface count, independence, depth)`. State it in the work order like the other axes.

Three shapes:
- **Solo loop** (default) — the coordinator IS the builder, running the process.md section loop in order. Use for: one surface; a page whose sections are coupled (gate below); or any "go slow" request.
- **Single-page section fan-out + integration** — one builder per INDEPENDENT section, then a mandatory integration pass. The workhorse for page builds.
- **Multi-page fan-out** — one page-coordinator per page, each recursing into single-page fan-out. One-level nesting only.

**Pipelined audits** are an optimization WITHIN fan-out, not a shape: a section's audit may run as a background agent while you build ahead — but ONLY across sections the gate cleared as independent (a late audit-fix to §N must not re-open §N+1). Never pipeline audits across coupled surfaces.

Decision tree:
- 1 surface → solo.
- N sections, gate passes for all → fan-out + integration.
- N sections, gate fails between some → group the coupled ones to one agent, parallelize the rest, + integration.
- N pages → multi-page fan-out (each page recurses).
- "go slow" / explicit override (`solo` / `fan-out` / `multi-page`) → honor it.

## Budget the motion mix ONCE, up front

Before fan-out, the coordinator budgets the page's motion mix (motion.md: mediums = backbone, smalls everywhere, larges rare and deliberate) and assigns EACH builder its motion class. Builders never each independently pick a LARGE. Whole-page pacing is a global property the pairwise gate below cannot see — making it a single up-front decision is what prevents two heavy pins landing back-to-back. The integration pass later VERIFIES the budget held; it does not get to discover clumping after the parallel work is already spent.

## The full-page / multi-page stop-gate

A single section: state the reading, proceed. A full page or multiple pages: present ONE plan-summary and WAIT for logan's go before spawning anything —
- the work order (surfaces, depth, viewport classes, media/copy, stop point),
- the section lineup,
- the chosen execution shape + one-line why,
- the independence-gate result (which surfaces grouped, why),
- the motion budget (per-section motion class),
- the commit plan.

logan approves, edits, or overrides the shape by name. This gate is non-negotiable for page-scale work — it touches too much and fan-out spawns many agents.

## The independence gate (the safety rail)

Two surfaces go to DIFFERENT agents only if ALL FOUR hold. If any fails, they go to ONE agent.

1. **Blast-radius-1 each (app-aware).**
   - miller-web (template-first): `npm run template-map` (run in `apps/miller-web`) confirms neither edit changes a shared template's default output touching the other surface or other pages.
   - transline49-web (bespoke — NO template-map): grep both surfaces' edits for shared `tl-*` selector prefixes and shared design tokens; blast-radius-1 holds only if neither touches a shared `tl-*` selector/token the other renders.
2. **No shared pin runway** between them.
3. **No continuous color field** across their seam (e.g. an unbroken dark band — VBEC walnut continuous with LifetimeReel).
4. **No motion handoff** — one's exit choreography doesn't feed the other's entry.

If ANY fails between two surfaces → they go to ONE agent, not two. Run the gate at SECTION level (within a page) and PAGE level (shared templates / the shared `brand` package are the cross-page coupling). Report the grouping in the plan-summary.

LIMIT: the gate is pairwise/local. Whole-page motion PACING is global and the gate cannot catch it — that is handled up front by the motion budget above, not here. The gate prevents coupled splits; the motion budget prevents clumped pacing; the integration pass catches what slips. Three layers.

## Fan-out: every builder micro-commits its OWN section by EXPLICIT PATH

In fan-out, many agents commit to the shared worktree at once. Each builder stages ONLY its section's paths (`git add <explicit paths>`) and commits its own section — NEVER `git add -A` (it sweeps other agents' in-flight files; this has bitten us before). Commit ownership is the builder's; the coordinator does not also commit those files (checklist item 8, process.md).

## Coordinator briefing template (multi-page)

A spawned page-coordinator is a BRIEFING, not an agent (its payload — the page work order — is volatile; per the agent-scope decision in process.md). Brief every page-coordinator with:
- **First action:** invoke the `website-design` skill via the Skill tool (it inherits nothing).
- **Given:** its page's full work order + execution shape + motion budget.
- **Does:** run the independence gate on its sections; spawn one builder per independent section, passing the 9-item subagent briefing checklist (process.md) DOWN VERBATIM and handing each its assigned motion class; inherit the session model; commit by explicit path; run its page's integration pass.
- **Returns UP:** a COMPACT result — integration verdict + finding list, NOT transcripts (keep the top coordinator's context scarce).
- **Nesting:** ONE level only — a page-coordinator does NOT spawn further coordinators.

Failure handling:
- **A section builder fails / returns broken:** do NOT run integration on a knowingly-incomplete page. Report the failed section up and halt that page. Committed sections stand; revert nothing.
- **Integration returns blockers:** the page-coordinator fixes the boundary itself (it owns the seam; no single builder does) and re-walks. A seam fix that re-couples two sections is fine — they were one page's concern.
- **Top coordinator:** collects per-page compact verdicts, HALTS the spawn wave on any page blocker (don't fan the next pages into a known-broken state), returns an aggregated report. No cross-PAGE integration walk — pages are independent routes.

## The integration pass (mandatory after any fan-out)

A FRESH agent judges the whole page as one object. It is the `design-auditor` with `scope: integration` (NOT a new agent). A fan-out page is NOT done until its integration pass is clean (finish criteria, process.md).

Brief it with: the page route; the ORDERED section list; the continuous-field + motion-handoff map (which boundaries carry a continuous color field or a handoff); the in-scope viewport classes; and the motion budget (so it can verify the budget held).

It does its OWN full-runway stepped scroll-walk into `.scratch/` (a fanned-out page is in-progress by definition — verification.md in-progress capture rules; NOT capture-home.mjs, which is home-only; NOT element shots), READS every frame, and judges ACROSS boundaries:
- seams (padding/rhythm at each width),
- color continuity (continuous fields read unbroken),
- motion handoffs (one section's exit into the next's entry),
- whole-page pacing (budget honored — no clumped larges, motion evenly distributed).

Motion is judged BY EYE on the walked frames. (Deterministic numeric motion verification is a separate initiative — it needs the motion engine.) Findings are keyed to BOUNDARIES (`between §N and §N+1`) or page-global, not file:line.

## One pattern: spawn, keep building, reconcile

Fan-out, pipelined audits, and async image generation (imagery.md HARD RULE) are the SAME discipline: spawn the slow work into a subagent, keep building, reconcile when it returns. Never sit and block on slow work — parallelize it and continue.
