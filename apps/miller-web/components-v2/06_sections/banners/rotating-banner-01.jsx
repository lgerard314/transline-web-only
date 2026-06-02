import { MarqueeBand01 } from "@/components-v2/05_widgets/marquees/marquee-band-01";
import { sectionProps } from "@/components-v2/section-config";

export function RotatingBanner01({ content, config = {} }) {
  return (
    <section className="mw-marquee" aria-label={content.ariaLabel} {...sectionProps(config)}>
      <MarqueeBand01 label={content.label} items={content.items} />
    </section>
  );
}
