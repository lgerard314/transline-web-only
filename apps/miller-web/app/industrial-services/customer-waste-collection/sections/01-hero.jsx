import Link from "next/link";
import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";
import { StopText } from "@/components/StopText";

// HERO — alert masthead. Schedule pickup is the primary action.
export function HeroSection() {
  const h = c.hero;
  return (
    <section className="mw-svc-hero mw-svc-hero--alert mw-svc-hero--photo-50" aria-labelledby="cwc-hero-title">
      <div className="mw-svc-hero__inner mw-inner">
        <div className="mw-svc-hero__content">
          <p className="mw-section-tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{h.eyebrow}</span>
          </p>
          <h1 id="cwc-hero-title" className="mw-svc-hero__title">
            {h.title}<br />
            <span className="mw-svc-hero__title-em"><StopText>{h.titleEm}</StopText></span>
          </h1>
          <p className="mw-svc-hero__lead">{h.lead}</p>
          <div className="mw-svc-hero__ctas">
            <Link href={h.secondaryCta.href} className="mw-cta mw-cta--solid">
              <span className="mw-svc-hero__cta-label mw-svc-hero__cta-label--full">{h.secondaryCta.label}</span>
              <span className="mw-svc-hero__cta-label mw-svc-hero__cta-label--short">{h.secondaryCta.labelShort}</span>{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="mw-svc-hero__bleed-photo" aria-hidden="true">
        <img className="mw-svc-hero__photo" src={h.photo} alt="" />
      </div>
    </section>
  );
}
