import Link from "next/link";
import { HOME as c } from "../home";
import { FacilityGallery } from "./facility-gallery";

const FACILITY_PHOTOS = [
  { src: "/miller/facility/vbec-drone-overview.png", alt: "VBEC drone overview", caption: "Aerial drone overview" },
  { src: "/miller/facility/vbec-office-front-aerial.png", alt: "Office front, aerial view", caption: "Office front, from above" },
  { src: "/miller/facility/vbec-office-front.png", alt: "Office front, ground view", caption: "Office front entrance" },
  { src: "/miller/facility/vbec-stone-sign.png", alt: "Vaughn Bullough Environmental Centre stone sign", caption: "Entrance stone sign" },
  { src: "/miller/facility/vbec-lake.png", alt: "Lake on the VBEC grounds", caption: "Reflection pond on the grounds" },
  { src: "/miller/facility/vbec-windmills.png", alt: "Wind turbines visible from VBEC", caption: "Wind turbines on the horizon" },
];

// FACILITY — VBEC split layout with photo gallery and capability ribbon.
export function FacilitySection() {
  return (
    <section className="mw-fac2" aria-labelledby="mw-facility-heading-copy">
      <div className="mw-inner">
        <div className="mw-fac2__split">
          <div className="mw-fac2__content" data-reveal-stagger>
            <header className="mw-fac2__head">
              <p className="mw-section-tag" aria-hidden="true">
                <span className="mw-section-tag-mark" />
                <span className="mw-section-tag-label">Vaughn Bullough Environmental Centre</span>
              </p>
              <h2 id="mw-facility-heading-copy" className="mw-fac2__title">
                <span className="mw-nobr">VBEC<span className="mw-stop" aria-hidden="true" /></span><br /><span className="mw-fac2__title-em">A facility built for the <span className="mw-nobr">work<span className="mw-stop" aria-hidden="true" /></span></span>
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
                <span className="mw-fac2__lbl-long">{c.vbec.cta.label}</span>
                <span className="mw-fac2__lbl-short">Visit Facility</span>
                {" "}<span aria-hidden="true">→</span>
              </Link>
              <Link href={c.vbec.aboutHref} className="mw-fac2__about">
                <span className="mw-fac2__lbl-long">{c.vbec.aboutLinkLabel}</span>
                <span className="mw-fac2__lbl-short">Read the story</span>
                {" "}<span aria-hidden="true">→</span>
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
  );
}
