// components/layout/site-header/index.jsx
// RSC — no client directive. See HeaderChrome.jsx for the scroll boundary.

import { Container } from "@/components/layout/Container";
import { HeaderChrome } from "./HeaderChrome";
import { Wordmark } from "@/components/ui/Wordmark";
import { DesktopNav } from "./DesktopNav";
import { CommandTrigger } from "./CommandTrigger";
import { ThemeToggle } from "./ThemeToggle";
import { StatusBadge } from "./StatusBadge";
import { HireCTA } from "./HireCTA";
import { MobileNav } from "./MobileNav";

/**
 * SiteHeader
 *
 * Pure orchestration — structure only, zero client-side state. Every
 * interactive sub-component owns its own boundary:
 *   HeaderChrome    → scroll subscription (client)
 *   DesktopNav      → usePathname + hover indicator (client)
 *   MobileNav       → usePathname + open/close (client)
 *   CommandTrigger  → click → ⌘K dispatch (client, owns its own handler)
 *   ThemeToggle     → localStorage read/write (client)
 *   StatusBadge     → static or data-driven, per its own implementation
 *
 * Structure:
 *   [Wordmark] [DesktopNav] [CommandTrigger | ThemeToggle | StatusBadge | HireCTA | MobileNav]
 */
export function SiteHeader() {
  return (
    <HeaderChrome>
      <Container size="full">
        <div className="flex h-16 items-center justify-between gap-3 md:h-14 md:gap-4">
          <Wordmark />

          <DesktopNav />

          <div className="flex items-center gap-2">
            <CommandTrigger />
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <StatusBadge />
            <HireCTA />
            <MobileNav />
          </div>
        </div>
      </Container>
    </HeaderChrome>
  );
}

export default SiteHeader;
