import Link from "next/link";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · doors-close-01 — the creed page's close (VMV v2 §5): a short
// challenge statement + two door cards out (careers / contact). The about
// page doesn't use the service-page related rail; these doors are its
// cross-links. Light surface (§12: never dark before the footer). Cards
// are whole-card links; data-reveal sits on the grid wrapper so the
// hover lift isn't fighting the reveal's fill-mode (§13).
//
// content: { titleId, eyebrow, title, titleEm, body,
//            doors[{ name, text, cta, href }] }
// config:  standard sectionProps passthrough.
export function DoorsClose01({ content, config = {} }) {
  return (
    <section className="mw-vmv-close" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-vmv-close__inner mw-inner">
        <p className="mw-section-tag" data-reveal aria-hidden="true">
          <span className="mw-section-tag-mark" />
          <span className="mw-section-tag-label">{content.eyebrow}</span>
        </p>
        <h2 id={content.titleId} className="mw-section-title mw-vmv-close__title" data-reveal>
          {content.title}{" "}
          <em className="mw-vmv-close__title-em"><StopText>{content.titleEm}</StopText></em>
        </h2>
        <p className="mw-vmv-close__body" data-reveal>{content.body}</p>

        <div className="mw-vmv-close__doors" data-reveal>
          {content.doors.map((d) => (
            <Link key={d.name} href={d.href} className="mw-vmv-close__door">
              <h3 className="mw-vmv-close__door-name">{d.name}</h3>
              <p className="mw-vmv-close__door-text">{d.text}</p>
              <span className="mw-vmv-close__door-cta">
                {d.cta} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
