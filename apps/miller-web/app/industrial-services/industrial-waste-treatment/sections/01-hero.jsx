import Link from "next/link";
import { PageHero } from "@white-owl/brand/components";
import { IWT } from "@/lib/content/service-industrial-waste-treatment";
import { GENERAL_PHONE } from "@/lib/content/brand";

export function HeroSection() {
  const ctas = (
    <>
      <Link href="/contact-us/" className="tl-btn tl-btn--primary">
        Contact Miller <span className="tl-btn-arr">→</span>
      </Link>
      <a
        href={`tel:${GENERAL_PHONE.replace(/[^0-9+]/g, "")}`}
        className="tl-btn tl-btn--ghost-light"
      >
        {GENERAL_PHONE}
      </a>
    </>
  );

  return (
    <PageHero
      eyebrow={IWT.eyebrow ?? "Service"}
      title={IWT.title}
      lead={IWT.lead}
      photo={IWT.photo}
      ctas={ctas}
    />
  );
}
