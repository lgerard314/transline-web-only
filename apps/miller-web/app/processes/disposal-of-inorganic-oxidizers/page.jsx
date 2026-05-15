import { ProcessTemplate } from "../../../components/templates/ProcessTemplate";
import { processInorganicOxidizers as c } from "../../../lib/content/process-disposal-of-inorganic-oxidizers";

export const metadata = { title: "Disposal of Inorganic Oxidizers" };

export default function DisposalOfInorganicOxidizersPage() {
  return (
    <ProcessTemplate
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
      highlights={c.highlights}
      sections={c.sections}
      faqs={c.faqs}
      cta={c.cta}
    />
  );
}
