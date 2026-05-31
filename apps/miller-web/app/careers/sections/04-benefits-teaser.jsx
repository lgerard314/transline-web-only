import Link from "next/link";
import { CAREERS as c } from "@/lib/content/careers";

export function BenefitsTeaserSection() {
  return (
    <section className="tl-container mw-section">
      <p className="mw-section__eyebrow">Benefits</p>
      <h2 className="tl-display tl-display--m mw-section__title">{c.benefitsTitle}</h2>
      <p className="mw-section__lead">{c.benefitsBody}</p>
      <p style={{ marginTop: 16 }}>
        <Link href={c.benefitsCta.href} className="tl-btn tl-btn--primary">
          {c.benefitsCta.label} <span className="tl-btn-arr">→</span>
        </Link>
      </p>
    </section>
  );
}
