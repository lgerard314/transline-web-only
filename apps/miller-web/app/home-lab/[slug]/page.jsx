import { notFound } from "next/navigation";
import { LabShell } from "../lab-shell";
import { getHomeLabSection, HOME_LAB_SECTIONS } from "../registry";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const section = getHomeLabSection(slug);
  if (!section) return { title: "Home lab" };
  return {
    title: `Home lab · ${section.label}`,
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return HOME_LAB_SECTIONS.map((s) => ({ slug: s.slug }));
}

export default async function HomeLabSectionPage({ params }) {
  const { slug } = await params;
  const section = getHomeLabSection(slug);
  if (!section) notFound();

  const { Component, content, config, label, templatePath, pin } = section;

  return (
    <LabShell slug={slug} label={label} templatePath={templatePath} pin={pin}>
      <Component content={content} config={config} />
    </LabShell>
  );
}
