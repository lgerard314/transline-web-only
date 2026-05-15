// Stewardship — compact service content.
// Source: docs/superpowers/miller-scrape/10-svc-stewardship.md

import { CRADLE_TO_GRAVE_PHRASE } from "./brand";

export const stewardship = {
  hero: {
    eyebrow: "Service",
    title: "Stewardship",
    lead:
      `Miller Environmental has relationships with a variety of different Stewardship Programs that oversee the ${CRADLE_TO_GRAVE_PHRASE} management of waste with a focus on recycling.`,
    photo: "/miller/services/stewardship-hero.webp",
  },
  sections: [
    {
      heading: "Managed waste streams",
      body: null,
    },
  ],
  bullets: [
    "Household paint (oil and latex based)",
    "Household chemicals and cleaners",
    "Unwanted agricultural pesticides and pharmaceuticals",
    "Empty pesticide plastic containers",
  ],
  extraLists: [
    {
      heading: "Additional services offered",
      items: [
        "Used engine oil, oil filters, and antifreeze",
        "Unwanted consumer electronics",
        "Consumer grade batteries",
        "Aerosol cans",
      ],
    },
  ],
  relatedSlugs: ["specialty-recycling", "emergency-response", "research-development"],
};
