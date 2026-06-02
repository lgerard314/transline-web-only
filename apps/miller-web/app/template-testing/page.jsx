import { Hero01 } from "@/components-v2/sections/hero-01";

export const metadata = {
  title: "Template Testing — components-v2 sandbox",
  robots: { index: false, follow: false },
};

export default function TemplateTestingPage() {
  return (
    <>
      <link rel="preload" href="/miller/hero/home-frame-1.png" as="image" fetchPriority="high" />
      <Hero01 />
    </>
  );
}
