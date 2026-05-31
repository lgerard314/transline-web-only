import { TimelineNotifyCycle } from "@/components/TimelineNotifyCycle";
import { emergencyResponse as c } from "@/lib/content/service-emergency-response";

// §2 — Response timeline (signature layout). The notification interval drives
// both the cycling banners and the sequential axis-fill animation period.
export function TimelineSection() {
  const tl = c.timeline;
  return (
    <section
      className="mw-svc-tl-sec mw-svc-tl-sec--v1"
      aria-labelledby="er-tl-title"
      style={{
        "--mw-tl-notify-count": tl.notifications.length,
        "--mw-tl-notify-interval": "4200ms",
      }}
    >
      <div className="mw-svc-tl-sec__inner mw-inner">
        <div className="mw-svc-tl-sec__intro">
          <div className="mw-svc-tl-sec__intro-copy">
            <header className="mw-svc-tl-sec__head" data-reveal>
              <div>
                <p className="mw-section-tag" aria-hidden="true">
                  <span className="mw-section-tag-mark" />
                  <span className="mw-section-tag-label">{tl.eyebrow}</span>
                </p>
                <h2 id="er-tl-title" className="mw-section-title">
                  {tl.title}<span className="mw-stop" aria-hidden="true" />
                </h2>
              </div>
            </header>
            <p className="mw-svc-tl-sec__lead" data-reveal>{tl.lead}</p>
          </div>
          <TimelineNotifyCycle notifications={tl.notifications} />
        </div>

        <ol className="mw-svc-tl" data-reveal-stagger>
          {tl.steps.map((st) => (
            <li key={st.name} className="mw-svc-tl__stage">
              <span className="mw-svc-tl__time">{st.t}</span>
              <span className="mw-svc-tl__axis" aria-hidden="true">
                <span className="mw-svc-tl__node" />
              </span>
              <h3 className="mw-svc-tl__name">{st.name}</h3>
              <p className="mw-svc-tl__body">{st.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
