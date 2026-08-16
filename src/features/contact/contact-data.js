// features/contact/contact-data.js
//
// Single source of truth for all contact page content.
// Components import from here — no content lives inside components.

import { Building2, Code2, Video, Mail } from "lucide-react";

// ─── What work is welcome ─────────────────────────────────────────────────────
export const LOOKING_FOR = [
  {
    icon: Building2,
    label: "Product licensing for institutions",
    sub: "UniCore · AttendIQ · GradeForge · VendaCore schools, polytechnics, retail",
  },
  {
    icon: Code2,
    label: "Custom software development",
    sub: "Spring Boot + Next.js Nigerian businesses and funded startups",
  },
  {
    icon: Video,
    label: "Tutorial & content collaboration",
    sub: "YouTube sponsorships, course partnerships, technical writing deals",
  },
];

// ─── What work is not welcome ─────────────────────────────────────────────────
//
// A single plain statement — not a list.
// States constraints without defensiveness. Set to null to hide entirely.
//
export const NOT_OPEN_TO =
  "Unpaid spec work, offshore staffing requests, job board aggregators, or general cold outreach with no specific brief.";

// ─── Direct reach channels ────────────────────────────────────────────────────
//
// DIRECT_CHANNELS powers the elevated QuickReach section.
// Set phone or whatsapp to null to hide that channel entirely.
//
// whatsapp.message — pre-filled message text. Keep it short and professional.
// phone.display    — human-readable number shown in the UI.
// phone.href       — tel: link for native dialer integration.

export const DIRECT_CHANNELS = {
  whatsapp: {
    number: "+2348146870361", // ⚠ Replace with your real WhatsApp number
    display: "+234 814 687 0361",
    message:
      "Hi Alex, I came across your portfolio and I'd like to discuss a project.",
    availability: "Typically replies within 2 hours",
  },
  phone: {
    display: "+234 802 030 6156", // ⚠ Replace with your real number
    href: "tel:+2348020306156",
    availability: "Mon – Fri, 9am – 6pm WAT",
  },
  email: {
    label: "hello@adcomtechs.com",
    href: "mailto:hello@adcomtechs.com",
  },
  github: {
    label: "github.com/adcomtechs",
    href: "https://github.com/adcomtechs",
  },
};

// ─── Legacy QUICK_LINKS — kept for any existing consumers ─────────────────────
export const QUICK_LINKS = [
  {
    id: "email",
    label: "hello@adcomtechs.com",
    href: "mailto:hello@adcomtechs.com",
    icon: Mail,
    external: false,
  },
  {
    id: "github",
    label: "github.com/adcomtechs",
    href: "https://github.com/adcomtechs",
    icon: ({ size, ...props }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        {...props}
      >
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
    external: true,
  },
];

// ─── Subject options ──────────────────────────────────────────────────────────
export const SUBJECT_OPTIONS = [
  { value: "", label: "What is this about?" },
  {
    value: "product-licensing",
    label: "Product licensing — UniCore / AttendIQ / GradeForge / VendaCore",
  },
  { value: "custom-development", label: "Custom software development" },
  { value: "consulting", label: "Technical consulting" },
  {
    value: "collaboration",
    label: "YouTube / tutorial / content collaboration",
  },
  { value: "general", label: "General enquiry" },
];

// ─── Contact hero identity card ───────────────────────────────────────────────
//
// Populates ContactIdentity in the hero right column.
// photoUrl: set to "/images/alex.jpg" (or similar) once a headshot is ready.
//           Leave as null to render the initials fallback.
//
export const CONTACT_IDENTITY = {
  initials: "AS",
  name: "Alex Shedrach",
  role: "Full-stack software developer and consultant based in Nigeria",
  photoUrl: null,

  // One sentence. Concrete — not "passionate developer".
  positioning:
    "Building production software for Nigerian institutions and businesses. Spring Boot + Next.js, shipped with architectural discipline.",

  // Three proof points — real numbers, not adjectives.
  // Update these as the work grows.
  proofPoints: [
    {
      value: "4+",
      label: "Products in production across education and retail",
    },
    { value: "3+", label: "Years shipping full-stack systems" },
    { value: "100%", label: "Client projects delivered on scope" },
  ],

  // Short discipline labels — what the work actually covers.
  disciplines: ["Next.js", "Spring Boot", "System Design", "EdTech", "FinTech"],
};

// ─── Availability ─────────────────────────────────────────────────────────────
//
// Update `open` and `startDate` as availability changes.
// All other fields remain stable unless the working arrangement changes.
//
export const AVAILABILITY = {
  open: true,
  label: "Open for new work",
  types: ["Product Licensing", "Custom Builds", "Consulting"],
  responseTime: "Within 24 hours",
  timezone: "WAT · UTC+1 · Nsukka, NG",
  startDate: "Immediately",
};
