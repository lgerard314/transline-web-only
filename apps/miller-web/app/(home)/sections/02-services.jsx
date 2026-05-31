import Link from "next/link";
import { SERVICES } from "@/lib/services";

const HOME_FIRST = [
  "industrial-waste-treatment",
  "environmental-remediation-services",
  "emergency-response",
];

function splitTitle(title) {
  const parts = String(title).trim().split(/\s+/);
  if (parts.length <= 1) return { line1: title, line2: null };
  return { line1: parts.slice(0, -1).join(" "), line2: parts[parts.length - 1] };
}

function homeServiceOrder() {
  const map = new Map(SERVICES.map((s) => [s.slug, s]));
  const head = HOME_FIRST.map((slug) => map.get(slug)).filter(Boolean);
  const rest = SERVICES.filter((s) => !HOME_FIRST.includes(s.slug)).sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  return [...head, ...rest];
}

// SERVICES — bento grid of capabilities on walnut.
export function ServicesSection() {
  const orderedServices = homeServiceOrder();

  return (
    <section className="mw-services" aria-labelledby="mw-services-heading">
      <div className="mw-inner">
        <header className="mw-section-head mw-services__head" data-reveal-stagger>
          <p className="mw-section-tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">Services</span>
          </p>
          <h2 id="mw-services-heading" className="mw-section-title">
            whatever your waste needs,<br /><span className="mw-services__title-em">we&rsquo;ve got you covered<span className="mw-stop" aria-hidden="true" /></span>
          </h2>
          <p className="mw-services__intro">
            From routine industrial streams to one-off emergency calls, Miller&rsquo;s licensed VBEC facility and field crews handle the full spectrum &mdash; collection, treatment, and final disposition, all under one roof.
          </p>
        </header>

        <ul className="mw-svcs-grid" aria-label="Capabilities" data-reveal-stagger>
          <li>
            <Link
              href={`/industrial-services/${orderedServices[0].slug}/`}
              className="mw-svcs-anchor"
            >
              <span
                className="mw-svcs-anchor__photo"
                style={{ backgroundImage: `url(${orderedServices[0].photo})` }}
                aria-hidden="true"
              />
              <div className="mw-svcs-anchor__body">
                <span className="mw-svcs-anchor__num">01</span>
                <div className="mw-svcs-anchor__title-row">
                  <h3 className="mw-svcs-anchor__title">
                    {orderedServices[0].title}
                  </h3>
                  <span className="mw-svcs-anchor__arr" aria-hidden="true">→</span>
                </div>
                <p className="mw-svcs-anchor__text">{orderedServices[0].summary}</p>
              </div>
            </Link>
          </li>

          {orderedServices.slice(1, 3).map((s, i) => (
            <li key={s.id}>
              <Link href={`/industrial-services/${s.slug}/`} className="mw-svcs-card">
                <span
                  className="mw-svcs-card__photo"
                  style={{ backgroundImage: `url(${s.photo})` }}
                  aria-hidden="true"
                />
                <div className="mw-svcs-card__body">
                  <span className="mw-svcs-card__num">{String(i + 2).padStart(2, "0")}</span>
                  {(() => {
                    const { line1, line2 } = splitTitle(s.title);
                    return (
                      <div className="mw-svcs-card__title-row">
                        <h3 className="mw-svcs-card__title">
                          {line1}{line2 && (<><br />{line2}</>)}
                        </h3>
                        <span className="mw-svcs-card__arr" aria-hidden="true">→</span>
                      </div>
                    );
                  })()}
                  <p className="mw-svcs-card__text">{s.summary}</p>
                </div>
              </Link>
            </li>
          ))}

          {orderedServices.slice(3, 6).map((s, i) => (
            <li key={s.id}>
              <Link href={`/industrial-services/${s.slug}/`} className="mw-svcs-tile">
                <span
                  className="mw-svcs-tile__photo"
                  style={{ backgroundImage: `url(${s.photo})` }}
                  aria-hidden="true"
                />
                <div className="mw-svcs-tile__body">
                  <span className="mw-svcs-tile__num">{String(i + 4).padStart(2, "0")}</span>
                  {(() => {
                    const { line1, line2 } = splitTitle(s.title);
                    return (
                      <div className="mw-svcs-tile__title-row">
                        <h3 className="mw-svcs-tile__title">
                          {line1}{line2 && (<><br />{line2}</>)}
                        </h3>
                        <span className="mw-svcs-tile__arr" aria-hidden="true">→</span>
                      </div>
                    );
                  })()}
                  <p className="mw-svcs-tile__text">{s.summary}</p>
                </div>
              </Link>
            </li>
          ))}

          <li>
            <a
              href="https://www.transline49.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mw-svcs-tile mw-svcs-tile--external"
            >
              <span
                className="mw-svcs-tile__photo"
                style={{ backgroundImage: "url(/miller/services/vacuum-truck-new-logo.webp)" }}
                aria-hidden="true"
              />
              <div className="mw-svcs-tile__body">
                <span className="mw-svcs-tile__num">07</span>
                <div className="mw-svcs-tile__title-row">
                  <h3 className="mw-svcs-tile__title">
                    Cross-Border<br />Services
                  </h3>
                  <span className="mw-svcs-tile__arr" aria-hidden="true">→</span>
                </div>
                <p className="mw-svcs-tile__text">
                  Transboundary movement of waste from the United States to Canada to mitigate your US liabilities.
                </p>
              </div>
            </a>
          </li>

          {[orderedServices[6], orderedServices[8], orderedServices[9]].map((s, i) => (
            <li key={s.id}>
              <Link href={`/industrial-services/${s.slug}/`} className="mw-svcs-tile">
                <span
                  className="mw-svcs-tile__photo"
                  style={{ backgroundImage: `url(${s.photo})` }}
                  aria-hidden="true"
                />
                <div className="mw-svcs-tile__body">
                  <span className="mw-svcs-tile__num">{String(i + 8).padStart(2, "0")}</span>
                  {(() => {
                    const { line1, line2 } = splitTitle(s.title);
                    return (
                      <div className="mw-svcs-tile__title-row">
                        <h3 className="mw-svcs-tile__title">
                          {line1}{line2 && (<><br />{line2}</>)}
                        </h3>
                        <span className="mw-svcs-tile__arr" aria-hidden="true">→</span>
                      </div>
                    );
                  })()}
                  <p className="mw-svcs-tile__text">{s.summary}</p>
                </div>
              </Link>
            </li>
          ))}

          <li>
            <Link href={`/industrial-services/${orderedServices[7].slug}/`} className="mw-svcs-tile">
              <span
                className="mw-svcs-tile__photo"
                style={{ backgroundImage: `url(${orderedServices[7].photo})` }}
                aria-hidden="true"
              />
              <div className="mw-svcs-tile__body">
                <span className="mw-svcs-tile__num">11</span>
                {(() => {
                  const { line1, line2 } = splitTitle(orderedServices[7].title);
                  return (
                    <div className="mw-svcs-tile__title-row">
                      <h3 className="mw-svcs-tile__title">
                        {line1}{line2 && (<><br />{line2}</>)}
                      </h3>
                      <span className="mw-svcs-tile__arr" aria-hidden="true">→</span>
                    </div>
                  );
                })()}
                <p className="mw-svcs-tile__text">{orderedServices[7].summary}</p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
