import Link from "next/link";
import { HOME as c } from "../home";
import { HeroPhraseCycle } from "./hero-phrase-cycle";

// HERO — civic-monument typography on a darkened operating-site photo.
export function HeroSection() {
  return (
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
  );
}
