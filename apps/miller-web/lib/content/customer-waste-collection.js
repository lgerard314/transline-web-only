// Customer Waste Collection — v2 service page content (the first interior v2 page).
// Plain strings + arrays only (no JSX) per design spec §5.1. Markup lives in the
// components-v2 *-02 templates this page composes. The v1 module
// (service-customer-waste-collection.js) stays untouched for reference.

import { EMERGENCY_PHONE, VBEC_FULL_NAME, VBEC_SHORT } from "./brand";

const EMERGENCY_TEL = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

export const customerWasteCollection = {
  slug: "customer-waste-collection",

  // §1 — light alert masthead + chain-of-custody strip.
  hero: {
    titleId: "cwc2-hero-title",
    eyebrow: "Collection & logistics",
    title: "Containerized pickup,",
    titleEm: "on your schedule",
    lead:
      "Scheduled, documented collection of hazardous and non-hazardous waste in any container — from a single pail to full van loads — moved from your loading dock to the licensed VBEC facility under one chain of custody.",
    photo: "/miller/cwc/hero-dock.png",
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: EMERGENCY_TEL,
    cta: { label: "Schedule a pickup", href: "/contact-us/" },
    custody: {
      caption: "One chain of custody",
      nodes: [
        { num: "01", label: "Your dock" },
        { num: "02", label: "Miller truck" },
        { num: "03", label: `${VBEC_SHORT} gate` },
      ],
    },
  },

  // §2 — "Any volume" container lineup (spec-sheet size chart).
  containers: {
    titleId: "cwc2-line-title",
    eyebrow: "Any volume",
    title: "From a single pail to full van loads",
    lead:
      "One drum a year or a van load every week — every size runs the same documented chain of custody. We size the service to your generation rate, not the other way around.",
    tiers: [
      {
        num: "01",
        name: "Pails",
        spec: "≤ 20 L",
        height: "0.4 m",
        image: "/miller/cwc/container-pail.png",
        note: "Lab packs and small-quantity streams, packed and labelled on site.",
      },
      {
        num: "02",
        name: "Drums",
        spec: "205 L",
        height: "0.9 m",
        image: "/miller/cwc/container-drum.png",
        note: "Steel and poly, open- or tight-head — the workhorse container.",
      },
      {
        num: "03",
        name: "Totes / IBC",
        spec: "1,000 L",
        height: "1.2 m",
        image: "/miller/cwc/container-tote.png",
        note: "Caged IBCs and reconditioned totes for higher-volume streams.",
      },
      {
        num: "04",
        name: "Van loads",
        spec: "Bulk",
        height: "1.0 m",
        image: "/miller/cwc/container-vanload.png",
        note: "Full, palletized container loads moved on dedicated trucks.",
      },
    ],
  },

  // §3 — How it works (dock → VBEC route + cycling notifications).
  process: {
    titleId: "cwc2-flow-title",
    eyebrow: "How it works",
    title: "Four steps from dock to disposition",
    lead:
      "Every collection runs the same documented route — from the first profile to a signed manifest at the facility gate.",
    route: `Your dock → ${VBEC_SHORT}`,
    steps: [
      {
        num: "01",
        tag: "Intake",
        name: "Profile",
        body: "Tell us your streams, volumes, and site. We profile each waste type up front so nothing is a surprise at pickup.",
      },
      {
        num: "02",
        tag: "Cadence",
        name: "Schedule",
        body: "We set a cadence that matches how fast you generate — a one-off clear-out, monthly service, or multiple pickups a week.",
      },
      {
        num: "03",
        tag: "On-site",
        name: "Package & manifest",
        body: "On-site technicians pack, label, and document every container for compliant, hazardous-rated transport.",
      },
      {
        num: "04",
        tag: "Transport",
        name: `Transport to ${VBEC_SHORT}`,
        body: `Dedicated trucks move your waste under documented chain of custody to the licensed ${VBEC_SHORT} for treatment or disposal.`,
      },
    ],
    notifications: [
      { title: "Streams profiled", body: "Waste types and volumes logged — service sized to your site." },
      { title: "Pickup scheduled", body: "A cadence is set. Your next collection window is booked." },
      { title: "Packed & manifested", body: "Containers labelled and documented for hazardous transport." },
      { title: "En route to VBEC", body: `Dedicated truck rolling to the licensed ${VBEC_SHORT} under chain of custody.` },
    ],
  },

  // §4 — Fleet showcase (the page's single dark-walnut anchor).
  fleet: {
    titleId: "cwc2-fleet-title",
    eyebrow: "The fleet",
    title: "Your waste rides on",
    titleEm: "our trucks",
    lead:
      "No brokers, no third-party haulers. Every collection moves on Miller-owned, hazardous-rated equipment — placarded for transport of dangerous goods, manifest-ready, and matched to the size of your load.",
    units: [
      {
        num: "01",
        name: "Vacuum units",
        role: "Bulk liquids & sludges",
        body: "Kenworth, Peterbilt, and Freightliner vacuum trucks for tank bottoms, washwater, and pumpable streams.",
        image: "/miller/cwc/fleet-vacuum.png",
      },
      {
        num: "02",
        name: "Highway tractors",
        role: "Palletized van loads",
        body: "Volvo and International tractors moving full container loads — palletized drums, totes, and lab packs in dedicated vans.",
        image: "/miller/cwc/fleet-tractor.png",
      },
      {
        num: "03",
        name: "Light duty",
        role: "Small pickups & site support",
        body: "Super Duty service units for single-pail collections, lab-pack visits, and site assessments across our coverage area.",
        image: "/miller/cwc/fleet-lightduty.png",
      },
    ],
    footnote: "Every unit placarded, manifest-equipped, and dispatched from our own yard.",
  },

  // §5 — Stream index (sector manifest + photo swap).
  streams: {
    titleId: "cwc2-index-title",
    eyebrow: "Who we collect from",
    title: "Built for regulated generators",
    lead: `On-site technicians handle the packaging and paperwork so your team doesn't have to — across every sector that ${VBEC_FULL_NAME} serves.`,
    cta: { label: "Talk to Miller", href: "/contact-us/" },
    sectors: [
      {
        num: "01",
        name: "Manufacturing",
        streams: "Process solvents, sludges, and off-spec plant waste",
        photo: "/miller/cwc/sector-manufacturing.png",
        caption: "Drum staging on the plant floor",
        default: true,
      },
      {
        num: "02",
        name: "Aerospace & Defence",
        streams: "Specialty chemicals, fuels, and secure-site streams",
        photo: "/miller/cwc/sector-aerospace.png",
        caption: "Hangar-side chemical collection",
      },
      {
        num: "03",
        name: "Agriculture",
        streams: "Surplus pesticides, fertilizers, and used farm oils",
        photo: "/miller/cwc/sector-agriculture.png",
        caption: "Farm chemical-shed clear-outs",
      },
      {
        num: "04",
        name: "Transportation & Rail",
        streams: "Yard spill residues, used fluids, and shop waste",
        photo: "/miller/cwc/sector-rail.png",
        caption: "Rail-yard and shop-waste service",
      },
      {
        num: "05",
        name: "Healthcare",
        streams: "Pharmaceutical, lab, and regulated medical waste",
        photo: "/miller/cwc/sector-healthcare.png",
        caption: "Regulated clinical-stream pickup",
      },
      {
        num: "06",
        name: "Biotech & Pharma",
        streams: "Reactive reagents, solvents, and expired product",
        photo: "/miller/cwc/sector-biotech.png",
        caption: "Lab-pack service at the bench",
      },
      {
        num: "07",
        name: "Education",
        streams: "Lab packs for campus chemistry and shops",
        photo: "/miller/cwc/sector-education.png",
        caption: "Campus chemistry clear-outs",
      },
      {
        num: "08",
        name: "Oil & Gas",
        streams: "Tank bottoms, drilling waste, and hydrocarbons",
        photo: "/miller/cwc/sector-oilgas.png",
        caption: "Hydrocarbon stream collection",
      },
      {
        num: "09",
        name: "Other generators",
        streams: "Almost any regulated waste stream — just ask",
        photo: "/miller/cwc/sector-other.png",
        caption: "If it's regulated, we can route it",
      },
    ],
  },

  // §6 — Closing CTA: light split panel with the scheduling form.
  cta: {
    titleId: "cwc2-sched-title",
    eyebrow: "Get on the schedule",
    title: "Set up a collection",
    titleEm: "schedule",
    body:
      "Tell us what you generate and how often. We'll build a pickup cadence that keeps your site compliant and your waste volume under control.",
    formTitle: "Request a pickup schedule",
    nextEyebrow: "What happens next",
    next: [
      {
        num: "01",
        name: "We profile your streams",
        text: "A coordinator reviews your waste types, containers, and site — usually within one business day.",
      },
      {
        num: "02",
        name: "We confirm a cadence",
        text: "You get a pickup schedule sized to how fast you generate, from a one-time clear-out to weekly service.",
      },
      {
        num: "03",
        name: "Your first pickup runs",
        text: `On-site technicians pack, label, and manifest every container for transport to the licensed ${VBEC_SHORT} facility.`,
      },
    ],
  },

  // §7 — Related services rail (shared RelatedServices close).
  related: {
    currentSlug: "customer-waste-collection",
    titleId: "cwc2-related-title",
  },
};
