// Industrial-waste-treatment sandbox content adapter.
// Imports the canonical content export and shapes it for each components-v2 template.
// Every string, id, and anchor is preserved VERBATIM from the source.
// Fields NOT present in the source content file are marked // RECONCILE-IN-D: so
// sub-project D can fold them back into lib/content/service-industrial-waste-treatment.js.

import { IWT } from "@/lib/content/service-industrial-waste-treatment";

// §1 — ServiceHero01  config: { alert:true, photoHalf:true, ghostPhone:true, reveal:true }
// titleId "iwt-hero-title" verified from sections/01-hero.jsx line 10 — RECONCILE-IN-D:
// ghostPhone:true because the hero renders a ghost-phone CTA (emergencyDisplay/emergencyHref present and used).
// reveal:true because 01-hero.jsx places data-reveal on eyebrow, title, lead, and ctas.
export const hero = {
  ...IWT.hero,
  titleId: "iwt-hero-title", // RECONCILE-IN-D: literal from sections/01-hero.jsx
};

// §2 — FacilityShowcase01
// titleId "iwt-fac-title" verified from sections/02-facility.jsx line 9 — RECONCILE-IN-D:
// caption is the exact figcaption literal from 02-facility.jsx line 26 — RECONCILE-IN-D:
// stats shape { value, unit, label } — matches IWT.facility.stats directly.
// processes is IWT.facility.processes (string[]) — matches template expectation directly.
export const facility = {
  eyebrow: IWT.facility.eyebrow,
  title: IWT.facility.title,
  lead: IWT.facility.lead,
  photo: IWT.facility.photo,
  caption: "Vaughn Bullough Environmental Centre", // RECONCILE-IN-D: exact literal from sections/02-facility.jsx line 26
  stats: IWT.facility.stats,
  processEyebrow: IWT.facility.processEyebrow,
  processes: IWT.facility.processes,
  titleId: "iwt-fac-title", // RECONCILE-IN-D: literal from sections/02-facility.jsx
};

// §3 — CapabilityGrid01
// titleId "iwt-cap-title" verified from sections/03-capabilities.jsx line 11 — RECONCILE-IN-D:
// groups shape { heading, photo, body?, items[] } — matches IWT.capabilities.groups directly.
export const capabilities = {
  eyebrow: IWT.capabilities.eyebrow,
  title: IWT.capabilities.title,
  lead: IWT.capabilities.lead,
  groups: IWT.capabilities.groups,
  titleId: "iwt-cap-title", // RECONCILE-IN-D: literal from sections/03-capabilities.jsx
};

// §4 — DispatchCta01
// titleId "iwt-cta-title" verified from sections/04-cta.jsx line 11 — RECONCILE-IN-D:
// emergencyHref / emergencyDisplay cross-referenced from hero (same as real 04-cta.jsx uses c.hero).
// hotlineNote is the exact literal string from sections/04-cta.jsx line 57 — RECONCILE-IN-D:
export const cta = {
  ...IWT.cta,
  titleId: "iwt-cta-title", // RECONCILE-IN-D: literal from sections/04-cta.jsx
  emergencyHref: IWT.hero.emergencyHref,
  emergencyDisplay: IWT.hero.emergencyDisplay,
  hotlineNote: "Answered by a trained responder — every hour, every day of the year.", // RECONCILE-IN-D: exact literal from sections/04-cta.jsx
};

// §5 — RelatedRail01
// Both strings verified from sections/05-related.jsx lines 6–8 — RECONCILE-IN-D:
export const related = {
  currentSlug: "industrial-waste-treatment", // RECONCILE-IN-D: literal from sections/05-related.jsx
  titleId: "iwt-related-title", // RECONCILE-IN-D: literal from sections/05-related.jsx
};
