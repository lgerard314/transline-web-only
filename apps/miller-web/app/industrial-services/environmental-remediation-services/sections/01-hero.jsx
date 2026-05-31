import Link from "next/link";
import { PageHero } from "@white-owl/brand/components";
import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { EMERGENCY_PHONE } from "@/lib/content/brand";

export function HeroSection() {
  const heroCtas = (
    <>
      <Link href="/contact-us/" className="tl-btn tl-btn--primary">
        Book a Consult <span className="tl-btn-arr">→</span>
      </Link>
      <a
        href={`tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`}
        className="tl-btn tl-btn--ghost-light"
        aria-label={`Call 24/7 emergency: ${EMERGENCY_PHONE}`}
      >
        24/7 {EMERGENCY_PHONE}
      </a>
    </>
  );

  return (
    <PageHero
      eyebrow={c.eyebrow}
      title={c.title}
      lead={c.lead}
      photo={c.photo}
      ctas={heroCtas}
    />
  );
}
