import Link from "next/link";
import { ParallelRule, FamilyOfCompanies } from "@white-owl/brand/components";

// Footer columns: pitch + ctas, then three nav columns + an address column.
// Service links all point to /services (the page contains all four bullets);
// company links route to their own pages.
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=231+S+Bemiston+Ave+Suite+800+Clayton+MO+63105";

function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="tl-footer__link">{children}</Link>
    </li>
  );
}

export function SiteFooter() {
  return (
    <footer className="tl-footer">
      <div className="tl-footer__top">
        <div className="tl-footer__pitch">
          <ParallelRule light label="49°N · CROSS-BORDER" note="EST. ST. LOUIS, MO" />
          <h3 className="tl-footer__big">
            Have a cross-border<br />waste project?
          </h3>
          <div className="tl-footer__pitch-ctas">
            <Link href="/contact" className="tl-btn tl-btn--primary">
              Start a Project <span className="tl-btn-arr">→</span>
            </Link>
            <a className="tl-btn tl-btn--ghost-light" href="tel:+13149342133">
              Call (314) 934-2133
            </a>
          </div>
        </div>

        <div className="tl-footer__col">
          <h4>Services</h4>
          <ul>
            <FooterLink href="/services">Cross-Border Waste Movement</FooterLink>
            <FooterLink href="/services">Hazardous Waste Permitting</FooterLink>
            <FooterLink href="/services">Logistics Coordination</FooterLink>
            <FooterLink href="/services">Disposal & Recycling Access</FooterLink>
          </ul>
        </div>

        <div className="tl-footer__col">
          <h4>Company</h4>
          <ul>
            <FooterLink href="/about">About / Network</FooterLink>
            <FooterLink href="/cross-border-process">Cross-Border Process</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <li><span className="tl-footer__static">Miller Environmental Corp.</span></li>
          </ul>
        </div>

        <div className="tl-footer__col">
          <h4>Office</h4>
          <address className="tl-footer__addr">
            <a href={MAPS_URL} target="_blank" rel="noreferrer noopener" className="tl-footer__link">
              231 S. Bemiston Ave.<br />Suite 800<br />Clayton, MO 63105
            </a>
            <a href="tel:+13149342133" className="tl-footer__link tl-mono">(314) 934-2133</a>
          </address>
        </div>
      </div>
      <FamilyOfCompanies current="tl49" />
      <div className="tl-footer__bot">
        <span>© 2026 TRANSLINE49° ENVIRONMENTAL SERVICES · ALL RIGHTS RESERVED</span>
        <span>U.S.–CANADA TRANSBOUNDARY WASTE · A WHITE OWL FAMILY OFFICE COMPANY</span>
      </div>
    </footer>
  );
}
