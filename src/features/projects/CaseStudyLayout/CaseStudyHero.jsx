// features/projects/CaseStudyHero/CaseStudyHero.jsx
// RSC — no client directive required.
//
// mesh SectionBackground — per DEC-020.
// Hero specification — per DEC-021.
// MetricsStrip — per DEC-018 amendment (additive, does not replace prose outcome).
// Demo and repo links — per DEC-032.
// default Container applied at the page level — per DEC-024.

import { SectionBackground } from "@/components/ui/SectionBackground";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { MetricsStrip } from "@/components/ui/MetricsStrip";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/Container";

// Status → Badge variant mapping.
// Badge uses semantic color variants — distinct from ProjectCard's STATUS_CONFIG
// which carries raw color values for its custom inline style approach.
const STATUS_BADGE = {
  live: { variant: "success", dot: true, label: "Live" },
  wip: { variant: "muted", dot: false, label: "WIP" },
  archived: { variant: "muted", dot: false, label: "Archived" },
};

/**
 * CaseStudyHero
 *
 * Front-loads enough signal that a technical evaluator can orient in under
 * 10 seconds before committing to six prose sections. (DEC-021)
 *
 * Element order — per DEC-021 and DEC-018 amendment:
 *   Breadcrumb → Domain eyebrow → Title → Description →
 *   MetricsStrip (conditional) → Meta row → Stack tags
 *
 * MetricsStrip renders between description and the meta row. It surfaces
 * quantified results before the evaluator reads any prose. The prose
 * outcome field is preserved and unchanged — this is additive. (DEC-018 amendment)
 *
 * Demo and repo links render as ghost Buttons in the meta row when the
 * URL fields are populated. Absent when empty — no placeholder state. (DEC-032)
 *
 * @param {Object} project - Full project data object from lib/data/projects.js
 */
export function CaseStudyHero({ project }) {
  const {
    title,
    domain,
    description,
    tags,
    status,
    year,
    metrics,
    demoUrl,
    repoUrl,
  } = project;

  const statusConfig = status ? STATUS_BADGE[status] : null;

  const breadcrumbItems = [
    { label: "Projects", href: "/projects" },
    { label: title },
  ];

  const hasMetaRow = statusConfig || year || demoUrl || repoUrl;

  return (
    <div className="relative overflow-hidden py-8 lg:py-14">
      <SectionBackground variant="mesh" />

      <Container size="wide" className="relative z-10 flex flex-col gap-6">
        {/* Breadcrumb — navigation path, establishes context for cold arrivals */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Domain eyebrow */}
        {domain && (
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="inline-block w-1 h-1 rounded-full shrink-0"
              style={{ background: "var(--color-accent)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
              }}
            >
              {domain}
            </span>
          </div>
        )}

        {/* Project title — primary heading */}
        <Heading as="h1" size="1" balance>
          {title}
        </Heading>

        {/* One-sentence description — must be a single sentence per DEC-021 */}
        {description && (
          <Text size="lg" color="muted" balance className="max-w-2xl">
            {description}
          </Text>
        )}

        {/* Metrics strip — conditional, renders when metrics array is populated.
            Between description and meta row — quantified signal before metadata.
            Per DEC-018 amendment. MetricsStrip handles the empty/null guard. */}
        {/* <MetricsStrip metrics={metrics} /> */}

        {/* Meta row — status, year, demo link, repo link.
            Stack tags are kept separate (see below) — they can be 8+ items and
            flex-wrapping them into this row would push buttons to an unpredictable
            line. Separation keeps this row consistently compact. */}
        {hasMetaRow && (
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status badge */}
            {statusConfig && (
              <Badge variant={statusConfig.variant} dot={statusConfig.dot}>
                {statusConfig.label}
              </Badge>
            )}

            {/* Year */}
            {year && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.06em",
                  color: "var(--color-faint)",
                }}
              >
                {year}
              </span>
            )}

            {/* Divider — only when URL buttons follow meta items */}
            {(statusConfig || year) && (demoUrl || repoUrl) && (
              <span
                aria-hidden
                style={{ color: "var(--color-border)", userSelect: "none" }}
              >
                /
              </span>
            )}

            {/* Demo link — ghost Button, external, conditional. (DEC-032)
                Verified live before populating demoUrl — a broken demo link
                damages credibility more than an absent one. */}
            {demoUrl && (
              <Button
                href={demoUrl}
                variant="ghost"
                size="sm"
                external
                rightIcon={<ExternalLink size={12} />}
              >
                Live demo
              </Button>
            )}

            {/* Repo link — ghost Button, external, conditional. (DEC-032) */}
            {repoUrl && (
              <Button
                href={repoUrl}
                variant="ghost"
                size="sm"
                external
                rightIcon={<ExternalLink size={12} />}
              >
                Repository
              </Button>
            )}
          </div>
        )}

        {/* Stack tags — technology array.
            Separate from the meta row so tag wrapping never displaces buttons. */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

// // features/projects/CaseStudyHero.jsx
// // RSC — no client directive required.
// //
// // mesh SectionBackground — per DEC-020.
// // Hero specification — per DEC-021.
// // default Container applied at the page level — per DEC-024.

// import { SectionBackground } from "@/components/ui/SectionBackground";
// import { Breadcrumb } from "@/components/ui/Breadcrumb";
// import { Heading } from "@/components/ui/Heading";
// import { Text } from "@/components/ui/Text";
// import { Badge } from "@/components/ui/Badge";
// import { Tag } from "@/components/ui/Tag";
// import { Container } from "@/components/layout/Container";

// // Status → Badge variant mapping.
// // Badge uses semantic color variants — distinct from ProjectCard's STATUS_CONFIG
// // which carries raw color values for its custom inline style approach.
// const STATUS_BADGE = {
//   live: { variant: "success", dot: true, label: "Live" },
//   wip: { variant: "muted", dot: false, label: "WIP" },
//   archived: { variant: "muted", dot: false, label: "Archived" },
// };

// /**
//  * CaseStudyHero
//  *
//  * Front-loads enough signal that a technical evaluator can orient in under
//  * 10 seconds before committing to six prose sections. (DEC-021)
//  *
//  * Element order — per DEC-021 specification:
//  *   Breadcrumb → Domain eyebrow → Title → Description → Meta row → Stack tags
//  *
//  * Self-contained: owns its vertical padding and SectionBackground.
//  * The page's Section provides semantic markup; spacing is handled here.
//  *
//  * @param {Object} project - Full project data object from lib/data/projects.js
//  */
// export function CaseStudyHero({ project }) {
//   const { title, domain, description, tags, status, year } = project;

//   const statusConfig = status ? STATUS_BADGE[status] : null;

//   const breadcrumbItems = [
//     { label: "Projects", href: "/projects" },
//     { label: title },
//   ];

//   return (
//     <div className="relative overflow-hidden py-10 lg:py-15">
//       <SectionBackground variant="mesh" />

//       <Container size="wide" className="relative z-10 flex flex-col gap-6">
//         {/* Breadcrumb — navigation path, establishes context for cold arrivals */}
//         <Breadcrumb items={breadcrumbItems} />

//         {/* Domain eyebrow */}
//         {domain && (
//           <div className="flex items-center gap-2.5">
//             <span
//               aria-hidden
//               className="inline-block w-1 h-1 rounded-full shrink-0"
//               style={{ background: "var(--color-accent)" }}
//             />
//             <span
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "var(--text-xs)",
//                 letterSpacing: "0.1em",
//                 textTransform: "uppercase",
//                 color: "var(--color-accent)",
//               }}
//             >
//               {domain}
//             </span>
//           </div>
//         )}

//         {/* Project title — primary heading */}
//         <Heading as="h1" size="1" balance>
//           {title}
//         </Heading>

//         {/* One-sentence description — must be a single sentence per DEC-021 */}
//         {description && (
//           <Text size="lg" color="muted" balance className="max-w-2xl">
//             {description}
//           </Text>
//         )}

//         {/* Meta row — status badge + year */}
//         {(statusConfig || year) && (
//           <div className="flex items-center gap-3 flex-wrap">
//             {statusConfig && (
//               <Badge variant={statusConfig.variant} dot={statusConfig.dot}>
//                 {statusConfig.label}
//               </Badge>
//             )}
//             {year && (
//               <span
//                 style={{
//                   fontFamily: "var(--font-mono)",
//                   fontSize: "var(--text-xs)",
//                   letterSpacing: "0.06em",
//                   color: "var(--color-faint)",
//                 }}
//               >
//                 {year}
//               </span>
//             )}
//           </div>
//         )}

//         {/* Stack tags — technology array rendered as readable labels */}
//         {tags && tags.length > 0 && (
//           <div className="flex flex-wrap gap-2">
//             {tags.map((tag) => (
//               <Tag key={tag}>{tag}</Tag>
//             ))}
//           </div>
//         )}
//       </Container>
//     </div>
//   );
// }
