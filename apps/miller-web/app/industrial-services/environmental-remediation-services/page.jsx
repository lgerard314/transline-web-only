import { RemediationTemplate } from "../../../components/templates/RemediationTemplate";
import { REMEDIATION } from "../../../lib/content/service-environmental-remediation";

export const metadata = {
  title: "Environmental Remediation Services",
  description:
    "Comprehensive environmental remediation — contaminated soil, hazardous material excavation, spill response, fire-damaged site recovery, brownfield prep, and UST work — backed by a licensed Manitoba treatment facility.",
  alternates: {
    canonical: "/industrial-services/environmental-remediation-services/",
  },
};

export default function RemediationPage() {
  return <RemediationTemplate content={REMEDIATION} />;
}
