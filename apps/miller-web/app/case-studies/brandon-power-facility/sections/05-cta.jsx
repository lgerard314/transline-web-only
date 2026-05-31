import Link from "next/link";

const cta = { label: "Contact Miller", href: "/contact-us" };

export function CtaSection() {
  if (!cta) return null;

  return (
    <section className="tl-container" style={{ padding: "var(--space-7) 0 var(--space-8)" }}>
      <Link href={cta.href} className="tl-btn tl-btn--primary">
        {cta.label} <span className="tl-btn-arr">→</span>
      </Link>
    </section>
  );
}
