# Capture harness — approved home-page reference screenshots

- `node .claude/skills/website-design/scripts/capture-home.mjs --class all` — regenerate all 66 approved home shots in place (`references/approved/home/<class>/`).
- `node .claude/skills/website-design/scripts/capture-home.mjs --section 06 --class all` — refresh just one section after an edit (e.g. VBEC); `--out .scratch/<dir>` to test without touching the approved tree.
- Poses + predicates live in `capture-home-manifest.mjs` (desktop 19 / phone 15 / tablet-portrait 15 / tablet-landscape 17); the runner is mechanical — shots that miss their pose condition are saved as `*.FAILED.png` (never overwriting a good shot) and the run exits nonzero.
- Review rule: the script CAPTURES mechanically; a human/agent still READS the output before anything is committed — check the `pose-converged` flags + probe values in `capture-report-<class>.json` / `capture-report.json`, then open and look at the pixels.
- Server prerequisite: uses the already-running shared dev server on :3001 (miller-web); it never starts, stops, or restarts one — if nothing is on :3001 the run fails fast.
