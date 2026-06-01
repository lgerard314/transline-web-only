import Link from "next/link";
import { HOME as c } from "../home";
import { HistoryTimeline } from "./history-timeline";

const MILESTONES = [
  { year: "1996", title: "Founding year", body: "The Province of Manitoba and Miller Paving sign a 50/50 partnership creating Miller Environmental Corporation, announced January 10, 1996." },
  { year: "1997", title: "Vaughn Bullough hired as GM", body: "Bullough builds the operation into Manitoba’s only fully-licensed hazardous-waste operator, leading it for twenty-five years." },
  { year: "2007", title: "Winnipeg Service Centre opens", body: "The Hekla Avenue centre opens as the company’s public-facing base and a licensed PCB-storage and waste-coordination hub." },
  { year: "2015", title: "Licence 58 HW S2 RRRR", body: "Manitoba posts the core treatment-facility operating licence — the regulatory backbone for everything that follows." },
  { year: "2017", title: "Federal disposal contract won", body: "MEC wins a federal Hazardous Waste Disposal Services contract, since amended through 2026." },
  { year: "2019 — 2022", title: "Processing Cell 5 commissioned", body: "A new engineered processing cell is constructed and licensed, expanding treatment, storage, and disposal capacity at the Montcalm facility." },
  { year: "August 2022", title: "Treatment Facility → VBEC", body: "The flagship facility is renamed the Vaughn Bullough Environmental Centre in recognition of Vaughn Bullough’s 25-year leadership." },
  { year: "2023", title: "MHCA COR safety certification", body: "MEC earns its MHCA COR 2023 safety certification and joins the Mining Association of Manitoba, broadening its sector standing." },
  { year: "2024", title: "MEIA Lifetime Achievement Award", body: "President Paul Bauer receives the MEIA Lifetime Achievement Award, anchoring the company’s credibility with regulators and large generators." },
  { year: "May 2025", title: "Solvent recycling online", body: "Manitoba approves an in-province solvent-recovery system reclaiming up to 4.5 million litres annually — moving MEC up the waste hierarchy." },
  { year: "February 2026", title: "Charting the path forward", body: "President Paul Bauer lays out the company’s strategy, with 96% of waste now managed in-house." },
];

// OUR HISTORY — milestone timeline, truck-plate stats, and mission block.
export function HistorySection() {
  return (
    <section className="mw-ten3" aria-labelledby="mw-tenure-heading-copy-b">
      <div className="mw-inner">
        <div className="mw-ten3__grid">
          <aside className="mw-ten3__timeline" aria-label="Company milestones">
            <p className="mw-ten3__timeline-note">*hover for more info</p>
            <HistoryTimeline items={MILESTONES} />
          </aside>

          <div className="mw-ten3__body">
            <header className="mw-ten3__head" data-reveal>
              <p className="mw-section-tag" aria-hidden="true">
                <span className="mw-section-tag-mark" />
                <span className="mw-section-tag-label">Our history</span>
              </p>
              <h2 id="mw-tenure-heading-copy-b" className="mw-ten3__title">
                Three decades in <span className="mw-ten3__title-em">hazardous <span className="mw-nobr">waste<span className="mw-stop" aria-hidden="true" /></span></span>
              </h2>
              <p className="mw-ten3__lead">
                Miller Environmental was formed in 1996 as Manitoba&rsquo;s first private-public hazardous-waste operator. Vaughn Bullough joined as General Manager in 1997 and led operations for twenty-five years. The facility was renamed in his honour in 2022. The work continues.
              </p>
            </header>

            <div className="mw-ten3__plate" aria-label="Track record" data-reveal>
              <img
                className="mw-ten3__plate-img"
                src="/miller/full-truck-sideview.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <dl className="mw-ten3__plate-stats">
                <div className="mw-ten3__plate-stat">
                  <dd className="mw-ten3__plate-val"><span className="mw-ten3__plate-num">25</span><span className="mw-ten3__plate-unit">+yrs</span></dd>
                  <dt className="mw-ten3__plate-label">Relationships</dt>
                </div>
                <div className="mw-ten3__plate-stat">
                  <dd className="mw-ten3__plate-val"><span className="mw-ten3__plate-num">96</span><span className="mw-ten3__plate-unit">%</span></dd>
                  <dt className="mw-ten3__plate-label">In-house</dt>
                </div>
                <div className="mw-ten3__plate-stat">
                  <dd className="mw-ten3__plate-val"><span className="mw-ten3__plate-num">4.5</span><span className="mw-ten3__plate-unit">ML/yr</span></dd>
                  <dt className="mw-ten3__plate-label">Solvent reclaimed</dt>
                </div>
              </dl>
            </div>

            <div className="mw-ten2__mission" data-reveal>
              <h3 className="mw-ten2__mission-heading">Mission</h3>
              <p className="mw-ten2__mission-copy">At Miller Environmental, our mission is to lead the hazardous waste disposal industry by exemplifying unwavering commitment to environmentally responsible practices, rigorous regulatory compliance, and continuous innovation.</p>
              <p className="mw-ten2__mission-copy">We prioritize safety in all operations, ensuring the well-being of our team, clients, and the communities we serve.</p>
              <p className="mw-ten2__mission-copy">Our dedication to transparency fosters trust, while active community engagement reflects our belief in shared responsibility.</p>
              <Link href={c.mission.cta.href} className="mw-ten2__mission-link">
                {c.mission.cta.label} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
