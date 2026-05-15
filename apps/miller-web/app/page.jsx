import { HomeTemplate } from "../components/templates/HomeTemplate";
import { HOME } from "../lib/content/home";
import { OVER_25_YEARS } from "../lib/content/brand";

export const metadata = {
  title: "Miller Environmental — Hazardous Waste Management",
  description: `Manitoba-based hazardous waste management with three ISO certifications and ${OVER_25_YEARS.toLowerCase()} of operating history. Routine pickup, scheduled treatment, and 24/7 emergency response.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* High-priority preload for the hero's first frame: it's the
          LCP element on mobile and the CSS animation reveals it before
          any user interaction. Frames 2/3 transition in after 4s+ —
          leave them to normal discovery. React 19 hoists <link> tags
          into <head>. */}
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
