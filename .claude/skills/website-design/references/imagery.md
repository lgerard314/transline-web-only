# Imagery — generate purpose-fit, prompt photos NEUTRAL

The standard: GENERATE the ideal image for the design (codex MCP `image_gen`) instead of hunting the existing library — the user swaps assets later if he wants.

## Async generation — NEVER block on an image (HARD RULE)

Image generation is the long pole of every page; sitting and waiting on it, one image at a time, is the single biggest time-sink in the whole process. So this is non-negotiable, for EVERYONE — the main agent, builders, orchestrators, nested coordinators alike, for a single image exactly as much as for a set:

1. **NEVER call the codex image MCP inline and wait for it.** ALWAYS delegate the generation to a SUBAGENT spawned in the BACKGROUND (`run_in_background`), then immediately CONTINUE working. Requesting the photo yourself and blocking on the result is forbidden.
2. **Build through the wait with a placeholder.** Reserve the exact slot — final box + aspect ratio — with a placeholder (or build the surrounding frame) and keep moving to the next work. Do not stall the section or the page on a pending image.
3. **Reconcile on return.** When the image subagent reports back (you are notified on completion), swap the placeholder for the landed asset and verify it yourself (Read the file) before shipping it.
4. **Fire them FIRST and in parallel.** At the start of section/page work, kick off ALL known image subagents in the background up front so they generate while you build — never discover an image need late and then block on it.

The image subagent is a MECHANICAL asset operator (it may run sonnet — checklist item 9): the REQUESTER crafts the neutral prompt (per THE PHOTO RULE below) and hands the subagent the full prompt block + the Windows MCP mechanics + the verify-after-write protocol; the subagent just runs the MCP, verifies the write, and returns the saved absolute path. Same async-and-continue pattern as background audits and section fan-out: spawn the slow work, keep building, reconcile when it lands.

## THE PHOTO RULE — prompts are neutral. No exceptions.

**A photo prompt contains: subject + composition + format/aspect ratio + "high quality, shot by a professional photographer." NOTHING about color.**

Do NOT add: film grades ("Kodak Portra"), color schemes, sky-color directives, banned-color lists for photographic subjects, or ANY time-of-day / weather / light-quality mandate that steers color in either direction ("golden hour", "warm haze", "overcast neutral", "cool morning", "harsh noon") — let the scene be lit naturally. The UI palette lock (no blue/teal) governs tokens, chrome, and generated GRAPHICS/illustrations — never photographs. A real site under a normal blue sky IS a real photo; a page of uniform amber shots reads fake. Classifier for the graphics-vs-photos boundary: **was a camera (real or simulated) the source?** A photograph processed to look graphic (duotone, posterized, heavy tint) is still a photo for this rule and doesn't get color-managed either.

A compliant prompt, whole and copy-adaptable — note there is nothing to "improve" with color words: "Two engineers in safety vests reviewing large-format drawings on the open tailgate of a white Ford F-250 service pickup, parked on a dirt berm overlooking an earthworks site with an excavator working in the middle distance. Landscape 1536x1024 (3:2), key action in the central band so it crops to ~21:9. High quality, shot by a professional photographer. No text, no watermarks."

This rule was violated across three pages (every prompt carried a mandatory warm-grade style block) before the user caught it — and the violation self-perpetuated because it had been written into session notes as "cool-toned subject policing." If you find notes like that, they are stale; this rule supersedes them. Restating the trap as a red-flag table:

| Thought | Reality |
|---|---|
| "The design system bans blue, so ban blue skies/drums in photos" | The ban is UI-scoped. Photos keep real-world colors. |
| "A shared grade makes the set cohere" | Sets cohere via shared SETTING and register, never imposed light/color. |
| "Older notes say to police cool-toned subjects" | Those notes encoded the violation. The user's brief outranks them. |
| "I'll fix the cast with a CSS filter instead" | Same violation, different layer. Don't color-manage photos at all without being asked. |

Sanctioned exception (white-owl): the pre-existing global `--mw-photo-grade` CSS token on the HOME page (a single subtle unifier, documented in `white-owl-design-system.md` §5) stays as shipped — it is NOT a precedent for adding new filters, strengthening it, or compensating prompts. The ad-hoc per-page filter stacks that the first interior v2 pages added on top of it were a violation and were removed at logan's direction (2026-06-12); never reintroduce per-page photo filters. Any further color management of photos requires the user's explicit ask.

## Set coherence (the legitimate version)

Multi-image sets share one SETTING/REGISTER block — register means subject matter, setting, framing, and real-world realism level, NOT a color or tonal treatment ("documentary register" can never be inflated into "muted/desaturated look") — plus no-text/no-watermark, and attach the first finished image as a reference for later ones ("match the attached set sibling") so the set reads as one shoot. Graphics/illustrations (non-photographic assets) DO follow the UI palette.

## References and branding

- Vehicles/equipment with brand identity: attach the real reference photos (e.g. the protected `miller-env-*` fleet folders — read-only, never move/rename) so generated vehicles match the real fleet.
- Worker/employee shots MAY carry the company logomark via an attached logo reference — the user offered this; don't blanket-ban logos in prompts (ban only watermarks/fake text).
- Real proof stays real: case-study photos, certifications, and other evidence assets are never replaced with generated stand-ins.

## Mechanics (codex MCP on Windows)

- Every call: `sandbox: "danger-full-access"`, `approval-policy: "never"` (the workspace-write sandbox fails to save files on Windows). Tell codex the exact absolute save path.
- **Verify after EVERY call:** `Test-Path` + fresh `LastWriteTime` — codex sometimes reports done without writing. Retry up to 2×.
- Output ceiling is 1536px wide — full-bleed heroes will soften on retina; flag it to the user, never fake-upscale.
- Compose for the crop: state the final aspect (16:9, 4:3, 21:9 band) and ask for key action in the safe zone.
- Transparent background needed? Request the page's own bg color instead (user cuts it out later).
- Object that must sit ON a page surface (spec-sheet/product shots): request a PURE WHITE background and composite with `mix-blend-mode: multiply` (white × surface = surface, mathematically seamless); the blend needs a backdrop inside the element's own stacking context — paint the surface color on the media box itself.
- Matched before/after pairs: generate the "before" with named registration landmarks (horizon line, treeline, fence), then generate the "after" on the same codex thread with the before attached and "same exact camera position/landmarks"; verify the registration by eye before building on the pair.
- Parallelize & never block: one BACKGROUND subagent per image (or per set), each carrying the full prompt block + verification protocol; you keep working while they run and review every landed image yourself (Read the file) before shipping it (see the async HARD RULE at the top of this file).
