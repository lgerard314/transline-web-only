import { HomeTemplate } from "./HomeTemplate";
import { HOME } from "./home";
import { OVER_25_YEARS } from "../../lib/content/brand";

export const metadata = {
  title: "Miller Environmental — Hazardous Waste Management",
  description: `Manitoba-based hazardous waste management with three ISO certifications and ${OVER_25_YEARS.toLowerCase()} of operating history. Routine pickup, scheduled treatment, and 24/7 emergency response.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* High-priority preload for the hero background — the LCP element on
          mobile. React 19 hoists <link> tags into <head>. */}
      <link
        rel="preload"
        href="/miller/hero/home-frame-1.webp"
        as="image"
        fetchPriority="high"
      />
      <HomeTemplate content={HOME} />
    </>
  );
}
