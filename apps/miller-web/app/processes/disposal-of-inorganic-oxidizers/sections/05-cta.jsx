import Link from "next/link";
import { processInorganicOxidizers as c } from "@/lib/content/process-disposal-of-inorganic-oxidizers";

export function CtaSection() {
  const cta = c.cta;
  if (!cta) return null;

  return (
    <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
      <Link href={cta.href} className="tl-btn tl-btn--primary">
        {cta.label} <span className="tl-btn-arr">→</span>
      </Link>
    </section>
  );
}
