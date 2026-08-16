// app/contact/page.jsx
// RSC — no client directive required. All client boundaries are scoped
// inside ContactForm.
//
// Page structure:
//   1. ContactHero    — identity + availability + reply commitment
//   2. Form grid      — ContactForm (left) + LookingFor sidebar (right, sticky)
//   3. QuickReach     — standalone full-width section, owns its own Section/Container

import { ContactHero, ContactFormGrid, QuickReach } from "@/features/contact";

export const metadata = {
  title: "Contact",
  description:
    "Open to product licensing, custom software development, consulting, and content collaboration. Get in touch.",
};

export default function ContactPage() {
  return (
    <>
      {/* 1. Hero */}
      <ContactHero />

      {/* 2. Form + sidebar */}
      <ContactFormGrid />

      {/* 3. QuickReach — standalone section, owns its Section + Container */}
      <QuickReach />
    </>
  );
}
