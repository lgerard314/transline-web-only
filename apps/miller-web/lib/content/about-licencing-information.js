// Licencing Information — about sub-page content.
// Source: docs/superpowers/miller-scrape/15-about-licencing.md
//
// The 3 cert/license cards declare { name, code, href, sizeKB } per phase
// 03.3. `href` points at real PDFs under /licences/ extracted from
// millerenvironmental.ca in phase 05.

import { CRADLE_TO_GRAVE_PHRASE } from "./brand";

export const aboutLicencingInformation = {
  hero: {
    eyebrow: "About",
    title: "Licencing Information",
    lead:
      "Transportation and handling of hazardous waste requires special licensing under Manitoba's Hazardous Waste Regulation (M.R. 195/2015).",
  },
  sections: [
    {
      heading: "Regulatory framework",
      body:
        `The regulatory framework establishes a system of controlling hazardous waste from ${CRADLE_TO_GRAVE_PHRASE} and involves registration of generators plus licensing of carriers and receivers. The facility license specifies administrative and technical conditions under which waste must be managed while ensuring safe, ethical, and environmentally responsible operations.`,
    },
  ],
  licences: [
    {
      name: "VBEC Processing Facility Operating Licence",
      code: "58 HW S2 RRRR",
      href: "/licences/vbec-processing-facility-operating-licence.pdf",
      sizeKB: 194,
    },
    {
      name: "Hazardous Waste Transport Licence",
      code: "MBC00202",
      href: "/licences/hazardous-waste-transport-licence.pdf",
      sizeKB: 5143,
    },
    {
      name: "1803 Hekla Ave. Operating Licence",
      code: "211 HW RR",
      href: "/licences/1803-hekla-ave-operating-licence.pdf",
      sizeKB: 155,
    },
  ],
};
