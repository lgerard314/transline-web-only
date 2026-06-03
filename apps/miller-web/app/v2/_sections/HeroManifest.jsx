import Image from "next/image";
import { DiamondSeal } from "../_components/DiamondSeal";
import { CustodyRule } from "../_components/CustodyThread";
import { MxStop, MxArrow } from "../_components/marks";

// 00 · ORIGIN — the manifest header. This first viewport must read as the
// HEADER OF A DOCUMENT (a waste manifest / certificate), not a hero with a
// label stuck on it: a top hairline rule carrying a mono ledger line, the
// headline pinned into the photo's upper-left negative space, a bottom
// registration line, and a large issuing SEAL (static — it lands in stillness;
// the DRAWING seal is reserved for the tally money shot). The ONE entrance move
// is the headline line-rise; everything else settles quietly.
export function HeroManifest({ content }) {
  const c = content;
  return (
    <section className="mx-hero mx-section" aria-labelledby={c.titleId}>
      <CustodyRule />
      {/* parallax photo + warm scrim weighting the upper-left text quadrant */}
      <div className="mx-hero__bg" data-mx-parallax data-mx-parallax-speed="0.12">
        <Image src={c.photoSrc} alt="" fill priority sizes="100vw" className="mx-hero__img" />
        <span className="mx-hero__scrim" aria-hidden="true" />
      </div>
      {/* registration corner ticks — technical-drawing atmosphere */}
      <span className="mx-hero__regmark mx-hero__regmark--tl" aria-hidden="true" />
      <span className="mx-hero__regmark mx-hero__regmark--br" aria-hidden="true" />

      <div className="mx-inner mx-hero__inner">
        <header className="mx-hero__masthead">
          <span className="mx-hero__hr" aria-hidden="true" />
          <div className="mx-hero__metarow">
            <p className="mx-hero__manifest">{c.manifestLine}</p>
            <p className="mx-hero__formno">FORM {c.stage}</p>
          </div>
        </header>

        <div className="mx-hero__body">
          <div className="mx-hero__type">
            <h1 id={c.titleId} className="mx-hero__title" data-mx-reveal="line">
              <span className="mx-line"><span className="mx-line__in">{c.title.line1}</span></span>
              <span className="mx-line"><span className="mx-line__in">{c.title.line2}</span></span>
              <span className="mx-line"><span className="mx-line__in">{c.title.line3}<MxStop /></span></span>
            </h1>
            <p className="mx-hero__lead" data-mx-reveal="fade">{c.lead}</p>
            <div className="mx-hero__actions" data-mx-reveal="fade">
              <a className="mx-btn mx-btn--primary" href={c.primaryCta.href}>
                {c.primaryCta.label} <MxArrow />
              </a>
              <a className="mx-btn mx-btn--ghost" href={c.ghostPhone.href}>
                <span className="mx-btn__sup">{c.ghostPhone.sup}</span>
                <span className="mx-btn__num">{c.ghostPhone.num}</span>
              </a>
            </div>
          </div>
        </div>

        {/* issuing seal — static (already drawn), floated as the document's mark
            of issue; absolute so it never steals headline column width */}
        <div className="mx-hero__sealwrap" data-mx-seal="closed" aria-hidden="true">
          <DiamondSeal legend={c.sealLegend}>
            <span className="mx-hero__sealmark">
              <Image src="/miller/miller-logomark.webp" alt="" width={132} height={132} className="mx-hero__seallogo" />
            </span>
          </DiamondSeal>
        </div>

        <footer className="mx-hero__reg">
          <span className="mx-hero__reg-strong">{c.registration.strong}</span>
          <span className="mx-hero__reg-rest">{c.registration.rest}</span>
        </footer>
      </div>
    </section>
  );
}
