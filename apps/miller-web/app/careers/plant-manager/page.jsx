import { jobPlantManager as c } from "@/lib/content/job-plant-manager";
import { HeroSection } from "./sections/01-hero";
import { RoleBodySection } from "./sections/02-role-body";

export const metadata = {
  title: "Plant Manager — Careers",
  description: c.hero.lead,
};

export default function PlantManagerJobPage() {
  return (
    <>
      <HeroSection />
      <RoleBodySection />
    </>
  );
}
