import { ServiceDetailTemplate } from "../../../components/templates/ServiceDetailTemplate";
import { emergencyResponse as c } from "../../../lib/content/service-emergency-response";

export const metadata = { title: "Emergency Response" };

export default function EmergencyResponsePage() {
  return (
    <ServiceDetailTemplate
      variant="capabilities"
      slug="emergency-response"
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
      groups={c.sections}
      trustBadge={c.inlineTrustBadge}
    />
  );
}
