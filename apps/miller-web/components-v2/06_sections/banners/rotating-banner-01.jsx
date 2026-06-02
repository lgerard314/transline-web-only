import { MarqueeBand01 } from "@/components-v2/05_widgets/marquees/marquee-band-01";

export function RotatingBanner01({ content, config = {} }) {
  return (
    <section className="mw-marquee" aria-label={content.ariaLabel}>
      <MarqueeBand01 label={content.label} items={content.items} />
    </section>
  );
}
