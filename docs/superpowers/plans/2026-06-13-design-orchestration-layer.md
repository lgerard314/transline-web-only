# Design-workflow orchestration layer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a derived execution-shape axis + a full-page stop-gate, a checkable independence gate, a coordinator briefing template, and a motion-aware integration pass (with its own eval) to the website-design governance stack — so page/multi-page builds can fan out safely and converge coherently.

**Architecture:** Doc-first, mirroring the tier-calibration change that shipped. Phase A is pure documentation (a new `orchestration.md` reference + small `process.md`/`SKILL.md` edits). Phase B is the only code: it extends the existing `design-auditor` with a `scope: integration` contract and ships a two-case behavioral eval for it (reusing the existing `scripts/eval/run.mjs` harness — TDD: fixtures + RED before the agent contract, GREEN after, plus the rubber-stamp regression). Phase C updates the parking-lot ledger and pushes.

**Tech Stack:** Markdown (skill reference files), one agent `.md` definition, Node + Playwright + the existing `claude -p` eval harness. No new runtime dependency (the spec's odiff helper was cut by the spec-audit).

**Spec:** `docs/superpowers/specs/2026-06-13-design-orchestration-layer-design.md` (finalized post-audit).

**Operating constraints (every task):** shared worktree with parallel agents → **stage by explicit path, never `git add -A`**; repo-local only; CRLF warnings expected; conventional-commit messages; do not touch another agent's files (untracked CWC / Docker / apprunner files live in this tree — leave them). **Shell snippets are bash** (run via the Bash tool). Phase B's fixture generator + eval need the **miller-web dev server on :3001** (`npm run dev:miller`) — never start/kill/restart it if it's already up.

**process.md edit note:** Phase A edits `process.md` in two spots (the work-order pre-flight + the finish criteria) and `orchestration.md` (new). Land Phase A as one uninterrupted sequence to minimize the conflict window in the shared worktree.

---

## File Structure

| File | Phase | Responsibility / change |
|---|---|---|
| `.claude/skills/website-design/references/orchestration.md` | A | NEW — execution shapes + decision tree + motion budget (WS1), independence gate w/ both app paths + pacing limit (WS2), coordinator briefing template + failure/aggregation (WS3), fan-out micro-commit reminder (WS5), async-pattern note (WS6), integration-pass definition + frame source (WS4 doc half) |
| `.claude/skills/website-design/references/process.md` | A | Work-order pre-flight gains axis 6 (execution shape) + full-page plan-summary stop-gate; finish criteria gain the integration-pass clause |
| `.claude/skills/website-design/SKILL.md` | A | File-map row for orchestration.md |
| `.claude/agents/design-auditor.md` | B | Add `scope: integration` — added inputs (route, ordered section list, continuous-field/handoff map, viewport classes, motion budget) + boundary-keyed return |
| `.claude/skills/website-design/references/verification.md` | B | Document the integration full-runway `.scratch` walk + eye-judgment |
| `.claude/skills/website-design/scripts/eval/make-broken-integration-fixture.mjs` | B | NEW — Playwright generator: recolor a continuous dark field to break a seam |
| `.claude/skills/website-design/scripts/eval/fixtures/broken-integration-seam.png` | B | NEW — generated committed fixture (good case reuses approved shots by path) |
| `.claude/skills/website-design/scripts/eval/run.mjs` | B | Extend: two `scope: integration` cases + multi-shot prompt support |
| `docs/superpowers/specs/PARKING-LOT-orchestration.md` | C | Ledger: items absorbed; Spec 2 inputs; SubagentStop reminder explicitly deferred |

---

## Phase A — Documentation layer (WS1, WS2, WS3, WS5, WS6 + WS4 doc) — SHIP FIRST

### Task A1: Create orchestration.md

**Files:**
- Create: `.claude/skills/website-design/references/orchestration.md`

- [ ] **Step 1: Presence check (baseline)**

Run: `test -f .claude/skills/website-design/references/orchestration.md && echo EXISTS || echo MISSING`
Expected: `MISSING`.

- [ ] **Step 2: Write the file** with EXACTLY this content:

````markdown
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
````

- [ ] **Step 3: Verify content landed**

Run: `rg -n "independence gate|scope: integration|Budget the motion mix|Coordinator briefing template|app-aware" .claude/skills/website-design/references/orchestration.md`
Expected: matches for each. GREEN.

- [ ] **Step 4: Dry-run validation (WS1/WS2 success gate).** In the commit body, narrate two asks through the decision tree and confirm they diverge: (a) "Refine the careers section" → ONE surface → **solo**, no stop-gate; (b) "Rebuild the home page" → N sections → run the gate → **fan-out + integration**, stop-gate fires (plan-summary + wait). Confirm the gate's TL49 path is present (grep `tl-*` in the file) so it's not miller-only.

### Task A2: Add the execution-shape axis + stop-gate to process.md's work-order pre-flight

**Files:**
- Modify: `.claude/skills/website-design/references/process.md` (the "Pre-flight — page/section asks open with a stated WORK ORDER" section)

- [ ] **Step 1: Insert axis 6.** Find the stop-point axis line (axis 5):

Find: `5. **Stop point** — default is through per-section audits + the page finish criteria. A critique/audit-only ask produces a REPORT and ZERO edits. The extraction pass and approved/ reference shots are never in scope without logan's done-rating.`

Replace with (axis 5 unchanged + new axis 6 appended):
```markdown
5. **Stop point** — default is through per-section audits + the page finish criteria. A critique/audit-only ask produces a REPORT and ZERO edits. The extraction pass and approved/ reference shots are never in scope without logan's done-rating.
6. **Execution shape** — for any ask touching MORE THAN ONE section, state the shape (solo / single-page fan-out / multi-page fan-out), DERIVED per orchestration.md (`shape = f(surfaces, independence, depth)`). A single section proceeds solo. A FULL PAGE or MULTIPLE PAGES is a STOP-GATE: present the plan-summary (lineup + shape + why + independence-gate grouping + the up-front motion budget + commit plan) and WAIT for logan's go before spawning anything (orchestration.md). logan may override the shape by name.
```

- [ ] **Step 2: Verify** `rg -n "Execution shape|STOP-GATE|orchestration.md" .claude/skills/website-design/references/process.md` → matches.

### Task A3: Add the integration-pass clause to process.md finish criteria

**Files:**
- Modify: `.claude/skills/website-design/references/process.md` (the "## Finish criteria (page level)" list)

- [ ] **Step 1: Insert the clause.** Find the first finish-criteria bullet:

Find: `- Seam rhythm consistent across all sections at each width (probe the padding values).`

Replace with:
```markdown
- Seam rhythm consistent across all sections at each width (probe the padding values).
- **If the page was built by fan-out: its integration pass is clean** — a fresh `design-auditor` with `scope: integration` (orchestration.md) did a full-runway walk judging seams, color continuity, motion handoffs, and whole-page pacing (motion budget honored). A fan-out page is NOT done until it passes.
```

- [ ] **Step 2: Verify** `rg -n "integration pass is clean|scope: integration" .claude/skills/website-design/references/process.md` → match.

### Task A4: File-map row in SKILL.md

**Files:**
- Modify: `.claude/skills/website-design/SKILL.md` (the file-map table)

- [ ] **Step 1: Add the row** after the `design-auditor.md` row:

Find: `| \`.claude/agents/design-auditor.md\` | When spawning a section audit — the reusable auditor agent (self-loads this skill); \`scripts/eval/\` proves it loads canon + isn't a rubber-stamp |`

Replace with that same line plus a new row beneath it:
```markdown
| `.claude/agents/design-auditor.md` | When spawning a section audit — the reusable auditor agent (self-loads this skill); `scripts/eval/` proves it loads canon + isn't a rubber-stamp |
| [orchestration.md](references/orchestration.md) | When a build touches MORE THAN ONE section — execution shapes, the full-page stop-gate, the independence gate, the coordinator briefing template, and the motion-aware integration pass |
```

- [ ] **Step 2: Verify** `rg -n "orchestration.md" .claude/skills/website-design/SKILL.md` → match.

- [ ] **Step 3: Commit (Phase A whole)**

```bash
git add .claude/skills/website-design/references/orchestration.md .claude/skills/website-design/references/process.md .claude/skills/website-design/SKILL.md
git commit -m "docs(skill): orchestration layer — execution shapes, independence gate, integration pass

New orchestration.md (loaded when a build touches >1 section): the derived execution-shape axis + decision tree, the up-front motion budget, the full-page plan-summary stop-gate, the four-part independence gate (app-aware: miller template-map / TL49 shared-tl-* grep) with its pairwise-pacing limit, the coordinator briefing template + failure/aggregation, the fan-out explicit-path micro-commit reminder, and the integration-pass definition. process.md gains work-order axis 6 + the stop-gate pointer + a finish-criteria integration clause; SKILL.md gets the file-map row.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase B — Integration pass: agent scope + eval (WS4, the only code) — depends on Phase A

TDD order: fixtures → extend runner → run RED (current agent has no `integration` scope) → add the agent contract → run GREEN → rubber-stamp regression → verification.md doc.

### Task B1: Generate the broken-integration fixture

**Files:**
- Create: `.claude/skills/website-design/scripts/eval/make-broken-integration-fixture.mjs`
- Create (generated): `.claude/skills/website-design/scripts/eval/fixtures/broken-integration-seam.png`

- [ ] **Step 1: Write the generator** (selector-independent — it finds the first pair of adjacent dark sections and recolors the second to cream, breaking a continuous field, then screenshots the seam; FAILS LOUD if :3001 isn't miller-web or no dark pair exists):

```javascript
import { chromium } from "playwright";
const OUT = ".claude/skills/website-design/scripts/eval/fixtures/broken-integration-seam.png";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3001/", { waitUntil: "networkidle" });
await p.addStyleTag({ content: `nextjs-portal{display:none!important}` });

// Guard: :3001 must be miller-web (mw-* markers are miller-only).
const isMiller = await p.evaluate(() => !!document.querySelector('[data-brand="miller"], .mw-roster2'));
if (!isMiller) { await b.close(); throw new Error(":3001 must be serving miller-web (npm run dev:miller)"); }

// Find the first pair of vertically-adjacent <section>s that BOTH have a dark background
// (a continuous dark field), recolor the SECOND to cream to break the seam, return its mid-Y.
const midY = await p.evaluate(() => {
  const lum = (c) => { const m = c.match(/\d+/g); if (!m) return 1; const [r,g,bl] = m.map(Number); return (0.2126*r+0.7152*g+0.0722*bl)/255; };
  const secs = [...document.querySelectorAll("section, main > div")].filter(e => e.offsetHeight > 200);
  for (let i = 0; i < secs.length - 1; i++) {
    const a = getComputedStyle(secs[i]).backgroundColor;
    const b2 = getComputedStyle(secs[i+1]).backgroundColor;
    if (lum(a) < 0.25 && lum(b2) < 0.25) {            // two consecutive dark sections = a continuous field
      secs[i+1].style.setProperty("background", "#FBF8F2", "important");  // break it: cream
      secs[i+1].style.setProperty("background-image", "none", "important");
      const r = secs[i+1].getBoundingClientRect();
      return window.scrollY + r.top;                  // seam is at the top edge of the recolored section
    }
  }
  return -1;
});
if (midY < 0) { await b.close(); throw new Error("no adjacent dark-section pair found — adjust the dark-field heuristic"); }

// Scroll the broken seam to viewport center and shoot.
await p.evaluate((y) => window.scrollTo(0, Math.max(0, y - 300)), midY);
await p.waitForTimeout(500);
await p.screenshot({ path: OUT });
await b.close();
console.log("wrote", OUT);
```

- [ ] **Step 2: Generate it** (dev server on :3001):

Run: `node .claude/skills/website-design/scripts/eval/make-broken-integration-fixture.mjs`
Expected: `wrote …/broken-integration-seam.png`. If it throws "no adjacent dark-section pair," widen the selector set or lower the luminance threshold until it finds the LifetimeReel→VBEC dark field, then re-run.

- [ ] **Step 3: Read the fixture yourself** (Read tool) — confirm it shows an abrupt dark→cream discontinuity at a seam where a continuous dark field is expected. If the break isn't flagrant/obvious, make it more so before proceeding.

### Task B2: Pick the good-case shot sequence

**Files:** none (selection only)

- [ ] **Step 1: List approved desktop shots** to choose a coherent consecutive run:

Run: `ls -1 .claude/skills/website-design/references/approved/home/desktop/ | rg "^0[5-7]"`
Expected: the lifetime / vbec / history settled+rest shots. Record three CONSECUTIVE ones (e.g. `05-lifetime-settled.png`, `06-vbec-settled.png`, `07-history-rest.png`) as the GOOD ordered sequence — these are approved (logan-rated) so they are coherent by construction. The BROKEN sequence is the same with `06-vbec-settled.png` replaced by `broken-integration-seam.png`.

### Task B3: Extend run.mjs with the two integration cases

**Files:**
- Modify: `.claude/skills/website-design/scripts/eval/run.mjs`

- [ ] **Step 1: Add multi-shot integration support + two cases.** After the existing `CASES` array (the `good`/`broken` single-shot cases), and BEFORE the `for (const c of CASES)` loop, insert the integration cases and a prompt-builder that branches on a `shots` array. Replace the existing block:

Find:
```javascript
const CASES = [
  { name: "good",   shot: ".claude/skills/website-design/scripts/eval/fixtures/good-hero.png",       good: true },
  { name: "broken", shot: ".claude/skills/website-design/scripts/eval/fixtures/broken-numerals.png", good: false, mustMention: /numeral|\b0[123]\b|forbidden/i },
];

let failed = 0;
for (const c of CASES) {
  const prompt = `Read ${c.shot} and audit it. scope: full-section. self-probe confirmed: yes (caller already reviewed this shot). Section intent: a Miller home marketing section. Return verdict + findings.`;
```

Replace with:
```javascript
const APPROVED = ".claude/skills/website-design/references/approved/home/desktop";
const CASES = [
  { name: "good",   shot: ".claude/skills/website-design/scripts/eval/fixtures/good-hero.png",       good: true },
  { name: "broken", shot: ".claude/skills/website-design/scripts/eval/fixtures/broken-numerals.png", good: false, mustMention: /numeral|\b0[123]\b|forbidden/i },
  // scope: integration — judge a fanned-out page as ONE object (ordered section shots).
  { name: "good-integration", integration: true, good: true,
    shots: [`${APPROVED}/05-lifetime-settled.png`, `${APPROVED}/06-vbec-settled.png`, `${APPROVED}/07-history-rest.png`] },
  { name: "broken-integration", integration: true, good: false,
    mustMention: /seam|continu|color|boundary|walnut|between/i,
    shots: [`${APPROVED}/05-lifetime-settled.png`, ".claude/skills/website-design/scripts/eval/fixtures/broken-integration-seam.png", `${APPROVED}/07-history-rest.png`] },
];

let failed = 0;
for (const c of CASES) {
  const prompt = c.integration
    ? `Read these ordered section shots of a fanned-out Miller home page IN ORDER: ${c.shots.join(", ")}. scope: integration. Ordered section list: LifetimeReel, VBEC facility, History. These are consecutive sections that must read as ONE continuous page — adjacent sections sharing a color field should carry it unbroken across the seam. self-probe confirmed: yes (caller already walked these). Judge ACROSS boundaries: seams, color continuity, motion handoffs, whole-page pacing. Return verdict + boundary-keyed findings.`
    : `Read ${c.shot} and audit it. scope: full-section. self-probe confirmed: yes (caller already reviewed this shot). Section intent: a Miller home marketing section. Return verdict + findings.`;
```

- [ ] **Step 2: Confirm the case-loop pass/fail logic already handles the new cases.** The existing loop computes `hasBlocker`, then for `good` cases `pass = /PASS/i || (/ISSUES/i && !hasBlocker)` and for non-good `pass = /ISSUES/i && hasBlocker && c.mustMention.test(out)`. Both integration cases set `good` + (for broken) `mustMention`, so NO loop change is needed — verify by reading the loop. (The `--allowedTools Read Skill Grep Glob` invocation already allows reading multiple shot paths.)

### Task B4: Run the eval BEFORE the agent supports `integration` → expect RED on broken-integration

**Files:** none

- [ ] **Step 1: Run it** (dev server on :3001; current `design-auditor.md` has only `delta|full-section`):

Run: `node .claude/skills/website-design/scripts/eval/run.mjs; echo "EXIT:$?"`
Expected: nonzero exit — `broken-integration` should FAIL because the current agent has no `integration` contract (it judges shots as generic sections, not cross-boundary, and is unlikely to raise a seam/continuity **blocker** keyed to the boundary). If `broken-integration` already passes here, the case isn't discriminating on the integration contract — STOP and make the seam break depend on cross-section judgment (the single-shot agent must NOT catch it as a lone-section defect). This RED proves the eval tests the new contract, not just canon-load.

### Task B5: Add `scope: integration` to the design-auditor (GREEN)

**Files:**
- Modify: `.claude/agents/design-auditor.md`

- [ ] **Step 1: Extend the Inputs section.** Find:

```markdown
## Inputs you are given at spawn
Route + section selector; the section's design intent + motion contract in words; the viewport classes/widths that matter; `scope` (`delta` = judge ONLY the change; `full-section` = judge the whole section); and confirmation a self-probe already happened (the caller already reviewed the shots). If `scope` or the self-probe confirmation is missing, ASK for it and do not proceed — you are not a substitute for the coordinator's own-eyes pass.
```

Replace with:
```markdown
## Inputs you are given at spawn
Route + section selector; the section's design intent + motion contract in words; the viewport classes/widths that matter; `scope` (`delta` = judge ONLY the change; `full-section` = judge the whole section; `integration` = judge a whole fanned-out page as ONE object); and confirmation a self-probe already happened (the caller already reviewed the shots). If `scope` or the self-probe confirmation is missing, ASK for it and do not proceed — you are not a substitute for the coordinator's own-eyes pass.

For `scope: integration` you are ALSO given: the page route, the ORDERED section list (not one selector), the continuous-field + motion-handoff map (which boundaries carry a continuous color field or a handoff), the in-scope viewport classes, and the motion budget (so you can verify it held). Do your OWN full-runway stepped scroll-walk into `.scratch/` (a fanned-out page is in-progress — NEVER use the home-only capture harness, NEVER element shots), READ every frame, and judge ACROSS boundaries: seams (padding/rhythm), color continuity (continuous fields read unbroken), motion handoffs (one section's exit into the next's entry), and whole-page pacing (budget honored — no clumped larges). The `delta`/`full-section` "don't re-litigate unchanged geometry" rule does NOT apply to `integration` — you are judging the RELATIONSHIPS between sections. Motion is judged BY EYE on the walked frames.
```

- [ ] **Step 2: Extend the Return section.** Find:

```markdown
## Return exactly
- scope judged: `<delta|full-section>`
- self-probe confirmed: `<yes — what the caller reviewed>`
- (Mode B only) target NOT in approved/INDEX.md: `<yes — in-progress|interaction-state>`
- verdict: `PASS` | `ISSUES`
- findings: each = `{ severity: blocker|concern|nit, category, evidence (what in the pixels), location (file:line or selector), screenshot-path }`
```

Replace with:
```markdown
## Return exactly
- scope judged: `<delta|full-section|integration>`
- self-probe confirmed: `<yes — what the caller reviewed>`
- (Mode B only) target NOT in approved/INDEX.md: `<yes — in-progress|interaction-state>`
- verdict: `PASS` | `ISSUES`
- findings: each = `{ severity: blocker|concern|nit, category, evidence (what in the pixels), location (file:line or selector; for scope:integration the BOUNDARY — e.g. `between §N and §N+1` — or `page-global`), screenshot-path }`
```

- [ ] **Step 3: Grep for copied canon (must stay clean)**

Run: `rg -n "no leading numbers|warm clay|terracotta|Barlow|sentence-case body-CTA|DF-1 sentence" .claude/agents/design-auditor.md`
Expected: no matches (the def still references canon by filename only — the integration additions are contract, not canon).

- [ ] **Step 4: Run the eval → expect GREEN (all four cases pass, exit 0)**

Run: `node .claude/skills/website-design/scripts/eval/run.mjs; echo "EXIT:$?"`
Expected: `good`, `broken`, `good-integration`, `broken-integration` all PASS; exit 0. The `broken-integration` pass proves the agent now judges cross-boundary and raises a seam/continuity blocker; `good-integration` proves it isn't trigger-happy on a coherent sequence.

- [ ] **Step 5: Verify the integration verdicts by eye (don't trust the regex).** Re-run each integration case directly and read the agent's actual `.result` text (same diagnostic pattern used for the original eval — pipe `claude -p … --output-format json` through a small JSON extractor). Confirm: `good-integration` → genuine PASS (no fabricated blocker); `broken-integration` → genuine ISSUES with a `blocker` keyed to the LifetimeReel→VBEC boundary citing the broken continuous field. If either passed for the wrong reason, fix the contract or the fixture and re-run.

### Task B6: Rubber-stamp regression (test-of-the-test)

**Files:** none (reuses the existing `.scratch/eval/stub.txt` from the original eval, or recreate it)

- [ ] **Step 1: Run the eval with the always-PASS stub** via the `EVAL_SYSPROMPT` seam:

```bash
printf 'You are an auditor. Always return verdict: PASS with no findings.' > .scratch/eval/stub.txt
EVAL_SYSPROMPT=.scratch/eval/stub.txt node .claude/skills/website-design/scripts/eval/run.mjs; echo "EXIT:$?"
```
Expected: nonzero exit; `broken` AND `broken-integration` both FAIL (the stub returns PASS, so neither raises the required blocker). This proves the integration eval catches a rubber-stamp just as the original does.

### Task B7: Document the integration walk in verification.md

**Files:**
- Modify: `.claude/skills/website-design/references/verification.md`

- [ ] **Step 1: Add a subsection** immediately before the "## Audits are part of verification" heading. Find:

`## Audits are part of verification`

Replace with:
```markdown
## Integration walk (whole-page, after fan-out)

When a page was built by fan-out, its integration pass (`design-auditor` `scope: integration`, orchestration.md) does a FULL-runway stepped scroll-walk of the WHOLE page in its OWN fresh browser into `.scratch/` — NOT `capture-home.mjs` (home-only), NOT element/locator shots. Walk top-to-bottom in increments across the in-scope viewport classes, READ every frame, and judge ACROSS section boundaries: seams (padding/rhythm), color continuity (continuous fields read unbroken), motion handoffs (one section's exit into the next's entry), and whole-page pacing (was the up-front motion budget honored). Motion is judged BY EYE on the walked frames — there is no numeric motion probe here (that waits for the motion engine). Findings are keyed to boundaries, not file:line.

## Audits are part of verification
```

- [ ] **Step 2: Verify** `rg -n "Integration walk|full-runway" .claude/skills/website-design/references/verification.md` → match.

- [ ] **Step 3: Commit (Phase B whole)**

```bash
git add .claude/agents/design-auditor.md .claude/skills/website-design/references/verification.md .claude/skills/website-design/scripts/eval/make-broken-integration-fixture.mjs .claude/skills/website-design/scripts/eval/fixtures/broken-integration-seam.png .claude/skills/website-design/scripts/eval/run.mjs
git commit -m "feat(tooling): design-auditor scope:integration + a two-case integration eval

scope:integration judges a fanned-out page as one object (ordered section list + continuous-field/handoff map + motion budget; own full-runway .scratch walk; boundary-keyed findings; not a new agent). Eval extends run.mjs: good-integration (consecutive approved shots) must PASS; broken-integration (a continuous dark field recolored to break the seam) must return ISSUES + a boundary blocker; the always-PASS stub fails broken-integration (rubber-stamp regression). Verified RED before the contract, GREEN after, verdicts confirmed by eye. verification.md documents the walk.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase C — Ledger + push

### Task C1: Update the parking-lot ledger

**Files:**
- Modify: `docs/superpowers/specs/PARKING-LOT-orchestration.md`

- [ ] **Step 1: Mark absorbed items + record the deferral.** Append a "## Status (2026-06-13)" section noting: execution-style menu / independence gate / integration pass / coordinator template / motion budget = ABSORBED into the orchestration spec+plan (this change); per-section isolation routes = REJECTED (already noted); the **SubagentStop finish-reminder hook = explicitly DEFERRED** (the current `design-reminder.mjs` fires on `Agent|Task` PostToolUse at the parent, which suffices for now; a true in-subagent `SubagentStop` re-anchor is a future hook edit, not this change); motion engine + `getAnimations()` probing + tokens + rubric grader + numeric motion-perceptibility (with a real region contract) = **Spec 2** inputs (research top-3 recorded in the orchestration spec's Follow-on).

- [ ] **Step 2: Verify** `rg -n "ABSORBED|DEFERRED|Spec 2" docs/superpowers/specs/PARKING-LOT-orchestration.md` → matches.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/PARKING-LOT-orchestration.md
git commit -m "docs(plan): parking-lot ledger — orchestration items absorbed; SubagentStop deferred; Spec 2 inputs recorded

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task C2: Push

- [ ] **Step 1: Safety check before advancing main.** `git log origin/main ^dev --oneline` → expect empty. If non-empty, STOP and ask.
- [ ] **Step 2:** `git push origin dev dev:main` — confirm both refs advance; report the final hash + a phase-by-phase summary.

---

## Notes for the executor

- **Dev server:** Phase B (B1 fixture, B4/B5/B6 eval) needs miller-web on :3001. Do not start/kill/restart it if it's already up; if nothing is running, start `npm run dev:miller` and leave it.
- **The eval is the gate for `scope: integration`** — do NOT skip B4 (RED) or B6 (rubber-stamp). A green eval that never went red proves nothing; the rubber-stamp regression is what proves the integration judge isn't always-PASS.
- **Verify integration verdicts by eye (B5 Step 5)** — the regex pass/fail is a proxy; the agent's actual `.result` text is the truth (reports are claims until verified).
- **If the broken-integration fixture's seam break isn't flagrant, fix the fixture, not the threshold** — there is no numeric threshold here by design.
- **Surgical edits only** — the reference files have a no-hard-wrap rule (one logical line per paragraph). Don't reformat surrounding prose.
