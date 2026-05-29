"use client";
// Sitewide 24/7 emergency contact banner. Sits ABOVE the TopNav (skip link
// still bypasses it). Cookie-gated SSR initial state so dismissals
// persist across navigations without hydration flash.
//
// Visibility per-route is gated by the `data-banner="on|off"` attribute
// set on `<body>` by route-segment layouts (or the home layout). This
// component renders unconditionally; the CSS in globals.css decides
// whether `.miller-eb` is shown. The route allow-list lives in
// `lib/nav.js` (`EMERGENCY_BANNER_ROUTES`).
//
// Mobile (≤sm) collapses to a circular phone icon whose aria-label spells
// out the full phone number for screen-reader users.

import { useEffect, useState } from "react";
import { EMERGENCY_PHONE } from "../lib/content/brand";

// Watches the topnav's data-scroll-state attribute. Once the user
// scrolls past the hero (topnav switches to "past-hero"), the
// EmergencyBanner slides up and out of view.
function useTopnavPastHero() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const target = document.querySelector(".tl-topbar");
    if (!target) return;
    const sync = () => setPast(target.getAttribute("data-scroll-state") === "past-hero");
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(target, { attributes: true, attributeFilter: ["data-scroll-state"] });
    return () => obs.disconnect();
  }, []);
  return past;
}

const EMERGENCY_DISPLAY = EMERGENCY_PHONE;
const EMERGENCY_HREF    = `tel:+1${EMERGENCY_PHONE.replace(/\D/g, "")}`;
const COOKIE_NAME       = "miller_eb_dismissed";

export function EmergencyBanner({ initialDismissed = false }) {
  const [dismissed, setDismissed] = useState(initialDismissed);
  const past = useTopnavPastHero();

  // Persist the dismissal in a session-scoped cookie. We don't bother with
  // expiry — the cookie clears when the browser session ends, which
  // matches the spec's "persists for the session" requirement.
  useEffect(() => {
    if (!dismissed) return;
    document.cookie = `${COOKIE_NAME}=1; path=/; SameSite=Lax`;
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <aside
      className="miller-eb"
      role="region"
      aria-label="24-hour emergency contact"
      data-eb-hidden={past ? "1" : "0"}
    >
      <div className="miller-eb__inner">
        <a
          className="miller-eb__phone"
          href={EMERGENCY_HREF}
          aria-label={`Call 24/7 emergency: ${EMERGENCY_DISPLAY}`}
        >
          <span className="miller-eb__icon" aria-hidden="true">☎</span>
          <span className="miller-eb__eyebrow">24/7 Emergency Response</span>
        </a>
        <a
          className="miller-eb__number-link"
          href={EMERGENCY_HREF}
          aria-label={`Call ${EMERGENCY_DISPLAY}`}
        >
          <span className="miller-eb__number tl-mono">{EMERGENCY_DISPLAY}</span>
        </a>
      </div>
    </aside>
  );
}
