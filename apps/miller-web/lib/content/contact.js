// Contact page content.
// Source: docs/superpowers/miller-scrape/25-contact.md

import {
  EMAIL_INQUIRIES,
  EMERGENCY_PHONE,
  GENERAL_PHONE,
} from "./brand";

export const contactContent = {
  hero: {
    eyebrow: "Contact",
    title: "Contact Us",
    lead: `Complete the form below or call ${GENERAL_PHONE}.`,
  },
  phone: { display: GENERAL_PHONE, href: "tel:+12049259600" },
  office: {
    lines: ["1803 Hekla Ave", "Winnipeg, MB R2R 0K3"],
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=1803+Hekla+Ave+Winnipeg+MB+R2R+0K3",
  },
  intake: {
    display: EMERGENCY_PHONE,
    href: "tel:+12049576327",
    note: "24/7 spill response team.",
  },
  email: EMAIL_INQUIRIES,
};
