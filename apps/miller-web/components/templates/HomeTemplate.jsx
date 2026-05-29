// HomeTemplate — server component. Implements design spec §3.1 in order:
//
//   1. Hero (3-frame CSS carousel)
//   2. Trust strip — only-in-Canada eyebrow + CertificationGrid + tenure
//   3. Services grid (10 cards, custom reorder)
//   4. Our Facility (VBEC) — promoted to position 4
//   5. "For Over 25 Years" editorial block
//   6. Our Mission + Core Values CTA
//   7. "Join The Miller Family"
//   8. Marquee with brand refrains
//   9. Final CTA (Contact + 24/7 emergency)
//
// No StatsBand — section is deleted entirely (design spec non-goals + §3.1).
//
// Content arrives as a single `content` prop sourced from
// `lib/content/home.js`. The template owns layout markup only — no inline
// copy here (design spec §5.1).

import Link from "next/link";
import { Marquee, ServiceCard } from "@white-owl/brand/components";
import { CertificationGrid } from "../CertificationGrid";
import { HeroPhraseCycle } from "../HeroPhraseCycle";
import { SectorStatCycle } from "../SectorStatCycle";
import { TenureStatCycle } from "../TenureStatCycle";
import { FacilityGallery } from "../FacilityGallery";
import { HistoryTimeline } from "../HistoryTimeline";
import { SERVICES } from "../../lib/services";
import { CERTS } from "../../lib/certs";

// Facility gallery photos — six VBEC views (drone overview, lake,
// office front, aerial office, stone sign, windmills). Captions are
// derived from the filenames and shown at the bottom of the main photo.
const FACILITY_PHOTOS = [
  { src: "/miller/facility/vbec-drone-overview.png", alt: "VBEC drone overview", caption: "Aerial drone overview" },
  { src: "/miller/facility/vbec-office-front-aerial.png", alt: "Office front, aerial view", caption: "Office front, from above" },
  { src: "/miller/facility/vbec-office-front.png", alt: "Office front, ground view", caption: "Office front entrance" },
  { src: "/miller/facility/vbec-stone-sign.png", alt: "Vaughn Bullough Environmental Centre stone sign", caption: "Entrance stone sign" },
  { src: "/miller/facility/vbec-lake.png", alt: "Lake on the VBEC grounds", caption: "Reflection pond on the grounds" },
  { src: "/miller/facility/vbec-windmills.png", alt: "Wind turbines visible from VBEC", caption: "Wind turbines on the horizon" },
];

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

// Tenure cycling stats — the big anchor numeral rotates between
// three angles on Miller's track record. Sourced from
// content-writing-resources/company-background.md and curated to
// avoid duplicating the SECTOR_STATS numbers.
const TENURE_STATS = [
  { value: "25", suffix: "+ yrs", label: "of relationships" },
  { value: "96", suffix: "%", label: "managed in-house" },
  { value: "4.5", suffix: "M L", label: "solvent reclaimed annually" },
];

// Service ordering for the home grid (design spec §3.1):
// Industrial Waste Treatment, Environmental Remediation, Emergency Response,
// then the rest alphabetical.
const HOME_FIRST = [
  "industrial-waste-treatment",
  "environmental-remediation-services",
  "emergency-response",
];

// Hard line-break a title into two lines: all-but-last word on line 1, last word on line 2. Keeps single-word titles on one line. The arrow then renders inline on the LAST line and the title block sizes to its widest line.
function splitTitle(title) {
  const parts = String(title).trim().split(/\s+/);
  if (parts.length <= 1) return { line1: title, line2: null };
  return { line1: parts.slice(0, -1).join(" "), line2: parts[parts.length - 1] };
}

function homeServiceOrder() {
  const map = new Map(SERVICES.map((s) => [s.slug, s]));
  const head = HOME_FIRST.map((slug) => map.get(slug)).filter(Boolean);
  const rest = SERVICES.filter((s) => !HOME_FIRST.includes(s.slug)).sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  return [...head, ...rest];
}

export function HomeTemplate({ content }) {
  const c = content;
  const orderedServices = homeServiceOrder();

  return (
    <>
      {/* 1. HERO — civic-monument typography on a darkened operating-site photo, fits in one viewport */}
      <section className="mw-hero" aria-labelledby="mw-hero-title">
        <div
          className="mw-hero__photo"
          aria-hidden="true"
          style={{ backgroundImage: "url(/miller/hero/home-frame-1.webp)" }}
        />
        <div className="mw-hero__inner">
          <p className="mw-hero__mark" aria-hidden="true">
            <span className="mw-hero__mark-corp">Miller Environmental Corporation</span>
            <span className="mw-hero__mark-dot" />
            <span className="mw-hero__mark-since">Since 1996</span>
          </p>

          <h1 id="mw-hero-title" className="mw-hero__title">
            <span className="mw-hero__line">leaders in</span>
            <span className="mw-hero__line">
              <HeroPhraseCycle
                phrases={[
                  { text: "hazardous" },
                  { text: "safe", tone: "accent" },
                  { text: "reliable", tone: "accent" },
                ]}
              />
            </span>
            <span className="mw-hero__line">waste disposal<span className="mw-hero__stop" aria-hidden="true" /></span>
          </h1>

          <p className="mw-hero__lead">
            Twenty-five years of licensed hazardous waste management in Manitoba.
            Three ISO certifications. One documented chain of custody from your
            loading dock to final disposition at VBEC.
          </p>

          <div className="mw-hero__foot">
            <div className="mw-hero__ctas">
              <Link href="/contact-us/" className="mw-cta mw-cta--solid">
                Talk to Miller <span aria-hidden="true">→</span>
              </Link>
              <a
                href={c.finalCta.emergencyHref}
                className="mw-cta mw-cta--ghost"
                aria-label={`Call 24/7 emergency: ${c.finalCta.emergencyDisplay}`}
              >
                <span className="mw-cta__sup">24/7 emergency</span>
                <span className="mw-cta__num">{c.finalCta.emergencyDisplay}</span>
              </a>
            </div>
            <p className="mw-hero__article">
              <strong>VBEC</strong> · 64 ha, Montcalm MB · ISO 9001 · 14001 · 45001
            </p>
          </div>
        </div>
      </section>

      {/* 2. TRUST — Certifications. Full-width 4-card row, each with mark + body. No eyebrow/heading/lead. */}
      <section className="mw-trust" aria-label="Certifications">
        <div className="mw-certs" role="list" aria-label="Certifications">
          {CERTS.map((cert) => {
            const isISO = cert.name.startsWith("ISO");
            const display = isISO
              ? cert.name.replace(/^ISO\s+/, "").split(":")[0]
              : "COR";
            const prefix = isISO ? "ISO" : "MHCA";
            return (
              <a
                key={cert.slug}
                href={cert.href}
                download
                className="mw-cert"
                role="listitem"
                aria-label={`Download ${cert.name} certificate, ${cert.sizeKB} KB PDF`}
              >
                <img
                  className="mw-cert__mark"
                  src={cert.mark}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <span className="mw-cert__body">
                  <span className="mw-cert__prefix">{prefix}&nbsp;·&nbsp;{cert.year}</span>
                  <span className="mw-cert__num">{display}</span>
                  <span className="mw-cert__desc">{cert.long}</span>
                  <span className="mw-cert__pdf">
                    <span>PDF · {cert.sizeKB}KB</span>
                    <span className="mw-cert__arr" aria-hidden="true">↓</span>
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* 3. SERVICES — Article 03: Capabilities on walnut. Bento composition: anchor with photo + 2 stacked features + 7-row registry. */}
      <section className="mw-services" aria-labelledby="mw-services-heading">
        <div className="mw-inner">
          <header className="mw-section-head mw-services__head">
            <div className="mw-services__head-l">
              <p className="mw-section-tag" aria-hidden="true">
                <span className="mw-section-tag-mark" />
                <span className="mw-section-tag-label">Services</span>
              </p>
              <h2 id="mw-services-heading" className="mw-section-title">
                whatever your waste needs,<br />we&rsquo;ve <span className="mw-services__title-em">got you covered.</span>
              </h2>
            </div>
            <p className="mw-services__intro">
              From routine industrial streams to one-off emergency calls, Miller&rsquo;s licensed VBEC facility and field crews handle the full spectrum &mdash; collection, treatment, and final disposition, all under one roof.
            </p>
          </header>

          {/* Single bento grid. Cell 1 = anchor; cells 2–3 = stacked features (both keep their original card treatment); cells 4–10 = small tiles with photo fully visible + content overlay; cell 11 = Cross Border Services (external link to TransLine49). */}
          <ul className="mw-svcs-grid" aria-label="Capabilities">
            {/* 01 — Anchor (Industrial Waste Treatment). Same num + title-row + text + arrow structure as the rest. */}
            <li>
              <Link
                href={`/industrial-services/${orderedServices[0].slug}/`}
                className="mw-svcs-anchor"
              >
                <span
                  className="mw-svcs-anchor__photo"
                  style={{ backgroundImage: `url(${orderedServices[0].photo})` }}
                  aria-hidden="true"
                />
                <div className="mw-svcs-anchor__body">
                  <span className="mw-svcs-anchor__num">01</span>
                  <div className="mw-svcs-anchor__title-row">
                    <h3 className="mw-svcs-anchor__title">
                      {orderedServices[0].title}
                    </h3>
                    <span className="mw-svcs-anchor__arr" aria-hidden="true">→</span>
                  </div>
                  <p className="mw-svcs-anchor__text">{orderedServices[0].summary}</p>
                </div>
              </Link>
            </li>

            {/* 02–03 — Supporting features (Environmental Remediation, Emergency Response) */}
            {orderedServices.slice(1, 3).map((s, i) => (
              <li key={s.id}>
                <Link href={`/industrial-services/${s.slug}/`} className="mw-svcs-card">
                  <span
                    className="mw-svcs-card__photo"
                    style={{ backgroundImage: `url(${s.photo})` }}
                    aria-hidden="true"
                  />
                  <div className="mw-svcs-card__body">
                    <span className="mw-svcs-card__num">{String(i + 2).padStart(2, "0")}</span>
                    {(() => {
                      const { line1, line2 } = splitTitle(s.title);
                      return (
                        <div className="mw-svcs-card__title-row">
                          <h3 className="mw-svcs-card__title">
                            {line1}{line2 && (<><br />{line2}</>)}
                          </h3>
                          <span className="mw-svcs-card__arr" aria-hidden="true">→</span>
                        </div>
                      );
                    })()}
                    <p className="mw-svcs-card__text">{s.summary}</p>
                  </div>
                </Link>
              </li>
            ))}

            {/* 04–06 — Customer Waste, Industrial Cleaning, Project Management */}
            {orderedServices.slice(3, 6).map((s, i) => (
              <li key={s.id}>
                <Link href={`/industrial-services/${s.slug}/`} className="mw-svcs-tile">
                  <span
                    className="mw-svcs-tile__photo"
                    style={{ backgroundImage: `url(${s.photo})` }}
                    aria-hidden="true"
                  />
                  <div className="mw-svcs-tile__body">
                    <span className="mw-svcs-tile__num">{String(i + 4).padStart(2, "0")}</span>
                    {(() => {
                      const { line1, line2 } = splitTitle(s.title);
                      return (
                        <div className="mw-svcs-tile__title-row">
                          <h3 className="mw-svcs-tile__title">
                            {line1}{line2 && (<><br />{line2}</>)}
                          </h3>
                          <span className="mw-svcs-tile__arr" aria-hidden="true">→</span>
                        </div>
                      );
                    })()}
                    <p className="mw-svcs-tile__text">{s.summary}</p>
                  </div>
                </Link>
              </li>
            ))}

            {/* 07 — Cross Border Services (external, now occupies the TALL cell) */}
            <li>
              <a
                href="https://www.transline49.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mw-svcs-tile mw-svcs-tile--external"
              >
                <span
                  className="mw-svcs-tile__photo"
                  style={{ backgroundImage: "url(/miller/services/vacuum-truck-new-logo.webp)" }}
                  aria-hidden="true"
                />
                <div className="mw-svcs-tile__body">
                  <span className="mw-svcs-tile__num">07</span>
                  <div className="mw-svcs-tile__title-row">
                    <h3 className="mw-svcs-tile__title">
                      Cross-Border<br />Services
                    </h3>
                    <span className="mw-svcs-tile__arr" aria-hidden="true">→</span>
                  </div>
                  <p className="mw-svcs-tile__text">
                    Transboundary movement of waste from the United States to Canada to mitigate your US liabilities.
                  </p>
                </div>
              </a>
            </li>

            {/* 08–10 — Research & Development, Stewardship, Vacuum Truck (R&D swapped in for Specialty Recycling). */}
            {[orderedServices[6], orderedServices[8], orderedServices[9]].map((s, i) => (
              <li key={s.id}>
                <Link href={`/industrial-services/${s.slug}/`} className="mw-svcs-tile">
                  <span
                    className="mw-svcs-tile__photo"
                    style={{ backgroundImage: `url(${s.photo})` }}
                    aria-hidden="true"
                  />
                  <div className="mw-svcs-tile__body">
                    <span className="mw-svcs-tile__num">{String(i + 8).padStart(2, "0")}</span>
                    {(() => {
                      const { line1, line2 } = splitTitle(s.title);
                      return (
                        <div className="mw-svcs-tile__title-row">
                          <h3 className="mw-svcs-tile__title">
                            {line1}{line2 && (<><br />{line2}</>)}
                          </h3>
                          <span className="mw-svcs-tile__arr" aria-hidden="true">→</span>
                        </div>
                      );
                    })()}
                    <p className="mw-svcs-tile__text">{s.summary}</p>
                  </div>
                </Link>
              </li>
            ))}

            {/* 11 — Specialty Recycling (swapped in from position 08). */}
            <li>
              <Link href={`/industrial-services/${orderedServices[7].slug}/`} className="mw-svcs-tile">
                <span
                  className="mw-svcs-tile__photo"
                  style={{ backgroundImage: `url(${orderedServices[7].photo})` }}
                  aria-hidden="true"
                />
                <div className="mw-svcs-tile__body">
                  <span className="mw-svcs-tile__num">11</span>
                  {(() => {
                    const { line1, line2 } = splitTitle(orderedServices[7].title);
                    return (
                      <div className="mw-svcs-tile__title-row">
                        <h3 className="mw-svcs-tile__title">
                          {line1}{line2 && (<><br />{line2}</>)}
                        </h3>
                        <span className="mw-svcs-tile__arr" aria-hidden="true">→</span>
                      </div>
                    );
                  })()}
                  <p className="mw-svcs-tile__text">{orderedServices[7].summary}</p>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </section>

{/* 5b. WHO WE SERVE — copy. Four cards (Industrial / Infrastructure / Institutional / Community) with a compact photo banner at the top of each, then category title + sector list. */}
      <section className="mw-sec2" aria-labelledby="mw-sectors-heading-copy">
        <div className="mw-inner">
          <header className="mw-sec2__head">
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">Who we serve</span>
            </p>
            <div className="mw-sec2__head-split">
              <div className="mw-sec2__head-left">
                <h2 id="mw-sectors-heading-copy" className="mw-sec2__title">
                  From rail yards to research labs &mdash; and the kitchen sink.
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

          <div className="mw-sec2__cards">
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

{/* 4. FACILITY — Photo-led: a large aerial photo on the right with a smaller plaque photo overlapping its bottom-left corner; content panel on the left with eyebrow + title above the lead, then stats and CTAs. Capabilities below as a clean chip ribbon. */}
      <section className="mw-fac2" aria-labelledby="mw-facility-heading-copy">
        <div className="mw-inner">
          <div className="mw-fac2__split">
            <div className="mw-fac2__content">
              <header className="mw-fac2__head">
                <p className="mw-section-tag" aria-hidden="true">
                  <span className="mw-section-tag-mark" />
                  <span className="mw-section-tag-label">Vaughn Bullough Environmental Centre</span>
                </p>
                <h2 id="mw-facility-heading-copy" className="mw-fac2__title">
                  VBEC.<br /><span className="mw-fac2__title-em">A facility built for the work.</span>
                </h2>
              </header>
              <p className="mw-fac2__lead">{c.vbec.body}</p>

              <dl className="mw-fac2__figs" aria-label="Facility figures">
                <div className="mw-fac2__fig">
                  <dt className="mw-fac2__fig-label">Footprint</dt>
                  <dd className="mw-fac2__fig-val"><span className="mw-fac2__fig-num">64</span><span className="mw-fac2__fig-unit">hectares</span></dd>
                </div>
                <div className="mw-fac2__fig">
                  <dt className="mw-fac2__fig-label">Location</dt>
                  <dd className="mw-fac2__fig-val"><span className="mw-fac2__fig-num">70</span><span className="mw-fac2__fig-unit">km S of Winnipeg</span></dd>
                </div>
                <div className="mw-fac2__fig">
                  <dt className="mw-fac2__fig-label">Operating</dt>
                  <dd className="mw-fac2__fig-val"><span className="mw-fac2__fig-num">1997</span><span className="mw-fac2__fig-unit">to today</span></dd>
                </div>
              </dl>

              <div className="mw-fac2__actions">
                <Link href={c.vbec.cta.href} className="mw-cta mw-cta--solid">
                  {c.vbec.cta.label} <span aria-hidden="true">→</span>
                </Link>
                <Link href={c.vbec.aboutHref} className="mw-fac2__about">
                  {c.vbec.aboutLinkLabel} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <FacilityGallery photos={FACILITY_PHOTOS} />
          </div>

          <div className="mw-fac2__caps">
            <header className="mw-fac2__caps-head">
              <h3 className="mw-fac2__caps-title">
                <span className="mw-fac2__caps-mark" aria-hidden="true" />
                <span>7 powerful capabilities</span>
              </h3>
            </header>
            <ol className="mw-fac2__caps-grid" aria-label="Onsite capabilities">
              {c.vbec.capabilities.map((cap, i) => (
                <li key={i} className="mw-fac2__caps-item">
                  <span className="mw-fac2__caps-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h4 className="mw-fac2__caps-name">{cap}</h4>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

{/* 6b. OUR HISTORY — copy with a vertical milestone timeline in the left column. Five milestones from the company background, alternating left/right of a center spine. Each row is a hover/focus-within accordion that expands the body using grid-template-rows: 0fr → 1fr. */}
      <section className="mw-ten3" aria-labelledby="mw-tenure-heading-copy-b">
        <div className="mw-inner">
          <div className="mw-ten3__grid">
            <aside className="mw-ten3__timeline" aria-label="Company milestones">
              <HistoryTimeline items={[
                { year: "1996", title: "Founded as a 50/50 venture", body: "Province of Manitoba (via the Manitoba Hazardous Waste Management Corporation) and Miller Paving sign a 50/50 partnership creating Miller Environmental Corporation. Announced January 10, 1996 by Environment Minister Glen Cummings." },
                { year: "1997", title: "Vaughn Bullough hired as GM", body: "Recruited from ChemSecurity Alta Ltd., Bullough reorganizes the operation from a struggling Crown-asset takeover into Manitoba’s only fully-licensed hazardous-waste operator. He leads operations for twenty-five years." },
                { year: "2019 — 2022", title: "Processing Cell 5 commissioned", body: "A new engineered processing cell is constructed and licensed under 58 HW S2 RRRR, expanding treatment, storage, and disposal capacity at the St. Jean Baptiste / Montcalm RM facility." },
                { year: "August 2022", title: "Renamed Vaughn Bullough Environmental Centre", body: "President & CEO Blair McArthur signs the dedication. The Manitoba Environmental Centre becomes VBEC in recognition of Bullough’s twenty-five-year leadership — an exceptional gesture in Manitoba’s environmental-services sector." },
                { year: "May 2025", title: "Solvent recycling online", body: "Manitoba Environment and Climate Change approves an Almatec AC-150 solvent-recycling installation in Processing Building PB1. Up to 4.5 million litres of contaminated solvent reclaimed annually — shifting MEC further up the waste-management hierarchy." },
              ]} />
            </aside>

            <div className="mw-ten3__body">
              <header className="mw-ten3__head">
                <p className="mw-section-tag" aria-hidden="true">
                  <span className="mw-section-tag-mark" />
                  <span className="mw-section-tag-label">Our history</span>
                </p>
                <h2 id="mw-tenure-heading-copy-b" className="mw-ten3__title">
                  Three decades in <span className="mw-ten3__title-em">hazardous waste</span>.
                </h2>
                <p className="mw-ten3__lead">
                  Miller Environmental was formed in 1996 as Manitoba&rsquo;s first private-public hazardous-waste operator. Vaughn Bullough joined as General Manager in 1997 and led operations for twenty-five years. The facility was renamed in his honour in 2022. The work continues.
                </p>
              </header>

              <div className="mw-ten3__plate" aria-label="Track record">
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

              <div className="mw-ten2__mission">
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

      {/* 7. JOIN MILLER FAMILY — dark walnut, bleed variant. Eyebrow + headline + lead on the left, photo bleeds full-height to the viewport right edge with the two cards (Culture / Hiring now) stacked on top of it. */}
      <section className="mw-careers mw-careers--bleed" aria-labelledby="mw-careers-bleed-heading">
        <div className="mw-careers__bleed-photo" aria-hidden="true">
          <img src="/miller/careers/team-at-conv-booth-big-5.jpg" alt="" loading="lazy" />
        </div>
        <div className="mw-inner">
          <header className="mw-careers__head">
            <div className="mw-careers__head-text" data-reveal-stagger>
              <p className="mw-section-tag" aria-hidden="true">
                <span className="mw-section-tag-mark" />
                <span className="mw-section-tag-label mw-section-tag-label--invert">Careers</span>
              </p>
              <h2 id="mw-careers-bleed-heading" className="mw-careers__title">
                Join the<br /><span className="mw-careers__title-em">Miller team.</span>
              </h2>
              <p className="mw-careers__lead">{c.joinFamily.intro}</p>
            </div>
          </header>

          <div className="mw-careers__cards" data-reveal-stagger>
            <article className="mw-careers__card">
              <span className="mw-careers__card-rule" aria-hidden="true" />
              <span className="mw-careers__card-tag">Culture</span>
              <h3 className="mw-careers__card-title">{c.joinFamily.whyTitle}</h3>
              <p className="mw-careers__card-text">{c.joinFamily.whyBody}</p>
              <Link href={c.joinFamily.whyCta.href} className="mw-careers__card-link">
                {c.joinFamily.whyCta.label} <span aria-hidden="true">→</span>
              </Link>
            </article>
            <article className="mw-careers__card">
              <span className="mw-careers__card-rule" aria-hidden="true" />
              <span className="mw-careers__card-tag">Hiring now</span>
              <h3 className="mw-careers__card-title">{c.joinFamily.opportunitiesTitle}</h3>
              <p className="mw-careers__card-text">{c.joinFamily.opportunitiesBody}</p>
              <Link href={c.joinFamily.opportunitiesCta.href} className="mw-careers__card-link">
                {c.joinFamily.opportunitiesCta.label} <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* 8. MARQUEE — brand refrains on a narrow terracotta-tinted strip that bridges Careers (dark) into the Final CTA. */}
      <section className="mw-marquee" aria-label="Miller brand refrains">
        <Marquee items={c.marquee} />
      </section>

      {/* 9. FINAL CTA — cream close, eyebrow + headline + body + two primary actions. */}
      <section className="mw-final" aria-labelledby="mw-final-heading">
        <div className="mw-final__grid" data-reveal-stagger>
          <div className="mw-final__col mw-final__col--truck">
            <img
              className="mw-final__truck"
              src="/miller/truck-graphic-angled.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
          </div>
          <div className="mw-final__col mw-final__col--content">
            <p className="mw-section-tag mw-final__tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{c.finalCta.eyebrow}</span>
            </p>
            <h2 id="mw-final-heading" className="mw-final__title">{c.finalCta.title}</h2>
            <p className="mw-final__body">{c.finalCta.body}</p>
            <div className="mw-final__row">
              <Link href={c.finalCta.contactHref} className="mw-cta mw-cta--solid">
                Contact Miller <span aria-hidden="true">→</span>
              </Link>
              <a
                href={c.finalCta.emergencyHref}
                className="mw-cta mw-cta--ghost"
                aria-label={`Call 24/7 emergency: ${c.finalCta.emergencyDisplay}`}
              >
                <span className="mw-cta__sup">24/7 emergency</span>
                <span className="mw-cta__num">{c.finalCta.emergencyDisplay}</span>
              </a>
            </div>
          </div>
          <div className="mw-final__col mw-final__col--logo">
            <img
              className="mw-final__logomark"
              src="/miller/logo/miller-logomark.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
