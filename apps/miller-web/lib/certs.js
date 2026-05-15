// Miller certification cards. Source of truth for both the homepage trust
// strip and the `/about-us/quality-assurance/` page.
//
// `href` points at a real PDF file slug. Phase 02 ships these as
// placeholder paths under `/certs/` — the files don't exist yet, and the
// ESLint rule `no-restricted-syntax` (see root `eslint.config.mjs`) bars
// `href="#"` so we can't write a sentinel here. Phase 05 will wire the
// real PDFs (and turn on the strict fs.existsSync check in CI).
//
// `mark` is the local image path for the certification mark; the
// `placeholder` flag is set for cards where we don't yet have a mark
// image (MHCA COR 2023). Templates render a text placeholder for those.

export const CERTS = [
  {
    slug: "iso-9001-2015",
    name: "ISO 9001:2015",
    year: "2015",
    long: "Quality Management System",
    href: "/certs/iso-9001-2015.pdf", // TODO(phase-5): real PDF
    sizeKB: 300,
    mark: "/miller/certs/iso-9001-2015.webp",
  },
  {
    slug: "iso-14001-2015",
    name: "ISO 14001:2015",
    year: "2015",
    long: "Environmental Management System",
    href: "/certs/iso-14001-2015.pdf", // TODO(phase-5): real PDF
    sizeKB: 300,
    mark: "/miller/certs/iso-14001-2015.webp",
  },
  {
    slug: "iso-45001-2018",
    name: "ISO 45001:2018",
    year: "2018",
    long: "Occupational Health & Safety",
    href: "/certs/iso-45001-2018.pdf", // TODO(phase-5): real PDF
    sizeKB: 300,
    mark: "/miller/certs/iso-45001-2018.webp",
  },
  {
    slug: "mhca-cor-2023",
    name: "MHCA COR 2023",
    year: "2023",
    long: "Certificate of Recognition (Safety)",
    href: "/certs/mhca-cor-2023.pdf", // TODO(phase-5): real PDF
    sizeKB: 250,
    // Mark image not yet supplied — design spec acknowledges this gap.
    // Templates render a labelled placeholder instead.
    mark: null,
    placeholder: true,
  },
];
