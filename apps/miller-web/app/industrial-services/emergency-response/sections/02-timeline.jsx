import { ResponseTimeline } from "@/components/ResponseTimeline";
import { emergencyResponse as c } from "@/lib/content/service-emergency-response";

// §2 — Response timeline (signature layout). ResponseTimeline owns the clock
// that keeps the cycling notifications in lock-step with the axis fill.
export function TimelineSection() {
  const tl = c.timeline;
  return (
    <section className="mw-svc-tl-sec mw-svc-tl-sec--v1" aria-labelledby="er-tl-title">
      <div className="mw-svc-tl-sec__inner mw-inner">
        <ResponseTimeline
          eyebrow={tl.eyebrow}
          title={tl.title}
          lead={tl.lead}
          steps={tl.steps}
          notifications={tl.notifications}
          titleId="er-tl-title"
          interval={4200}
        />
      </div>
    </section>
  );
}
