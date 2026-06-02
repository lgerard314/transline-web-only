import { ResponseTimeline } from "@/components/ResponseTimeline";
import { sectionProps } from "@/components-v2/section-config";

// Template: ResponseTimeline01
// Reproduces the mw-svc-tl-sec --v1 shell from
// app/industrial-services/emergency-response/sections/02-timeline.jsx verbatim.
// content: { eyebrow, title, lead, steps, notifications, titleId, interval? }
// Default interval falls back to 4200 (the ER production value).
// sectionProps(config) emits nothing for default config — no stray data-scheme/style.
export function ResponseTimeline01({ content, config = {} }) {
  return (
    <section
      className="mw-svc-tl-sec mw-svc-tl-sec--v1"
      aria-labelledby={content.titleId}
      {...sectionProps(config)}
    >
      <div className="mw-svc-tl-sec__inner mw-inner">
        <ResponseTimeline
          eyebrow={content.eyebrow}
          title={content.title}
          lead={content.lead}
          steps={content.steps}
          notifications={content.notifications}
          titleId={content.titleId}
          interval={content.interval ?? 4200}
        />
      </div>
    </section>
  );
}
