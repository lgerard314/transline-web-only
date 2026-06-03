// Environmental-remediation sandbox content adapter.
// Imports the canonical content export and shapes it for each components-v2 template.
// Every string, id, and anchor is preserved VERBATIM from the source.
// Fields NOT present in the source content file are marked // RECONCILE-IN-D: so
// sub-project D can fold them back into lib/content/service-environmental-remediation.js.

import { REMEDIATION } from "@/lib/content/service-environmental-remediation";

// §1 — ServiceHero01  config: { media:"video", reveal:true, ghostPhone:true }
// titleId "rem-hero-title" is a literal from 01-hero.jsx — RECONCILE-IN-D:
// video.id / video.title sourced from films[0] per the real 01-hero.jsx (const film = c.videos.films[0]).
// caption is REMEDIATION.hero.caption (already in content file).
export const hero = {
  ...REMEDIATION.hero,
  titleId: "rem-hero-title", // RECONCILE-IN-D: literal from sections/01-hero.jsx
  video: {
    id: REMEDIATION.videos.films[0].id,
    title: REMEDIATION.videos.films[0].title,
  },
};

// §2 — PhotoCardGrid01  config: { cardStyle:"wwd", head:"split", variant:"mw-rem-wwd" }
// titleId "rem-wwd-title" is a literal from 02-what-we-do.jsx — RECONCILE-IN-D:
export const whatWeDo = {
  ...REMEDIATION.whatWeDo,
  titleId: "rem-wwd-title", // RECONCILE-IN-D: literal from sections/02-what-we-do.jsx
};

// §3 — PickerGallery01  config: { serve:true }
// titleId "rem-serve-title" is a literal from 03-industries.jsx — RECONCILE-IN-D:
// items maps to REMEDIATION.whoWeServe.provides (CoverageGallery expects `items`, content key is `provides`).
// NOTE: the real 03-industries.jsx passes NO phoneHref/phoneDisplay to CoverageGallery — this section
// has no phone CTA (only the "Discover your site" link). So we deliberately omit them here; passing them
// would make CoverageGallery render an extra 24/7-emergency phone block that the real page lacks.
export const whoWeServe = {
  eyebrow: REMEDIATION.whoWeServe.eyebrow,
  title: REMEDIATION.whoWeServe.title,
  lead: REMEDIATION.whoWeServe.lead,
  cta: REMEDIATION.whoWeServe.cta,
  items: REMEDIATION.whoWeServe.provides,
  titleId: "rem-serve-title", // RECONCILE-IN-D: literal from sections/03-industries.jsx
};

// §4 — ProcessFlow01  config: { wide:true }
// titleId "rem-steps-title" is a literal from 04-process.jsx — RECONCILE-IN-D:
export const process = {
  ...REMEDIATION.process,
  titleId: "rem-steps-title", // RECONCILE-IN-D: literal from sections/04-process.jsx
};

// §5 — VideoPicker01  (no config needed)
// titleId "rem-vid-title" is a literal from 05-videos.jsx — RECONCILE-IN-D:
export const videos = {
  ...REMEDIATION.videos,
  titleId: "rem-vid-title", // RECONCILE-IN-D: literal from sections/05-videos.jsx
};

// §6 — PhotoCardGrid01  config: { cardStyle:"case", head:"split", variant:"mw-rem-case" }
// titleId "rem-case-title" is a literal from 06-case-studies.jsx — RECONCILE-IN-D:
export const caseStudies = {
  ...REMEDIATION.caseStudies,
  titleId: "rem-case-title", // RECONCILE-IN-D: literal from sections/06-case-studies.jsx
};

// §7 — WhyBand01  config: { statCycle:true, variant:"mw-why--rem" }
// titleId "rem-why-title" is a literal from 07-why-choose.jsx — RECONCILE-IN-D:
export const whyChoose = {
  ...REMEDIATION.whyChoose,
  titleId: "rem-why-title", // RECONCILE-IN-D: literal from sections/07-why-choose.jsx
};

// §8 — DispatchCta01
// titleId "rem-cta-title" is a literal from 08-cta.jsx — RECONCILE-IN-D:
// emergencyHref / emergencyDisplay cross-referenced from hero (same as real 08-cta.jsx uses c.hero).
// hotlineNote is the exact literal string from 08-cta.jsx line 56 — RECONCILE-IN-D:
export const cta = {
  ...REMEDIATION.cta,
  titleId: "rem-cta-title", // RECONCILE-IN-D: literal from sections/08-cta.jsx
  emergencyHref: REMEDIATION.hero.emergencyHref,
  emergencyDisplay: REMEDIATION.hero.emergencyDisplay,
  hotlineNote: "Answered by a trained responder — every hour, every day of the year.", // RECONCILE-IN-D: exact literal from sections/08-cta.jsx
};

// §9 — RelatedRail01
// Both strings are literals from 09-related.jsx — RECONCILE-IN-D:
export const related = {
  currentSlug: "environmental-remediation-services", // RECONCILE-IN-D: literal from sections/09-related.jsx
  titleId: "rem-related-title", // RECONCILE-IN-D: literal from sections/09-related.jsx
};
