// L0 · solid-cta-01 — primary squared clay CTA. Internal -> next/link;
// external -> raw anchor with target/rel. children include any trailing arrow.
import Link from "next/link";
export function SolidCta01({ href, children, external = false, ariaLabel }) {
  const label = ariaLabel ? { "aria-label": ariaLabel } : {};
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="mw-cta mw-cta--solid" {...label}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="mw-cta mw-cta--solid" {...label}>
      {children}
    </Link>
  );
}
