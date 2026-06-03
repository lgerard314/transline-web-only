import { SectorStatCycle } from "@/components-v2/05_widgets/cycles/sector-stat-cycle";
import { SectorCard } from "./sector-card";

const SECTOR_STATS = [
  {
    label: "Active clients",
    value: "450+",
    text: "industrial manufacturers, public agencies, and community programs across Canada and the United States rely on Miller for hazardous waste service.",
  },
  {
    label: "Lifetime disposal",
    value: "49M+",
    unit: "tons",
    text: "of hazardous and regulated waste processed through documented chain of custody since operations began.",
  },
  {
    label: "Lifetime recycling",
    value: "40M+",
    unit: "tons",
    text: "diverted from landfill through specialty recycling — solvents, metals, plastics, and oils recovered back into use.",
  },
];

const SECTOR_CARDS = [
  {
    title: "Industrial",
    items: [
      { slug: "industrial-manufacturing", name: "Industrial Manufacturing" },
      { slug: "mining", name: "Mining" },
      { slug: "oil-and-gas", name: "Oil & Gas" },
      { slug: "chemical-distribution", name: "Chemical Distribution" },
    ],
  },
  {
    title: "Infrastructure",
    items: [
      { slug: "aerospace-and-defence", name: "Aerospace & Defence" },
      { slug: "transportation-and-rail", name: "Transportation & Rail" },
      { slug: "utlities-and-power", name: "Utilities & Power" },
      { slug: "agriculture", name: "Agriculture" },
    ],
  },
  {
    title: "Institutional",
    items: [
      { slug: "biotech-and-pharma", name: "Biotech & Pharma" },
      { slug: "crown-insurers", name: "Crown Insurers" },
      { slug: "federal-and-provincial-agencies", name: "Federal & Provincial Agencies" },
      { slug: "education-and-healthcare", name: "Education & Healthcare" },
    ],
  },
  {
    title: "Community",
    items: [
      { slug: "small-business", name: "Small Business" },
      { slug: "households", name: "Households (HHW)" },
      { slug: "municipal-programs", name: "Municipal Programs" },
      { slug: "construction-and-demolition", name: "Construction & Demolition" },
    ],
  },
];

// WHO WE SERVE — four sector cards with cycling headline stats.
export function SectorsSection() {
  return (
    <section className="mw-sec2" aria-labelledby="mw-sectors-heading-copy">
      <div className="mw-inner">
        <header className="mw-sec2__head">
          <p className="mw-section-tag" aria-hidden="true" data-reveal>
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">Who we serve</span>
          </p>
          <div className="mw-sec2__head-split" data-reveal-stagger>
            <div className="mw-sec2__head-left">
              <h2 id="mw-sectors-heading-copy" className="mw-sec2__title">
                From refineries to households &mdash; and everything <span className="mw-nobr">between<span className="mw-stop" aria-hidden="true" /></span>
              </h2>
              <p className="mw-sec2__lead">
                Large industrial manufacturers, public agencies, small businesses, and even the household-hazardous-waste drop-off down the street &mdash; one operator, one chain of custody.
              </p>
            </div>
            <div className="mw-sec2__head-right">
              <SectorStatCycle stats={SECTOR_STATS} />
            </div>
          </div>
        </header>

        <div className="mw-sec2__cards" data-reveal-stagger>
          {SECTOR_CARDS.map((card) => (
            <SectorCard key={card.title} title={card.title} items={card.items} />
          ))}
        </div>
      </div>
    </section>
  );
}
