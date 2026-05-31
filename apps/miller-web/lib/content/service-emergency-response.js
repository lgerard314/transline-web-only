// Emergency Response — service page content. Plain strings + arrays only.

import { EMERGENCY_PHONE, VBEC_SHORT } from "./brand";

const EMERGENCY_HREF = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

export const emergencyResponse = {
  slug: "emergency-response",

  hero: {
    kicker: "Industrial Services",
    name: "Emergency Response",
    eyebrow: "24/7 spill response",
    title: "When it spills,",
    titleEm: "we're already moving",
    lead:
      "Trained spill responders and a prairie-wide subcontractor network on call around the clock — containment, cleanup, and disposal for flammable, corrosive, and toxic dangerous goods across central Canada.",
    photo: "/miller/fleet-trucks-gravel-transparent.png",
    caption: "Containment on site, any hour",
    callSup: "Call the 24/7 line",
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: EMERGENCY_HREF,
    secondaryCta: { label: "Pre-incident planning", href: "/contact-us/" },
  },

  // §2 — Response timeline (signature layout for this page).
  timeline: {
    eyebrow: "When you call",
    title: "From your call to all-clear",
    lead:
      "Every incident is different — but the response cadence never changes. Answered fast, dispatched fast, contained first.",
    steps: [
      { t: "T + 0", name: "Call answered", body: "A real responder picks up — 24/7, no queue. We capture location, material, and scale on the first call." },
      { t: "Mobilize", name: "Crew dispatched", body: "The nearest trained crew and equipment roll out, with out-of-province coordination when the incident crosses borders." },
      { t: "On site", name: "Contain first", body: "Stop the spread — booms, berms, and confined-space entry to secure the source and protect drains and waterways." },
      { t: "Recover", name: "Clean up & remediate", body: "Recover product, excavate or treat impacted soil, and decontaminate the affected area." },
      { t: "Close out", name: "Dispose & document", body: `Spilled material and contaminated soil move to ${VBEC_SHORT} under documented chain of custody, with a full incident record.` },
    ],
    notifications: [
      {
        title: "Live on the line",
        body: "A responder is on the line. Estimated arrival to site: 45 min.",
      },
      {
        title: "Crew en route",
        body: "Nearest crew is en route with containment gear. ETA: 38 min.",
      },
      {
        title: "On site now",
        body: "Crew on site — booms deployed and the source is secured.",
      },
      {
        title: "Recovery underway",
        body: "Recovery underway. Impacted soil is being excavated and treated.",
      },
      {
        title: "Closing the loop",
        body: `Material routed to ${VBEC_SHORT}. Full incident record in progress.`,
      },
    ],
  },

  // §3 — Incident types.
  incidents: {
    eyebrow: "What we respond to",
    title: "Built for the call we hope you never make",
    lead:
      "Spill responses vary with the environment, material, and scale. Every one gets a customized approach — these are the situations our crews are equipped for.",
    items: [
      { name: "Chemical spills", blurb: "Acids, caustics, and reactive process chemicals contained at the source.", photo: "/miller/services/remediation-hazmat-excavation.webp" },
      { name: "Fuel & diesel releases", blurb: "Tank, line, and roadway fuel releases recovered before they spread.", photo: "/miller/case-studies/hwy-16-diesel-spill.webp" },
      { name: "Transport incidents", blurb: "Highway and rail cargo spills cleared and the corridor reopened.", photo: "/miller/case-studies/hwy-16-diesel-spill-response.webp" },
      { name: "Industrial leaks", blurb: "Process and equipment failures sealed and the area made safe.", photo: "/miller/services/remediation-industrial-site.webp" },
      { name: "Dangerous goods", blurb: "Flammable, corrosive, and toxic DG handled to TDG standards.", photo: "/miller/services/industrial-waste-treatment-hero.webp" },
      { name: "Confined-space entry", blurb: "Trained entry into vaults, sumps, and vessels others can't reach.", photo: "/miller/services/industrial-cleaning-hero.jpeg" },
      { name: "Vessel & tank failures", blurb: "Ruptured tanks drained, contained, and decontaminated on site.", photo: "/miller/services/remediation-ust.webp" },
      { name: "Contaminated soil", blurb: "Impacted soil excavated, treated, and routed to VBEC.", photo: "/miller/services/remediation-contaminated-soil.webp" },
    ],
  },

  // §4 — Coverage & capabilities.
  coverage: {
    eyebrow: "Coverage & readiness",
    title: "Across Manitoba and the prairies",
    lead:
      "From Winnipeg out across central Canada — local crews backed by a coordinated subcontractor network for large, remote, or multi-site incidents.",
    provides: [
      "24-hour emergency response availability",
      "Response coordination — locally and out-of-province",
      "Spill containment",
      "Clean-up and site remediation",
      "Treatment & disposal of spilled materials and contaminated soils",
      "Confined-space response",
    ],
    photo: "/miller/services/remediation-emergency-spill.webp",
  },

  // §5 — Closing CTA.
  cta: {
    eyebrow: "Don't wait for the spill",
    title: "Save the number before you need it",
    body: "Program Miller's 24/7 line into your phone today. When minutes matter, one call puts a trained crew on the road.",
  },

  relatedSlugs: ["project-management", "customer-waste-collection", "industrial-waste-treatment"],
};
