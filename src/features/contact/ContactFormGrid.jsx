import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "./ContactForm";
import { LookingFor } from "./LookingFor";

export function ContactFormGrid() {
  return (
    <Section spacing="md">
      <Container size="wide">
        <div className="grid grid-cols-1 gap-10 items-start lg:grid-cols-[1fr_400px] lg:gap-14">
          <div>
            <ContactForm />
          </div>

          <aside
            className="flex flex-col gap-8 lg:sticky lg:top-24"
            aria-label="Work enquiry context"
          >
            <div className="order-first lg:order-none">
              <LookingFor />
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

export default ContactFormGrid;
