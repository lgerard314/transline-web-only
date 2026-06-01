import { projectManagement as c } from "@/lib/content/service-project-management";
import { HeroSection } from "./sections/01-hero";
import { GroupSection } from "./sections/02-group";
import { ProjectsSection } from "./sections/03-projects";
import { CtaSection } from "./sections/04-cta";
import { RelatedSection } from "./sections/05-related";

export const metadata = {
  title: "Project Management",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/project-management/" },
};

export default function ProjectManagementPage() {
  return (
    <>
      <HeroSection />
      <GroupSection />
      <ProjectsSection />
      <CtaSection />
      <RelatedSection />
    </>
  );
}
