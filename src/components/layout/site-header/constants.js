// components/layout/site-header/constants.js

/**
 * NAV_LINKS
 *
 * Single source of truth for primary navigation.
 * Both DesktopNav and MobileNav consume this — update here only.
 *
 * "Blog" is listed as a future route per ROADMAP.md Phase 9.
 * Remove or point at /resources when that route is live.
 */
export const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Lab", href: "/lab" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];