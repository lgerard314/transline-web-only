// L3 · bento-grid-02 — uniform 3×4 services grid; intro + CTA in the 12th cell.
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { BentoGridCard02 } from "@/components-v2/06_sections/grids/bento-grid-card-02";
import { sectionProps } from "@/components-v2/section-config";

/** Ten services in home order, then cross-border as the last photo card. */
function buildGridItems(services, external) {
  const ordered = [];
  for (let i = 0; i < 6 && i < services.length; i++) ordered.push(services[i]);
  if (services[6]) ordered.push(services[6]);
  if (services[8]) ordered.push(services[8]);
  if (services[9]) ordered.push(services[9]);
  if (services[7]) ordered.push(services[7]);

  const items = ordered.map((service, i) => ({ type: "service", service, n: i + 1 }));
  items.push({ type: "external", external, n: items.length + 1 });
  return items;
}

export function BentoGrid02({ content, config = {} }) {
  const {
    services: s,
    title: t,
    externalTile: ext,
    eyebrow,
    headingId,
    intro,
    learnMore = { label: "Learn more", href: "/industrial-services/" },
  } = content;
  const gridItems = buildGridItems(s, ext);

  return (
    <section className="mw-services mw-services--02" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        <header className="mw-services__head mw-services__head--02" data-reveal-stagger>
          <Eyebrow01 label={eyebrow} />
          <h2 id={headingId} className="mw-section-title">
            <span className="mw-services__title-line">{t.lead}</span>
            <span className="mw-services__title-line mw-services__title-em">
              <StopText01>{t.em}</StopText01>
            </span>
          </h2>
        </header>

        <ul className="mw-svcs-grid mw-svcs-grid--02" aria-label="Capabilities" data-reveal-stagger>
          {gridItems.map((item) => (
            <li key={item.type === "external" ? "external" : item.service.id}>
              {item.type === "external" ? (
                <BentoGridCard02
                  external
                  href={item.external.href}
                  photo={item.external.photo}
                  titleLines={item.external.titleLines}
                  summary={item.external.summary}
                  n={item.n}
                />
              ) : (
                <BentoGridCard02 service={item.service} n={item.n} />
              )}
            </li>
          ))}
          <li>
            <div className="mw-svcs-grid-close">
              {intro ? <p className="mw-svcs-grid-close__text">{intro}</p> : null}
              <SolidCta01 href={learnMore.href}>
                {learnMore.label} <ActionArrow01 />
              </SolidCta01>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
