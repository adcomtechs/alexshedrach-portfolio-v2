import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { WritingHero } from "./WritingHero";
import { WritingIndex } from "./WritingIndex";

export function WritingPageSections({
  postCount,
  posts,
  projects,
  conditions,
  activeFilters,
  filterDesc,
  totalCount,
  currentPage,
  totalPages,
}) {
  return (
    <>
      <Section as="header" spacing="sm" className="relative">
        <SectionBackground variant="editorial" />
        <Container size="wide">
          <WritingHero postCount={postCount} />
        </Container>
      </Section>

      <Section spacing="sm" className="relative">
        <SectionBackground variant="minimal" />
        <Container size="wide">
          <WritingIndex
            posts={posts}
            projects={projects}
            conditions={conditions}
            activeFilters={activeFilters}
            filterDesc={filterDesc}
            allPostsCount={postCount}
            totalCount={totalCount}
            showPagination={conditions.showPagination}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </Container>
      </Section>
    </>
  );
}

export default WritingPageSections;
