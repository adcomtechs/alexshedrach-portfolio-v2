// features/home/HeroSection/HeroCTA.jsx
// RSC — no client directive required.
//
// Button composition only. No state, no event handlers that require client JS.
// The Button component handles its own click semantics via href rendering as <a>.
//
// Icon is passed via the `rightIcon` prop — not as raw children — which is the
// correct API usage per the Button component's prop contract.

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * HeroCTA
 *
 * Primary and secondary call-to-action for the hero section.
 *
 * Primary → /projects (glow variant, directional arrow)
 * Secondary → /about  (secondary variant, philosophy signal)
 *
 * Entrance: hero-animate at 200ms delay — after headline and description.
 */
export function HeroCTA() {
  return (
    <div
      className="flex flex-wrap items-center gap-3 justify-center lg:justify-start hero-animate"
      style={{ animationDelay: "200ms" }}
    >
      <Button
        href="/projects"
        variant="glow"
        size="lg"
        pill
        rightIcon={<ArrowRight />}
      >
        View my work
      </Button>

      <Button href="/about" variant="secondary" size="lg" pill>
        Engineering philosophy
      </Button>
    </div>
  );
}
