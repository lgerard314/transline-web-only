// Project-management sandbox content adapter.
// Imports the canonical content export and shapes it for each components-v2 template.
// Every string, id, and anchor is preserved VERBATIM from the source.
// Fields NOT present in the source content file are marked // RECONCILE-IN-D: so
// sub-project D can fold them back into lib/content/service-project-management.js.

import { projectManagement } from "@/lib/content/service-project-management";

// §1 — ServiceHero01  config: { alert:true, photoHalf:true, ghostPhone:true, reveal:true }
// titleId "pm-hero-title" verified from sections/01-hero.jsx line 10 — RECONCILE-IN-D:
// ghostPhone:true because the hero renders a ghost-phone CTA (emergencyDisplay/emergencyHref present and used).
// reveal:true because 01-hero.jsx places data-reveal on eyebrow, title, lead, and ctas.
export const hero = {
  ...projectManagement.hero,
  titleId: "pm-hero-title", // RECONCILE-IN-D: literal from sections/01-hero.jsx
};

// §2 — WhyBand01  config: { variant:"mw-why--3up", marker:"number", columns:3 }
// titleId "pm-group-title" verified from sections/02-group.jsx line 11 — RECONCILE-IN-D:
// items mapped from projectManagement.group.disciplines (shape {mark, title, body}).
// WhyBand01 marker:"number" renders mw-why__num from it.mark; mw-why__name from it.title;
// mw-why__body from it.body — verified against 02-group.jsx and why-band-01.jsx.
// lead included: 02-group.jsx has a lead paragraph inside the header (PM --3up variant).
export const group = {
  eyebrow: projectManagement.group.eyebrow,
  title: projectManagement.group.title,
  lead: projectManagement.group.lead,
  items: projectManagement.group.disciplines,
  titleId: "pm-group-title", // RECONCILE-IN-D: literal from sections/02-group.jsx
};

// §3 — NumberedCardGrid01
// titleId "pm-projects-title" is a literal from 03-projects.jsx — RECONCILE-IN-D:
// items shape {num, name, body} matches projectManagement.projects.items directly.
export const projects = {
  eyebrow: projectManagement.projects.eyebrow,
  title: projectManagement.projects.title,
  lead: projectManagement.projects.lead,
  items: projectManagement.projects.items,
  titleId: "pm-projects-title", // RECONCILE-IN-D: literal from sections/03-projects.jsx
};

// §4 — DispatchCta01
// titleId "pm-cta-title" verified from sections/04-cta.jsx line 11 — RECONCILE-IN-D:
// emergencyHref / emergencyDisplay cross-referenced from hero (same as real 04-cta.jsx uses c.hero).
// hotlineNote is the exact literal string from sections/04-cta.jsx line 57 — RECONCILE-IN-D:
export const cta = {
  ...projectManagement.cta,
  titleId: "pm-cta-title", // RECONCILE-IN-D: literal from sections/04-cta.jsx
  emergencyHref: projectManagement.hero.emergencyHref,
  emergencyDisplay: projectManagement.hero.emergencyDisplay,
  hotlineNote: "Answered by a trained responder — every hour, every day of the year.", // RECONCILE-IN-D: exact literal from sections/04-cta.jsx
};

// §5 — RelatedRail01
// Both strings verified from sections/05-related.jsx lines 7–8 — RECONCILE-IN-D:
export const related = {
  currentSlug: "project-management", // RECONCILE-IN-D: literal from sections/05-related.jsx
  titleId: "pm-related-title", // RECONCILE-IN-D: literal from sections/05-related.jsx
};
