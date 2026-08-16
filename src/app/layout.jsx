import { cn } from "@/lib/utils";
import Script from "next/script";

import "@/styles/global.css";

import { Providers } from "./providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ChatWidget } from "@/features/chat";
import { CommandPalette } from "@/features/command-palette/CommandPalette";
import { siteConfig } from "@/lib/config/site";

// ─── Theme flash prevention ────────────────────────────────────────────────────
//
// Runs synchronously before the browser paints. Reads localStorage and applies
// data-theme="light" to <html> if the user's stored preference is light.
// Without this, dark-default users who switched to light would see a flash
// of the dark theme on every page load.
//
// This script must remain inline and blocking — do not move to an external file
// or defer it. Any async execution allows a paint cycle to occur first.
//
// Covered scenarios:
//   stored = "light"  → light theme applied
//   stored = "dark"   → no attribute set (default is dark via :root)
//   stored = null     → system preference checked; light applied if matched
//   localStorage unavailable (private browsing) → silently falls back to dark

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var preferred = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    if (preferred === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();
`;

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: `${siteConfig.name} Portfolio`,

  title: {
    default: `${siteConfig.name} | ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  keywords: [
    "Alex Shedrach",
    "Software Engineer",
    "Senior Developer",
    "Full Stack Engineer",
    "AI Engineer",
    "System Architecture",
    "Next.js Developer",
    "Backend Engineer",
    "Platform Engineering",
  ],

  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "Alex Shedrach — Senior Software Engineer",
    description:
      "Engineering scalable systems, AI platforms, and modern web architectures.",
    url: siteConfig.url,
    siteName: `${siteConfig.name} Portfolio`,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alex Shedrach — Senior Software Engineer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Alex Shedrach — Senior Software Engineer",
    description:
      "Engineering scalable systems, AI platforms, and modern web architectures.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// ─── Root Layout ───────────────────────────────────────────────────────────────

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col antialiased"
      >
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />

        <a
          href="#main-content"
          className={cn(
            "sr-only focus:not-sr-only",
            "focus:fixed focus:top-4 focus:left-4 focus:z-50",
            "bg-(--color-surface) text-(--color-fg)",
            "border border-(--color-border)",
            "px-4 py-2 rounded-md shadow-(--shadow-md)",
          )}
          style={{ fontSize: "var(--text-sm)" }}
        >
          Skip to content
        </a>

        <Providers>
          <SiteHeader />

          <main id="main-content" className="relative z-1 flex-1">
            {children}
          </main>

          <SiteFooter />

          <ChatWidget />
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
