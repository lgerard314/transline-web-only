// Emergency Response — service page content. Plain strings + arrays only.

import { EMERGENCY_PHONE, VBEC_SHORT } from "./brand";

const EMERGENCY_HREF = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

export const emergencyResponse = {
  hero: {
    eyebrow: "24/7 spill response",
    title: "When it spills,",
    titleEm: "we're already moving",
    lead:
      "Trained spill responders and a prairie-wide subcontractor network on call around the clock — containment, cleanup, and disposal for flammable, corrosive, and toxic dangerous goods across central Canada.",
    photo: "/miller/fleet-trucks-gravel-transparent.png",
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
    title: "Ready for the call we hope you never have to make",
    lead:
      "Spill responses vary with the environment, material, and scale. Every one gets a customized approach — these are the situations our crews are equipped for.",
    items: [
      { name: "Chemical spills", blurb: "Acids, caustics, and reactive process chemicals contained at the source.", photo: "/miller/chemical-spills.png" },
      { name: "Fuel & diesel releases", blurb: "Tank, line, and roadway fuel releases recovered before they spread.", photo: "/miller/fuel-and-diesel-spills.png" },
      { name: "Transport incidents", blurb: "Highway and rail cargo spills cleared and the corridor reopened.", photo: "/miller/transport-incidents.png" },
      { name: "Industrial leaks", blurb: "Process and equipment failures sealed and the area made safe.", photo: "/miller/industrial-leaks.png" },
      { name: "Dangerous goods", blurb: "Flammable, corrosive, and toxic DG handled to TDG standards.", photo: "/miller/dangerous-goods.png" },
      { name: "Confined-space entry", blurb: "Trained entry into vaults, sumps, and vessels others can't reach.", photo: "/miller/confined-space-entry.png" },
      { name: "Vessel & tank failures", blurb: "Ruptured tanks drained, contained, and decontaminated on site.", photo: "/miller/vessel-and-tank-failures.png" },
      { name: "Contaminated soil", blurb: "Impacted soil excavated, treated, and routed to VBEC.", photo: "/miller/contaminated-soul.png" },
    ],
  },

  // §4 — Coverage & capabilities. Each capability carries its own photo +
  // one-line caption; hovering a row swaps the large image on the right and
  // the last-hovered image stays locked until another row is hovered.
  coverage: {
    eyebrow: "Coverage & readiness",
    title: "Across Manitoba and the prairies",
    lead:
      "From Winnipeg out across central Canada — local crews backed by a coordinated subcontractor network for large, remote, or multi-site incidents.",
    cta: { label: "Plan your spill response", href: "/contact-us/" },
    provides: [
      {
        text: "24-hour emergency response availability",
        photo: "/miller/24-hour-emergency-response-availability.png",
        bigAnchor: "50% 50%",
        thumbAnchor: "50% 52%",
        caption: "A Miller responder answers the emergency line around the clock — day, night, weekend, or holiday.",
      },
      {
        text: "Response coordination — locally and out-of-province",
        photo: "/miller/response-coordination.png",
        bigAnchor: "50% 62%",
        thumbAnchor: "50% 66%",
        caption: "Crews coordinate the response locally and across provincial lines for large or remote incidents.",
      },
      {
        text: "Spill containment",
        photo: "/miller/guy-with-clipboard-by-barrels.png",
        bigAnchor: "50% 50%",
        thumbAnchor: "50% 50%",
        caption: "A technician documents and secures recovered drums at the containment site.",
      },
      {
        text: "Clean-up and site remediation",
        photo: "/miller/snowing-hazmat-cleaning.png",
        bigAnchor: "50% 15%",
        thumbAnchor: "50% 20%",
        caption: "Hazmat crews decontaminate an impacted site through harsh prairie winter conditions.",
      },
      {
        text: "Treatment & disposal of spilled materials and contaminated soils",
        photo: "/miller/spill-containment.png",
        bigAnchor: "50% 48%",
        thumbAnchor: "55% 48%",
        caption: "Spilled product and contaminated soil are contained for treatment and documented disposal.",
      },
      {
        text: "Confined-space response",
        photo: "/miller/confined-space-response.png",
        bigAnchor: "50% 100%",
        thumbAnchor: "50% 44%",
        caption: "A trained responder makes entry into a confined space others can't safely reach.",
      },
    ],
  },

  // §5 — Closing CTA.
  cta: {
    eyebrow: "Don't wait for the spill",
    title: "Save our number…",
    titleEm: "before",
    titleAfter: "you need it",
    body: "Program Miller's 24/7 line into your phone today. When minutes matter, one call puts a trained crew on the road.",
    formTitle: "Request pre-incident planning",
    formNote: "Quotes, site planning, and general inquiries — we'll be in touch.",
  },
};
