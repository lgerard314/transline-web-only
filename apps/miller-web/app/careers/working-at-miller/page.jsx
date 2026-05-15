import { AboutTemplate } from "../../../components/templates/AboutTemplate";
import { careersWorkingAtMiller as c } from "../../../lib/content/careers-working-at-miller";

export const metadata = { title: "Working at Miller" };

export default function WorkingAtMillerPage() {
  return (
    <AboutTemplate
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
      sections={c.sections}
      lists={c.lists}
    />
  );
}
