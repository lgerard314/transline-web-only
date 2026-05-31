// Customer Waste Collection — service page content. Plain strings + arrays
// only (no JSX) per design spec §5.1. Markup lives in the page composition.

import { EMERGENCY_PHONE, VBEC_FULL_NAME, VBEC_SHORT } from "./brand";

export const customerWasteCollection = {
  slug: "customer-waste-collection",

  hero: {
    kicker: "Industrial Services",
    name: "Customer Waste Collection",
    eyebrow: "Collection & logistics",
    title: "Containerized pickup,",
    titleEm: "on your schedule",
    lead:
      "Scheduled, documented collection of hazardous and non-hazardous waste in any container — from a single pail to full van loads — moved from your loading dock to the licensed VBEC facility under one chain of custody.",
    photo: "/miller/services/customer-waste-collection-hero.webp",
    caption: "Packaged & manifested on site",
    stat: { value: "450+", label: "active collection clients" },
    primaryCta: { label: "Schedule a pickup", href: "/contact-us/" },
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`,
  },

  // §2 — "Any volume" scale ribbon (new layout for this page).
  scale: {
    eyebrow: "Any volume",
    title: "From a single pail to full van loads",
    lead:
      "One drum a year or a van load every week — it runs on the same documented chain of custody either way. We size the service to your generation rate, not the other way around.",
    steps: [
      { num: "01", name: "Pails", spec: "≤ 20 L", note: "Lab packs, small-quantity streams" },
      { num: "02", name: "Drums", spec: "205 L", note: "Steel & poly, open- or tight-head" },
      { num: "03", name: "Totes", spec: "1,000 L", note: "IBCs and reconditioned totes" },
      { num: "04", name: "Van loads", spec: "Bulk", note: "Full container loads, palletized" },
    ],
  },

  // §3 — How it works (numbered process).
  process: {
    eyebrow: "How it works",
    title: "Four steps from dock to disposition",
    steps: [
      { num: "01", name: "Profile", body: "Tell us your streams, volumes, and site. We profile each waste type up front so nothing is a surprise at pickup." },
      { num: "02", name: "Schedule", body: "We set a cadence that matches how fast you generate — a one-off clear-out, monthly service, or multiple pickups a week." },
      { num: "03", name: "Package & manifest", body: "On-site technicians pack, label, and document every container for compliant, hazardous-rated transport." },
      { num: "04", name: "Transport to VBEC", body: `Dedicated trucks move your waste under documented chain of custody to the licensed ${VBEC_SHORT} for treatment or disposal.` },
    ],
  },

  // §4 — Industries.
  industries: {
    eyebrow: "Who we collect from",
    title: "Built for regulated generators",
    lead: `On-site technicians handle the packaging and paperwork so your team doesn't have to — across every sector that ${VBEC_FULL_NAME} serves.`,
    items: [
      "Manufacturing",
      "Aerospace & Defence",
      "Agriculture",
      "Transportation & Rail",
      "Healthcare",
      "Biotech & Pharma",
      "Education",
      "Oil & Gas",
    ],
  },

  // §5 — Closing CTA.
  cta: {
    eyebrow: "Get on the schedule",
    title: "Set up a collection schedule",
    body: "Tell us what you generate and how often. We'll build a pickup cadence that keeps your site compliant and your waste volume under control.",
  },

};
