// Miller services — single source of truth. Each entry drives both the
// services landing grid and the per-service detail route. `variant`
// determines which ServiceDetailTemplate branch renders: `compact` for
// the simpler operational services, `capabilities` for the deeper
// capabilities pages, `bespoke` for the one-off Remediation page that
// uses its own RemediationTemplate (phase 04).
//
// Photo paths are absolute under /miller/services/ — those files ship
// with the public-asset manifest from phase 01. Until phase 03/04 wire
// the real photos through HeroPhoto, the `photo` field is consumed by
// templates as a generic background.

export const SERVICES = [
  {
    id: "industrial-waste-treatment",
    slug: "industrial-waste-treatment",
    title: "Industrial Waste Treatment",
    summary:
      "VBEC facility treatment of inorganic, organic, liquid and solid hazardous waste streams.",
    icon: "▣",
    photo: "/miller/services/industrial-waste-treatment.webp",
    variant: "capabilities",
  },
  {
    id: "environmental-remediation",
    slug: "environmental-remediation-services",
    title: "Environmental Remediation",
    summary:
      "Site assessment, containment, excavation, treatment and verification across Western Canada.",
    icon: "△",
    photo: "/miller/services/environmental-remediation.webp",
    variant: "bespoke",
  },
  {
    id: "emergency-response",
    slug: "emergency-response",
    title: "Emergency Response",
    summary: "24/7 spill response across Manitoba and the prairies.",
    icon: "✕",
    photo: "/miller/services/emergency-response.webp",
    variant: "capabilities",
  },
  {
    id: "customer-waste-collection",
    slug: "customer-waste-collection",
    title: "Customer Waste Collection",
    summary:
      "Scheduled pickup of hazardous and non-hazardous waste streams from customer sites.",
    icon: "◫",
    photo: "/miller/services/customer-waste-collection.webp",
    variant: "compact",
  },
  {
    id: "industrial-cleaning",
    slug: "industrial-cleaning",
    title: "Industrial Cleaning",
    summary:
      "Vessel, tank and process cleaning with confined-space and high-pressure capabilities.",
    icon: "◐",
    photo: "/miller/services/industrial-cleaning.webp",
    variant: "compact",
  },
  {
    id: "project-management",
    slug: "project-management",
    title: "Project Management",
    summary: "Turnkey project oversight from planning through closeout.",
    icon: "◑",
    photo: "/miller/services/project-management.webp",
    variant: "compact",
  },
  {
    id: "research-development",
    slug: "research-development",
    title: "Research & Development",
    summary:
      "Treatment R&D for novel waste streams; bench- to pilot-scale process development.",
    icon: "✦",
    photo: "/miller/services/research-development.webp",
    variant: "capabilities",
  },
  {
    id: "specialty-recycling",
    slug: "specialty-recycling",
    title: "Specialty Recycling",
    summary:
      "Recovery and recycling pathways for specialty waste streams diverted from landfill.",
    icon: "↻",
    photo: "/miller/services/specialty-recycling.webp",
    variant: "capabilities",
  },
  {
    id: "stewardship",
    slug: "stewardship",
    title: "Stewardship",
    summary:
      "Producer-responsibility programs and end-of-life stewardship for regulated products.",
    icon: "◇",
    photo: "/miller/services/stewardship.webp",
    variant: "compact",
  },
  {
    id: "vacuum-truck",
    slug: "vacuum-truck",
    title: "Vacuum Truck",
    summary:
      "Liquid, solid and slurry vacuum services with dedicated hazardous-rated equipment.",
    icon: "▽",
    photo: "/miller/services/vacuum-truck.webp",
    variant: "compact",
  },
];

export function serviceBySlug(slug) {
  return SERVICES.find((s) => s.slug === slug);
}

export function relatedServices(slug, limit = 3) {
  return SERVICES.filter((s) => s.slug !== slug).slice(0, limit);
}
