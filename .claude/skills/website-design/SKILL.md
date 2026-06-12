---
name: website-design
description: Use when creating, editing, redesigning, converting, optimizing, or reviewing any website page, section, hero, or template — including generating page imagery, adding or tuning scroll/motion/hover effects, responsive/viewport passes, and verifying visual work with Playwright/screenshots. Triggers on asks like "build/redesign this page", "add a section", "make it feel more alive", "optimize for mobile", "fix this section's motion", "generate photos for the page", "audit this page's design".
---

# Website Design

## Overview

The design language is already locked; the craft is in process. Every page is built against a fixed visual canon, one section at a time, with every claim about the result proven by a measured probe plus your own eyes on rendered pixels. Vibes ship regressions; contracts, probes, and fresh-eyed audits ship design.

## When to Use

- Any page/section/template work on a website: new build, redesign, conversion, copy-into-layout, optimization, "make it look better."
- Adding or adjusting scroll-tied motion, pins, hovers, or reveals.
- Generating or swapping page imagery.
- Verifying visual work (yours or another agent's).
- Critiquing/auditing an existing page's design quality, even with no edit planned.
- NOT for: non-visual logic, backend work, copy edits with no layout consequence (trust the diff).

## Companion skill

Also invoke `frontend-design:frontend-design` — use ONLY its process/craft discipline (intentionality, motion restraint, detail rigor). Do NOT take styles from it: tone, fonts, palette, and aesthetic direction are already defined by the project's design system, so ignore every invitation it makes to pick fonts, color schemes, or aesthetic flavors.

## Read in this order

1. The repo's design canon — see [design-language.md](references/design-language.md) for what's canonical where. For the white-owl monorepo specifically, the full canon now lives INSIDE this skill at `references/white-owl-design-system.md`, `references/white-owl-responsive-playbook.md`, and `references/white-owl-templates.md` — the old repo paths (`docs/DESIGN-SYSTEM.md`, `docs/RESPONSIVE-PLAYBOOK.md`, `apps/miller-web/components-v2/README.md`) are stubs pointing here. For all other repos, locate their own canon first; if none exists, say so and get the language locked before designing. Precedence on any conflict: the user's explicit brief > the moved canon files (`white-owl-*.md`) > the distilled reference files > remembered session notes.
2. The reference file(s) for the work at hand (map below).

## File map

| File | Load when |
|---|---|
| [process.md](references/process.md) | Building/redesigning a page or section — the brief → section loop → audit → commit workflow |
| [design-language.md](references/design-language.md) | Any visual decision — canon locations + cross-cutting locked rules |
| [motion.md](references/motion.md) | Any scroll-tied effect, scrub, pin, cycling device, or reveal |
| [imagery.md](references/imagery.md) | Generating or selecting photos/graphics for a page |
| [verification.md](references/verification.md) | Proving visual work — Playwright protocol, probes, screenshot review |
| [responsive.md](references/responsive.md) | Deriving non-desktop viewports or any viewport-matrix verification |
| [vocabulary.md](references/vocabulary.md) | Choosing devices for a section — the approved registry (with reuse contracts) + the forbidden list |
| [white-owl-design-system.md](references/white-owl-design-system.md) | White-owl monorepo visual canon (palette/tokens/type/motifs/§12 interior rules) — moved from the repo |
| [white-owl-responsive-playbook.md](references/white-owl-responsive-playbook.md) | White-owl motion/responsive recipes, §6 checklist, §7 page production — moved from the repo |
| [white-owl-templates.md](references/white-owl-templates.md) | miller-web components-v2 template library guide — moved from the repo |

## Non-negotiables (full detail in the files)

- Locked palette/type/motifs come from the repo canon — never invented, never "refreshed."
- Photos are prompted NEUTRAL — no imposed color scheme or grade ([imagery.md](references/imagery.md)).
- Motion completions land AT exact geometric anchors; imperceptible effects count as missing ([motion.md](references/motion.md)).
- Every section ships → gets probed → gets a fresh-agent audit → findings applied → committed, before it's "done" ([process.md](references/process.md)).
- A UI is never "correct" until you've looked at it rendered ([verification.md](references/verification.md)).
- Edits stay surgically namespaced to your assigned surface — never revert/overwrite/`git reset` work outside your scope (other agents may be mid-flight on it); flag problems there instead of fixing them.
