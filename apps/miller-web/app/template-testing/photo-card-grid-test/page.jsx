// TDD sandbox fixture for PhotoCardGrid01 + IndThumbCard01 + IndGalleryCard01.
// Exercises both cardStyle configs on one route so the Playwright spec can assert both.
// Not a production route — noindex, minimal, no layout decoration beyond root chrome.

import { PhotoCardGrid01 } from "@/components-v2/06_sections/grids/photo-card-grid-01";
import { emergencyResponse } from "@/lib/content/service-emergency-response";
import { customerWasteCollection } from "@/lib/content/service-customer-waste-collection";

export const metadata = {
  title: "TDD Fixture — PhotoCardGrid01",
  robots: { index: false, follow: false },
};

// The ER incidents head PNG is a literal in the source section (not currently in the
// content file). Surface it here as headMedia per spec §5 / Task 3 "RECONCILE-IN-D".
// RECONCILE-IN-D: fold headMedia into emergencyResponse.incidents in lib/content/service-emergency-response.js at cutover.
const ER_INCIDENTS = {
  ...emergencyResponse.incidents,
  titleId: "er-inc-title",
  headMedia: "/miller/pickup-truck-transparent-removebg.png",
};

// CWC industries already has cta in the content file; attach titleId.
// RECONCILE-IN-D: fold titleId into customerWasteCollection.industries at cutover.
const CWC_INDUSTRIES = {
  ...customerWasteCollection.industries,
  titleId: "cwc-inds-title",
};

export default function PhotoCardGridTestPage() {
  return (
    <>
      <PhotoCardGrid01
        content={ER_INCIDENTS}
        config={{ cardStyle: "thumb", head: "media-split" }}
      />
      <PhotoCardGrid01
        content={CWC_INDUSTRIES}
        config={{ cardStyle: "gallery", head: "split", trailingCta: true }}
      />
    </>
  );
}
