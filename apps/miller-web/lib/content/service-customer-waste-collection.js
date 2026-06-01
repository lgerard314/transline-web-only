// Customer Waste Collection — service page content. Plain strings + arrays
// only (no JSX) per design spec §5.1. Markup lives in the page composition.

import { EMERGENCY_PHONE, VBEC_FULL_NAME, VBEC_SHORT } from "./brand";

export const customerWasteCollection = {
  slug: "customer-waste-collection",

  hero: {
    eyebrow: "Collection & logistics",
    title: "Containerized pickup,",
    titleEm: "on your schedule",
    lead:
      "Scheduled, documented collection of hazardous and non-hazardous waste in any container — from a single pail to full van loads — moved from your loading dock to the licensed VBEC facility under one chain of custody.",
    photo: "/miller/steel-drums-of-waste.png",
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`,
    secondaryCta: { label: "Schedule a pickup", labelShort: "Schedule pickup", href: "/contact-us/" },
  },

  // §2 — "Any volume" container capacity ladder.
  scale: {
    eyebrow: "Any volume",
    title: "From a single pail to full van loads",
    kicker: "Four container tiers · one chain of custody",
    lead:
      "One drum a year or a van load every week — it runs on the same documented chain of custody either way. We size the service to your generation rate, not the other way around.",
    // fill = relative capacity, drives the proportional clay bar (0–100).
    // glyph = monoline container icon key rendered in the section.
    tiers: [
      { num: "01", glyph: "pail", name: "Pails", spec: "≤ 20 L", fill: 16, note: "Lab packs and small-quantity streams, packed and labelled on site." },
      { num: "02", glyph: "drum", name: "Drums", spec: "205 L", fill: 42, note: "Steel and poly, open- or tight-head — the workhorse container." },
      { num: "03", glyph: "tote", name: "Totes / IBC", spec: "1,000 L", fill: 72, note: "Caged IBCs and reconditioned totes for higher-volume streams." },
      { num: "04", glyph: "van", name: "Van loads", spec: "Bulk", fill: 100, note: "Full, palletized container loads moved on dedicated trucks." },
    ],
  },

  // §3 — How it works (dock → VBEC routing manifest).
  process: {
    eyebrow: "How it works",
    title: "Four steps from dock to disposition",
    lead: "Every collection runs the same documented route — from the first profile to a signed manifest at the facility gate.",
    route: "Your dock → VBEC",
    steps: [
      { num: "01", tag: "Intake", name: "Profile", body: "Tell us your streams, volumes, and site. We profile each waste type up front so nothing is a surprise at pickup." },
      { num: "02", tag: "Cadence", name: "Schedule", body: "We set a cadence that matches how fast you generate — a one-off clear-out, monthly service, or multiple pickups a week." },
      { num: "03", tag: "On-site", name: "Package & manifest", body: "On-site technicians pack, label, and document every container for compliant, hazardous-rated transport." },
      { num: "04", tag: "Transport", name: "Transport to VBEC", body: `Dedicated trucks move your waste under documented chain of custody to the licensed ${VBEC_SHORT} for treatment or disposal.` },
    ],
  },

  // §4 — Industries.
  industries: {
    eyebrow: "Who we collect from",
    title: "Built for regulated generators",
    lead: `On-site technicians handle the packaging and paperwork so your team doesn't have to — across every sector that ${VBEC_FULL_NAME} serves.`,
    items: [
      { name: "Manufacturing", photo: "/miller/industrial-leaks.png" },
      { name: "Aerospace & Defence", photo: "/miller/dangerous-goods.png" },
      { name: "Agriculture", photo: "/miller/contaminated-soul.png" },
      { name: "Transportation & Rail", photo: "/miller/transport-incidents.png" },
      { name: "Healthcare", photo: "/miller/hazmat-cleaning.png" },
      { name: "Biotech & Pharma", photo: "/miller/chemical-spills.png" },
      { name: "Education", photo: "/miller/clean-up-and-site-remediation.png" },
      { name: "Oil & Gas", photo: "/miller/fuel-and-diesel-spills.png" },
    ],
  },

  // §5 — Closing CTA: split panel with a purpose-built scheduling form.
  cta: {
    eyebrow: "Get on the schedule",
    title: "Set up a collection",
    titleEm: "schedule",
    body: "Tell us what you generate and how often. We'll build a pickup cadence that keeps your site compliant and your waste volume under control.",
    formTitle: "Request a pickup schedule",
    formNote: "Share your containers and cadence — a coordinator confirms a first pickup window within one business day.",
    nextEyebrow: "What happens next",
    next: [
      { num: "01", name: "We profile your streams", text: "A coordinator reviews your waste types, containers, and site — usually within one business day." },
      { num: "02", name: "We confirm a cadence", text: "You get a pickup schedule sized to how fast you generate, from a one-time clear-out to weekly service." },
      { num: "03", name: "Your first pickup runs", text: "On-site technicians pack, label, and manifest every container for transport to the licensed VBEC facility." },
    ],
  },

};
