// Miller services — single source of truth. Each entry drives the services
// landing grid, the home service bento, and RelatedServices rails.
//
// `variant` documents the page layout family: `compact` and `capabilities`
// map to ServiceDetailTemplate (each page.jsx passes variant explicitly);
// `bespoke` marks custom routes (Remediation, Emergency Response).
//
// `photo` is consumed by home tiles and RelatedServices card backgrounds.
// Service page heroes may use a different path from their content module.

export const SERVICES = [
  {
    id: "industrial-waste-treatment",
    slug: "industrial-waste-treatment",
    title: "Industrial Waste Treatment",
    summary:
      "VBEC facility treatment of inorganic, organic, liquid and solid hazardous waste streams.",
    icon: "▣",
    photo: "/miller/industrial-waste-treatment-hero-1.webp",
    variant: "capabilities",
  },
  {
    id: "environmental-remediation",
    slug: "environmental-remediation-services",
    title: "Environmental Remediation",
    summary:
      "Site assessment, containment, excavation, treatment and verification across Western Canada.",
    icon: "△",
    photo: "/miller/remediation-contaminated-soil-2.webp",
    variant: "bespoke",
  },
  {
    id: "emergency-response",
    slug: "emergency-response",
    title: "Emergency Response",
    summary: "24/7 emergency response across Manitoba and the prairies.",
    icon: "✕",
    photo: "/miller/custom/fleet-trucks-gravel-transparent.png",
    variant: "bespoke",
  },
  {
    id: "customer-waste-collection",
    slug: "customer-waste-collection",
    title: "Customer Waste Collection",
    summary:
      "Scheduled pickup of hazardous and non-hazardous waste streams from customer sites.",
    icon: "◫",
    photo: "/miller/customer-waste-collection-hero-2.webp",
    variant: "compact",
  },
  {
    id: "industrial-cleaning",
    slug: "industrial-cleaning",
    title: "Industrial Cleaning",
    summary:
      "Vessel, tank and process cleaning with confined-space and high-pressure capabilities.",
    icon: "◐",
    photo: "/miller/home-frame-2-2.webp",
    variant: "compact",
  },
  {
    id: "project-management",
    slug: "project-management",
    title: "Project Management",
    summary: "Turnkey project oversight from planning through closeout.",
    icon: "◑",
    photo: "/miller/project-management-hero-2.webp",
    variant: "compact",
  },
  {
    id: "research-development",
    slug: "research-development",
    title: "Research & Development",
    summary:
      "Treatment R&D for novel waste streams; bench- to pilot-scale process development.",
    icon: "✦",
    photo: "/miller/research-development-hero-2.webp",
    variant: "capabilities",
  },
  {
    id: "specialty-recycling",
    slug: "specialty-recycling",
    title: "Specialty Recycling",
    summary:
      "Recovery and recycling pathways for specialty waste streams diverted from landfill.",
    icon: "↻",
    photo: "/miller/specialty-recycling-hero-2.webp",
    variant: "capabilities",
  },
  {
    id: "stewardship",
    slug: "stewardship",
    title: "Stewardship",
    summary:
      "Producer-responsibility programs and end-of-life stewardship for regulated products.",
    icon: "◇",
    photo: "/miller/stewardship-hero-2.webp",
    variant: "compact",
  },
  {
    id: "vacuum-truck",
    slug: "vacuum-truck",
    title: "Vacuum Truck",
    summary:
      "Liquid, solid and slurry vacuum services with dedicated hazardous-rated equipment.",
    icon: "▽",
    photo: "/miller/vacuum-truck-hero-2.jpg",
    variant: "compact",
  },
];

export function relatedServices(slug, limit = 3) {
  return SERVICES.filter((s) => s.slug !== slug).slice(0, limit);
}
