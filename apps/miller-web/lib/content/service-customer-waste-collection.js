// Customer Waste Collection — service page content. Plain strings + arrays
// only (no JSX) per design spec §5.1. Markup lives in the page composition.

import { EMERGENCY_PHONE, VBEC_FULL_NAME, VBEC_SHORT } from "./brand";

export const customerWasteCollection = {
  slug: "customer-waste-collection",

  hero: {
    titleId: "cwc-hero-title",
    eyebrow: "Collection & logistics",
    title: "Containerized pickup,",
    titleEm: "on your schedule",
    lead:
      "Scheduled, documented collection of hazardous and non-hazardous waste in any container — from a single pail to full van loads — moved from your loading dock to the licensed VBEC facility under one chain of custody.",
    photo: "/miller/custom/steel-drums-of-waste.png",
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`,
    secondaryCta: { label: "Schedule a pickup", labelShort: "Schedule pickup", href: "/contact-us/" },
  },

  // §2 — "Any volume" container capacity ladder.
  scale: {
    titleId: "cwc-scale-title",
    headPhoto: "/miller/custom/dumptruck-2.png",
    eyebrow: "Any volume",
    title: "From a single pail to full van loads",
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
    titleId: "cwc-steps-title",
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
    // One banner per step — cycled in lock-step with the route-line animation.
    notifications: [
      { title: "Streams profiled", body: "Waste types and volumes logged — service sized to your site." },
      { title: "Pickup scheduled", body: "A cadence is set. Your next collection window is booked." },
      { title: "Packed & manifested", body: "Containers labelled and documented for hazardous transport." },
      { title: "En route to VBEC", body: `Dedicated truck rolling to the licensed ${VBEC_SHORT} under chain of custody.` },
    ],
  },

  // §4 — Industries.
  industries: {
    titleId: "cwc-inds-title",
    eyebrow: "Who we collect from",
    title: "Built for regulated generators",
    lead: `On-site technicians handle the packaging and paperwork so your team doesn't have to — across every sector that ${VBEC_FULL_NAME} serves.`,
    items: [
      { name: "Manufacturing", photo: "/miller/custom/industrial-leaks.png", blurb: "Process solvents, sludges, and off-spec plant waste." },
      { name: "Aerospace & Defence", photo: "/miller/custom/dangerous-goods.png", blurb: "Specialty chemicals, fuels, and secure-site streams." },
      { name: "Agriculture", photo: "/miller/custom/contaminated-soul.png", blurb: "Surplus pesticides, fertilizers, and used farm oils." },
      { name: "Transportation & Rail", photo: "/miller/custom/transport-incidents.png", blurb: "Yard spill residues, used fluids, and shop waste." },
      { name: "Healthcare", photo: "/miller/custom/hazmat-cleaning.png", blurb: "Pharmaceutical, lab, and regulated medical waste." },
      { name: "Biotech & Pharma", photo: "/miller/custom/chemical-spills.png", blurb: "Reactive reagents, solvents, and expired product." },
      { name: "Education", photo: "/miller/custom/clean-up-and-site-remediation.png", blurb: "Lab-pack service for campus chemistry and shops." },
      { name: "Oil & Gas", photo: "/miller/custom/fuel-and-diesel-spills.png", blurb: "Tank bottoms, drilling waste, and hydrocarbons." },
      { name: "Other", photo: "/miller/custom/dumptruck-on-ice.png", blurb: "Almost any regulated waste stream — just ask." },
    ],
    cta: { label: "Talk to Miller", href: "/contact-us/" },
  },

  // §6 — Related services rail.
  related: {
    currentSlug: "customer-waste-collection",
    titleId: "cwc-related-title",
  },

  // §5 — Closing CTA: split panel with a purpose-built scheduling form.
  cta: {
    titleId: "cwc-cta-title",
    eyebrow: "Get on the schedule",
    title: "Set up a collection",
    titleEm: "schedule",
    body: "Tell us what you generate and how often. We'll build a pickup cadence that keeps your site compliant and your waste volume under control.",
    formTitle: "Request a pickup schedule",
    nextEyebrow: "What happens next",
    next: [
      { num: "01", name: "We profile your streams", text: "A coordinator reviews your waste types, containers, and site — usually within one business day." },
      { num: "02", name: "We confirm a cadence", text: "You get a pickup schedule sized to how fast you generate, from a one-time clear-out to weekly service." },
      { num: "03", name: "Your first pickup runs", text: "On-site technicians pack, label, and manifest every container for transport to the licensed VBEC facility." },
    ],
  },

};
