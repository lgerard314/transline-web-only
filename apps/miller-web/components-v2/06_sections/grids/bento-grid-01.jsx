import { HeadIntro01 } from "@/components-v2/04_blocks/heads/head-intro-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { FeatureAnchor01 } from "@/components-v2/03_cards/feature/feature-anchor-01";
import { FeatureCard01 } from "@/components-v2/03_cards/feature/feature-card-01";
import { FeatureTile01 } from "@/components-v2/03_cards/feature/feature-tile-01";

export function BentoGrid01({ content, config = {} }) {
  const s = content.services;
  const t = content.title;
  const ext = content.externalTile;
  return (
    <section className="mw-services" aria-labelledby={content.headingId}>
      <div className="mw-inner">
        <HeadIntro01
          eyebrow={content.eyebrow}
          headingId={content.headingId}
          className="mw-services__head"
          title={<>{t.lead}<br /><span className="mw-services__title-em"><StopText01>{t.em}</StopText01></span></>}
          intro={content.intro}
        />
        <ul className="mw-svcs-grid" aria-label="Capabilities" data-reveal-stagger>
          <li><FeatureAnchor01 service={s[0]} /></li>
          {s.slice(1, 3).map((svc, i) => (<li key={svc.id}><FeatureCard01 service={svc} n={i + 2} /></li>))}
          {s.slice(3, 6).map((svc, i) => (<li key={svc.id}><FeatureTile01 service={svc} n={i + 4} /></li>))}
          <li><FeatureTile01 external href={ext.href} photo={ext.photo} titleLines={ext.titleLines} summary={ext.summary} n={7} /></li>
          {[s[6], s[8], s[9]].map((svc, i) => (<li key={svc.id}><FeatureTile01 service={svc} n={i + 8} /></li>))}
          <li><FeatureTile01 service={s[7]} n={11} /></li>
        </ul>
      </div>
    </section>
  );
}
