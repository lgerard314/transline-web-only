import Link from "next/link";
import { ServiceDetailTemplate } from "../../../components/templates/ServiceDetailTemplate";
import { IWT } from "../../../lib/content/service-industrial-waste-treatment";
import { GENERAL_PHONE } from "../../../lib/content/brand";

export const metadata = {
  title: "Industrial Waste Treatment",
  description:
    "Licensed treatment of industrial organic and inorganic waste — liquid and solid — at the Vaughn Bullough Environmental Centre.",
  alternates: { canonical: "/industrial-services/industrial-waste-treatment/" },
};

export default function IndustrialWasteTreatmentPage() {
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
    <ServiceDetailTemplate
      variant="capabilities"
      slug={IWT.slug}
      eyebrow={IWT.eyebrow}
      title={IWT.title}
      lead={IWT.lead}
      photo={IWT.photo}
      groups={IWT.groups}
      ctas={ctas}
    />
  );
}
