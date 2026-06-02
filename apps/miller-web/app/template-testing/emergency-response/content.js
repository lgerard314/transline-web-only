// Emergency-response sandbox content adapter.
// Imports the canonical content export and shapes it for each components-v2 template.
// Every string, id, and anchor is preserved VERBATIM from the source.
// Fields NOT present in the source content file are marked // RECONCILE-IN-D: so
// sub-project D can fold them back into lib/content/service-emergency-response.js.

import { emergencyResponse } from "@/lib/content/service-emergency-response";

// §1 — ServiceHero01
// titleId "er-hero-title" is a literal from 01-hero.jsx — RECONCILE-IN-D:
export const hero = {
  ...emergencyResponse.hero,
  titleId: "er-hero-title", // RECONCILE-IN-D: literal from sections/01-hero.jsx
};

// §2 — ResponseTimeline01
// titleId "er-tl-title" is a literal from 02-timeline.jsx — RECONCILE-IN-D:
// interval 4200 is passed via content so the template's `content.interval ?? 4200` picks it up.
export const timeline = {
  ...emergencyResponse.timeline,
  titleId: "er-tl-title", // RECONCILE-IN-D: literal from sections/02-timeline.jsx
  interval: 4200,
};

// §3 — PhotoCardGrid01 (cardStyle:"thumb", head:"media-split")
// titleId "er-inc-title" is a literal from 03-incidents.jsx — RECONCILE-IN-D:
// headMedia PNG path is the literal from 03-incidents.jsx line 31 — RECONCILE-IN-D:
export const incidents = {
  ...emergencyResponse.incidents,
  titleId: "er-inc-title", // RECONCILE-IN-D: literal from sections/03-incidents.jsx
  headMedia: "/miller/pickup-truck-transparent-removebg.png", // RECONCILE-IN-D: literal from sections/03-incidents.jsx
};

// §4 — PickerGallery01
// titleId "er-cov-title" is a literal from 04-coverage.jsx — RECONCILE-IN-D:
// phoneHref / phoneDisplay are cross-referenced from hero (same pattern as the real 04-coverage.jsx).
// items maps to emergencyResponse.coverage.provides (CoverageGallery expects items, not provides).
export const coverage = {
  eyebrow: emergencyResponse.coverage.eyebrow,
  title: emergencyResponse.coverage.title,
  lead: emergencyResponse.coverage.lead,
  cta: emergencyResponse.coverage.cta,
  items: emergencyResponse.coverage.provides,
  titleId: "er-cov-title", // RECONCILE-IN-D: literal from sections/04-coverage.jsx
  phoneHref: emergencyResponse.hero.emergencyHref,
  phoneDisplay: emergencyResponse.hero.emergencyDisplay,
};

// §5 — DispatchCta01
// titleId "er-cta-title" is a literal from 05-cta.jsx — RECONCILE-IN-D:
// emergencyHref / emergencyDisplay are cross-referenced from hero (same as real 05-cta.jsx).
// hotlineNote is the exact literal string from 05-cta.jsx line 55-57 — RECONCILE-IN-D:
// showOptionalFields is omitted → template defaults to false via `content.showOptionalFields ?? false`.
export const cta = {
  ...emergencyResponse.cta,
  titleId: "er-cta-title", // RECONCILE-IN-D: literal from sections/05-cta.jsx
  emergencyHref: emergencyResponse.hero.emergencyHref,
  emergencyDisplay: emergencyResponse.hero.emergencyDisplay,
  hotlineNote: "Answered by a trained responder — every hour, every day of the year.", // RECONCILE-IN-D: exact literal from sections/05-cta.jsx
};

// §6 — RelatedRail01
// Both strings are literals from 06-related.jsx — RECONCILE-IN-D:
export const related = {
  currentSlug: "emergency-response", // RECONCILE-IN-D: literal from sections/06-related.jsx
  titleId: "er-related-title", // RECONCILE-IN-D: literal from sections/06-related.jsx
};
