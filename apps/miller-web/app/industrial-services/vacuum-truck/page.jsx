import { ServiceDetailTemplate } from "../../../components/templates/ServiceDetailTemplate";
import { vacuumTruck as c } from "../../../lib/content/service-vacuum-truck";

export const metadata = { title: "Vacuum Truck" };

export default function VacuumTruckPage() {
  return (
    <ServiceDetailTemplate
      variant="compact"
      slug="vacuum-truck"
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
      sections={c.sections}
      bullets={c.bullets}
    />
  );
}
