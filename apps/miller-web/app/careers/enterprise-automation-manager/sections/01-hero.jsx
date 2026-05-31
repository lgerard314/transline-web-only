import { PageHero } from "@white-owl/brand/components";
import { jobEnterpriseAutomationManager as c } from "@/lib/content/job-enterprise-automation-manager";

export function HeroSection() {
  const meta = [];
  if (c.location) meta.push({ k: "Location ", v: c.location });

  return (
    <PageHero
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      meta={meta.length > 0 ? meta : null}
    />
  );
}
