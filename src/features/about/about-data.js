// features/about/about-data.js
//
// Phase 4 — About page content data.
// Location: features/about/ — feature-scoped authored prose, not an addressable
// content record indexed by slug. Per DEC-046.
//
// Schema amendments from DEC-046 original spec:
//   engineeringPhilosophy.examples → { project, detail }  (was { principle, implication })
//   decisionMaking.scenarios       → { situation, tradeoff, reasoning, decision }
//                                    (was { situation, reasoning, outcome })
//   valuesInPractice               → { title, detail }  (was { behavior, explanation })
//   currentlyExploring             → { topic, detail, date }  (timeframe renamed to date per DEC-047)
//
// Writing standard (PORTFOLIO_V2_SPEC.md Section 8):
//   Precise · Concrete · Direct · First person
//
// Update protocol (DEC-047):
//   When currentlyExploring entries change — update topic, detail, and date.
//   Commit. Zero infrastructure overhead.

export const aboutData = {
  // ─── Hero ───────────────────────────────────────────────────────────────────
  // One sentence. Survives a 5-second test. Per DEC-044.
  hero: {
    positioning:
      "I design software around real Nigerian operational constraints and system realities before choosing the framework.",
  },

  // ─── Engineering Philosophy ─────────────────────────────────────────────────
  // Continuous prose — how problems are approached.
  // Two to three concrete examples from real decisions. Per DEC-044.

  engineeringPhilosophy: {
    narrative:
      "I treat software architecture as a modelling problem before it becomes a tooling problem. The first objective is understanding the domain deeply enough that the business rules can be expressed in plain functions and data structures without framework abstractions hiding mistakes. Once the constraints, edge cases, and workflows are proven in the simplest possible environment, the framework becomes an implementation detail rather than the foundation of the system. This process changes how databases are designed, how APIs are shaped, and which abstractions are allowed to exist. It also makes architectural tradeoffs visible much earlier, before they become expensive to reverse.",

    // { project, detail } — project grounds the example, detail is the narrative.
    examples: [
      {
        project: "GradeForge",
        detail:
          "The CGPA calculation engine was fully implemented in vanilla JavaScript before the Spring Boot backend existed. Carry-over handling, repeat-course replacement, incomplete semester states, and 5-point versus 4-point grading systems were all validated in plain functions first. The resulting prototype became the behavioural specification for the Java service layer and prevented database redesign later in development.",
      },
      {
        project: "VendaCore",
        detail:
          "The offline transaction queue was designed before the POS sales interface because intermittent electricity and unstable internet connectivity are operational realities for Nigerian SMEs. IndexedDB persistence, reconnect synchronization, and transaction replay logic were treated as core architecture rather than progressive enhancement features added later.",
      },
      {
        project: "AttendIQ",
        detail:
          "The authentication model intentionally rejected purely stateless JWT authentication in favour of nonce-based token invalidation because the actual problem was preventing proxy attendance abuse in university environments. The architecture prioritized revocation guarantees and device-level verification over implementation simplicity.",
      },
    ],
  },

  // ─── Decision Making ────────────────────────────────────────────────────────
  // How tradeoffs are evaluated — not personality traits.
  // Two to three real tradeoff scenarios. Per DEC-044.

  decisionMaking: {
    narrative:
      "I evaluate engineering decisions by starting from operational reality instead of technical trends. Every tradeoff is examined against the environment the software will actually run inside: infrastructure reliability, institutional workflow, long-term maintainability, deployment cost, developer ergonomics, and failure recovery. I prefer systems that remain understandable under pressure over systems that appear sophisticated but become difficult to reason about six months later. Architectural decisions are written down before implementation because the reasoning behind a decision matters as much as the final choice itself.",

    // { situation, tradeoff, reasoning, decision } — four fields separate the
    // context, the choice surface, the evaluation, and the outcome.
    scenarios: [
      {
        situation: "UniCore architecture planning",
        tradeoff:
          "Modular monolith versus early microservices for a multi-module university management platform.",
        reasoning:
          "The operational overhead of distributed services would have slowed iteration while solving problems that did not yet exist. Shared domain boundaries, deployment simplicity, and maintainability were more valuable at the current scale than independent deployment pipelines.",
        decision:
          "Chose a modular monolith with strongly separated domains and documented service boundaries that can later evolve into independent services if scaling pressure justifies it.",
      },
      {
        situation: "ScholarHive vector search infrastructure",
        tradeoff:
          "pgvector inside PostgreSQL versus external vector infrastructure such as Pinecone.",
        reasoning:
          "Keeping embeddings and relational academic metadata in the same persistence layer simplified consistency guarantees, reduced operational cost, and eliminated local development complexity. The projected scale did not justify introducing an additional distributed dependency early.",
        decision:
          "Selected PostgreSQL with pgvector while documenting future migration paths if retrieval scale eventually exceeds database efficiency thresholds.",
      },
      {
        situation: "GradeForge transcript generation",
        tradeoff:
          "Generic transcript formats versus strict NUC-oriented formatting.",
        reasoning:
          "The software exists for Nigerian students applying to Nigerian institutions and NYSC workflows. Compatibility with actual institutional expectations mattered more than broad international flexibility.",
        decision:
          "Prioritized NUC-compliant transcript formatting and grading interpretation as first-class domain rules.",
      },
    ],
  },

  // ─── Working Approach ───────────────────────────────────────────────────────
  // Collaboration and delivery in practice. Continuous prose. Per DEC-044.

  workingApproach: {
    narrative:
      "I work by making reasoning visible early. Before any significant feature work begins, I write down the architectural decisions, domain assumptions, tradeoffs under consideration, and known implementation constraints. This is not documentation for its own sake — it is the mechanism that allows a collaborator to understand not just what is being built, but why the specific approach was chosen over the alternatives that were evaluated and rejected.\n\nI prefer iterative delivery with working vertical slices instead of disconnected feature fragments that only integrate at the end of a sprint. Each slice ships a complete path through the system — from interface to persistence — so progress is observable and testable at every stage, not just at integration time. This keeps feedback loops short and surfaces integration problems before they compound.\n\nDuring implementation, I keep domain logic isolated from framework logic to make debugging and future rewrites manageable. Business rules, domain entities, and core workflows live independently of the framework that hosts them. When Next.js updates or Spring Boot conventions shift, the domain layer is unaffected. This is not over-engineering — it is the minimum investment that makes a system maintainable eighteen months after it was written.\n\nTeaching alongside development has also shaped how I collaborate. I explain decisions at the moment they are made, challenge weak assumptions early while the cost of changing course is still low, and document enough context that another engineer can continue the work without reverse-engineering intent from the codebase.",
  },

  // ─── Values in Practice ─────────────────────────────────────────────────────
  // Three to four discrete behaviors — structured layout per DEC-048.
  // { title, detail } — title maps to CardHeader, detail to CardContent.
  // Each item passes the specificity test: not claimable by a generic developer.

  valuesInPractice: [
    {
      title: "Prototype before abstraction",
      detail:
        "Core domain behaviour is implemented in plain JavaScript before framework abstractions are introduced. If the business rules cannot be modelled clearly without the framework, the domain understanding is incomplete.",
    },
    {
      title: "Design for Nigerian infrastructure first",
      detail:
        "Offline queues, reconnect synchronization, local payment realities, institutional document standards, and unstable connectivity are treated as primary architectural inputs instead of edge cases discovered after deployment.",
    },
    {
      title: "Document decisions while context is fresh",
      detail:
        "Tradeoffs, rejected alternatives, and architectural reasoning are written at the moment decisions are made rather than reconstructed retrospectively after implementation complexity obscures the original intent.",
    },
    {
      title: "Prefer understandable systems over impressive systems",
      detail:
        "Distributed infrastructure, excessive abstractions, and unnecessary tooling are avoided unless operational scale justifies the complexity they add.",
    },
  ],

  // ─── Currently Exploring ────────────────────────────────────────────────────
  // Two to three dated entries. Per DEC-047.
  // { topic, detail, date } — date format: "Month YYYY" per DEC-049.
  // Maximum three entries. Update date when entry content changes.

  currentlyExploring: [
    {
      topic: "Spring Boot modular architecture",
      detail:
        "Exploring how large Java backend systems maintain domain isolation while preserving developer velocity, particularly modular monolith patterns that can evolve toward service extraction without premature distributed complexity.",
      date: "May 2026",
    },
    {
      topic: "Offline-first frontend systems",
      detail:
        "Studying resilient client-side architecture patterns involving IndexedDB synchronization, transaction replay queues, optimistic UI state, and failure recovery strategies for unstable connectivity environments.",
      date: "May 2026",
    },
    {
      topic: "Semantic retrieval for academic platforms",
      detail:
        "Researching pgvector-based semantic search, document similarity scoring, and retrieval architecture for ScholarHive's academic material discovery and duplicate-content detection workflows.",
      date: "May 2026",
    },
  ],

  // ─── Connect to Work ────────────────────────────────────────────────────────
  // Closing CTA. Specific — no generic language. Per DEC-044, DEC-050.
  // Button variants: glow (projects, primary) → secondary (contact). Per DEC-050.

  connectToWork: {
    heading: "See the engineering in practice.",

    projectsCopy:
      "The projects below are not tutorial clones or UI exercises — each one exists to solve a specific operational problem inside Nigerian academic, retail, or institutional environments, with the architecture decisions documented alongside the implementation.",

    contactCopy:
      "Relevant conversations: Nigerian-focused software infrastructure, frontend architecture, JavaScript systems engineering, Spring Boot backend development, technical collaboration, and long-term product building.",

    // New fields — required by ConnectToWork.jsx WorkStrip
    workTypes: ["Product Licensing", "Custom Builds", "Consulting"],
    locationMeta: ["WAT", "UTC+1", "Nsukka, NG"],
    responseTime: "Replies within 24 hours",
  },
};
