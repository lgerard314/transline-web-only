// About index content — 13-about.md. Includes the dedicated
// "Vaughn Bullough story" section preserving the renaming-announcement
// framing (design spec §3.5 + Phase 04 cross-task). VBEC full name on
// first use, "VBEC" thereafter.

import { OVER_25_YEARS, VBEC_FULL_NAME, VBEC_SHORT } from "./brand";

export const ABOUT_INDEX = {
  eyebrow: "About",
  title: "Hazardous Waste Management — done deliberately.",
  lead:
    `Miller Environmental is a Manitoba operator with three ISO certifications and ${OVER_25_YEARS.toLowerCase()} of operating history. Our facility — the ${VBEC_FULL_NAME} (${VBEC_SHORT}) — sits 70 km south of Winnipeg on 64 hectares.`,
  photo: "/miller/services/customer-waste-collection-hero.webp",

  sections: [
    {
      heading: "Company History",
      body:
        "In 1995, Miller Paving — already operating Miller Waste Systems — partnered with Manitoba's provincial government to assume control of the Manitoba Hazardous Waste Management Corporation's operations. Miller invested capital and introduced private-sector operational practices.",
    },
    {
      heading: "The Vaughn Bullough story",
      body:
        `Vaughn Bullough joined Miller as General Manager in 1997. President & CEO Blair McArthur credits him with providing "steady hand, tremendous vision" and establishing organisational foundations that positioned Miller as "one of Canada's most environmentally sustainable, diverse and respected hazardous waste treatment and disposal facilities." On that record, the Manitoba Environmental Centre in St. Jean Baptiste was renamed the ${VBEC_FULL_NAME} in his honour. ${VBEC_SHORT} is a person, not just an acronym.`,
    },
    {
      heading: "Mission & Vision",
      body:
        "Our vision: a trusted provider of sustainable environmental waste and process solutions. Our mission: innovative and accountable environmental management solutions that advance a sustainable world.",
    },
  ],

  subPages: [
    {
      heading: "Explore the About section",
      items: [
        "Health & Safety — /about-us/health-safety/",
        "Licencing Information — /about-us/licencing-information/",
        "Professional Affiliations — /about-us/professional-affiliations/",
        "Quality Assurance — /about-us/quality-assurance/",
        "Vision, Mission, and Core Values — /about-us/vision-mission-and-core-values/",
      ],
    },
  ],
};
