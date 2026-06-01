import Link from "next/link";
import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { StopText } from "@/components/StopText";

// §6 — Case studies that prove our expertise. Four photo cards, each linking to
// the full case-study detail route.
export function CaseStudiesSection() {
  const cs = c.caseStudies;
  return (
    <section className="mw-svc-inds mw-svc-inds--gallery mw-rem-case" aria-labelledby="rem-case-title">
      <div className="mw-svc-inds__inner mw-inner">
        <header className="mw-svc-inds__head">
          <div className="mw-svc-inds__head-left">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{cs.eyebrow}</span>
            </p>
            <h2 id="rem-case-title" className="mw-section-title" data-reveal>
              <StopText>{cs.title}</StopText>
            </h2>
          </div>
          <p className="mw-svc-inds__lead" data-reveal>{cs.lead}</p>
        </header>

        <ul className="mw-svc-inds__grid" data-reveal-stagger>
          {cs.items.map((it) => (
            <li key={it.href} className="mw-ind-card mw-case-card">
              <Link href={it.href} className="mw-case-card__link">
                <div className="mw-ind-card__media">
                  <img src={it.photo} alt="" loading="lazy" />
                </div>
                <div className="mw-ind-card__body">
                  <p className="mw-case-card__loc">{it.location}</p>
                  <h3 className="mw-ind-card__name">{it.title}</h3>
                  <span className="mw-case-card__cta">
                    Read case study <span className="mw-case-card__arrow" aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
