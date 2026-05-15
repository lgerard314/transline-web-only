// 10-card professional affiliations grid for
// `/about-us/professional-affiliations/`. Sources org metadata + the
// local mark images from `/miller/affiliations/` + the cross-link logos
// in `/miller/logo/`. Entry #10 (TransLine49°) is the sibling site under
// the same parent group and opens in a new tab.

/* eslint-disable @next/next/no-img-element -- 64px logo thumbnails; same
   reasoning as CertificationGrid. */

const AFFILIATIONS = [
  {
    name: "Manitoba Environmental Industries Association (MEIA)",
    desc: "Advances environmental and clean technology opportunities in Manitoba through networking, education, and support.",
    href: "https://meia.mb.ca/",
    mark: "/miller/affiliations/meia.webp",
  },
  {
    name: "Manitoba Chamber of Commerce",
    desc: "Champions sustainable economic development and a business-friendly climate across the province.",
    href: "https://mbchamber.mb.ca/",
    mark: "/miller/affiliations/manitoba-chamber.webp",
  },
  {
    name: "Canadian Manufacturers & Exporters (CME)",
    desc: "National association advocating for manufacturers and exporters; helping businesses grow.",
    href: "https://cme-mec.ca/",
    mark: "/miller/affiliations/cme.webp",
  },
  {
    name: "Construction Safety Association of Manitoba",
    desc: "Non-profit run by and for the building construction industry in Manitoba.",
    href: "https://www.constructionsafety.ca/",
    mark: "/miller/affiliations/csam.webp",
  },
  {
    name: "Commitment To Opportunity, Diversity & Equity (CODE)",
    desc: "A Chamber community movement dedicated to fostering inclusive workplaces.",
    href: "https://www.winnipeg-chamber.com/code/",
    mark: "/miller/affiliations/code.webp",
  },
  {
    name: "Manitoba Trucking Association",
    desc: "Develops and maintains a safe and healthy business environment for industry members.",
    href: "https://trucking.mb.ca/",
    mark: "/miller/affiliations/mta.webp",
  },
  {
    name: "Winnipeg Chamber of Commerce",
    desc: "Committed to building a city where industry prosperity and community wellness grow together.",
    href: "https://www.winnipeg-chamber.com/",
    mark: "/miller/affiliations/winnipeg-chamber.webp",
  },
  {
    name: "Ontario Waste Management Association (OWMA)",
    desc: "The voice of the waste management sector; provides research and expertise.",
    href: "https://www.owma.org/",
    mark: "/miller/affiliations/owma.webp",
  },
  {
    name: "Miller Waste Systems",
    desc: "Offers waste management solutions in collection, haulage, disposal, and organics.",
    href: "https://millerwastesystems.com/",
    mark: "/miller/logo/miller-waste-systems-cross-link.webp",
  },
  {
    name: "TransLine49° Environmental Services",
    desc: "Cross-border environmental services under White Owl Family Office Group ownership.",
    href: "https://transline49.com/",
    mark: "/miller/logo/transline49-cross-link.webp",
    external: true,
  },
];

export function AffiliationsGrid() {
  return (
    <div className="mw-aff-grid">
      {AFFILIATIONS.map((a) => (
        <div key={a.name} className="mw-aff-card">
          <img
            className="mw-aff-card__mark"
            src={a.mark}
            alt={`${a.name} mark`}
            width={64}
            height={64}
            style={{ background: "transparent" }}
          />
          <h3 className="mw-aff-card__name">{a.name}</h3>
          <p className="mw-aff-card__desc">{a.desc}</p>
          <a
            className="mw-aff-card__link"
            href={a.href}
            {...(a.external
              ? { target: "_blank", rel: "noreferrer noopener" }
              : { target: "_blank", rel: "noreferrer noopener" })}
          >
            Visit website ↗
          </a>
        </div>
      ))}
    </div>
  );
}
