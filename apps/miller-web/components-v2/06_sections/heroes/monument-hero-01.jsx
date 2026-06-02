// L3 · hero-01 — civic-monument hero on darkened site photo.
import { EMERGENCY_PHONE } from "@/lib/content/brand";
import { PhraseCycle01 } from "@/components-v2/05_widgets/cycles/phrase-cycle-01";
import { StopPeriod01 } from "@/components-v2/01_marks/stops/stop-period-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { GhostPhoneCta01 } from "@/components-v2/02_buttons/ghost/ghost-phone-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";

const EMERGENCY_HREF = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

export function MonumentHero01() {
  return (
    <section className="mw-hero" aria-labelledby="mw-hero-title">
      <div
        className="mw-hero__photo"
        aria-hidden="true"
        style={{ backgroundImage: "url(/miller/hero/home-frame-1.png)" }}
      />
      <div className="mw-hero__inner">
        <p className="mw-hero__mark" aria-hidden="true">
          <img className="mw-hero__mark-logo" src="/miller/logo/miller-logomark.webp" alt="" />
          <span className="mw-hero__mark-corp">
            Miller Environmental{" "}
            <span className="mw-hero__mark-corp-long">Corporation</span>
            <span className="mw-hero__mark-corp-short">Corp.</span>
          </span>
          <span className="mw-hero__mark-meta">
            <span className="mw-hero__mark-dot" />
            <span className="mw-hero__mark-since">Since 1996</span>
          </span>
        </p>

        <h1 id="mw-hero-title" className="mw-hero__title">
          <span className="mw-hero__line">leaders in</span>
          <span className="mw-hero__line">
            <PhraseCycle01
              phrases={[
                { text: "hazardous" },
                { text: "safe", tone: "accent" },
                { text: "reliable", tone: "accent" },
              ]}
            />
          </span>
          <span className="mw-hero__line">waste <span className="mw-nobr">disposal<StopPeriod01 variant="hero" /></span></span>
        </h1>

        <p className="mw-hero__lead">
          Twenty-five years of licensed hazardous waste management in Manitoba.
          Three ISO certifications. One documented chain of custody from your
          loading dock to final disposition at VBEC.
        </p>

        <div className="mw-hero__foot">
          <div className="mw-hero__ctas">
            <SolidCta01 href="/contact-us/">
              Talk to Miller <ActionArrow01 />
            </SolidCta01>
            <GhostPhoneCta01
              sup="24/7 emergency"
              num={EMERGENCY_PHONE}
              href={EMERGENCY_HREF}
              ariaLabel={`Call 24/7 emergency: ${EMERGENCY_PHONE}`}
            />
          </div>
          <p className="mw-hero__article">
            <strong>VBEC</strong> · 64 ha, Montcalm MB · ISO 9001 · 14001 · 45001
          </p>
        </div>
      </div>
    </section>
  );
}
