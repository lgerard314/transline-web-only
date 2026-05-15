// QA page content — 17-about-quality-assurance.md. Hero `lead` is the
// verbatim "only in Canada" claim from brand.js. Tracking paragraph uses
// CRADLE_TO_GRAVE_PHRASE.

import { ONLY_IN_CANADA_CLAIM, CRADLE_TO_GRAVE_PHRASE } from "./brand";

export const QA = {
  eyebrow: "About",
  title: "Quality Assurance",
  lead: ONLY_IN_CANADA_CLAIM,
  photo: "/miller/services/about-quality-assurance.webp",

  intro: {
    heading: "An integrated management system",
    body:
      "Safety, procedural soundness, and the protection of our environment are extremely important to Miller and to our success. As a processing and treatment facility, Miller maintains a comprehensive quality assurance program that is essential to operations.",
  },

  tracking: {
    heading: "Tracking & reporting",
    body:
      `Miller employs a modified U.S.-based waste tracking database enabling comprehensive monitoring through each waste management phase. The system supports ${CRADLE_TO_GRAVE_PHRASE} documentation and generates customised reports per client requirements.`,
  },
};
