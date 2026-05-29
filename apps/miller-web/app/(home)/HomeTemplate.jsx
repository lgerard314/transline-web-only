// HomeTemplate — server component. Section order:
//   1. Hero (photo + cycling phrase headline)
//   2. Trust — 4 full-width cert cards
//   3. Services — bento grid of 10 capabilities
//   4. Who we serve — 4 sector cards
//   5. VBEC — facility split + 7 capabilities
//   6. Our history — interactive timeline + truck-plate stats + Mission
//   7. Careers — bleed photo + Culture / Hiring cards
//   8. Marquee — brand refrains
//   9. Final CTA — truck | content | logo, contact + 24/7
//
// Content arrives via the `content` prop from lib/content/home.js.

import Link from "next/link";
import { Marquee } from "@white-owl/brand/components";
import { HeroPhraseCycle } from "./HeroPhraseCycle";
import { SectorStatCycle } from "./SectorStatCycle";
import { FacilityGallery } from "./FacilityGallery";
import { HistoryTimeline } from "./HistoryTimeline";
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

// Social links shown beneath the Final CTA buttons. Icon glyphs are
// single-path Bootstrap Icons (16x16 viewBox, currentColor).
const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/millerenvironmentalcorporation",
    path: "M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/millerenvironmentalcorporation/",
    path: "M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.281.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z",
  },
  {
    label: "X",
    href: "https://x.com/MillerEnviron",
    path: "M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/miller-environmental-corporation",
    path: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@MillerEnvironmental",
    path: "M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c1.123-.302 5.288-.332 6.11-.335zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z",
  },
];

// Professional-affiliation marks shown in the rotating band below Careers.
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

// Service ordering for the home grid:
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
            <img className="mw-hero__mark-logo" src="/miller/logo/miller-logomark.webp" alt="" />
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
        <div className="mw-certs" role="list" aria-label="Certifications" data-reveal-stagger>
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
          <header className="mw-section-head mw-services__head" data-reveal-stagger>
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">Services</span>
            </p>
            <h2 id="mw-services-heading" className="mw-section-title">
              whatever your waste needs,<br /><span className="mw-services__title-em">we&rsquo;ve got you covered<span className="mw-stop" aria-hidden="true" /></span>
            </h2>
            <p className="mw-services__intro">
              From routine industrial streams to one-off emergency calls, Miller&rsquo;s licensed VBEC facility and field crews handle the full spectrum &mdash; collection, treatment, and final disposition, all under one roof.
            </p>
          </header>

          {/* Single bento grid. Cell 1 = anchor; cells 2–3 = stacked features (both keep their original card treatment); cells 4–10 = small tiles with photo fully visible + content overlay; cell 11 = Cross Border Services (external link to TransLine49). */}
          <ul className="mw-svcs-grid" aria-label="Capabilities" data-reveal-stagger>
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

{/* 4. FACILITY — Photo-led: a large aerial photo on the right with a smaller plaque photo overlapping its bottom-left corner; content panel on the left with eyebrow + title above the lead, then stats and CTAs. Capabilities below as a clean chip ribbon. */}
      <section className="mw-fac2" aria-labelledby="mw-facility-heading-copy">
        <div className="mw-inner">
          <div className="mw-fac2__split" data-reveal-stagger>
            <div className="mw-fac2__content">
              <header className="mw-fac2__head">
                <p className="mw-section-tag" aria-hidden="true">
                  <span className="mw-section-tag-mark" />
                  <span className="mw-section-tag-label">Vaughn Bullough Environmental Centre</span>
                </p>
                <h2 id="mw-facility-heading-copy" className="mw-fac2__title">
                  VBEC<span className="mw-stop" aria-hidden="true" /><br /><span className="mw-fac2__title-em">A facility built for the work<span className="mw-stop" aria-hidden="true" /></span>
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
                  <dd className="mw-fac2__fig-val"><span className="mw-fac2__fig-num">1996</span><span className="mw-fac2__fig-unit">to today</span></dd>
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
            <header className="mw-fac2__caps-head" data-reveal>
              <h3 className="mw-fac2__caps-title">
                <span className="mw-fac2__caps-mark" aria-hidden="true" />
                <span>7 powerful capabilities</span>
              </h3>
            </header>
            <ol className="mw-fac2__caps-grid" aria-label="Onsite capabilities" data-reveal-stagger>
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
              <header className="mw-ten3__head" data-reveal>
                <p className="mw-section-tag" aria-hidden="true">
                  <span className="mw-section-tag-mark" />
                  <span className="mw-section-tag-label">Our history</span>
                </p>
                <h2 id="mw-tenure-heading-copy-b" className="mw-ten3__title">
                  Three decades in <span className="mw-ten3__title-em">hazardous waste</span><span className="mw-stop" aria-hidden="true" />
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

      {/* 7. JOIN MILLER FAMILY — dark walnut, bleed variant. Eyebrow + headline + lead on the left, photo bleeds full-height to the viewport right edge with the two cards (Culture / Hiring now) stacked on top of it. */}
      <section className="mw-careers mw-careers--bleed" aria-labelledby="mw-careers-bleed-heading">
        <div className="mw-careers__bleed-photo" aria-hidden="true">
          <img src="/miller/careers/team-at-conv-booth-big-5.jpg" alt="" loading="lazy" />
        </div>
        <div className="mw-inner">
          <header className="mw-careers__head">
            <div className="mw-careers__head-text" data-reveal>
              <p className="mw-section-tag" aria-hidden="true">
                <span className="mw-section-tag-mark" />
                <span className="mw-section-tag-label mw-section-tag-label--invert">Careers</span>
              </p>
              <h2 id="mw-careers-bleed-heading" className="mw-careers__title">
                Join the<br /><span className="mw-careers__title-em">Miller team<span className="mw-stop" aria-hidden="true" /></span>
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
            <h2 id="mw-final-heading" className="mw-final__title">{c.finalCta.title.replace(/\.\s*$/, "")}<span className="mw-stop" aria-hidden="true" /></h2>
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
            <span className="mw-final__divider" aria-hidden="true" />
            <ul className="mw-final__socials" aria-label="Miller Environmental on social media">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="mw-final__social"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                  >
                    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
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
