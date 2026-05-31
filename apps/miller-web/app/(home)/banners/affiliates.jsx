import { Marquee } from "@white-owl/brand/components";

const AFFILIATES = [
  { name: "Manitoba Environmental Industries Association", src: "/miller/affiliations/meia.png" },
  { name: "Canadian Manufacturers & Exporters", src: "/miller/affiliations/cme.png" },
  { name: "Manitoba Chamber of Commerce", src: "/miller/affiliations/manitoba-chamber.png" },
  { name: "Winnipeg Chamber of Commerce", src: "/miller/affiliations/winnipeg-chamber.png" },
  { name: "Construction Safety Association of Manitoba", src: "/miller/affiliations/csam.png" },
  { name: "Manitoba Trucking Association", src: "/miller/affiliations/mta.png" },
  { name: "Ontario Waste Management Association", src: "/miller/affiliations/owma.png" },
  { name: "Commitment To Opportunity, Diversity & Equity", src: "/miller/affiliations/code.png" },
];

// Proud affiliates — rotating logo band between Careers and the final CTA.
export function AffiliatesBanner() {
  return (
    <section className="mw-marquee" aria-label="Affiliates">
      <div className="mw-marquee__row">
        <p className="mw-marquee__label">Proud<br />affiliates<span className="mw-stop-colon" aria-hidden="true" /></p>
        <Marquee
          items={AFFILIATES.map((a) => (
            <img key={a.src} className="mw-marquee__logo" src={a.src} alt={a.name} loading="lazy" />
          ))}
        />
      </div>
    </section>
  );
}
