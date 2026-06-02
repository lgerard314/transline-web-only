// Customer-waste-collection sandbox content adapter.
// Imports the canonical content export and shapes it for each components-v2 template.
// Every string, id, and anchor is preserved VERBATIM from the source.
// Fields NOT present in the source content file are marked // RECONCILE-IN-D: so
// sub-project D can fold them back into lib/content/service-customer-waste-collection.js.

import { customerWasteCollection } from "@/lib/content/service-customer-waste-collection";

// §1 — ServiceHero01
// titleId "cwc-hero-title" verified from sections/01-hero.jsx line 9 — RECONCILE-IN-D:
export const hero = {
  ...customerWasteCollection.hero,
  titleId: "cwc-hero-title", // RECONCILE-IN-D: literal from sections/01-hero.jsx
};

// §2 — CapacityLadder01
// titleId "cwc-scale-title" verified from sections/02-scale.jsx line 51 — RECONCILE-IN-D:
// headPhoto "/miller/dumptruck-2.png" verified from sections/02-scale.jsx line 64 — RECONCILE-IN-D:
export const scale = {
  ...customerWasteCollection.scale,
  titleId: "cwc-scale-title", // RECONCILE-IN-D: literal from sections/02-scale.jsx
  headPhoto: "/miller/dumptruck-2.png", // RECONCILE-IN-D: literal from sections/02-scale.jsx
};

// §3 — ProcessFlow01
// titleId "cwc-steps-title" verified from sections/03-process.jsx line 11 — RECONCILE-IN-D:
export const process = {
  ...customerWasteCollection.process,
  titleId: "cwc-steps-title", // RECONCILE-IN-D: literal from sections/03-process.jsx
};

// §4 — PhotoCardGrid01 (cardStyle:"gallery", head:"split", trailingCta:true)
// titleId "cwc-inds-title" verified from sections/04-industries.jsx line 11 — RECONCILE-IN-D:
// industries.cta is already in the content file and used by trailingCta.
export const industries = {
  ...customerWasteCollection.industries,
  titleId: "cwc-inds-title", // RECONCILE-IN-D: literal from sections/04-industries.jsx
};

// §5 — ScheduleCta01
// titleId "cwc-cta-title" verified from sections/05-cta.jsx line 12 — RECONCILE-IN-D:
export const cta = {
  ...customerWasteCollection.cta,
  titleId: "cwc-cta-title", // RECONCILE-IN-D: literal from sections/05-cta.jsx
};

// §6 — RelatedRail01
// Both strings verified from sections/06-related.jsx lines 6–8 — RECONCILE-IN-D:
export const related = {
  currentSlug: "customer-waste-collection", // RECONCILE-IN-D: literal from sections/06-related.jsx
  titleId: "cwc-related-title", // RECONCILE-IN-D: literal from sections/06-related.jsx
};
