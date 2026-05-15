// Miller certification cards. Source of truth for both the homepage trust
// strip and the `/about-us/quality-assurance/` page.
//
// `href` points at a real PDF file under `public/certs/`. Files extracted
// from millerenvironmental.ca in phase 05 (real ISO 9001/14001/45001
// certs from 2023). The MHCA COR PDF is the COR program mark (the only
// COR asset published on the live site).
//
// `mark` is the local image path for the certification mark.

export const CERTS = [
  {
    slug: "iso-9001-2015",
    name: "ISO 9001:2015",
    year: "2015",
    long: "Quality Management System",
    href: "/certs/iso-9001-2015.pdf",
    sizeKB: 149,
    mark: "/miller/certs/iso-9001-2015.webp",
  },
  {
    slug: "iso-14001-2015",
    name: "ISO 14001:2015",
    year: "2015",
    long: "Environmental Management System",
    href: "/certs/iso-14001-2015.pdf",
    sizeKB: 149,
    mark: "/miller/certs/iso-14001-2015.webp",
  },
  {
    slug: "iso-45001-2018",
    name: "ISO 45001:2018",
    year: "2018",
    long: "Occupational Health & Safety",
    href: "/certs/iso-45001-2018.pdf",
    sizeKB: 149,
    mark: "/miller/certs/iso-45001-2018.webp",
  },
  {
    slug: "mhca-cor-2023",
    name: "MHCA COR 2023",
    year: "2023",
    long: "Certificate of Recognition (Safety)",
    href: "/certs/mhca-cor-2023.pdf",
    sizeKB: 9,
    mark: "/miller/certs/mhca-cor-2023.webp",
  },
];
