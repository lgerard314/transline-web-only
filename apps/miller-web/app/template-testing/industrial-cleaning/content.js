// Industrial-cleaning sandbox content adapter.
// Imports the canonical content export and shapes it for each components-v2 template.
// Every string, id, and anchor is preserved VERBATIM from the source.
// Fields NOT present in the source content file are marked // RECONCILE-IN-D: so
// sub-project D can fold them back into lib/content/service-industrial-cleaning.js.

import { industrialCleaning } from "@/lib/content/service-industrial-cleaning";

// §1 — ServiceHero01  config: { alert:true, photoHalf:true, ghostPhone:true, reveal:true }
// titleId "ic-hero-title" verified from sections/01-hero.jsx line 10 — RECONCILE-IN-D:
// ghostPhone:true because the hero renders a ghost-phone CTA (emergencyDisplay/emergencyHref present and used).
// reveal:true because 01-hero.jsx places data-reveal on eyebrow, title, lead, and ctas.
export const hero = {
  ...industrialCleaning.hero,
  titleId: "ic-hero-title", // RECONCILE-IN-D: literal from sections/01-hero.jsx
};

// §2 — PhotoCardGrid01  config: { cardStyle:"thumb", head:"split" }
// Section class: mw-svc-inds mw-svc-inds--photo (no variant suffix).
// titleId "ic-cap-title" verified from sections/02-capabilities.jsx line 17 — RECONCILE-IN-D:
// head:"split" reproduces the split head (head-left eyebrow+h2, sibling p.lead) from 02-capabilities.jsx.
export const capabilities = {
  ...industrialCleaning.capabilities,
  titleId: "ic-cap-title", // RECONCILE-IN-D: literal from sections/02-capabilities.jsx
};

// §3 — FleetSplit01
// titleId "ic-fleet-title" verified from sections/03-fleet.jsx line 16 — RECONCILE-IN-D:
// mediaPhoto mapped from industrialCleaning.fleet.image ("/miller/industrial-vaccum-truck-transparent.png").
// NOTE: image path spelled "vaccum" (typo) — preserved verbatim from the content file.
export const fleet = {
  ...industrialCleaning.fleet,
  titleId: "ic-fleet-title", // RECONCILE-IN-D: literal from sections/03-fleet.jsx
  mediaPhoto: industrialCleaning.fleet.image, // RECONCILE-IN-D: FleetSplit01 expects mediaPhoto; source content key is image
};

// §4 — WhyBand01  config: { marker:"number", columns:4 }
// titleId "ic-why-title" verified from sections/04-why.jsx line 15 — RECONCILE-IN-D:
// marker:"number" renders mw-why__num from item.mark (verified: IC why items all have mark: "01".."04").
// No lead in head (04-why.jsx only has eyebrow + h2 in its header, no lead paragraph).
export const why = {
  ...industrialCleaning.why,
  titleId: "ic-why-title", // RECONCILE-IN-D: literal from sections/04-why.jsx
};

// §5 — DispatchCta01
// titleId "ic-cta-title" verified from sections/05-cta.jsx line 28 — RECONCILE-IN-D:
// emergencyHref / emergencyDisplay cross-referenced from hero (same as real 05-cta.jsx uses c.hero).
// hotlineNote is the exact literal string from sections/05-cta.jsx line 57 — RECONCILE-IN-D:
export const cta = {
  ...industrialCleaning.cta,
  titleId: "ic-cta-title", // RECONCILE-IN-D: literal from sections/05-cta.jsx
  emergencyHref: industrialCleaning.hero.emergencyHref,
  emergencyDisplay: industrialCleaning.hero.emergencyDisplay,
  hotlineNote: "Answered by a trained responder — every hour, every day of the year.", // RECONCILE-IN-D: exact literal from sections/05-cta.jsx
};

// §6 — RelatedRail01
// Both strings verified from sections/06-related.jsx lines 6–8 — RECONCILE-IN-D:
export const related = {
  currentSlug: "industrial-cleaning", // RECONCILE-IN-D: literal from sections/06-related.jsx
  titleId: "ic-related-title", // RECONCILE-IN-D: literal from sections/06-related.jsx
};
