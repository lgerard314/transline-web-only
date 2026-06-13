# Design-workflow tier-calibration + design-auditor agent — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the design section-loop tier-aware (so a Refine doesn't run a Rebuild-weight procedure), disambiguate the two "patterns" lists, and stand up a reusable design-auditor agent with a minimal eval.

**Architecture:** Four independently-committable phases. A (WS1) + B (WS2) + C (WS4) are doc/text-only edits to the website-design skill + the hook. D (WS3) is a new agent definition under `.claude/agents/` plus a two-case eval under `scripts/eval/`, depending on B. No changes to the capture harness, scope-ladder definitions, or hook cooldown mechanics.

**Tech Stack:** Markdown (skill reference files), one Node hook file (`design-reminder.mjs`, text-only), one agent `.md` definition, Node + Playwright + the `claude` CLI for the eval.

**Spec:** `docs/superpowers/specs/2026-06-13-design-workflow-calibration-and-auditor-agent.md` (finalized).

**Plan status:** finalized — self-review + adversarial opus plan-audit folded in (verdict EXECUTE WITH FIXES; all 3 blockers + 6 concerns + 4 nits applied). Blockers fixed: eval allowlist now includes the Skill tool (was starving the agent's first action); hook's second "locked patterns" mention now renamed; CRLF-safe frontmatter strip. Not yet executed — awaiting logan's go + execution-mode choice (below).

**Operating constraints (every task):** shared worktree with a parallel agent → **stage by explicit path, never `git add -A`**; repo-local only; CRLF warnings expected; conventional-commit messages; do not touch another agent's files (a CWC build + Docker/apprunner files are untracked in this tree — leave them). **All shell snippets below are bash — run them via the Bash tool, not PowerShell** (PowerShell needs here-strings for multi-line commit messages and `$null` for `/dev/null`).

**Process.md edit ordering (hard):** Phases A → B → C all edit `process.md`; land them as one uninterrupted sequence (don't interleave Phase D's agent work between them) to minimize the conflict window in the shared worktree.

---

## File Structure

| File | Phase | Responsibility / change |
|---|---|---|
| `.claude/skills/website-design/references/process.md` | A, B, C | Phase-2 loop → tier-led verbs + tier×step table (A); auditor don't-flag list renamed + ID'd (B); agent-scope decision note (C) |
| `.claude/skills/website-design/references/vocabulary.md` | B | Forbidden-devices list named distinctly from the don't-flag list (term hygiene only) |
| `.claude/skills/website-design/references/verification.md` | B | The one "locked patterns" mention repointed to the correctly-named home |
| `.claude/hooks/design-reminder.mjs` | B | Agent-return emit string: name both lists at their correct homes (text only) |
| `.claude/agents/design-auditor.md` | D | NEW — thin pointer-and-load auditor agent definition |
| `.claude/skills/website-design/scripts/eval/run.mjs` | D | NEW — two-case eval runner (feeds the agent's system prompt via `claude -p --append-system-prompt-file`) |
| `.claude/skills/website-design/scripts/eval/make-broken-fixture.mjs` | D | NEW — one-off generator: injects bare `01/02/03` numerals → broken fixture |
| `.claude/skills/website-design/scripts/eval/fixtures/*.png` | D | NEW — 1 good (copied from approved/) + 1 broken fixture (committed reference data) |
| `.claude/skills/website-design/scripts/eval/README.md` | D | NEW — how to run the eval + what it guarantees |
| `.claude/skills/website-design/SKILL.md` | D | One file-map row pointing at the agent (optional, end of Phase D) |

---

## Phase A — Tier-gated section loop (WS1, doc-only, SHIP FIRST)

### Task A1: Add the tier×step lookup table to Phase 2

**Files:**
- Modify: `.claude/skills/website-design/references/process.md` (Phase 2 section, after the loop's numbered steps)

- [ ] **Step 1: Presence check (baseline — not a true RED, this is a doc paste)**

Run: `rg -n "tier.*template-map|scope: delta" .claude/skills/website-design/references/process.md`
Expected now: no match (the table doesn't exist yet). NOTE: this and the Step-4 grep are presence checks (did the block land), not behavioral tests — the REAL success gate for this task is the Step-5 dry-run.

- [ ] **Step 2: Insert the table** immediately after the section-loop numbered steps (after step 6, before "## Micro-commit discipline"):

```markdown
### The loop is tier-gated — run only what the scope tier requires

The scope ladder sets depth; this table sets which loop steps actually run. Read your tier's row before running the loop — do not run the full Rebuild procedure for a lighter tier (a Refine that runs the full loop is the documented waste this table exists to stop). Urgency is real: the mechanical capture harness removed the token cost of re-capture, but the JUDGMENT cost (a judgment-tier auditor re-judging unchanged geometry) survives until you scope by tier.

| Tier | template-map (step 0) | audit scope (step 3) | motion contracts | re-capture (step 6) |
|---|---|---|---|---|
| **Rebuild** | run if a shared template's default output changes | full-section — brief the auditor `scope: full-section` | write fresh | only if an approved section's appearance changed → run the harness |
| **Recast** | run if the section's device is a shared template | full-section | per the new device | same |
| **Restructure** | run if a shared template changes | full-section | **MUST re-derive** (geometry changed) | same |
| **Refine** | **skip** when no shared template is touched | **delta — brief the auditor `scope: delta`** (judge the change, not the whole section) | re-probe at existing geometry | same |

Tier-scoping the audit is NOT waiving it — a Refine still gets an audit, just scoped to the delta. The agent never self-waives (only logan waives; a waiver is recorded in the commit).
```

- [ ] **Step 3: Make step 1 of the loop tier-led** — replace the loop's step 1 line:

Find: `1. **Build** the template + content + CSS.`
Replace with:
```markdown
1. **Build / edit (tier-led):** **Refine** → make the treatment change in place (spacing/type/motion-tuning/hover). **Restructure** → rebuild the section's internal composition + CSS. **Recast** → swap the section's device. **Rebuild** → build the template + content + CSS fresh. (See the tier×step table below for which later steps run.)
```

- [ ] **Step 4: Verify the assertion now passes**

Run: `rg -n "scope: delta|tier-gated" .claude/skills/website-design/references/process.md`
Expected: matches in the table + the loop. GREEN.

- [ ] **Step 5: Dry-run validation (the spec's WS1 success gate — the REAL test for this task)**

Manually narrate, in the commit message body, a Refine and a Rebuild through the rewritten loop and confirm the Refine path differs from Rebuild on the two named cells: **template-map row** (Refine = "skip" when no shared template; Rebuild = "run") and **audit-scope row** (Refine = "delta"; Rebuild = "full-section"). Both must differ. If they don't, the table is wrong — fix before committing.

- [ ] **Step 6: Commit**

```bash
git add .claude/skills/website-design/references/process.md
git commit -m "docs(skill): tier-gate the section loop — Refine stops running the Rebuild procedure

Phase 2 gets tier-led step verbs + a tier x step lookup table (template-map / audit-scope / motion-contracts / re-capture per Rebuild|Recast|Restructure|Refine). Refine audits the delta (scope: delta), skips template-map when no shared template is touched; Restructure must re-derive motion contracts. Encodes the VBEC-Refine-ran-full-Rebuild lesson.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase B — Disambiguate the two "patterns" lists (WS2)

Two distinct concepts, currently both called "locked patterns": **forbidden devices** (don't BUILD — home: vocabulary.md) and the **auditor don't-flag list** (don't FLAG as defects — home: process.md auditor template). Rename for distinctness; fix every enumerated call-site; correct the hook pointer.

### Task B1: Name and ID the auditor don't-flag list in process.md

**Files:**
- Modify: `.claude/skills/website-design/references/process.md` (line ~95 list + line 59 + line 83 checklist item 5)

- [ ] **Step 1: Rename the list heading + give entries IDs.** Find the "Common locked patterns to include" line (~95) and replace its lead-in with a named, ID'd block:

```markdown
**Auditor don't-flag list** (deliberate house patterns auditors must NOT raise as defects — distinct from vocabulary.md's *forbidden devices*, which must not be BUILT). Cite by ID when rejecting a finding:
- `DF-1` sentence-case body-CTA labels
- `DF-2` inverted stamp colors on accent text
- `DF-3` the dev-overlay badge in screenshots
- `DF-4` per-field form error messages
- `DF-5` small mono text reading blue-ish in downscaled screenshots (subpixel artifact — verify computed color before claiming a palette violation)
```

- [ ] **Step 2: Fix the two other in-file mentions.** Line 59: change "what contradicts locked patterns" → "what contradicts the **auditor don't-flag list** (above) or proposes a **forbidden device** (vocabulary.md)". Line 83 (checklist item 5): change "Locked-patterns list" → "Auditor don't-flag list (process.md) — the deliberate house patterns auditors must not flag".

- [ ] **Step 3: Verify**

Run: `rg -n "don't-flag|forbidden device|DF-[0-9]" .claude/skills/website-design/references/process.md`
Expected: the named block + the two repointed mentions. Then run a **case-insensitive, hyphen-tolerant** residual grep (line 83's phrasing is "Locked-patterns" — capital L, hyphen — which a lowercase-space grep silently misses): `rg -ni "locked.patterns" .claude/skills/website-design/references/process.md` → expected: **zero** hits (every mention now names which list).

### Task B2: Term hygiene in vocabulary.md

**Files:**
- Modify: `.claude/skills/website-design/references/vocabulary.md` (forbidden list heading)

- [ ] **Step 1:** Find the forbidden-list section heading (`## Forbidden list …`) and append a one-line distinction so the two concepts are explicitly separated:

```markdown
> These are **forbidden DEVICES** (must not be BUILT). Distinct from the **auditor don't-flag list** in process.md (deliberate patterns auditors must not RAISE as defects). Don't conflate the two.
```

- [ ] **Step 2: Verify** `rg -n "forbidden DEVICES|don't-flag" .claude/skills/website-design/references/vocabulary.md` → matches.

### Task B3: Repoint verification.md

**Files:**
- Modify: `.claude/skills/website-design/references/verification.md` (~line 43)

- [ ] **Step 1:** Find the "locked patterns" mention (~line 43, in the audit section) and make it precise: "reject against the **auditor don't-flag list** (process.md) / don't propose **forbidden devices** (vocabulary.md)".
- [ ] **Step 2: Verify** `rg -n "don't-flag|forbidden devices" .claude/skills/website-design/references/verification.md` → match; `rg -n "locked patterns" .claude/skills/website-design/references/verification.md` → none bare.

### Task B4: Fix the hook emit string

**Files:**
- Modify: `.claude/hooks/design-reminder.mjs` (the Agent/Task `emit(...)` string, ~line 85)

- [ ] **Step 1: Verify the current text** `rg -n "locked patterns" .claude/hooks/design-reminder.mjs` → expect the agent-return emit string (two mentions).
- [ ] **Step 2: Edit BOTH "locked patterns" mentions in the emit string** (the line has two — confirmed). (a) Replace "act on each finding or REJECT WITH CAUSE against the locked patterns (vocabulary.md)" with "act on each finding or REJECT WITH CAUSE — against the auditor don't-flag list (process.md, DF-*) for deliberate patterns, or vocabulary.md for proposed forbidden devices". (b) In the checklist-pointer tail, the enumerated item still reads "...locked patterns, motion/viewport contracts..." — rename that occurrence to "...auditor don't-flag list, motion/viewport contracts...". Text only — no logic change.
- [ ] **Step 3: Parse + branch test + residual-grep**

Run: `node --check .claude/hooks/design-reminder.mjs` → expect clean.
Run (unique transcript_path to dodge the 1/10min cooldown — empty output on a repeat run is the cooldown, not a failure): `'{"session_id":"t1","transcript_path":"C:/t/a-DATESTAMP.jsonl","tool_name":"Agent","tool_input":{}}' | node .claude/hooks/design-reminder.mjs` (substitute a fresh DATESTAMP) → expect JSON emit containing "don't-flag list (process.md".
Run: `rg -n "locked patterns" .claude/hooks/design-reminder.mjs` → expect **zero** hits (both mentions renamed).

- [ ] **Step 4: Commit (Phase B whole)**

```bash
git add .claude/skills/website-design/references/process.md .claude/skills/website-design/references/vocabulary.md .claude/skills/website-design/references/verification.md .claude/hooks/design-reminder.mjs
git commit -m "docs(skill): disambiguate forbidden-devices vs auditor don't-flag list

Two different concepts were both called 'locked patterns'. Name them distinctly, ID the don't-flag entries (DF-1..5, home: process.md), keep forbidden devices in vocabulary.md, and fix the hook pointer + verification.md mention to name both at their correct homes. No logic change.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase C — Record the agent-scope decision (WS4)

### Task C1: Add the "why one agent" note to process.md

**Files:**
- Modify: `.claude/skills/website-design/references/process.md` (after the auditor briefing template / near the checklist)

- [ ] **Step 1: Insert the note:**

```markdown
### Why a design-auditor agent but not a builder / scope / capture agent

Reusable AGENTS are for stable, repeated contracts. The **auditor** qualifies: its payload is mostly stable contract + a pointer to canon, it fires every section → it's a `.claude/agents/` definition (see design-auditor). The others do not: a **builder's** payload is mostly the per-page work order (concept, lineup, copy, namespace) — volatile, so it stays a per-task briefing, not an agent. **Scope** (Rebuild/Recast/Restructure/Refine) is a PARAMETER threaded through the loop table, not an agent type — minting one agent per tier would be four drifting near-duplicates. **Capture** is a deterministic script (scripts/capture-home.mjs), not a judgment role — an agent there would re-introduce the token cost the harness removed. If you feel the pull to "add a builder agent for symmetry," that's consistency in the wrong direction.
```

- [ ] **Step 2: Verify** `rg -n "Why a design-auditor agent but not" .claude/skills/website-design/references/process.md` → match.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/website-design/references/process.md
git commit -m "docs(skill): record the agent-scope decision (auditor yes; builder/scope/capture no)

Prevents the future 'add a builder agent for symmetry' thread. Auditor = stable contract + canon pointer (agent); builder = volatile work order (briefing); scope = parameter; capture = script.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase D — The design-auditor agent + eval (WS3, depends on Phase B)

### Task D1: Verify the agent + CLI contract BEFORE building (spike)

**Files:** none (verification only)

- [ ] **Step 1: Confirm the agent frontmatter schema.** `plugin-dev:agent-development` may not be in this session's available-skills list — if it isn't, Read the cached reference directly: `~/.claude/plugins/cache/claude-plugins-official/plugin-dev/*/agents/agent-creator.md` and `.../skills/agent-development/SKILL.md` (Skill invocation optional). Confirm the supported keys are `name, description, model, color, tools` and whether `skills:` is supported.
  - Expected: schema is `{name, description, model, color, tools}`; `model: inherit` is the documented inherit idiom; no `skills:` key. If `skills:` IS in fact supported, note it for OPTIONAL non-load-bearing reinforcement; if not, do NOT use it (the design is correct without it).
- [ ] **Step 2: Confirm the CLI flags the eval needs.** Run: `claude --help` (or the plugin-dev mcp-integration/agent docs) and confirm `-p`, `--append-system-prompt-file`, `--allowedTools`, `--output-format json` exist and their exact spelling.
  - Expected: all present. If `--append-system-prompt-file` is spelled differently, record the real flag — D3's runner depends on it.
- [ ] **Step 3: Record findings** as a comment block at the top of the eval README (created in D5) so the next worker doesn't re-spike. Note for the record: `--agent <name>` DOES exist as a headless selector, but we deliberately use `--append-system-prompt-file` so the eval tests the prompt body in isolation and stays a standalone script (no dependency on the agent being registered/discoverable headlessly). Also confirm `--allowedTools` accepts multiple variadic tokens (`--allowedTools Read Skill Grep Glob`).

### Task D2: Write the eval fixtures (TDD: cases before the agent)

**Files:**
- Create: `.claude/skills/website-design/scripts/eval/fixtures/good-hero.png` (copy of an approved shot)
- Create: `.claude/skills/website-design/scripts/eval/make-broken-fixture.mjs`
- Create: `.claude/skills/website-design/scripts/eval/fixtures/broken-numerals.png` (generated)

- [ ] **Step 1: Create the eval dir and the GOOD fixture** (copy a real approved shot — it is known-good by logan's rating):

```bash
mkdir -p .claude/skills/website-design/scripts/eval/fixtures
cp .claude/skills/website-design/references/approved/home/desktop/01-hero-rest.png .claude/skills/website-design/scripts/eval/fixtures/good-hero.png
```

- [ ] **Step 2: Write the broken-fixture generator** (`make-broken-fixture.mjs`) — loads the home page on the shared :3001 server, injects a flagrant bare `01/02/03` mono-numeral sequence leading a stacked list (the unambiguous forbidden device), screenshots:

```javascript
import { chromium } from "playwright";
const OUT = ".claude/skills/website-design/scripts/eval/fixtures/broken-numerals.png";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3001/", { waitUntil: "networkidle" });
await p.addStyleTag({ content: `nextjs-portal{display:none!important}` });
// Inject a flagrant banned device: bare 01/02/03 eyebrow-register numerals leading stacked rows.
// FAIL LOUD if :3001 isn't miller-web — `.mw-roster2` is miller-only; the monorepo default
// `npm run dev` serves TL49, miller is `npm run dev:miller`. A silent fallback would generate
// the fixture against the wrong site and quietly invalidate the eval's provenance.
await p.evaluate(() => {
  const host = document.querySelector(".mw-roster2");
  if (!host) throw new Error("`.mw-roster2` not found — :3001 must be serving miller-web (npm run dev:miller)");
  const box = document.createElement("div");
  box.style.cssText = "position:relative;padding:48px;background:#FBF8F2;font-family:monospace;";
  box.innerHTML = `
    <p style="font:600 12px monospace;letter-spacing:.18em;color:#A85A2C;">01 &nbsp; INDUSTRIAL WASTE</p>
    <p style="font:600 12px monospace;letter-spacing:.18em;color:#A85A2C;">02 &nbsp; EMERGENCY RESPONSE</p>
    <p style="font:600 12px monospace;letter-spacing:.18em;color:#A85A2C;">03 &nbsp; CUSTOMER COLLECTION</p>`;
  host.prepend(box);
});
await p.waitForTimeout(400);
await p.screenshot({ path: OUT });
await b.close();
console.log("wrote", OUT);
```

- [ ] **Step 3: Generate the broken fixture** (dev server must be running on :3001):

Run: `node .claude/skills/website-design/scripts/eval/make-broken-fixture.mjs`
Expected: "wrote …/broken-numerals.png".

- [ ] **Step 4: Read both fixtures yourself** (Read tool) — confirm good-hero is the clean hero and broken-numerals visibly shows `01/02/03` leading a stacked list. If the broken one isn't flagrant, make it more obvious before proceeding.

### Task D3: Write the eval runner (watch it have nothing to test → RED)

**Files:**
- Create: `.claude/skills/website-design/scripts/eval/run.mjs`

- [ ] **Step 1: Write the runner** (uses the flags confirmed in D1; feeds the agent's system-prompt body, not an `--agent` selector):

```javascript
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const AGENT = ".claude/agents/design-auditor.md";
// Env seam so the D5 rubber-stamp regression can point at a stub WITHOUT the runner
// regenerating over it. Default: rebuild the system prompt from the agent file.
const SYS = process.env.EVAL_SYSPROMPT || ".scratch/eval/sysprompt.txt";
mkdirSync(".scratch/eval", { recursive: true });
if (!process.env.EVAL_SYSPROMPT) {
  // CRLF-safe frontmatter strip (this repo is CRLF — a `---\n` pattern won't match `---\r\n`).
  const body = readFileSync(AGENT, "utf8").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  if (/name:\s*design-auditor/.test(body)) throw new Error("frontmatter not stripped — fix the regex");
  writeFileSync(SYS, body);
}

// Both paths are repo-root-relative — the runner is invoked from repo root and the
// claude subprocess inherits that cwd, so the Read tool resolves from repo root.
const CASES = [
  { name: "good",   shot: ".claude/skills/website-design/scripts/eval/fixtures/good-hero.png",       good: true },
  { name: "broken", shot: ".claude/skills/website-design/scripts/eval/fixtures/broken-numerals.png", good: false, mustMention: /numeral|\b0[123]\b|forbidden/i },
];

let failed = 0;
for (const c of CASES) {
  const prompt = `Read ${c.shot} and audit it. scope: full-section. self-probe confirmed: yes (caller already reviewed this shot). Section intent: a Miller home marketing section. Return verdict + findings.`;
  let out = "";
  try {
    // --allowedTools MUST include Skill — the agent's mandatory first action invokes the
    // website-design skill; without it the agent refuses to judge (no canon loaded) and the
    // eval fails for the wrong reason. (Variadic: pass tools as separate argv tokens.)
    out = execFileSync("claude", ["-p", prompt,
      "--append-system-prompt-file", SYS,
      "--allowedTools", "Read", "Skill", "Grep", "Glob",
      "--output-format", "json"], { encoding: "utf8", timeout: 180000 });
  } catch (e) { out = String(e.stdout || "") + String(e.message || ""); }
  const hasBlocker = /blocker/i.test(out);
  let pass;
  if (c.good) {
    // Spec §3b: GOOD passes on PASS, OR ISSUES with ZERO blockers (a lone nit must not fail it).
    pass = /PASS/i.test(out) || (/ISSUES/i.test(out) && !hasBlocker);
  } else {
    pass = /ISSUES/i.test(out) && hasBlocker && c.mustMention.test(out);
  }
  if (!pass) failed++;
  console.log(`[${c.name}] blocker=${hasBlocker} => ${pass ? "PASS" : "FAIL"}`);
}
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run it BEFORE the agent exists → expect failure (RED).**

Run: `node .claude/skills/website-design/scripts/eval/run.mjs`
Expected: nonzero exit (no `.claude/agents/design-auditor.md` yet → readFileSync throws / both cases fail). This proves the runner actually discriminates rather than vacuously passing.

### Task D4: Write the design-auditor agent (GREEN)

**Files:**
- Create: `.claude/agents/design-auditor.md`

- [ ] **Step 1: Write the agent definition** (zero copied canon — contract + load-instruction only; `model: inherit`; no `skills:` unless D1 confirmed it):

```markdown
---
name: design-auditor
description: Use to audit a rendered website section/page against the locked design bar — per-section in the website-design build/optimize loop, or to critique an existing design with no edit planned. Judges rendered pixels, returns a verdict + findings, makes no edits.
model: inherit
color: orange
tools: Skill, Read, Grep, Glob, Bash
---

You are the design-auditor for this repo's website work. You judge rendered pixels against the locked bar and return findings. You make NO edits, ever.

NOTE: `model: inherit` is intentional — you are judgment-tier (briefing checklist item 9). Do not let anyone pin this agent to a smaller model.

## First action (mandatory — you inherit NO skills)
Invoke the `website-design` skill via the Skill tool, and `frontend-design:frontend-design` for craft lens (use ONLY its process/craft discipline; ignore its font/colour/aesthetic invitations — this project's design language is locked). Then read `references/vocabulary.md` (forbidden devices) and `references/process.md` (the auditor don't-flag list `DF-*` + the auditor briefing template). If you cannot load the skill/canon, say so and STOP — never judge without the canon loaded.

## Inputs you are given at spawn
Route + section selector; the section's design intent + motion contract in words; the viewport classes/widths that matter; `scope` (`delta` = judge ONLY the change; `full-section` = judge the whole section); and confirmation a self-probe already happened (the caller already reviewed the shots). If `scope` or the self-probe confirmation is missing, ASK for it and do not proceed — you are not a substitute for the coordinator's own-eyes pass.

## Modes
- **Mode A (default): judge the screenshots the caller provides.** Capturing approved-page shots is the mechanical harness's job (`scripts/capture-home.mjs`), not yours.
- **Mode B (capture-then-judge): ONLY for in-progress (non-approved, no-manifest) sections and live interaction states a static shot can't show.** BEFORE capturing, check the target section/selector against `references/approved/INDEX.md`; if it is an approved section, REFUSE and tell the caller to use the capture harness. When you do capture: own a fresh `chromium.launch()` against the shared dev server on its ACTUAL port; NEVER start/kill/restart it; write artifacts to `.scratch/`; viewport screenshots only; READ every shot.

## Judge
Against the bar — "does this look like a very high-end, expensive website?" — at rest / mid-motion / settled. Probes passing while something looks cheap (crowding, runt lines, broken words, drifting alignment, dead voids) is still a FAIL. Do NOT flag the auditor don't-flag list (`DF-*`, process.md) — those are deliberate house patterns. Do NOT propose forbidden devices (vocabulary.md). For `scope: delta`, judge only what changed; do not re-litigate unchanged geometry.

## You do not replace the briefing checklist
You absorb only the stable contract above. The coordinator still owns the per-section briefing (route, selector, this section's intent + motion contract, the widths that matter, the rejection-list context). If those weren't given, ask — don't guess.

## Return exactly
- scope judged: `<delta|full-section>`
- self-probe confirmed: `<yes — what the caller reviewed>`
- (Mode B only) target NOT in approved/INDEX.md: `<yes — in-progress|interaction-state>`
- verdict: `PASS` | `ISSUES`
- findings: each = `{ severity: blocker|concern|nit, category, evidence (what in the pixels), location (file:line or selector), screenshot-path }`
```

- [ ] **Step 2: Grep the def for copied canon (must be clean)**

Run: `rg -n "no leading numbers|warm clay|terracotta|Barlow|sentence-case body-CTA|DF-1 sentence" .claude/agents/design-auditor.md`
Expected: no matches (it references canon by filename, never restates it). If anything matches, the def copied canon — remove it.

- [ ] **Step 3: Run the eval → expect GREEN**

Run (dev server on :3001): `node .claude/skills/website-design/scripts/eval/run.mjs`
Expected: both cases PASS, exit 0. The `broken` case passing proves the agent loaded the forbidden list and caught the numerals; the `good` case passing proves it isn't trigger-happy.
If the broken case fails: the agent isn't loading canon (check the first-action instruction) or the fixture isn't flagrant enough (revisit D2). Fix and re-run.

### Task D5: Eval README + the rubber-stamp regression check

**Files:**
- Create: `.claude/skills/website-design/scripts/eval/README.md`

- [ ] **Step 1: Write the README** (≤15 lines): what the eval guarantees (the agent loads canon + isn't always-PASS), how to run it (`node scripts/eval/run.mjs`, dev server must be on :3001), the D1 spike findings (confirmed flags + whether `skills:` is supported), and the regression rule: re-run when the agent contract or the canon it points at changes.

- [ ] **Step 2: Rubber-stamp regression check (test-of-the-test).** Create `.scratch/eval/stub.txt` containing only "You are an auditor. Always return verdict: PASS with no findings." Run via the env seam baked into `run.mjs`: `EVAL_SYSPROMPT=.scratch/eval/stub.txt node .claude/skills/website-design/scripts/eval/run.mjs` (the runner skips regeneration when `EVAL_SYSPROMPT` is set, so the stub survives). Confirm the `broken` case FAILS → nonzero exit. This proves the eval actually catches a rubber-stamp. No file revert needed (the stub is in `.scratch/`). Record the result in the README.

- [ ] **Step 3: Commit (Phase D whole)**

```bash
git add .claude/agents/design-auditor.md .claude/skills/website-design/scripts/eval/run.mjs .claude/skills/website-design/scripts/eval/make-broken-fixture.mjs .claude/skills/website-design/scripts/eval/fixtures/good-hero.png .claude/skills/website-design/scripts/eval/fixtures/broken-numerals.png .claude/skills/website-design/scripts/eval/README.md
git commit -m "feat(tooling): design-auditor agent (thin pointer-and-load) + two-case eval

Reusable judgment-tier auditor: self-invokes website-design (subagents inherit nothing), model: inherit, scope: delta|full-section threaded from the tier table, Mode-B approved/INDEX refusal gate, self-probe-as-input contract, zero copied canon. Eval feeds the agent system prompt via claude -p --append-system-prompt-file: a good approved shot must PASS, an injected 01/02/03 numeral render must be CAUGHT; an always-PASS stub fails the broken case (rubber-stamp regression guard).

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task D6: Wire the agent into the skill file map (optional, low-risk)

**Files:**
- Modify: `.claude/skills/website-design/SKILL.md` (file-map table)

- [ ] **Step 1:** Add a row: `| .claude/agents/design-auditor.md | When spawning a section audit — the reusable auditor agent (self-loads this skill) |`.
- [ ] **Step 2: Verify** `rg -n "design-auditor" .claude/skills/website-design/SKILL.md` → match.
- [ ] **Step 3: Commit**

```bash
git add .claude/skills/website-design/SKILL.md
git commit -m "docs(skill): file-map row for the design-auditor agent

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task D7: Push

- [ ] **Step 1: Safety check before advancing main.** logan's convention is to fast-forward `main` from `dev` for tooling/doc changes. Confirm main has no unrelated commits ahead of dev first: `git log origin/main ^dev --oneline` → expect empty. If non-empty, STOP and ask — do not clobber.
- [ ] **Step 2:** `git push origin dev dev:main` — confirm both refs advance; report the final hash.

---

## Notes for the executor

- **Dev server:** Phases D2/D4 need the shared dev server on :3001. Do not start/kill/restart it (another agent may be using it); if none is running, start one and leave it up.
- **Don't reformat** the files you touch — surgical edits only; the reference files have a no-hard-wrap rule (one logical line per paragraph).
- **If a grep assertion can't be made to pass without restating canon in the agent def, STOP** — that means the design drifted toward a fat auditor; re-read spec WS3a.
