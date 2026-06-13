# Spec — Per-scope-tier design-workflow calibration + a reusable design-auditor agent

**Status:** finalized (opinion pass + self-audit + opus spec-audit all folded in; verdict SHIP WITH FIXES, fixes applied)
**Date:** 2026-06-13
**Owner:** logan (ratifies); authored with an opus org-ai-tooling opinion pass + an adversarial opus spec-audit folded in.

## Problem

The website-design governance stack has a scope ladder (Rebuild / Recast / Restructure / Refine) that parameterizes **how deep** a redo goes, but the procedure that consumes that parameter — the Phase-2 section loop in `process.md` — is a **single uniform procedure written in Rebuild language** ("Build the template + content + CSS…"). The parameter exists; the cheap path through the procedure does not exist in the text. Direct evidence: a Refine-tier change (removing banned numeral markers from one home section) ran the full Rebuild loop — template-map, a fresh Opus audit re-judging a barely-changed section, full re-capture. The capture cost was later removed by the mechanical harness, but the **judgment cost** (spawning a judgment-tier auditor to re-audit unchanged geometry) survives on every trivial change.

Separately, two structural questions are open: (1) should the recurring auditor role become a reusable agent definition rather than being hand-briefed on every spawn; (2) is there latent rule-drift in how "patterns" are referenced across `process.md`, `vocabulary.md`, and the hook.

## Goals

1. Make the section loop **tier-aware** so each scope tier runs a right-sized procedure — the scope ladder actually cashes out in less work, not just in vocabulary.
2. Stand up a **design-auditor agent** as a reusable primitive, built so it carries **zero copied canon** (it points at the rules' single homes and self-loads them; it carries only its own contract), with a minimal **eval** that proves it loads canon and catches a flagrant regression (not a rubber-stamp).
3. **Disambiguate the two "patterns" lists** and fix imprecise pointers so there is one home per concept.
4. **Record the agent-scope decision** (auditor yes; builder / scope-level / capture no) so it is not re-litigated.

## Non-goals

- No design-builder agent, no per-tier ("Rebuild-agent") agents, no capture agent. (Rationale recorded in WS4.)
- No JSON/regex matcher for locked patterns — the list is fuzzy prose ("inverted stamp colors on accent text"); a matcher is the wrong primitive.
- No changes to the capture harness, the scope-ladder definitions, the hook's cooldown mechanics, or the per-class approval model beyond pointer/wording fixes.
- No re-capture of approved reference shots (none of these changes alter a section's rendered appearance).
- No new always-loaded context: SKILL.md stays lean; new material lives in reference files / the agent def, loaded on demand.

## Constraints (carried from the repo's operating rules)

- **Repo-local only.** Everything under the repo's `.claude/` or `docs/`. No global-path (`~/.claude`) references for design rules.
- **Shared worktree, parallel agents.** Stage by **explicit path**, never `git add -A` — another agent (CWC) may have in-flight work in this worktree.
- **Subagents inherit nothing.** Any agent must invoke the skill or be handed the rules; the auditor def resolves this by self-loading.
- **Model rule (checklist item 9).** Judgment roles inherit the session model; the auditor def must NOT pin a model.
- **Micro-commit** per workstream/phase; conventional-commit messages; CRLF warnings are expected and benign.
- **The agent def carries zero copied canon** — it may hold its own contract (return schema, self-probe-input, camera discipline) but must not restate the forbidden list / don't-flag list / bar rubric; copying canon in creates a new drift surface (we have been bitten by cross-file rule drift twice this week).

## Workstream 1 — Tier-gated section loop (doc-only, ship first)

**Why first:** highest leverage, lowest risk, reversible, independent of the other workstreams.

Requirements:

1. Rewrite Phase 2 in `process.md` so the procedure **reads differently per tier at the point of action**. Lead the action step with its tier behavior rather than a Rebuild verb plus a footnote — agents follow the imperative verb and skim qualifying prose (the same description-vs-body trap documented in the skill-authoring canon). E.g. step 1: "**Refine:** make the treatment change in place. **Restructure/Recast/Rebuild:** build/replace the template + content + CSS."
2. Add a **tier × step lookup table** — rows = the four tiers, columns = `{ template-map run?, audit scope, motion contracts, re-capture trigger }`. A table is itself a determinism artifact: an agent cannot skim past a cell the way it skims a parenthetical. Cells encode:
   - **template-map:** required when a shared template's default output changes (any tier that touches it); skippable at Refine when no shared template is touched.
   - **audit scope:** Rebuild/Recast/Restructure → audit the section against the full bar (brief the auditor `scope: full-section`); **Refine → audit THE CHANGE, not the whole section** (brief the auditor `scope: delta` — the highest-value clause; it stops paying a judgment-tier agent to re-audit unchanged geometry, and `scope` is the exact word the design-auditor's contract consumes, WS3a-4).
   - **motion contracts:** Restructure → **MUST re-derive** (geometry changed); Refine → re-probe at existing geometry; Rebuild → write fresh; Recast → per new device.
   - **re-capture trigger:** any tier, only if the change alters an approved section's rendered appearance (then the mechanical harness runs — unchanged rule).
3. Keep the "agent never self-waives an audit" rule intact; tier-scoping the audit is **not** waiving it — a Refine still gets an audit, just scoped to the delta.
4. Urgency framing in the doc: **medium** — the harness removed the token/capture cost, but the judgment cost persists until this lands.

Success: `process.md` Phase 2 has tier-led step verbs + the lookup table; a reader can determine, for any tier, which of the four columns apply without reading the ladder section separately. **Validation (in the plan):** narrate one Refine and one Rebuild through the rewritten loop and confirm the Refine path skips ≥2 steps the Rebuild path runs (template-map + full-section audit at minimum) — the cheaper path must be demonstrably shorter, not just present.

## Workstream 2 — Disambiguate the two "patterns" lists (doc refactor)

There are two distinct concepts currently both called "patterns," with an imprecise pointer:

- **Forbidden devices** — *don't build these* (home: `vocabulary.md` forbidden list).
- **Auditor don't-flag list** — *deliberate house choices auditors must not raise as defects* (home: `process.md` auditor template, the "common locked patterns" prose at ~line 95).

Requirements:

1. Give the two lists **distinct names** in all references: "forbidden devices" (build-time ban) vs "auditor don't-flag list" (review-time deliberate patterns). Stop using the bare ambiguous term "locked patterns" to mean both.
2. **One home each, stable IDs** on the don't-flag entries so references can cite them precisely. Forbidden devices already live in vocabulary.md; the don't-flag list stays in process.md's auditor template (its natural home) — promoted to a clearly-headed, ID'd list.
3. **Fix the hook pointer** (`design-reminder.mjs`, the agent-return emit string ~line 85): it currently says "REJECT WITH CAUSE against the locked patterns (vocabulary.md)" and names "locked patterns" again later in the same emit — make it name both lists correctly: reject findings that (a) hit the auditor don't-flag list (process.md) or (b) propose a forbidden device (vocabulary.md). Message-text only.
4. **Exhaustive rename — enumerated call-sites the plan must touch** (so "defined once" is actually met): `design-reminder.mjs` (~line 85, both mentions in the emit string), `process.md` (line 59 "contradicts locked patterns", line 83 checklist item 5, line 95 the actual common-patterns list), `verification.md` (~line 43). Grep for the bare term "locked patterns" afterward and confirm every remaining hit is a precise pointer to one named home, not a restated copy.

Success: grep shows each concept defined once, named distinctly, with every other mention being a pointer to its single home; the hook names both lists at their correct homes.

## Workstream 3 — The design-auditor agent + its eval

### 3a. The agent definition (`.claude/agents/design-auditor.md`)

The agent is a **thin pointer-and-load shell**. The stable contract lives in the def; the volatile rules stay single-sourced in the skill.

Requirements:

1. **Zero copied CANON** (renamed from "zero copied rules" — the def necessarily carries *contract*: the return schema, the self-probe-input requirement, camera discipline; what it must NOT carry is the volatile canon that lives elsewhere — the forbidden-devices list, the don't-flag list, the bar rubric). The system prompt is contract + load-instruction only: "You are the design-auditor. First action: invoke the `website-design` skill (and `frontend-design:frontend-design` for craft lens, ignoring its style invitations). Read `references/vocabulary.md` (forbidden devices) and `references/process.md` (auditor don't-flag list + auditor template). Judge rendered pixels against the expensive-website bar." No rubric, no forbidden list, no don't-flag list copied in. Success grep targets forbidden-list/don't-flag *content*, which must find none in the def.
2. **Skill presence is the agent's own job: it self-invokes `website-design` as its first action.** The authoritative agent frontmatter schema is `{name, description, model, color, tools}` — there is **no `skills:` key** (confirmed against the official marketplace; the org-ai-tooling cheat-sheet line that implied one is outranked by the implementation reference). So the design must be correct with self-invoke as the SOLE presence mechanism — no belt-and-suspenders frontmatter to lean on. Because a self-invoke the model could skip would be a single point of failure (forgotten invoke → no canon → silent rubber-stamp), the **eval (3b) is the guarantee**: its forbidden-device case is impossible to pass without the canon loaded, so a green eval IS the proof the self-load works. (Plan-task: if `plugin-dev:agent-development` confirms `skills:` is in fact supported, add it as NON-load-bearing reinforcement — but never as the correctness mechanism.)
3. **`model: inherit`** — the literal value, not an omitted field (every model-deferring agent in the official marketplace writes `model: inherit`; agent-creator's standard is "use `inherit` unless specified"). It is self-documenting and visible, which is exactly the "don't let someone silently pin sonnet" guard the earlier draft tried to get via an omitted-field-plus-comment. (Reconciles with checklist item 9: item 9's "OMIT the model param" governs hand-spawned `Agent` calls; a durable agent DEF uses the literal `inherit`. Both resolve to session-model inheritance.)
4. **Two input modes + an explicit `scope` input, judgment rubric shared:**
   - The contract takes `scope: delta | full-section` (threaded from WS1's tier×step table — Refine briefs `scope: delta`, other tiers `full-section`). This is the seam where WS1 and WS3 meet; without it the auditor defaults to judging "the section" and re-introduces the very full-section re-audit WS1 kills.
   - **Mode A — judge provided shots:** caller supplies screenshots + the section's intent/motion-contract + the widths that matter + `scope`. The auditor judges them. This is the **evaluable core** and the primary mode for approved-page refinement (capture is the harness's job now).
   - **Mode B — capture-then-judge:** for interaction states / in-progress (non-approved, no-manifest) sections, the auditor drives its own fresh `chromium.launch()` against the shared dev server on its actual port (never start/kill/restart), `.scratch/` artifacts, viewport screenshots, READ every shot. **Structural gate (not just prose):** before any Mode-B capture the agent checks the target section/selector against `approved/INDEX.md`; if it is an approved section, it REFUSES and emits "use the capture harness." This makes the no-capture-agent boundary mechanically checkable rather than an honor system the bounded party can cross.
5. **Self-probe-as-input contract:** the return format requires the spawn to include "self-probe already done / shots reviewed" as an input, so an auditor used as a *substitute* for the coordinator's own-eyes step is using it wrong by construction (defends the failure mode that a named auditor tempts coordinators to skip their own step 2).
6. **Return schema:** verdict (PASS / ISSUES) + per-finding `{ severity (blocker|concern|nit), category, pixel-evidence, file:line or selector, screenshot-path }`; the return echoes the `scope` it judged; for any Mode-B run it includes a field asserting "target NOT in approved/INDEX.md (Mode B justified: in-progress | interaction-state)" so a misuse is visible in the output. Camera-operator discipline for Mode B.
7. **Relationship to the 9-item briefing checklist (does NOT replace it):** the agent absorbs only the *stable* contract (camera/return discipline, load-the-canon, judge-the-bar). The coordinator still provides the **volatile per-section briefing** the checklist governs — route, selector, this section's design intent + motion contract, the widths that matter, the rejection-list context, and (item 9) the model is left to inherit. The agent shrinks the boilerplate the coordinator gets wrong; it does not eliminate the per-section judgment briefing. Checklist item 4 ("rules in the prompt") is satisfied for this agent by its self-load, not by inlining.
8. **Mode B is not a capture-agent revival.** Mode B exists ONLY for surfaces the mechanical harness does not cover — in-progress (non-approved, no-manifest) sections and live interaction states (hover/active) that a static shot can't show. Approved-page reference shots remain the harness's job; the auditor never hand-walks those.

Success: the agent file exists, contains zero restated rules (grep for forbidden-list / don't-flag content finds none), self-loads the skill, has unset-model-with-comment, specifies both modes + the self-probe-input requirement, and explicitly states it does not replace the briefing checklist.

### 3b. The eval (gates "done" for 3a)

An auditor is a judgment primitive; stabilizing it without an eval is cargo-culting, and the worst failure (a rubber-stamp auditor returning false PASS) is invisible from reading its reports. We already own a labeled golden set: `references/approved/`.

**Scope deliberately minimal** (the eval's load-bearing job is narrow: prove the agent loads canon and isn't always-PASS — NOT to grade fuzzy pixel quality, which would force binary labels onto judgment calls and make the eval flaky, the same matcher-on-fuzzy anti-pattern the Non-goals reject). Grow the corpus only when a real rubber-stamp escape is observed (vibe-code then harden), not pre-emptively.

Requirements:

1. **Two cases, both mechanically checkable:**
   - **GOOD (expect PASS / no blockers):** one real approved shot (e.g. desktop hero).
   - **BROKEN (expect a blocker citing the device):** one render with a flagrant, *unambiguous* forbidden-device injection — a reintroduced bare `01/02` numeral marker (CSS one-off or edited fixture). This single case proves BOTH "the agent loaded the forbidden list" (impossible to catch otherwise → also validates 3a-2's self-load) and "it isn't always-PASS." Drop fuzzy off-anchor/`.FAILED.png` motion cases — judging a wrong-frame pose is itself fuzzy and would make the eval flaky (false nonzero exits erode trust in the eval).
2. **Runner:** a script that, per case, runs the auditor's behavior headlessly by feeding the **agent's system prompt via `claude -p --append-system-prompt-file <agent-prompt> --output-format json`** plus the case shot — NOT via an unconfirmed `--agent <name>` selection flag (there is no documented headless agent-by-name selector; relying on one would fork the eval into a session-driven thing and break the "standalone runner" success criterion). Parse verdict + severities, assert against the label, nonzero exit on mismatch.
3. **Key property:** an always-PASS auditor MUST fail the BROKEN case. This is the regression test for the def itself — re-run when the contract or canon moves.
4. **Location:** the one fixture + runner live under the skill (`scripts/eval/`), checked in; the single broken-render fixture is committed reference data (exception like `approved/`).

Success: `node/sh <runner>` runs both cases against the agent's system prompt and exits zero; a stubbed always-PASS prompt makes the BROKEN case fail (nonzero); documented in a short eval README.

## Workstream 4 — Record the agent-scope decision

Add a short note near the auditor template in `process.md`: **why an auditor agent but not a builder / scope-level / capture agent** — the auditor's payload is mostly stable contract + a pointer to canon (reusable → agent); a builder's payload is mostly the per-page work order (volatile → stays a briefing); scope is a parameter, not a type; capture is a deterministic script. Prevents the future "let's add a builder agent for symmetry" thread (consistency in the wrong direction).

Success: the decision + its one-line rationale is in `process.md`; a reader seeing one lonely agent file finds the answer to "why only one."

## Sequencing & independence

WS1, WS2, WS4 are doc-only and independently committable; ship WS1 first and alone (the change that stops the waste). WS3 is the new build and depends on WS2 (the agent points at the disambiguated lists) — do WS2 before WS3's agent def. WS3b (eval) is authored alongside 3a and gates its completion.

## Success criteria (whole spec)

- A Refine change provably runs a lighter procedure: `process.md` has tier-led step verbs + the tier×step table; "Refine audits the change, not the section" is explicit; the plan's dry-run shows Refine skipping ≥2 steps.
- Each "patterns" concept is defined once, named distinctly; the hook names both at correct homes; the enumerated call-sites are all renamed; grep finds no duplicate prose copy.
- `.claude/agents/design-auditor.md` exists, carries zero copied canon (grep clean), self-loads the skill as its first action, uses `model: inherit`, and specifies the `scope` input + both modes + the Mode-B `approved/INDEX.md` refusal gate + the self-probe-input contract + that it does not replace the briefing checklist.
- The two-case eval runs against the agent's system prompt (via `--append-system-prompt-file`) and exits zero; a stubbed always-PASS prompt makes the BROKEN case fail.
- The agent-scope rationale (auditor yes; builder/scope/capture no) is recorded.
- Everything committed by explicit path, pushed, no other agent's work touched.

## Risks & mitigations

- **Eval fixture cost (broken renders).** → Seed small (≥3), harvest `.FAILED.png` + one CSS-injection case for cheap; grow over time.
- **Agent/skill drift.** → Zero-copied-rules + `skills:` frontmatter; WS2 single-sources the lists the agent points at.
- **Headless agent invocation for the eval.** → RESOLVED in-spec: feed the agent's system prompt via `claude -p --append-system-prompt-file` rather than an unconfirmed `--agent` selector; tests the same contract, keeps the runner standalone.
- **Mode-A complexity (judge provided shots).** → It aligns with the mechanical-capture split (capture = harness, judgment = auditor); it is a simplification, not added surface.
- **`skills:` frontmatter key does not exist in the agent schema; `model` idiom.** → RESOLVED in-spec: dropped `skills:` (self-invoke is the sole presence mechanism, eval is the guarantee); use literal `model: inherit`. Plan still verifies the frontmatter schema (`name/description/model/color/tools`) via plugin-dev:agent-development before writing the file, and treats `skills:` as optional reinforcement ONLY if confirmed supported.
- **Self-invoke is a single point of failure (forgotten → silent rubber-stamp).** → The eval's forbidden-device case cannot pass unless canon loaded, so the green eval is the structural proof; this is why the eval is co-required with the agent, not optional.
- **Three workstreams all edit `process.md`.** → They touch different regions (Phase 2 loop / auditor template / a new scope-decision note); the plan sequences the process.md edits (WS1 → WS2 → WS4) so they don't collide within the session, each its own commit.

## Open questions for logan

1. Don't-flag list home: keep in `process.md` auditor template (recommended) vs promote to its own small reference file?
2. Spec/plan location: `docs/superpowers/{specs,plans}/` at repo root (used here) acceptable?

(Resolved by the audit: agent uses `model: inherit` not omitted-field; `skills:` frontmatter dropped; eval judges provided shots via `--append-system-prompt-file`; eval shrunk to two cases.)

## Decision log (opinion pass folded in)

- Tier calibration: build as a **table + tier-led verbs**, not a footnote; **medium** urgency (judgment cost survived the capture fix). [agreed]
- Auditor: build **only** as a thin pointer-and-load shell with an eval; if that discipline isn't kept, the steelman ("keep hand-briefing, just tighten the template") wins — do not build a fat auditor. [agreed]
- "Two patterns lists" — **refined** from the opinion: they are two *different* concepts (forbidden devices vs don't-flag list), not one list duplicated; fix = disambiguate + correct the hook pointer, not merge. [improved on opinion]
- Skip builder / scope-level / capture agents. [agreed]
- Eval is co-priority with the agent and gates its "done." [agreed]
- **Agent schema corrections (spec-audit pass):** no `skills:` key (self-invoke is sole presence mechanism, eval guarantees it); `model: inherit` literal not omitted-field; eval runner uses `--append-system-prompt-file` not `--agent` selection; eval shrunk to two mechanically-checkable cases (drop fuzzy motion fixtures); `scope: delta|full-section` threaded from WS1 into the auditor contract; Mode-B gets a mechanical `approved/INDEX.md` refusal gate; "zero copied rules" → "zero copied canon" (the def carries its own contract). [applied]
- **Status:** finalized post spec-audit (verdict was SHIP WITH FIXES; all blockers + concerns applied, nits applied).
