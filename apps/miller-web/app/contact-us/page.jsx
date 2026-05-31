import { HeroSection } from "./sections/01-hero";
import { ContactCardsSection } from "./sections/02-contact-cards";
import { FormSection } from "./sections/03-form";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <HeroSection />
      <ContactCardsSection />
      <FormSection />
    </>
  );
}
