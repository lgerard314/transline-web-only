// Industrial Waste Treatment — capabilities-variant content. Sourced
// from 06-svc-industrial-waste-treatment.md. Verbatim copy. VBEC full
// name on first use, "VBEC" thereafter (design spec §5.4).

import { VBEC_FULL_NAME, VBEC_SHORT } from "./brand";

export const IWT = {
  slug: "industrial-waste-treatment",
  eyebrow: "Service",
  title: "Industrial Waste Treatment",
  // Full VBEC name on first occurrence.
  lead:
    `Miller Environmental operates the licensed ${VBEC_FULL_NAME} (${VBEC_SHORT}) on 160 acres, equipped to receive large volumes of waste in multiple forms.`,
  photo: "/miller/services/industrial-waste-treatment-hero.webp",

  groups: [
    {
      heading: "Specialty Soil, Sludges & Solids Treatment",
      body:
        `Miller formulates chemistries for contaminated soils and hazardous solids, with exclusive capability to receive materials "24/7 to mitigate major spills and environmental incidents immediately." Treatable materials include:`,
      items: [
        "Glycol contamination",
        "Heavy metal impacted materials",
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
      items: [
        "Stabilization of metals",
        "Wet or dry inorganic sludge solidification & disposal",
        "High-value metal salts recycling capability",
        "Fluorescent tube shredding, stabilization & solidification",
        "Chemical processing for inorganic chemicals",
        "Stabilization of processed chemical residues",
      ],
    },
    {
      heading: "Liquid Organic Waste Processing",
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
      items: [
        "Solidification and disposal of oily debris",
        "Dissolution of solid materials including pharmaceuticals",
        "Aerosol processing",
      ],
    },
    {
      heading: "Special Waste Processing",
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
      items: [
        "Industrial plastic shredding, washing, and recycling",
        "Lead acid and alkaline battery recycling",
        "Solvent recycling",
        "Electronic waste recycling",
        "Industrial container cleaning and tote recertification",
      ],
    },
    {
      heading: "Special Processing Projects",
      // Second occurrence — use short form.
      body:
        `Development of specialized chemistries for unique waste streams through the SR&ED Canadian Federal Government initiative. ${VBEC_SHORT}'s on-site R&D group profiles incoming streams to determine recycling or repurposing opportunities.`,
      items: [],
    },
  ],
};
