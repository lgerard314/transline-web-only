import Link from "next/link";
import { HOME as c } from "@/app/(home)/home";
import { FACILITY_PHOTOS } from "@/lib/content/template-testing-home";
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { FigureStat01 } from "@/components-v2/04_blocks/stats/figure-stat-01";
import { CapItem01 } from "@/components-v2/04_blocks/stats/cap-item-01";
import { ThumbGallery01 } from "@/components-v2/05_widgets/galleries/thumb-gallery-01";

export function MediaSplit01() {
  return (
    <section className="mw-fac2" aria-labelledby="mw-facility-heading-copy">
      <div className="mw-inner">
        <div className="mw-fac2__split">
          <div className="mw-fac2__content" data-reveal-stagger>
            <header className="mw-fac2__head">
              <Eyebrow01 label="Vaughn Bullough Environmental Centre" />
              <h2 id="mw-facility-heading-copy" className="mw-fac2__title">
                <span className="mw-nobr">VBEC<span className="mw-stop" aria-hidden="true" /></span><br /><span className="mw-fac2__title-em">A facility built for the <span className="mw-nobr">work<span className="mw-stop" aria-hidden="true" /></span></span>
              </h2>
            </header>
            <p className="mw-fac2__lead">{c.vbec.body}</p>
            <dl className="mw-fac2__figs" aria-label="Facility figures">
              <FigureStat01 label="Footprint" num="64" unit="hectares" />
              <FigureStat01 label="Location" num="70" unit="km S of Winnipeg" />
              <FigureStat01 label="Operating" num="1996" unit="to today" />
            </dl>
            <div className="mw-fac2__actions">
              <SolidCta01 href={c.vbec.cta.href}>
                <span className="mw-fac2__lbl-long">{c.vbec.cta.label}</span>
                <span className="mw-fac2__lbl-short">Visit Facility</span>
                {" "}<ActionArrow01 />
              </SolidCta01>
              <Link href={c.vbec.aboutHref} className="mw-fac2__about">
                <span className="mw-fac2__lbl-long">{c.vbec.aboutLinkLabel}</span>
                <span className="mw-fac2__lbl-short">Read the story</span>
                {" "}<span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <ThumbGallery01 photos={FACILITY_PHOTOS} />
        </div>
        <div className="mw-fac2__caps">
          <header className="mw-fac2__caps-head" data-reveal>
            <h3 className="mw-fac2__caps-title">
              <span className="mw-fac2__caps-mark" aria-hidden="true" />
              <span>7 powerful capabilities</span>
            </h3>
          </header>
          <ol className="mw-fac2__caps-grid" aria-label="Onsite capabilities" data-reveal-stagger>
            {c.vbec.capabilities.map((cap, i) => (<CapItem01 key={i} n={i + 1} name={cap} />))}
          </ol>
        </div>
      </div>
    </section>
  );
}
