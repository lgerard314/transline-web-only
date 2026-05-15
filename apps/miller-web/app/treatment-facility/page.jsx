import { LocationTemplate } from "../../components/templates/LocationTemplate";
import { treatmentFacility as c } from "../../lib/content/treatment-facility";

export const metadata = { title: "Treatment Facility (VBEC)" };

export default function TreatmentFacilityPage() {
  return (
    <LocationTemplate
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
      address={c.address}
      capabilities={c.capabilities}
      contact={c.contact}
    />
  );
}
