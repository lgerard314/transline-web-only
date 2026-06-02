import { ContactForm } from "@/components/ContactForm";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// §5-style dark dispatch CTA. Darkness is driven by the literal class
// `mw-svc-cta--dark` — NOT by a [data-scheme] attribute or token rebind.
// Reverse layout is driven by the literal class `mw-svc-cta__grid--reverse`
// on the inner grid div — NOT by data-layout or any token path.
//
// content shape:
//   { eyebrow, title, titleEm, titleAfter, body,
//     formTitle, formNote,
//     emergencyHref, emergencyDisplay,
//     hotlineNote,          ← literal string supplied by the adapter
//     titleId,              ← e.g. "er-cta-title" — drives aria-labelledby
//     showOptionalFields }  ← passed to <ContactForm>; ER supplies false
//
// config: { reverse = true }  ← ER/REM/IC/IWT/PM all use the reversed grid
export function DispatchCta01({ content, config = {} }) {
  const { reverse = true } = config;
  const gridCls = "mw-svc-cta__inner mw-inner mw-svc-cta__grid" + (reverse ? " mw-svc-cta__grid--reverse" : "");
  return (
    <section className="mw-svc-cta mw-svc-cta--dark" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className={gridCls}>
        <div className="mw-svc-cta__form-col" data-reveal>
          <div className="mw-svc-cta__form">
            <div className="mw-svc-cta__form-head">
              <p className="mw-svc-cta__form-title">{content.formTitle}</p>
              <p className="mw-svc-cta__form-note">{content.formNote}</p>
            </div>
            <ContactForm showOptionalFields={content.showOptionalFields ?? false} />
          </div>
        </div>

        <div className="mw-svc-cta__content" data-reveal>
          <p className="mw-section-tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{content.eyebrow}</span>
          </p>
          <h2 id={content.titleId} className="mw-section-title mw-svc-cta__title">
            {content.title}{" "}
            <em className="mw-svc-cta__title-em">{content.titleEm}</em>{" "}
            <StopText>{content.titleAfter}</StopText>
          </h2>
          <p className="mw-svc-cta__body">{content.body}</p>

          <div className="mw-svc-cta__dispatch">
            <div className="mw-svc-cta__dispatch-row">
              <img
                className="mw-svc-cta__dispatch-logo"
                src="/miller/logo/miller-logomark.webp"
                alt=""
                aria-hidden="true"
              />
              <a
                href={content.emergencyHref}
                className="mw-svc-cta__hotline"
                aria-label={`Call the 24/7 emergency line: ${content.emergencyDisplay}`}
              >
                <span className="mw-svc-cta__hotline-dot" aria-hidden="true" />
                <span className="mw-svc-cta__hotline-text">
                  <span className="mw-svc-cta__hotline-sup">24/7 emergency line</span>
                  <span className="mw-svc-cta__hotline-num">{content.emergencyDisplay}</span>
                </span>
              </a>
            </div>
            <p className="mw-svc-cta__hotline-note">{content.hotlineNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
