import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { CaseStudyHero } from "./CaseStudyHero";
import { CaseStudyLayout } from "./CaseStudyLayout";
import { NextPrevNavigation } from "./NextPrevNavigation";
import { StickyOutline } from "./StickyOutline";

export function CaseStudySections({
  project,
  outlineSections,
  previous,
  next,
}) {
  return (
    <>
      <Section spacing="none">
        <CaseStudyHero project={project} />
      </Section>

      <Section spacing="sm">
        <Container size="wide">
          <div className="lg:grid lg:grid-cols-[160px_1fr] lg:gap-12 xl:grid-cols-[180px_1fr] xl:gap-16">
            <StickyOutline sections={outlineSections} />

            <div className="min-w-0">
              <CaseStudyLayout project={project} />
              <NextPrevNavigation previous={previous} next={next} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default CaseStudySections;
