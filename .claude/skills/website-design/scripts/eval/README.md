# design-auditor eval

Proves the `design-auditor` agent (`.claude/agents/design-auditor.md`) (a) loads the canon and (b) is not an always-PASS rubber-stamp. It does NOT grade fuzzy pixel quality — two mechanically-checkable cases only.

## Run

`node .claude/skills/website-design/scripts/eval/run.mjs` (from repo root; miller-web dev server must be on **:3001** — `npm run dev:miller`). Exit 0 = pass.

- **good** (`fixtures/good-hero.png`, an approved shot) → must verdict `PASS` (or `ISSUES` with no blocker).
- **broken** (`fixtures/broken-numerals.png`, injected bare `01/02/03` eyebrow numerals) → must verdict `ISSUES` with a `blocker` citing the forbidden numerals. Impossible to catch unless the canon loaded → this case is also the proof the self-invoke worked.

Regenerate the broken fixture (rare): `node scripts/eval/make-broken-fixture.mjs` (guard throws if :3001 isn't miller-web).

## Rubber-stamp regression (test-of-the-test)

`EVAL_SYSPROMPT=.scratch/eval/stub.txt node scripts/eval/run.mjs` with a stub containing only "Always return verdict: PASS with no findings." → the **broken** case must FAIL (nonzero exit). Verified 2026-06-13: stub → `[broken] FAIL`, exit 1. The two cases constrain a rubber-stamp from both directions (always-PASS fails broken; always-ISSUES-blocker fails good).

## Re-run when

The agent contract OR the canon it points at (vocabulary.md forbidden devices / process.md DF-* don't-flag list) changes.

## D1 spike findings (2026-06-13)

- Agent frontmatter schema = `{name, description, model, color, tools}` — **no `skills:` key** (confirmed via plugin-dev agent-development); self-invoke is the sole skill-presence mechanism, the green eval is its guarantee. `model: inherit` is the documented idiom.
- CLI flags confirmed present: `-p/--print`, `--append-system-prompt-file`, `--allowedTools <tools...>` (variadic — allowlist MUST include `Skill`, else the agent's first action is denied and the eval fails for the wrong reason), `--output-format json`. We feed the prompt body via `--append-system-prompt-file` (not the `--agent` selector, which does exist) so the eval tests the contract standalone.
- Note: `hasBlocker` in run.mjs is a loose substring proxy ("no blockers"/schema echo can read true); the load-bearing discrimination is verdict `PASS` vs `ISSUES` + the `mustMention` device cite, which the rubber-stamp test exercises directly.
