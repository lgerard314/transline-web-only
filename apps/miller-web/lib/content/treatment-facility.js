// Treatment Facility (VBEC) — location content.
// Source: docs/superpowers/miller-scrape/19-location-treatment-facility.md

export const treatmentFacility = {
  hero: {
    eyebrow: "Location",
    title: "Vaughn Bullough Environmental Centre",
    // Subhead per phase 03.3 — one-line "named for…" line.
    lead:
      "Named for our co-founder Vaughn Bullough — a fully licensed hazardous waste treatment facility 70 kilometres south of Winnipeg on 64 hectares in the rural municipality of Montcalm.",
    photo: "/miller/facility/vbec-aerial.webp",
  },
  address: {
    lines: ["Hwy 14 & 75", "Saint Jean Baptiste, MB R0G 2B0"],
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Hwy+14+%26+75+Saint+Jean+Baptiste+MB+R0G+2B0",
    embedSrc:
      "https://www.google.com/maps?q=Hwy%2014%20%26%2075%2C%20Saint%20Jean%20Baptiste%2C%20MB%20R0G%202B0&output=embed",
  },
  capabilities: [
    "Engineered Lined Landfill",
    "Clay Base Lined Processing Cells",
    "Specialized Organic/Inorganic Processing",
    "Decontamination Facility",
    "Plastic Shredding/Recycling",
    "Batch Water Treatment",
    "Hydro Vac Slurry Receiving",
  ],
  contact: {
    phone: { display: "(204) 737-2045", href: "tel:+12047372045" },
    email: "inquiries@millerenvironmental.mb.ca",
    hours: "24/7 spill response: (204) 957-6327 · Fax: (204) 737-2161",
  },
};
