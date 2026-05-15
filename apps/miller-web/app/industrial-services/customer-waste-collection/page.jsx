import { ServiceDetailTemplate } from "../../../components/templates/ServiceDetailTemplate";
import { customerWasteCollection as c } from "../../../lib/content/service-customer-waste-collection";

export const metadata = { title: "Customer Waste Collection" };

export default function CustomerWasteCollectionPage() {
  return (
    <ServiceDetailTemplate
      variant="compact"
      slug="customer-waste-collection"
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
      sections={c.sections}
      bullets={c.bullets}
    />
  );
}
