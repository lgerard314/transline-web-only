// XML sitemap — enumerates all 32 real Miller routes. Priorities per
// design spec §8 + phase-05 spec: home 1.0, services 0.8, case-studies
// + job postings 0.6, others 0.5. `lastModified` uses build time.

const BASE = "https://millerenvironmental.ca";

const SERVICE_SLUGS = [
  "customer-waste-collection",
  "emergency-response",
  "environmental-remediation-services",
  "industrial-cleaning",
  "industrial-waste-treatment",
  "project-management",
  "research-development",
  "specialty-recycling",
  "stewardship",
  "vacuum-truck",
];

const CASE_STUDY_SLUGS = [
  "brandon-power-facility",
  "grain-elevator-remediation-project",
  "highway-16-diesel-spill-response-remediation",
  "steinbach-strip-mall-fire-recovery-restoration-project",
];

const JOB_SLUGS = ["plant-manager", "enterprise-automation-manager"];

const ABOUT_SUB_SLUGS = [
  "health-safety",
  "licencing-information",
  "professional-affiliations",
  "quality-assurance",
  "vision-mission-and-core-values",
];

const CAREER_SUB_SLUGS = ["benefits-rewards", "working-at-miller"];

export default function sitemap() {
  const now = new Date();
  const entry = (path, priority) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  });

  return [
    // Home
    entry("/", 1.0),

    // Services index + 10 service detail pages
    entry("/industrial-services", 0.8),
    ...SERVICE_SLUGS.map((s) => entry(`/industrial-services/${s}`, 0.8)),

    // About index + 5 about subs
    entry("/about-us", 0.5),
    ...ABOUT_SUB_SLUGS.map((s) => entry(`/about-us/${s}`, 0.5)),

    // Careers index + 2 sub-pages + 2 job postings
    entry("/careers", 0.5),
    ...CAREER_SUB_SLUGS.map((s) => entry(`/careers/${s}`, 0.5)),
    ...JOB_SLUGS.map((s) => entry(`/careers/${s}`, 0.6)),

    // Case studies index + 4 details
    entry("/case-studies", 0.5),
    ...CASE_STUDY_SLUGS.map((s) => entry(`/case-studies/${s}`, 0.6)),

    // Locations
    entry("/treatment-facility", 0.5),
    entry("/winnipeg-service-centre", 0.5),

    // Contact
    entry("/contact-us", 0.5),

    // Processes
    entry("/processes/disposal-of-inorganic-oxidizers", 0.5),
  ];
}
