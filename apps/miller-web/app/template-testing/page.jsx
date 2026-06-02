import { Hero01 } from "@/components-v2/sections/hero-01";
import { CertsBanner01 } from "@/components-v2/sections/certs-banner-01";
import { Services01 } from "@/components-v2/sections/services-01";
import { Careers01 } from "@/components-v2/sections/careers-01";
import { AffiliatesBanner01 } from "@/components-v2/sections/affiliates-banner-01";
import { FinalCta01 } from "@/components-v2/sections/final-cta-01";

export const metadata = {
  title: "Template Testing — components-v2 sandbox",
  robots: { index: false, follow: false },
};

export default function TemplateTestingPage() {
  return (
    <>
      <link rel="preload" href="/miller/hero/home-frame-1.png" as="image" fetchPriority="high" />
      <Hero01 />
      <CertsBanner01 />
      <Services01 />
      <Careers01 />
      <AffiliatesBanner01 />
      <FinalCta01 />
    </>
  );
}
