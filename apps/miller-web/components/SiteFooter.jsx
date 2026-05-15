// Miller site footer. Four columns (Services / Company / Locations /
// Contact) plus a social row, per design spec §2.3. Phase 05 added the
// `FamilyOfCompanies` cross-link strip above the bottom bar.
//
// Internal links use next/link so prefetch behaviour matches the rest of
// the app; the Google Maps link uses a plain anchor with rel="noreferrer
// noopener" because it points off-site.
import Link from "next/link";
import { FamilyOfCompanies } from "@white-owl/brand/components";
import { GENERAL_PHONE, EMERGENCY_PHONE } from "../lib/content/brand";

const GENERAL_PHONE_DISPLAY = GENERAL_PHONE;
const GENERAL_PHONE_HREF    = `tel:+1${GENERAL_PHONE.replace(/\D/g, "")}`;
const EMERGENCY_DISPLAY     = EMERGENCY_PHONE;
const EMERGENCY_HREF        = `tel:+1${EMERGENCY_PHONE.replace(/\D/g, "")}`;
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=1803+Hekla+Avenue+Winnipeg+MB+R2R+0J7";

function FooterLink({ href, children, external = false }) {
  if (external) {
    return (
      <li>
        <a className="tl-footer__link" href={href} target="_blank" rel="noreferrer noopener">
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className="tl-footer__link">{children}</Link>
    </li>
  );
}

export function SiteFooter() {
  return (
    <footer className="tl-footer mw-footer">
      <div className="tl-footer__top">
        <div className="tl-footer__pitch">
          <p className="tl-mono mw-footer__eyebrow">Over 25 Years · Hazardous Waste Management</p>
          <h3 className="tl-footer__big">
            Safe, dependable,<br />and on-time service.
          </h3>
          <div className="tl-footer__pitch-ctas">
            <Link href="/contact-us" className="tl-btn tl-btn--primary">
              Contact Miller <span className="tl-btn-arr">→</span>
            </Link>
            <a className="tl-btn tl-btn--ghost-light" href={EMERGENCY_HREF}>
              24/7 Emergency · {EMERGENCY_DISPLAY}
            </a>
          </div>
        </div>

        <div className="tl-footer__col">
          <h4>Services</h4>
          <ul>
            <FooterLink href="/industrial-services/industrial-waste-treatment">Industrial Waste Treatment</FooterLink>
            <FooterLink href="/industrial-services/environmental-remediation-services">Environmental Remediation</FooterLink>
            <FooterLink href="/industrial-services/emergency-response">Emergency Response</FooterLink>
            <FooterLink href="/industrial-services/specialty-recycling">Specialty Recycling</FooterLink>
            <FooterLink href="/industrial-services">All services →</FooterLink>
          </ul>
        </div>

        <div className="tl-footer__col">
          <h4>Company</h4>
          <ul>
            <FooterLink href="/about-us">About Miller</FooterLink>
            <FooterLink href="/about-us/quality-assurance">Quality Assurance</FooterLink>
            <FooterLink href="/about-us/professional-affiliations">Affiliations</FooterLink>
            <FooterLink href="/case-studies">Case Studies</FooterLink>
            <FooterLink href="/careers">Careers</FooterLink>
          </ul>
        </div>

        <div className="tl-footer__col">
          <h4>Locations</h4>
          <ul>
            <FooterLink href="/treatment-facility">Treatment Facility (VBEC)</FooterLink>
            <FooterLink href="/winnipeg-service-centre">Winnipeg Service Centre</FooterLink>
          </ul>
          <h4 style={{ marginTop: "var(--space-5)" }}>Office</h4>
          <address className="tl-footer__addr">
            <a href={MAPS_URL} target="_blank" rel="noreferrer noopener" className="tl-footer__link">
              1803 Hekla Avenue<br />Winnipeg, MB R2R 0J7
            </a>
            <a href={GENERAL_PHONE_HREF} className="tl-footer__link tl-mono">{GENERAL_PHONE_DISPLAY}</a>
            <a href={EMERGENCY_HREF} className="tl-footer__link tl-mono">24/7 · {EMERGENCY_DISPLAY}</a>
          </address>
        </div>
      </div>
      <FamilyOfCompanies current="miller" />
      <div className="tl-footer__bot">
        <span>© {new Date().getFullYear()} MILLER ENVIRONMENTAL · ALL RIGHTS RESERVED</span>
        <span>HAZARDOUS WASTE MANAGEMENT · WINNIPEG, MANITOBA</span>
      </div>
    </footer>
  );
}
