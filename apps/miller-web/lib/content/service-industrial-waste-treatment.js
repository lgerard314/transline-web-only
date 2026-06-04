// Industrial Waste Treatment — capabilities-rich service page content. Plain
// strings + arrays only (no JSX); markup lives in the section composition.
// Body copy is sourced from the live millerenvironmental.ca treatment page.
// VBEC full name on first use, "VBEC" thereafter (design spec §5.4).

import { VBEC_FULL_NAME, VBEC_SHORT, EMERGENCY_PHONE, GENERAL_PHONE } from "./brand";

const EMERGENCY_TEL = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

export const IWT = {
  slug: "industrial-waste-treatment",

  hero: {
    eyebrow: "Industrial waste treatment",
    title: "One facility,",
    titleEm: "every stream",
    lead:
      `Miller Environmental operates the licensed ${VBEC_FULL_NAME} (${VBEC_SHORT}) on a 160-acre footprint — with the capacity and capability to receive large volumes of industrial waste in every form, organic and inorganic, liquid and solid, at a single location.`,
    photo: "/miller/industrial-waste-treatment-hero-1.webp",
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: EMERGENCY_TEL,
    secondaryCta: { label: "Contact Miller", labelShort: "Contact", href: "/contact-us/" },
    titleId: "iwt-hero-title",
  },

  // §2 — The VBEC facility (unique stat band).
  facility: {
    eyebrow: "The facility",
    title: "Built to take it all in",
    lead:
      "Treating industrial organic and inorganic waste — both liquid and solid — at one location is a unique benefit in the overall management of incoming streams. Waste arrives in everything from pails to bulk trucks, profiled on intake to determine its recycling or reprocessing potential.",
    photo: "/miller/vbec-aerial-2.webp",
    caption: "Vaughn Bullough Environmental Centre",
    stats: [
      { value: "160", unit: "acres", label: "Licensed processing footprint" },
      { value: "1", unit: "site", label: "Organic + inorganic, liquid + solid" },
      { value: "Pails", unit: "→ bulk", label: "Every container size received" },
      { value: "24/7", unit: "intake", label: "Emergency sequestration capacity" },
    ],
    processEyebrow: "Treatment processes",
    processes: ["Inorganic", "Aqueous", "Liquid organic", "Solid organics", "Recycling"],
    titleId: "iwt-fac-title",
  },

  // §3 — Treatment & processing capabilities. Seven groups; the first is the
  // featured wide card (its treatable-solids list is the bullet set).
  capabilities: {
    eyebrow: "Capabilities",
    title: "Treatment & processing",
    lead:
      "Specific chemistries, formulated per stream — from contaminated soils to spent catalysts. If it can be recovered, recycled, or safely disposed, it has a route through VBEC.",
    titleId: "iwt-cap-title",
    groups: [
      {
        heading: "Specialty Soil, Sludges & Solids",
        photo: "/miller/about-health-safety-2.webp",
        body:
          "Miller formulates specific chemistries to treat unique contaminated soils, hazardous solids, and sludges — with exclusive capability to receive material 24/7 for emergency sequestration. Treatable solids include:",
        items: [
          "Glycol contamination",
          "Heavy-metal impacted materials",
          "Acid or alkali contamination",
          "Toxic / environmentally hazardous substances",
          "PFAS and PFOS impacted material",
          "Flammable solids",
          "Chlorinated soil",
          "Catalysts",
        ],
      },
      {
        heading: "Inorganic Waste Processing",
        photo: "/miller/20190801_130310-scaled.jpg",
        items: [
          "Stabilization of metals",
          "Wet or dry inorganic sludge solidification & disposal",
          "High-value metal-salt recycling",
          "Fluorescent tube shredding, stabilization & solidification",
          "Chemical processing for inorganic chemicals",
          "Stabilization of processed chemical residues",
        ],
      },
      {
        heading: "Liquid Organic Waste Processing",
        photo: "/miller/about-quality-assurance-2.webp",
        items: [
          "Sludge / water separation",
          "Solvent / fuel blending (waste to energy)",
          "Latex paint bulking & solidification",
          "Oil-based paint bulking / fuel blending",
          "Oil filtering and sludge separation",
        ],
      },
      {
        heading: "Solid Organic Waste Processing",
        photo: "/miller/cap-solid-organic-1.webp",
        items: [
          "Solidification and disposal of oily debris",
          "Dissolution of solid materials for incineration",
          "Aerosol processing",
        ],
      },
      {
        heading: "Special Waste Processing",
        photo: "/miller/cap-special-waste-1.webp",
        items: [
          "Flammable solids",
          "Spent catalyst recycling and / or disposal",
          "Industrial wastewater treatment",
          "Hydrovac sludge / slurry",
          "Chlorate neutralization",
        ],
      },
      {
        heading: "Miscellaneous Processing & Recycling",
        photo: "/miller/cap-misc-recycling-1.webp",
        items: [
          "Industrial plastic shredding, washing & recycling",
          "Lead-acid and alkaline battery recycling",
          "Solvent recycling",
          "Electronic waste recycling",
          "Industrial container cleaning & tote recertification",
        ],
      },
      {
        heading: "Special Processing Projects",
        photo: "/miller/cap-special-projects-1.webp",
        body:
          `Development of specialized chemistries for unique waste streams through the SR&ED Canadian Federal Government initiative. ${VBEC_SHORT}'s on-site R&D group profiles incoming streams to find recycling or repurposing opportunities.`,
        items: [],
      },
    ],
  },

  // §4 — Closing CTA (dark dispatch panel + contact form).
  cta: {
    eyebrow: "Contact Miller",
    title: "Profile a waste stream",
    titleEm: "with our team",
    titleAfter: "today",
    body:
      `Send us your stream and we'll determine its treatment, recycling, or disposal route through VBEC — or call now at ${GENERAL_PHONE}. For an active spill or release, our 24/7 emergency team is standing by.`,
    formTitle: "Contact Miller",
    formNote: "A treatment coordinator will reach out within one business day.",
    titleId: "iwt-cta-title",
    hotlineNote: "Answered by a trained responder — every hour, every day of the year.",
  },

  // §5 — Related services rail.
  related: {
    currentSlug: "industrial-waste-treatment",
    titleId: "iwt-related-title",
  },
};
