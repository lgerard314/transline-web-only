// Industrial Cleaning — service page content. Plain strings + arrays only (no
// JSX); markup lives in the section composition. Body copy is sourced from the
// live millerenvironmental.ca industrial-cleaning page.

import { EMERGENCY_PHONE, GENERAL_PHONE } from "./brand";

const EMERGENCY_TEL = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

export const industrialCleaning = {
  slug: "industrial-cleaning",

  hero: {
    eyebrow: "Industrial cleaning",
    title: "Industrial cleaning,",
    titleEm: "any vessel",
    lead:
      "Miller Environmental provides industrial cleaning to every sector — from confined-space cleaning of underground and above-ground holding tanks to high-pressure steam cleaning of equipment and piping, sludge pits, and bulk-liquid and gondola rail-car cleaning.",
    photo: "/miller/services/industrial-cleaning-hero.jpeg",
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: EMERGENCY_TEL,
    secondaryCta: { label: "Contact Miller", labelShort: "Contact", href: "/contact-us/" },
  },

  // §2 — What we clean (photo capability cards).
  capabilities: {
    eyebrow: "What we clean",
    title: "Confined spaces to rail cars",
    lead:
      "One crew, every cleaning method — sized to the vessel, the access, and the material inside it.",
    items: [
      {
        name: "Confined-Space Tank Cleaning",
        photo: "/miller/confined-space-entry.png",
        blurb: "Underground and above-ground holding tanks entered and cleaned under full confined-space protocol.",
      },
      {
        name: "High-Pressure Steam Cleaning",
        photo: "/miller/hazmat-cleaning.png",
        blurb: "Equipment and piping cut clean with high-pressure steam — scale, residue, and product removed.",
      },
      {
        name: "Sludge Pit Cleanouts",
        photo: "/miller/spill-containment.png",
        blurb: "Sludge pits pumped, cleaned, and the recovered material routed to licensed treatment.",
      },
      {
        name: "Rail Car & Bulk-Liquid Cleaning",
        photo: "/miller/transport-incidents.png",
        blurb: "Gondola and bulk-liquid rail cars cleaned to spec for return to service or reload.",
      },
    ],
  },

  // §3 — The fleet (unique equipment feature).
  fleet: {
    eyebrow: "The fleet",
    title: "Vacuum & pressure, on wheels",
    lead:
      "We operate a fleet of vacuum trucks and pressure-washer units to clean tanks and other industrial equipment — mobilized to your site, backed by our own licensed treatment facility for whatever comes out.",
    items: [
      { mark: "01", name: "Vacuum trucks", body: "High-volume liquid and slurry recovery from tanks, pits, and sumps — straight into sealed transport." },
      { mark: "02", name: "Pressure-washer units", body: "High-pressure and steam units that strip residue from equipment, piping, and vessel interiors." },
    ],
    image: "/miller/industrial-vaccum-truck-transparent.png",
  },

  // §4 — Why Miller (skilled-team band).
  why: {
    eyebrow: "The crew",
    title: "A team that handles it safely",
    items: [
      { mark: "01", title: "Skilled technicians", body: "A qualified, experienced, highly skilled team of professional technicians." },
      { mark: "02", title: "Every sector", body: "Industrial cleaning for all industry sectors, whatever the vessel or material." },
      { mark: "03", title: "Safe & effective", body: "Trained to handle all manner of tasks safely and effectively, every time." },
      { mark: "04", title: "Closed loop", body: "Recovered material routed straight to our licensed VBEC treatment facility." },
    ],
  },

  // §5 — Closing CTA (dark dispatch panel + contact form).
  cta: {
    eyebrow: "Contact Miller",
    title: "Book a cleaning crew",
    titleEm: "for your site",
    titleAfter: "today",
    body:
      `Tell us about the tank, vessel, or rail car and we'll scope the cleaning — or call now at ${GENERAL_PHONE}. For an active spill or release, our 24/7 emergency team is standing by.`,
    formTitle: "Contact Miller",
    formNote: "A coordinator will reach out within one business day.",
  },
};
