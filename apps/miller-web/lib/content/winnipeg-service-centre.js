// Winnipeg Service Centre — location content.
// Source: docs/superpowers/miller-scrape/20-location-winnipeg-service-centre.md

import { EMAIL_SALES, EMERGENCY_PHONE, GENERAL_PHONE } from "./brand";

export const winnipegServiceCentre = {
  hero: {
    eyebrow: "Location",
    title: "Winnipeg Service Centre",
    lead:
      "A hub for the coordination and movement of inbound/outbound waste headed to its final disposal location. Licensed PCB storage facility. Home to our Customer Service Technicians and Projects / Field Services Team.",
    photo: "/miller/facility/winnipeg-service-centre.webp",
  },
  address: {
    lines: ["1803 Hekla Ave", "Winnipeg, MB R2R 0K3"],
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=1803+Hekla+Ave+Winnipeg+MB+R2R+0K3",
    embedSrc:
      "https://www.google.com/maps?q=1803%20Hekla%20Ave%2C%20Winnipeg%2C%20MB%20R2R%200K3&output=embed",
  },
  capabilities: [
    "Customer Waste Collection",
    "Emergency Response",
    "Industrial Cleaning",
    "Industrial Waste Treatment",
    "Project Management",
    "Specialty Recycling",
    "Stewardship",
    "Vacuum Truck services",
    "Field coordination and project services",
  ],
  contact: {
    phone: { display: GENERAL_PHONE, href: "tel:+12049259600" },
    email: EMAIL_SALES,
    hours: `24/7 spill response: ${EMERGENCY_PHONE}`,
  },
};
