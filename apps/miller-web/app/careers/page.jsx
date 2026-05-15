import { CareersTemplate } from "../../components/templates/CareersTemplate";
import { CAREERS } from "../../lib/content/careers";

export const metadata = {
  title: "Careers",
  description:
    "Join the Miller Environmental team — current openings, core values, total rewards, and our commitment to a diverse and inclusive workforce.",
  alternates: { canonical: "/careers/" },
};

export default function CareersPage() {
  return <CareersTemplate content={CAREERS} />;
}
