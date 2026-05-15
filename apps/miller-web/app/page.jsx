import { HomeTemplate } from "../components/templates/HomeTemplate";
import { HOME } from "../lib/content/home";
import { OVER_25_YEARS } from "../lib/content/brand";

export const metadata = {
  title: "Miller Environmental — Hazardous Waste Management",
  description: `Manitoba-based hazardous waste management with three ISO certifications and ${OVER_25_YEARS.toLowerCase()} of operating history. Routine pickup, scheduled treatment, and 24/7 emergency response.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeTemplate content={HOME} />;
}
