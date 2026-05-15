import { ContactTemplate } from "../../components/templates/ContactTemplate";
import { ContactForm } from "../../components/ContactForm";
import { contactContent as c } from "../../lib/content/contact";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <ContactTemplate
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      phone={c.phone}
      office={c.office}
      intake={c.intake}
      formSlot={<ContactForm />}
    />
  );
}
