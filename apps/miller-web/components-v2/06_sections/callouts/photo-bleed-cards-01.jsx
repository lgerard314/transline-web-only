import { HOME as c } from "@/app/(home)/home";
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { NoteCard01 } from "@/components-v2/03_cards/note/note-card-01";

export function PhotoBleedCards01() {
  return (
    <section className="mw-careers mw-careers--bleed" aria-labelledby="mw-careers-bleed-heading">
      <div className="mw-careers__bleed-photo" aria-hidden="true">
        <img src="/miller/careers/team-at-conv-booth-big-5.jpg" alt="" loading="lazy" />
      </div>
      <div className="mw-inner">
        <header className="mw-careers__head">
          <div className="mw-careers__head-text" data-reveal>
            <Eyebrow01 label="Careers" invert />
            <h2 id="mw-careers-bleed-heading" className="mw-careers__title">
              Join the<br /><span className="mw-careers__title-em">Miller <span className="mw-nobr">team<span className="mw-stop" aria-hidden="true" /></span></span>
            </h2>
            <p className="mw-careers__lead">{c.joinFamily.intro}</p>
          </div>
        </header>
        <div className="mw-careers__cards" data-reveal-stagger>
          <NoteCard01 tag="Culture" title={c.joinFamily.whyTitle} text={c.joinFamily.whyBody} cta={c.joinFamily.whyCta} />
          <NoteCard01 tag="Hiring now" title={c.joinFamily.opportunitiesTitle} text={c.joinFamily.opportunitiesBody} cta={c.joinFamily.opportunitiesCta} />
        </div>
      </div>
    </section>
  );
}
