// Homepage content. Strings + arrays only — markup belongs in HomeTemplate.
// Shared phrases / phone numbers come from `./brand`.

import {
  OVER_25_YEARS,
  SAFE_DEPENDABLE_ON_TIME,
  EMERGENCY_PHONE,
  VBEC_SHORT,
} from "./brand";

export const HOME = {
  vbec: {
    body:
      `${VBEC_SHORT} sits on 64 hectares in the rural municipality of Montcalm, 70 km south of Winnipeg. ` +
      "Renamed in 2022 to honour Vaughn Bullough — the long-tenured General Manager who joined Miller in 1997 and led operations for 25 years — the facility is the operating heart of every service on this site.",
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
  },

  mission: {
    cta: { label: "Our Core Values", href: "/about-us/vision-mission-and-core-values/" },
  },

  joinFamily: {
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
