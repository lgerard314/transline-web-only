import { LocationTemplate } from "../../components/templates/LocationTemplate";
import { winnipegServiceCentre as c } from "../../lib/content/winnipeg-service-centre";

export const metadata = { title: "Winnipeg Service Centre" };

export default function WinnipegServiceCentrePage() {
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
