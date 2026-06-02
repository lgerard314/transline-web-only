import { homeServiceOrder } from "./bento-grid-order";
import { HeadIntro01 } from "@/components-v2/04_blocks/heads/head-intro-01";
import { FeatureAnchor01 } from "@/components-v2/03_cards/feature/feature-anchor-01";
import { FeatureCard01 } from "@/components-v2/03_cards/feature/feature-card-01";
import { FeatureTile01 } from "@/components-v2/03_cards/feature/feature-tile-01";

export function BentoGrid01() {
  const s = homeServiceOrder();
  return (
    <section className="mw-services" aria-labelledby="mw-services-heading">
      <div className="mw-inner">
        <HeadIntro01
          eyebrow="Services"
          headingId="mw-services-heading"
          className="mw-services__head"
          title={<>whatever your waste needs,<br /><span className="mw-services__title-em">we&rsquo;ve got you <span className="mw-nobr">covered<span className="mw-stop" aria-hidden="true" /></span></span></>}
          intro={<>From routine industrial streams to one-off emergency calls, Miller&rsquo;s licensed VBEC facility and field crews handle the full spectrum &mdash; collection, treatment, and final disposition, all under one roof.</>}
        />
        <ul className="mw-svcs-grid" aria-label="Capabilities" data-reveal-stagger>
          <li><FeatureAnchor01 service={s[0]} /></li>
          {s.slice(1, 3).map((svc, i) => (<li key={svc.id}><FeatureCard01 service={svc} n={i + 2} /></li>))}
          {s.slice(3, 6).map((svc, i) => (<li key={svc.id}><FeatureTile01 service={svc} n={i + 4} /></li>))}
          <li>
            <FeatureTile01
              external
              href="https://www.transline49.com"
              photo="/miller/services/vacuum-truck-new-logo.webp"
              titleLines={["Cross-Border", "Services"]}
              summary="Transboundary movement of waste from the United States to Canada to mitigate your US liabilities."
              n={7}
            />
          </li>
          {[s[6], s[8], s[9]].map((svc, i) => (<li key={svc.id}><FeatureTile01 service={svc} n={i + 8} /></li>))}
          <li><FeatureTile01 service={s[7]} n={11} /></li>
        </ul>
      </div>
    </section>
  );
}
