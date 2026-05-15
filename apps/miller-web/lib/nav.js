// Primary nav for Miller Environmental. Structure mirrors the live site
// (industrial services + about + locations + case studies + careers +
// contact). "Processes" is intentionally folded — see design spec §2.2.
//
// Each entry is either a direct link or has a `children` array which the
// TopNav renders as a mega-menu (services) or dropdown (about / locations /
// careers).

export const NAV_ITEMS = [
  {
    id: "services",
    label: "Services",
    path: "/industrial-services",
    children: [
      { label: "Customer Waste Collection", path: "/industrial-services/customer-waste-collection" },
      { label: "Emergency Response",        path: "/industrial-services/emergency-response" },
      { label: "Environmental Remediation", path: "/industrial-services/environmental-remediation-services" },
      { label: "Industrial Cleaning",       path: "/industrial-services/industrial-cleaning" },
      { label: "Industrial Waste Treatment", path: "/industrial-services/industrial-waste-treatment" },
      { label: "Project Management",        path: "/industrial-services/project-management" },
      { label: "Research & Development",    path: "/industrial-services/research-development" },
      { label: "Specialty Recycling",       path: "/industrial-services/specialty-recycling" },
      { label: "Stewardship",               path: "/industrial-services/stewardship" },
      { label: "Vacuum Truck",              path: "/industrial-services/vacuum-truck" },
    ],
  },
  {
    id: "about",
    label: "About",
    path: "/about-us",
    children: [
      { label: "Health & Safety",                  path: "/about-us/health-safety" },
      { label: "Licencing Information",            path: "/about-us/licencing-information" },
      { label: "Professional Affiliations",        path: "/about-us/professional-affiliations" },
      { label: "Quality Assurance",                path: "/about-us/quality-assurance" },
      { label: "Vision, Mission and Core Values",  path: "/about-us/vision-mission-and-core-values" },
    ],
  },
  {
    id: "locations",
    label: "Locations",
    path: "/treatment-facility",
    children: [
      { label: "Treatment Facility (VBEC)",   path: "/treatment-facility" },
      { label: "Winnipeg Service Centre",     path: "/winnipeg-service-centre" },
    ],
  },
  {
    id: "case-studies",
    label: "Case Studies",
    path: "/case-studies",
  },
  {
    id: "careers",
    label: "Careers",
    path: "/careers",
    children: [
      { label: "Benefits & Rewards",   path: "/careers/benefits-rewards" },
      { label: "Working at Miller",    path: "/careers/working-at-miller" },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact-us",
  },
];

// Match the longest top-level segment so `/industrial-services/foo` highlights
// "Services". Returns undefined when the path doesn't map to a nav entry
// (e.g., the home route).
export function pageIdFromPath(pathname) {
  if (!pathname || pathname === "/") return "home";
  for (const item of NAV_ITEMS) {
    if (pathname === item.path) return item.id;
    if (pathname.startsWith(item.path + "/")) return item.id;
  }
  return undefined;
}

// Routes where the EmergencyBanner is shown. Hidden everywhere else
// (see design spec §2.4). Comparison is "startsWith" against `/` prefix
// so `/industrial-services/anything` qualifies but `/about-us/anything`
// does not.
//
// The banner element is rendered unconditionally in the root layout; each
// route segment sets `data-banner="on"|"off"` via its own layout to gate
// visibility with a single CSS rule. The string list below is the
// authoritative source; route layouts read it to decide which value to
// emit.
const EMERGENCY_BANNER_ROUTES = {
  exact: new Set(["/", "/treatment-facility"]),
  prefix: ["/industrial-services"],
};

export function shouldShowEmergencyBanner(pathname) {
  if (!pathname) return false;
  if (EMERGENCY_BANNER_ROUTES.exact.has(pathname)) return true;
  return EMERGENCY_BANNER_ROUTES.prefix.some((p) => pathname === p || pathname.startsWith(p + "/"));
}
