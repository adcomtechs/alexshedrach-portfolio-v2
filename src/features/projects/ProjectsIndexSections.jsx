import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import TechTicker from "@/features/home/HeroSection/TechTicker";
import { CurrentlyBuildingCallout } from "./CurrentlyBuildingCallout";
import { DomainSidebar } from "./DomainSidebar";
import { EmptyState } from "./EmptyState";
import { PaginationControls } from "./PaginationControls";
import { ProjectIndex } from "./ProjectIndex";
import { ProjectsHero } from "./ProjectsHero";
import { StatusFilterBar } from "./StatusFilterBar";

export function ProjectsIndexSections({
  available,
  availableFrom,
  projectCount,
  domains,
  statusBreakdown,
  conditions,
  filters,
  view,
  pagination,
  filtersActive,
}) {
  return (
    <>
      <Section spacing="none">
        <ProjectsHero
          available={available}
          availableFrom={availableFrom}
          projectCount={projectCount}
          domains={domains}
          statusBreakdown={statusBreakdown}
        />

        <Container size="full" className="-mt-6">
          {conditions.currentlyBuilding && (
            <CurrentlyBuildingCallout project={conditions.currentlyBuilding} />
          )}
        </Container>
      </Section>

      <Section spacing="sm">
        <Container size="full">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {conditions.showDomainFilter && (
              <DomainSidebar
                domains={domains}
                activeFilter={filters.domain}
                totalCount={projectCount}
                className="mb-4 w-full shrink-0 lg:mb-1 lg:w-70"
              />
            )}

            <div className="min-w-0 flex-1">
              <StatusFilterBar
                statuses={conditions.uniqueStatuses}
                activeStatus={filters.status}
                activeView={view}
                totalCount={projectCount}
                filteredCount={pagination.totalCount}
                filtersActive={filtersActive}
              />

              {pagination.totalCount === 0 ? (
                <EmptyState filters={filters} />
              ) : (
                <>
                  <ProjectIndex projects={pagination.items} view={view} />

                  {conditions.showPagination && (
                    <PaginationControls
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      hasNext={pagination.hasNext}
                      hasPrev={pagination.hasPrev}
                      filters={filters}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </Container>

        <TechTicker />
      </Section>
    </>
  );
}

export default ProjectsIndexSections;
