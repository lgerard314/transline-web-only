import Link from "next/link";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · case-rail-01 — proof of work as a 2×2 wall of horizontal case cards
// (REM v2 §5). REAL case studies: each card is a whole-card <Link> to its
// live case-study route with a library photo (real project imagery — not
// generated), location mono line, condensed title, one-line desc, and a
// mono "Read the case →" row. Hover: clay border + photo zoom.
//
// content: { titleId, eyebrow, title, lead,
//            items[{ href, title, location, photo, desc }] }
// config:  standard sectionProps passthrough.
export function CaseRail01({ content, config = {} }) {
  return (
    <section className="mw-rem2-case" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-rem2-case__inner mw-inner">
        <header className="mw-rem2-case__head">
          <div>
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-rem2-case__title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
          </div>
          <p className="mw-rem2-case__lead" data-reveal>{content.lead}</p>
        </header>

        <ul className="mw-rem2-case__grid" data-reveal-stagger>
          {content.items.map((it) => (
            <li key={it.href} className="mw-rem2-case__item">
              <Link href={it.href} className="mw-rem2-case__card">
                <span className="mw-rem2-case__media" aria-hidden="true">
                  <img className="mw-rem2-case__photo" src={it.photo} alt="" loading="lazy" />
                </span>
                <span className="mw-rem2-case__meta">
                  <span className="mw-rem2-case__loc">{it.location}</span>
                  <span className="mw-rem2-case__name">{it.title}</span>
                  <span className="mw-rem2-case__desc">{it.desc}</span>
                  <span className="mw-rem2-case__cta">
                    Read the case <span aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
