import { SlabHero01 } from "@/components-v2/06_sections/heroes/slab-hero-01";
import { RestorationWipe01 } from "@/components-v2/06_sections/flows/restoration-wipe-01";
import { CapabilityLedger01 } from "@/components-v2/06_sections/grids/capability-ledger-01";
import { ClosureLadder01 } from "@/components-v2/06_sections/flows/closure-ladder-01";
import { CaseRail01 } from "@/components-v2/06_sections/grids/case-rail-01";
import { ScreeningRoom01 } from "@/components-v2/06_sections/pickers/screening-room-01";
import { CallbackCta01 } from "@/components-v2/06_sections/callouts/callback-cta-01";
import { RelatedRail02 } from "@/components-v2/06_sections/rails/related-rail-02";
import { environmentalRemediation as c } from "@/lib/content/environmental-remediation";

// REM v2 — the "site file" page. Thin composition only: slab hero, the
// before/after restoration wipe (scroll signature), type-led capability
// ledger, vertical closure ladder with the cycling site feed, real case
// studies, the dark screening room (real films), and the walnut-crowned
// callback close.

export const metadata = {
  title: "Environmental Remediation Services",
  description: c.hero.lead,
  alternates: {
    canonical: "/industrial-services/environmental-remediation-services/",
  },
};

export default function RemediationPage() {
  return (
    <>
      <SlabHero01 content={c.hero} />
      <RestorationWipe01 content={c.wipe} />
      <CapabilityLedger01 content={c.capabilities} />
      <ClosureLadder01 content={c.process} />
      <CaseRail01 content={c.cases} />
      <ScreeningRoom01 content={c.films} />
      <CallbackCta01 content={c.cta} />
      <RelatedRail02 content={c.related} config={{ hookClass: "mw-rem2-rel" }} />
    </>
  );
}
