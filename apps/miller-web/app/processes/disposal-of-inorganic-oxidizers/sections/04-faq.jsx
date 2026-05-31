import { FAQ } from "@white-owl/brand/components";
import { processInorganicOxidizers as c } from "@/lib/content/process-disposal-of-inorganic-oxidizers";

export function FaqSection() {
  const faqs = c.faqs;
  if (!faqs?.length) return null;

  return (
    <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
      <h2 className="tl-display tl-display--m">Frequently asked</h2>
      <FAQ items={faqs} />
    </section>
  );
}
