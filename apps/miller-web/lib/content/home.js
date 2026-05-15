// Homepage content — plain strings + arrays only (design spec §5.1).
// Refrains and contact info source from `brand.js`; the sequence here
// follows the §3.1 ordering: hero → trust → services → VBEC → editorial
// → mission → join family → marquee → final CTA. No StatsBand.

import {
  OVER_25_YEARS,
  SAFE_DEPENDABLE_ON_TIME,
  ONLY_IN_CANADA_CLAIM,
  CRADLE_TO_GRAVE_PHRASE,
  EMERGENCY_PHONE,
  VBEC_FULL_NAME,
  VBEC_SHORT,
} from "./brand";

export const HOME = {
  hero: {
    eyebrow: "Miller Environmental",
    title: "Committed to Leadership in the Hazardous Waste Disposal Industry",
    subhead: `Providing ${SAFE_DEPENDABLE_ON_TIME.toLowerCase()} to all our clients.`,
    frames: [
      "/miller/facility/vbec-aerial.webp",
      "/miller/case-studies/brandon-power-2.webp",
      "/miller/services/industrial-cleaning-hero.jpeg",
    ],
  },

  trust: {
    eyebrow: "Certifications",
    claim: ONLY_IN_CANADA_CLAIM,
    tenure: `${OVER_25_YEARS.toUpperCase()} OF OPERATING HISTORY`,
  },

  services: {
    eyebrow: "Services",
    title: "Services We Offer",
    lead:
      "Ten operating capabilities anchored at the licensed " +
      VBEC_FULL_NAME +
      " (" + VBEC_SHORT + ").",
  },

  // VBEC promoted to position 4 (procurement journey wants to see the
  // facility). Capabilities verbatim from 19-location-treatment-facility.md.
  // Position 3 (services lead) already expanded the full name once; per
  // design spec §5.4, position 4 uses the short form.
  vbec: {
    eyebrow: VBEC_SHORT,
    title: "Our Facility",
    body:
      `${VBEC_SHORT} sits on 64 hectares in the rural municipality of Montcalm, 70 km south of Winnipeg. ` +
      "Named for the General Manager who built it — Vaughn Bullough, who joined Miller in 1997 — the facility is the operating heart of every service on this site.",
    aboutHref: "/about-us/",
    aboutLinkLabel: "Read the Vaughn Bullough story",
    capabilities: [
      "Engineered lined landfill",
      "Clay-base lined processing cells",
      "Specialised organic / inorganic processing",
      "Decontamination facility",
      "Plastic shredding & recycling",
      "Batch water treatment",
      "Hydro-vac slurry receiving",
    ],
    cta: { label: "Visit Treatment Facility", href: "/treatment-facility/" },
    image: "/miller/facility/vbec-building.webp",
  },

  // Verbatim from 00-homepage.md "For Over 25 Years" block.
  editorial: {
    eyebrow: `For ${OVER_25_YEARS}`,
    body:
      `Miller Environmental has consistently provided ${SAFE_DEPENDABLE_ON_TIME.toLowerCase()} to all our clients. ` +
      "This follows through from the initial pickup, to invoicing, to the provision of summary reports. " +
      `This "${CRADLE_TO_GRAVE_PHRASE}" approach helps our customers to not only remain on-budget, but also provides the ability to track and assess both Miller's performance and audit their own specific waste stream management. ` +
      "Our clients range from large industrial manufactures to small businesses and even your average household that disposes of waste through various household hazardous waste programs.",
  },

  // Verbatim from 00-homepage.md "Our Mission" block.
  mission: {
    eyebrow: "Our Mission",
    body:
      "At Miller Environmental, our mission is to lead the hazardous waste disposal industry by exemplifying unwavering commitment to environmentally responsible practices, rigorous regulatory compliance, and continuous innovation. " +
      "We prioritize safety in all operations, ensuring the well-being of our team, clients, and the communities we serve. " +
      "Our dedication to transparency fosters trust, while active community engagement reflects our belief in shared responsibility.",
    cta: { label: "Our Core Values", href: "/about-us/vision-mission-and-core-values/" },
  },

  // Verbatim from 00-homepage.md "Join The Miller Family" + "Why Choose
  // Miller?" + "Career Opportunities" blocks.
  joinFamily: {
    eyebrow: "Join The Miller Family",
    intro:
      "Total rewards compensation program, growth potential and Manitoba pride are just some of the reasons to join the Miller Team. " +
      "We take pride in the fact that we build a team focused on commitment, enthusiasm, unity to grow in a dynamic industry.",
    whyTitle: "Why Choose Miller?",
    whyBody:
      "At Miller, we understand that a diverse and inclusive workforce benefits us all. Each individual employee provides Miller with a unique perspective on the world.",
    whyCta: { label: "Working At Miller", href: "/careers/working-at-miller/" },
    opportunitiesTitle: "Career Opportunities",
    opportunitiesBody:
      "If you're ready to join us in our mission and share our values, we invite you to explore the career opportunities we have to offer, and the rewards that come from being part of the Miller team.",
    opportunitiesCta: { label: "Open Positions", href: "/careers/" },
  },

  // Marquee refrains — each entry is a brand refrain that recurs on
  // multiple pages.
  marquee: [
    OVER_25_YEARS,
    SAFE_DEPENDABLE_ON_TIME,
    "Three ISO certifications",
    "MHCA COR 2023",
    `${VBEC_SHORT} — licensed hazardous waste facility`,
    "Cradle-to-grave tracking",
    "24/7 emergency response",
  ],

  finalCta: {
    eyebrow: "Get in touch",
    title: "Talk to Miller about your project.",
    body: "Routine pickup, scheduled treatment, or a 24/7 emergency — one call covers it.",
    contactHref: "/contact-us/",
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`,
  },
};
