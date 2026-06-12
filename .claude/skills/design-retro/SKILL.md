---
name: design-retro
description: Use when logan declares a page or work session finished and wants its lessons harvested into the design governance files — or asks to "run the retro", "harvest this session", or "update the docs/skills from what we learned". White-owl-repo-specific; operates on session transcripts AFTER design work ends, never during it.
disable-model-invocation: true
---

# Design Retro — harvest the session into the governance files

## Overview

The transcript is ground truth that survives compaction and selective memory. Mine the finished session for correction events, then fold each into the ONE file that owns its territory. Core discipline: **classify before writing, consolidate before adding, quote — never novelize.** The skill proposes; logan ratifies anything his words didn't explicitly settle.

## Inputs

- Transcripts: `C:\Users\logan\.claude\projects\C--Users-logan-Desktop-projects-apps-transline49-web\*.jsonl` — the session that built the finished page (newest by mtime, or the one logan names; confirm if ambiguous). Subagent transcripts (`agent-*.jsonl`) ride along where present.
- Governance files — **each rule has exactly ONE owner**: `design-language.md` (cross-cutting rules) · `motion.md` / `imagery.md` / `verification.md` / `responsive.md` (domain rules) · `vocabulary.md` (device registry + forbidden list — forbidden entries are TERSE one-liners pointing to the owning file, never the rationale twice) · `process.md` (workflow + briefing checklist) · `white-owl-*.md` (visual-canon facts only) · repo `CLAUDE.md` (auto-loaded invariants only) · `.claude/hooks/design-reminder.mjs` (message wording only). All under `.claude/skills/website-design/references/` unless noted.

## Process

1. **Scope.** Name the finished page/session; locate its transcript(s).
2. **Extract.** Fan out sonnet chunk-readers (artifacts in `.scratch/retro-<page>/`; subagents inherit nothing — paste this schema into their briefing). Each returns correction events: `{ logan_verbatim_quote, what_agent_had_done, resolution_and_rounds, final_approved_form, existing_rule_implicated_or_none }`. Readers report facts only — no rule-drafting in the readers.
3. **Classify every event BEFORE touching any file:**
   - **A — NEW RULE.** Logan's words are explicit and quotable, and no existing rule covers the territory → write it into the ONE owning file: rule + his verbatim quote + date. If it bans a device, ALSO add a one-line pointer entry to vocabulary.md's forbidden list (pointer only — the rationale lives once).
   - **B — ALREADY ENCODED.** The rule existed and was violated anyway → that is a **COMPLIANCE failure, the most valuable finding this skill produces.** Do NOT edit the rule's wording, do NOT restate it anywhere. Propose the counter where compliance is manufactured: a briefing-checklist item (process.md), a hook-message tweak, or an auditor locked-pattern note. Report which rule failed, where, and the proposed counter.
   - **C — UNRESOLVED / ONE-OFF.** Logan reacted but never settled it ("hmm", "not sure about", topic dropped) → goes ONLY into the retro report's **"Awaiting logan"** list. Never into any governance file. Never with invented alternatives or recommendations attached.
   - **D — NEW DEVICE** that earned his explicit approval → vocabulary.md `pending` entry recording ONLY what the transcript supports: what it is, the rounds and what fixed each, his approval quote, date. NO motion-class assignment, NO reuse guidance, NO approval — those come from his done-rating extraction pass (process.md), not from this skill.
4. **Consolidate (same pass, mandatory).** For each touched file: hunt for an existing rule to strengthen INSTEAD of adding a new one; merge near-duplicates; propose deletions of stale or wrong rules (a justified deletion is a win). Net doc growth with no consolidation check is a failure of this skill.
5. **Deliver.** Micro-commit per file-family. Final report in three sections: **Applied** (A/D, with diffs) · **Compliance failures** (B, with proposed counters) · **Awaiting logan** (C).

## Hard rules

- **Quote logan VERBATIM** in every rule's why. Paraphrase is not evidence. Never write context the transcript doesn't contain — "the agent assumed X" is fiction unless the agent said it.
- **One rule, one owner.** The same rationale appearing in two files is a bug this skill introduced.
- This skill **never promotes** devices to approved, never touches `references/approved/` or its INDEX, never alters the precedence chain (brief > canon > refs).
- Runs AFTER a session, never during one — it must not steer in-flight design work.

## Red flags

| Thought | Reality |
|---|---|
| "He disliked it once — ban it" | Unresolved one-off → "Awaiting logan" report only. Canon needs his ratification. |
| "I'll put the rule in both files so it's definitely seen" | One owner + a one-line pointer. Duplication is tomorrow's contradiction. |
| "The rule existed but was broken — I'll make the wording sterner" | Compliance failure. The counter goes in the checklist/hook; canon stays clean. |
| "I'll add reuse guidance and a motion class to the new device" | Beyond the evidence. Pending entries record what happened — nothing more. |
| "I'll explain WHY the agent made the mistake" | Unless the transcript says it, that's novelization. Quote, don't narrate. |
| "A lessons-learned.md would keep this organized" | New files fragment authority. Owning files only. |
