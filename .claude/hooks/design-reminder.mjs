#!/usr/bin/env node
// PostToolUse hook — keeps the website-design skill's rules from getting
// "lost" across long design sessions (logan, 2026-06-12). Two branches:
//
//   1. Edit/Write on a DESIGN SURFACE (styles, components-v2, page.jsx,
//      content modules): inject a short rules re-anchor, rate-limited to
//      one per 20 minutes so specific/small edits don't get spammed.
//   2. Agent/Task returning (a subagent finished — auditors, builders,
//      capture agents): inject the act-on-findings / brief-the-next-agent
//      reminder, rate-limited to one per 10 minutes.
//
// Reinforcement only — never blocks. Exit 0 with no output = silence.

import { readFileSync, writeFileSync, statSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DESIGN_SURFACE = /(app[\\/].*styles[\\/]|components-v2[\\/]|page\.jsx$|lib[\\/]content[\\/]|app[\\/]styles[\\/]|apps[\\/]brand[\\/])/i;
const EDIT_COOLDOWN_MIN = 20;
const AGENT_COOLDOWN_MIN = 10;

let input = "";
try {
  input = readFileSync(0, "utf8");
} catch {
  process.exit(0);
}

let evt;
try {
  evt = JSON.parse(input);
} catch {
  process.exit(0);
}

const tool = evt.tool_name || "";
// Cooldowns are PER AGENT, not machine-global: multiple sessions run this repo
// in parallel AND coordinators spawn parallel design subagents — a shared stamp
// would let the first agent's reminder suppress everyone else's for the whole
// window. transcript_path is unique per agent (subagents get their own
// transcript); session_id is the fallback.
const keySrc = String(evt.transcript_path || evt.session_id || "global");
const sid = keySrc.split(/[\\/]/).pop().replace(/[^a-z0-9-]/gi, "").slice(0, 24);

function due(kind, minutes) {
  const stampDir = join(tmpdir(), "claude-design-reminder");
  const stamp = join(stampDir, `${kind}-${sid}.stamp`);
  try {
    const age = (Date.now() - statSync(stamp).mtimeMs) / 60000;
    if (age < minutes) return false;
  } catch {
    /* no stamp yet */
  }
  try {
    mkdirSync(stampDir, { recursive: true });
    writeFileSync(stamp, String(Date.now()));
  } catch {
    /* stamp failure = stay silent rather than spam */
    return false;
  }
  return true;
}

function emit(context) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: context },
    })
  );
  process.exit(0);
}

if (tool === "Edit" || tool === "Write" || tool === "MultiEdit") {
  const fp = (evt.tool_input && (evt.tool_input.file_path || "")) || "";
  if (!DESIGN_SURFACE.test(fp)) process.exit(0);
  if (!due("design-edit", EDIT_COOLDOWN_MIN)) process.exit(0);
  emit(
    "Design-surface edit detected (auto-reminder, fires max 1/20min). The website-design skill (.claude/skills/website-design (in-repo)) governs this work: motion contracts written BEFORE coding with completions landing AT geometric anchors; probes + your own eyes on rendered pixels before any 'done' claim; the home page is the structural/motion foundation; devices come from vocabulary.md (approved list + forbidden list — no leading numbers on stacked lists, photos prompted neutral, motion adjusted never stripped on mobile). If this session is page/section design work and the skill isn't loaded, invoke it now."
  );
}

if (tool === "Agent" || tool === "Task") {
  if (!due("agent-return", AGENT_COOLDOWN_MIN)) process.exit(0);
  emit(
    "A subagent returned (auto-reminder, fires max 1/10min). If it was a design auditor: act on each finding or REJECT WITH CAUSE against the locked patterns (vocabulary.md), re-probe every applied fix at proven frames, and commit the section before moving on. If it returned screenshots: Read them yourself before acting on any visual claim. If you are about to spawn another design subagent: it does NOT inherit the website-design skill — run the 8-item Subagent briefing checklist in .claude/skills/website-design/references/process.md (scope, server/browser, .scratch, inlined rules, locked patterns, motion/viewport contracts, return format, commit ownership), and nested coordinators must pass the checklist down verbatim."
  );
}

process.exit(0);
