import { SectorStatCycle } from "./sector-stat-cycle";

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
                From refineries to households &mdash; and everything between<span className="mw-stop" aria-hidden="true" />
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
          <article className="mw-sec2__card">
            <div className="mw-sec2__card-photo" aria-hidden="true">
              <img src="/miller/services/industrial-waste-treatment-hero.webp" alt="" loading="lazy" />
            </div>
            <div className="mw-sec2__card-body">
              <h3 className="mw-sec2__card-title">Industrial</h3>
              <span className="mw-sec2__card-rule" aria-hidden="true" />
              <ul className="mw-sec2__card-list">
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Industrial Manufacturing</span></li>
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Mining</span></li>
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Oil &amp; Gas</span></li>
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Chemical Distribution</span></li>
              </ul>
            </div>
          </article>
          <article className="mw-sec2__card">
            <div className="mw-sec2__card-photo" aria-hidden="true">
              <img src="/miller/services/vacuum-truck-new-logo.webp" alt="" loading="lazy" />
            </div>
            <div className="mw-sec2__card-body">
              <h3 className="mw-sec2__card-title">Infrastructure</h3>
              <span className="mw-sec2__card-rule" aria-hidden="true" />
              <ul className="mw-sec2__card-list">
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Aerospace &amp; Defence</span></li>
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Transportation &amp; Rail</span></li>
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Utilities &amp; Power</span></li>
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Agriculture</span></li>
              </ul>
            </div>
          </article>
          <article className="mw-sec2__card">
            <div className="mw-sec2__card-photo" aria-hidden="true">
              <img src="/miller/services/research-development-hero.webp" alt="" loading="lazy" />
            </div>
            <div className="mw-sec2__card-body">
              <h3 className="mw-sec2__card-title">Institutional</h3>
              <span className="mw-sec2__card-rule" aria-hidden="true" />
              <ul className="mw-sec2__card-list">
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Biotech &amp; Pharma</span></li>
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Crown Insurers</span></li>
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Federal &amp; Provincial Agencies</span></li>
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Education &amp; Healthcare</span></li>
              </ul>
            </div>
          </article>
          <article className="mw-sec2__card">
            <div className="mw-sec2__card-photo" aria-hidden="true">
              <img src="/miller/services/customer-waste-collection-hero.webp" alt="" loading="lazy" />
            </div>
            <div className="mw-sec2__card-body">
              <h3 className="mw-sec2__card-title">Community</h3>
              <span className="mw-sec2__card-rule" aria-hidden="true" />
              <ul className="mw-sec2__card-list">
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Small Business</span></li>
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Households (HHW)</span></li>
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Municipal Programs</span></li>
                <li className="mw-sec2__entry"><span className="mw-sec2__entry-name">Construction &amp; Demolition</span></li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
