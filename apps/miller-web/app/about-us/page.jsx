import Link from "next/link";
import { AboutTemplate } from "../../components/templates/AboutTemplate";
import { ABOUT_INDEX } from "../../lib/content/about-index";

export const metadata = {
  title: "About Miller Environmental",
  description:
    "Miller Environmental's company history, the Vaughn Bullough story, and our mission. Manitoba-based hazardous waste management with three ISO certifications.",
  alternates: { canonical: "/about-us/" },
};

const SUB_PAGES = [
  { label: "Health & Safety", href: "/about-us/health-safety/" },
  { label: "Licencing Information", href: "/about-us/licencing-information/" },
  { label: "Professional Affiliations", href: "/about-us/professional-affiliations/" },
  { label: "Quality Assurance", href: "/about-us/quality-assurance/" },
  { label: "Vision, Mission, and Core Values", href: "/about-us/vision-mission-and-core-values/" },
];

export default function AboutIndexPage() {
  return (
    <AboutTemplate
      eyebrow={ABOUT_INDEX.eyebrow}
      title={ABOUT_INDEX.title}
      lead={ABOUT_INDEX.lead}
      photo={ABOUT_INDEX.photo}
      sections={ABOUT_INDEX.sections}
    >
      <section style={{ marginTop: "var(--space-7)" }}>
        <h3 className="tl-display tl-display--xs" style={{ marginBottom: 16 }}>
          Explore the About section
        </h3>
        <ul>
          {SUB_PAGES.map((p) => (
            <li key={p.href}>
              <Link href={p.href}>{p.label} →</Link>
            </li>
          ))}
        </ul>
      </section>
    </AboutTemplate>
  );
}
