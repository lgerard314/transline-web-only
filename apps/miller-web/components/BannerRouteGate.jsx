"use client";
// Tiny client island that toggles `body[data-banner="on|off"]` based on
// the current pathname. The EmergencyBanner is rendered unconditionally
// in the root layout; this gate decides whether it paints, so the work
// per route is just one attribute write — no banner remount, no
// suspense churn.
//
// Allow-list lives in `lib/nav.js` (`shouldShowEmergencyBanner`). Default
// for SSR is "on" (set on <body> in layout.jsx) which matches every
// allow-listed home/services/treatment route — so the first paint for
// the most-trafficked routes shows the banner without a client tick.
// Other routes correct the attribute on mount (one DOM write, no layout
// shift because the banner uses `position: sticky`).
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { shouldShowEmergencyBanner } from "../lib/nav";

export function BannerRouteGate() {
  const pathname = usePathname();
  useEffect(() => {
    const show = shouldShowEmergencyBanner(pathname);
    document.body.dataset.banner = show ? "on" : "off";
  }, [pathname]);
  return null;
}
