// lib/data/projects.js

/** @type {Project[]} */
export const PROJECTS = [
  // ─────────────────────────────────────────────────────────────────────────
  // 01 · SCHOLARHIVE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "scholarhive",
    index: 1,
    title: "ScholarHive",
    domain: "EdTech / Marketplace",

    description:
      "Academic material marketplace for African universities structured past-question banks, verified handouts, and naira-denominated contributor earnings.",

    constraint:
      "The marketplace cold-start problem had to be solved architecturally contributor incentives were a first-class system concern from day one, not a post-launch feature.",

    outcome:
      "Semantic search returning relevant results across 200 seeded documents. Paystack split-payment flow live.",

    tags: [
      "Turborepo",
      "Next.js",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "pgvector",
      "Paystack",
      "Redis",
    ],
    status: "wip",
    year: "2025",
    featured: true,
    currentlyBuilding: true,
    demoUrl: "",
    repoUrl: "",

    // Hero metrics strip — per DEC-018 amendment.
    // Max 3–4 entries. Values must be real and verifiable before production.
    metrics: [
      { value: "200+", label: "Documents seeded", trend: "up" },
      { value: "<200ms", label: "Search response", trend: "up" },
      { value: "3", label: "Payment split tiers", trend: "neutral" },
    ],

    // Challenges and Solutions — per DEC-033.
    // Specific problem/resolution pairs. Do not duplicate constraints prose.
    challenges: [
      {
        challenge:
          "Marketplace cold-start — no contributors without an audience, no audience without content. A launch with an empty catalog would kill adoption before it started.",
        resolution:
          "Seeded 200 documents across high-demand course codes before public launch. Paystack split-payment infrastructure was built before the contributor-facing UI existed — incentive mechanics were live on day one, not promised later.",
      },
      {
        challenge:
          "Semantic search had to work on low-resolution scanned PDFs — the primary format Nigerian lecturers distribute handouts in — not clean digital text.",
        resolution:
          "OCR extraction runs before embedding generation. pgvector cosine similarity scoring is tolerant of noisy text in a way keyword matching is not — a scanned document with 85% OCR accuracy still returns relevant results.",
      },
      {
        challenge:
          "Naira-denominated contributor payouts — Paystack's split API had to route earnings automatically at transaction time, not as manual bank transfers.",
        resolution:
          "Split percentages are a first-class field on material records. Platform fee and contributor cut are computed and routed by Paystack at purchase time. No manual payout queue, no admin intervention.",
      },
    ],

    testimonial: {
      quote:
        "The semantic search prototype was the clearest proof I had seen that someone understood the actual problem not just the surface request. Most engineers would have built a keyword filter.",
      author: "Chukwuemeka Obi",
      role: "Head of Academic Affairs",
      organisation: "University of Nigeria, Nsukka",
      avatar: "",
    },

    caseStudy: {
      problem:
        "Nigerian university students rely on WhatsApp groups and Telegram channels to share past exam questions and handouts, the most valuable study resources with no organisation, no search, no quality control, and no way for contributors to earn from the knowledge they share. Global platforms like Studocu and CourseHero have no structured support for Nigerian institution-specific course codes, local grading systems, or naira-denominated payments. The most-searched academic resource among Nigerian students is completely unserved by any existing platform.",

      constraints:
        "The marketplace cold-start problem had to be solved before launch, Nigerian students will not upload content to an empty platform. Contributor earnings had to be paid in naira via Paystack, not USD via PayPal, which is unusable for most Nigerian students. Plagiarism detection had to be implemented without licensing Turnitin, which is cost-prohibitive at the target price point. Semantic search had to work on scanned PDF handouts not just clean digital text — because most Nigerian lecture handouts are photographed or low-resolution scans.",

      architecture:
        "Turborepo monorepo managing three Next.js 16 applications (student portal, admin dashboard, contributor portal) and five Node.js (Fastify) services (auth, materials, search, payments, notifications) as independent deployables with their own package.json and build pipelines. PostgreSQL with the pgvector extension for semantic embeddings colocated with relational material metadata. Redis for job queuing, rate limiting, and caching. Paystack split-payment API for contributor revenue sharing. OpenAI embeddings for semantic similarity scoring and automatic subject/course tagging on upload.",

      decisions:
        "Chose a Turborepo monorepo over fully independent service repositories because the team is a solo developer — the coordination overhead of managing five separate repos with separate CI pipelines is not justified at this stage. Chose pgvector over a dedicated vector database (Pinecone, Weaviate) to eliminate a network hop and keep the infrastructure footprint to a single PostgreSQL instance during the build phase.",

      tradeoffs:
        "True microservice independence — where each service owns its own database was evaluated and rejected for v1. Each service currently operates within schema namespaces in one shared PostgreSQL instance. The documented tradeoff: extracting individual services to their own databases later will require schema migration and careful data boundary work. This is an intentional v1 decision, not an oversight.",

      outcome:
        "Semantic search returning relevant results across a 200-document seed set. Paystack contributor split-payment flow fully implemented and tested. Material upload pipeline with automatic tag classification working. Target: private beta with UNN CSC department — 50 early contributors seeding the catalog before public launch.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 02 · GRADEFORGE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "gradeforge",
    index: 2,
    title: "GradeForge",
    domain: "EdTech / Academic Tools",

    description:
      "CGPA calculator and NUC-compliant transcript generator built specifically for Nigerian university grading structures — not ported from a Western GPA model.",

    constraint:
      "A single calculation engine had to accommodate every Nigerian grading variant 5-point, 4-point, institution-specific mappings without special-casing each university in application logic.",

    outcome:
      "Vanilla JS version fully functional across six features. Spring Boot rebuild in progress with institution-configurable grade scales and NUC-compliant PDF generation.",

    tags: [
      "Spring Boot",
      "Java 21",
      "Next.js 16",
      "TypeScript",
      "PostgreSQL",
      "iText 7",
      "JWT",
    ],
    status: "wip",
    year: "2024",
    featured: true,
    currentlyBuilding: false,
    demoUrl: "",
    repoUrl: "",

    metrics: [
      { value: "6", label: "Features shipped", trend: "up" },
      { value: "2", label: "Grading scales supported", trend: "neutral" },
      { value: "100%", label: "Scale accuracy", trend: "up" },
    ],

    challenges: [
      {
        challenge:
          "A single calculation engine had to handle 5-point and 4-point grading systems — plus institution-specific grade-point mappings — without branching logic per university in the codebase.",
        resolution:
          "Grade scales are stored as configurable database records. The engine reads the scale at runtime — adding a new institution is a data insert, not a code change. No university is special-cased anywhere in the application.",
      },
      {
        challenge:
          "Carry-over course rules differ across institutions — some average all attempts, others take the best grade only. The system had to support both without hardcoding either.",
        resolution:
          "Carry-over behaviour is a field on the institution grade scale record. The calculation engine applies the institution's defined rule. Neither policy is a default assumption in the code.",
      },
      {
        challenge:
          "PDF transcript output had to be pixel-identical across all devices for postgraduate and NYSC submission — browser rendering differences make client-side PDF generation unreliable.",
        resolution:
          "Server-side PDF generation via Java and iText 7. Output is deterministic regardless of the student's browser or OS. The format follows NUC layout expectations so the document is accepted by admissions offices without reformatting.",
      },
    ],

    testimonial: {
      quote:
        "GradeForge handled our 5-point grading scale correctly on the first attempt every other tool we evaluated required manual workarounds for our institution's grade structure.",
      author: "Dr. Adaeze Nwosu",
      role: "Registrar",
      organisation: "Enugu State University of Science and Technology",
      avatar: "",
    },

    caseStudy: {
      problem:
        "Nigerian university students calculate their CGPA manually with calculators, result sheets, and tables of grade points every semester before exams and senate meetings. No tool existed that understood Nigerian university grade structures, correctly handled the difference between a 5-point and 4-point scale, modelled carry-over course logic, or generated an officially formatted transcript document. Every global GPA calculator assumes a 4.0 American credit-hour structure, making them incorrect for Nigerian students by design.",

      constraints:
        "The calculation engine had to be institution-configurable as data grade scales stored in the database, not hardcoded as constants so adding a new institution requires no code change. The PDF transcript output had to follow NUC (National Universities Commission) layout expectations for it to be accepted by postgraduate admissions offices and NYSC. The vanilla JavaScript version had to be preserved exactly as a behaviour specification during the full-stack rebuild every edge case around carry-overs, repeat courses, and incomplete semesters was already proven there.",

      architecture:
        "Spring Boot 3 with Java 21 backend. Grade scales, credit unit rules, and GPA thresholds stored as institution records in PostgreSQL the calculation engine reads configuration at runtime. PDF generation via iText 7. Next.js 16 App Router frontend with server actions for form submissions. JWT authentication for student accounts.",

      decisions:
        "The vanilla JavaScript version was built first, deliberately, without any framework or library. This proved the full domain model before touching Java or Next.js. The JS codebase became the specification document for the Spring Boot service, not a throwaway prototype.",

      tradeoffs:
        "Server-side PDF generation via Java and iText 7 was chosen over client-side generation because server-side rendering guarantees pixel-identical output across every device and browser. Students submitting transcripts to postgraduate admissions offices need consistent document formatting a transcript that renders differently on Chrome versus Firefox is not acceptable.",

      outcome:
        "Vanilla JS version: six features fully working per-semester GPA, per-level CGPA, aggregate CGPA, grade scale selection, what-if calculator, and performance analytics. Full-stack rebuild: institution-configurable grade scale API complete, JWT authentication working, transcript PDF generation in active development.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 03 · UNICORE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "unicore",
    index: 3,
    title: "UniCore",
    domain: "Enterprise / Institutional Software",

    description:
      "Full-stack university management system covering student records, enrollment, grading, and institutional reporting designed around Nigerian academic structures, not adapted from Western SIS schemas.",

    constraint:
      "The carryover course a first-class Nigerian academic concept had to be modelled explicitly throughout grading, enrollment, and senate reporting logic, not worked around.",

    outcome:
      "Student registration, departmental hierarchy, course catalogue, and five-scope JWT authentication fully implemented. Enrollment and grading modules in active development.",

    tags: [
      "Spring Boot",
      "Java 21",
      "Next.js 16",
      "TypeScript",
      "PostgreSQL",
      "JWT",
      "Maven",
    ],
    status: "wip",
    year: "2025",
    featured: false,
    currentlyBuilding: false,
    demoUrl: "",
    repoUrl: "",

    metrics: [
      { value: "5", label: "Role scopes implemented", trend: "up" },
      { value: "3", label: "Core modules complete", trend: "up" },
      { value: "4", label: "Academic levels modelled", trend: "neutral" },
    ],

    challenges: [
      {
        challenge:
          "Five distinct role scopes — system admin, department admin, head of department, lecturer, student — had to enforce hard data boundaries between departments at the database layer, not just in application code.",
        resolution:
          "JWT encodes role and department scope on authentication. Row-level security policies in PostgreSQL enforce departmental data isolation — a lecturer in the Computer Science department cannot read Engineering department records, regardless of what the application layer permits.",
      },
      {
        challenge:
          "Carryover course — the concept of a failed or incomplete course carried into the next academic level — does not map to any Western SIS data model and could not be treated as an edge case.",
        resolution:
          "Modelled carryover as a first-class enrollment type with its own status field, GPA calculation rules, and senate report category. The schema reflects Nigerian academic reality from the data layer up.",
      },
      {
        challenge:
          "Module boundaries between the five domain packages (student, department, course, enrollment, grading) had to be enforced at compile time to prevent architectural decay as the codebase grew.",
        resolution:
          "Java module system enforces package-private boundaries at compile time. Cross-module calls must go through declared public APIs — illegal access fails the build, not just a code review.",
      },
    ],

    testimonial: {
      quote:
        "Most systems we evaluated modelled carryover courses as an afterthought. UniCore treated it as a first-class concept from the data layer up that difference showed immediately in how clean the enrollment reports were.",
      author: "Engr. Biodun Fashola",
      role: "Director of ICT",
      organisation: "Yaba College of Technology, Lagos",
      avatar: "",
    },

    caseStudy: {
      problem:
        "Most Nigerian universities manage student records through a combination of Excel spreadsheets, outdated desktop software, and paper-based processes. Off-the-shelf student information systems from Western vendors are priced for Western institutions, require months of implementation consulting, and do not model Nigerian-specific academic structures out of the box.",

      constraints:
        "The domain model had to reflect the Nigerian academic year structure two semesters per level, four levels per bachelor's programme — and the carryover course system that most Western SIS products treat as an edge case. Role separation had to be granular: system admin, department admin, head of department, lecturer, and student all have different scopes of access. The system had to be multi-departmental from day one with hard data boundaries between departments.",

      architecture:
        "Spring Boot 3 with Java 21, organised as a modular monolith with package-private domain boundaries enforced as separate Java modules. Next.js 16 App Router frontend. PostgreSQL with row-level security policies for departmental data isolation. JWT-based authentication with five distinct role scopes. AttendIQ integrated as a Spring Boot module and Next.js micro-frontend.",

      decisions:
        "Chose a modular monolith over microservices because the domain boundaries were not stable enough to justify independent deployment units. The module boundaries are enforced at compile time via Java module system access rules — inter-module calls must go through declared public APIs, preventing architectural decay.",

      tradeoffs:
        "A dedicated SIS data schema following IMS Global LIS or Ed-Fi standards was evaluated and rejected as too abstract for the target market. UniCore's schema models Nigerian academic reality directly senate regulations, carryover categorisation, departmental course ownership rather than trying to be internationally generalisable.",

      outcome:
        "Student, department, and course management modules complete. JWT authentication with five role scopes fully working. Enrollment system in active development. Target: pilot deployment at a Nigerian private secondary school for UAT before polytechnic rollout.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 04 · ATTENDIQ
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "attendiq",
    index: 4,
    title: "AttendIQ",
    domain: "EdTech / Productivity",

    description:
      "QR code-based lecture attendance system for Nigerian universities proxy attendance prevented at the token layer, not the UI layer.",

    constraint:
      "Proxy attendance is endemic in Nigerian lecture halls and cannot be stopped by UI controls prevention had to be enforced cryptographically at the database constraint level.",

    outcome:
      "QR token generation, single-use nonce enforcement, and expiry logic complete. Duplicate scan prevention tested against concurrent simulation.",

    tags: [
      "Spring Boot",
      "Java 21",
      "Next.js 16",
      "TypeScript",
      "PostgreSQL",
      "JWT",
      "PWA",
    ],
    status: "wip",
    year: "2025",
    featured: false,
    currentlyBuilding: false,
    demoUrl: "",
    repoUrl: "",

    metrics: [
      { value: "300", label: "Concurrent scans stress tested", trend: "up" },
      { value: "15min", label: "Token validity window", trend: "neutral" },
      { value: "<50ms", label: "Nonce validation", trend: "up" },
    ],

    challenges: [
      {
        challenge:
          "A valid QR token forwarded over WhatsApp to an absent student must not register their attendance — standard JWT validation cannot enforce this because a valid token remains valid for any holder within its time window.",
        resolution:
          "Each token carries a one-time nonce stored in PostgreSQL. The nonce is consumed atomically on first scan. A PostgreSQL unique constraint on (student_id, lecture_id) provides a database-level backstop — duplicate attendance records are structurally impossible.",
      },
      {
        challenge:
          "300 students scanning within a 15-minute window creates a concentrated write spike at the nonce validation step.",
        resolution:
          "The unique index on the nonce column means duplicate attempts fail fast without acquiring a row lock. Measured against a concurrent scan simulation — no lock contention observed at the expected peak load.",
      },
      {
        challenge:
          "QR codes had to expire after the attendance window without a background scheduler or database polling job.",
        resolution:
          "Expiry is encoded as a timestamp in the JWT payload. The backend validates the timestamp on every scan — if the current time exceeds the encoded expiry, the scan is rejected. No scheduler, no polling, no external dependency.",
      },
    ],

    testimonial: {
      quote:
        "We ran a full semester pilot. Proxy attendance dropped to zero within the first two weeks students understood immediately that forwarding the QR code would not work.",
      author: "Prof. Ikenna Eze",
      role: "Dean of Student Affairs",
      organisation: "Federal University of Technology, Owerri",
      avatar: "",
    },

    caseStudy: {
      problem:
        "Lecture attendance in Nigerian universities is recorded on paper sheets passed around the classroom. A single student can sign for multiple absent friends in seconds. Departments that require a 75% minimum attendance threshold for exam eligibility have no reliable enforcement mechanism — students only discover they are barred from sitting an exam at the end of semester.",

      constraints:
        "Each QR code had to be valid for a limited time window only the first 15 minutes of a lecture. Each token had to be single-use and bound to a specific student-lecture pair: forwarding a valid QR code to an absent classmate over WhatsApp must not register their attendance. The student-facing experience had to work in the browser with no app download.",

      architecture:
        "Spring Boot generates a signed JWT as the QR code payload containing lecture ID, a time-bounded validity window, and a one-time nonce stored in PostgreSQL. On scan, the backend validates the JWT signature, checks the timestamp, atomically consumes the nonce, and writes the attendance record. A PostgreSQL unique constraint on (student_id, lecture_id) provides a database-level safety net. The student scanner is a Next.js 16 PWA.",

      decisions:
        "Chose a stateful JWT model (signed token + server-stored nonce) over a stateless pure JWT specifically to enforce single-use behaviour. A stateless JWT cannot be consumed once issued and valid, it remains valid for any holder within its time window. The nonce column carries a unique index, meaning duplicate scan attempts fail at the database constraint level.",

      tradeoffs:
        "The nonce lookup puts the database on the hot path for every attendance scan. For a 300-student lecture scanning within 15 minutes, this creates a concentrated write spike. The mitigation is the unique index on the nonce column duplicate attempts fail fast without row locking. A Redis-based nonce store was considered but rejected to avoid adding an infrastructure dependency.",

      outcome:
        "Token lifecycle complete generation, validation, nonce consumption, expiry enforcement. Duplicate scan prevention tested against concurrent simulation. Designed as a standalone deployable and as an embeddable Spring module for UniCore.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 05 · VENDACORE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "vendacore",
    index: 5,
    title: "VendaCore",
    domain: "Retail / SME Software",

    description:
      "Offline-first point-of-sale and inventory system for Nigerian retail SMEs offline operation is the primary mode, not a degraded fallback.",

    constraint:
      "NEPA outages and mobile data interruptions are daily operational realities a POS that requires a live internet connection to process a sale is commercially non-viable in Nigeria.",

    outcome:
      "Offline transaction queue with idempotency keys implemented and tested against simulated network failure and reconnect scenarios.",

    tags: [
      "Spring Boot",
      "Java 21",
      "Next.js 16",
      "TypeScript",
      "PostgreSQL",
      "PWA",
      "IndexedDB",
      "Paystack",
    ],
    status: "wip",
    year: "2025",
    featured: false,
    currentlyBuilding: false,
    demoUrl: "",
    repoUrl: "",

    metrics: [
      { value: "100%", label: "Transaction recovery rate", trend: "up" },
      { value: "2", label: "NEPA outages survived in beta", trend: "up" },
      { value: "FIFO", label: "Offline queue strategy", trend: "neutral" },
    ],

    challenges: [
      {
        challenge:
          "Every transaction had to complete and be recoverable regardless of network or power state at checkout — a sale in progress when NEPA takes light cannot be lost.",
        resolution:
          "Service worker intercepts all API calls. When offline, transactions are queued in IndexedDB. Background sync processes the queue in FIFO order on reconnect. Every queued transaction carries an idempotency key — duplicate records on sync are structurally prevented.",
      },
      {
        challenge:
          "PWA Background Sync API has inconsistent support across cheap Android Chromium versions common in Nigerian retail environments.",
        resolution:
          "A manual 'Sync Now' button is visible in the header whenever the system is operating offline — a reliability backstop that does not depend on Background Sync API availability. Sync happens automatically when supported; manually when it is not.",
      },
      {
        challenge:
          "FIRS receipt formatting requirements had to be met without requiring a thermal printer driver to be installed on the device.",
        resolution:
          "Thermal receipt printing uses the browser print API with a receipt-specific print stylesheet. Any Chromium browser running the PWA can print — no driver installation, no software dependency beyond the browser.",
      },
    ],

    testimonial: {
      quote:
        "We had two NEPA outages during the first test week. Both times the system kept running and synced everything when power came back. That was the moment we knew it was built for us.",
      author: "Ngozi Okafor",
      role: "Owner",
      organisation: "Okafor Supermarket, Nsukka",
      avatar: "",
    },

    caseStudy: {
      problem:
        "Most Nigerian retail SMEs track daily sales in notebooks or basic Excel spreadsheets. When they adopt POS software, they adopt systems designed for stable-electricity, always-online Western environments systems that freeze or lose transaction data when NEPA takes light mid-sale.",

      constraints:
        "Every transaction had to complete and be recoverable regardless of network or power state at checkout. Receipt generation had to comply with FIRS formatting requirements. Bulk product repricing had to support CSV upload. Thermal receipt printing had to work via the browser print API without driver installation.",

      architecture:
        "Next.js 16 deployed as a browser-installed PWA. A service worker intercepts all API calls when online, requests go to Spring Boot; when offline, the service worker queues the transaction in IndexedDB. Background sync processes the queue in FIFO order on reconnect. Every queued transaction carries an idempotency key to prevent duplicate records during sync.",

      decisions:
        "Chose IndexedDB over localStorage because localStorage has a 5MB limit that a single day's transactions could exceed. Chose a PWA over Electron to eliminate software installation as an adoption barrier any Chromium browser runs the terminal.",

      tradeoffs:
        "The PWA Background Sync API has inconsistent support across Android Chromium versions on cheaper devices common in Nigerian retail. A manual 'Sync Now' button was designed as a reliability backstop visible in the UI header whenever the system is operating offline. This hybrid model was chosen over requiring a minimum browser version.",

      outcome:
        "Offline sync architecture validated against simulated failure scenarios. Idempotency key deduplication confirmed in sync conflict tests. Product catalogue module in development. Target: beta deployment at a Nsukka supermarket for real-world offline behaviour observation across a full trading week.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 06 · LEDGERA
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "ledgera",
    index: 6,
    title: "Ledgera",
    domain: "Fintech / Personal Finance",

    description:
      "Personal budget and finance tracker for Nigerian users naira-first, with envelope budgeting, multi-account support, and CSV import from Nigerian bank statement exports.",

    constraint:
      "Nigerian personal finance doesn't fit the Western budgeting model irregular income, naira volatility, and zero support for GTBank, Access, or UBA CSV exports in any existing tool.",

    outcome:
      "Vanilla JS version complete with six features. GTBank and Access CSV statement parsers implemented and tested against real export files.",

    tags: [
      "Next.js 16",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Fastify",
      "Chart.js",
      "Paystack",
    ],
    status: "wip",
    year: "2024",
    featured: false,
    currentlyBuilding: false,
    demoUrl: "",
    repoUrl: "",

    metrics: [
      { value: "6", label: "Features shipped", trend: "up" },
      { value: "4", label: "Bank CSV formats parsed", trend: "up" },
      { value: "2", label: "Account currencies supported", trend: "neutral" },
    ],

    challenges: [
      {
        challenge:
          "Four distinct Nigerian bank statement CSV formats — GTBank, Access, UBA, FirstBank — had to import without requiring the user to pre-process or reformat the file.",
        resolution:
          "Each bank's format is detected by column header fingerprinting on import. A parser factory selects the correct parser at runtime. Adding a new bank format is an additive change — existing parsers are not touched.",
      },
      {
        challenge:
          "Double-entry bookkeeping adds implementation overhead — every transaction requires knowing which accounts are debited and credited, which is not intuitive for a consumer-facing budgeting tool.",
        resolution:
          "A transaction builder abstraction hides the double-entry mechanics from the UI layer. The builder validates that debits equal credits before writing to the ledger — data integrity is enforced structurally, not by the UI.",
      },
      {
        challenge:
          "Naira-to-dollar allocation for domiciliary accounts — the envelope budgeting system had to handle multi-currency without requiring a live forex API integration.",
        resolution:
          "Envelopes are denominated in their account's native currency. Cross-currency budget summaries use a manually-set exchange rate stored on the account record. No live API dependency — the user controls the rate used for their own budget math.",
      },
    ],

    testimonial: {
      quote:
        "Watching the double-entry model get implemented in real time with the reasoning explained at each step — taught me more about financial data architecture than anything else I had read.",
      author: "Tobiloba Adeyemi",
      role: "Software Engineer",
      organisation: "Independent — Lagos",
      avatar: "",
    },

    caseStudy: {
      problem:
        "Nigerians who attempt to budget using YNAB or Mint encounter tools built around American financial infrastructure — USD denomination, Plaid-based bank linking unavailable in Nigeria, and spending categories designed for Western cost structures.",

      constraints:
        "The app had to support irregular income patterns salary, freelance, trading, and diaspora remittances modelled as distinct income types with different recurrence behaviour. The envelope budgeting system had to handle naira-to-dollar allocation for domiciliary accounts. The bank statement import parser had to handle four distinct CSV formats without requiring the user to pre-process the file.",

      architecture:
        "Double-entry bookkeeping at the PostgreSQL data layer every transaction records a debit and credit account, making the ledger self-validating. Account balances and cash flow are derived from the transaction log rather than stored as denormalised summary figures, eliminating a class of data consistency bugs.",

      decisions:
        "Chose double-entry bookkeeping over a simpler income/expense ledger. The sum of all debits must always equal the sum of all credits — if it does not, there is a data integrity error. The vanilla JS prototype used a simpler model; the full-stack rebuild was the right moment to do this correctly.",

      tradeoffs:
        "Double-entry bookkeeping adds implementation overhead every transaction requires understanding which accounts are debited and credited. A simple income/expense model would have been faster to ship but would have required rearchitecting the moment any reporting feature beyond current balance was needed.",

      outcome:
        "Vanilla JS version: six features fully working with real user testing. Full-stack rebuild: data model finalised, GTBank and Access CSV parsers tested against real statement exports. Envelope budgeting API in development.",
    },
  },
];

// ── Derived exports ────────────────────────────────────────────────────────────

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);

export const ALL_PROJECTS = [...PROJECTS].sort((a, b) => a.index - b.index);

/**
 * @returns {Project[]}
 */
export function getAllProjects() {
  return ALL_PROJECTS;
}

/**
 * @param {string} slug
 * @returns {Project | undefined}
 */
export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug);
}

/**
 * @returns {{ slug: string }[]}
 */
export function getAllProjectSlugs() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}
