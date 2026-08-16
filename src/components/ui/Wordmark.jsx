// components/ui/Wordmark/Wordmark.jsx
// RSC — no client directive required.

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZE_CONFIG = {
  sm: {
    logoSize: 28,
    nameSize: "var(--text-sm)",
    gap: "gap-2",
  },
  md: {
    logoSize: 30,
    nameSize: "14px",
    gap: "gap-2.5",
  },
};

export function Wordmark({ size = "md", className }) {
  const config = SIZE_CONFIG[size] ?? SIZE_CONFIG.md;

  return (
    <Link
      href="/"
      aria-label="Alex Shedrach — home"
      className={cn(
        "inline-flex items-center shrink-0 group w-fit",
        config.gap,
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-(--color-accent)",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-(--color-bg)",
        "rounded-sm",
        className,
      )}
    >
      <Image
        src="/images/alex-logo.png"
        alt="Alex Shedrach logo mark"
        width={config.logoSize}
        height={config.logoSize}
        sizes={`${config.logoSize}px`}
        priority
        className={cn(
          "shrink-0",
          "transition-opacity duration-200",
          "group-hover:opacity-80",
        )}
        style={{ height: "auto" }}
      />

      <span
        className="font-semibold select-none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: config.nameSize,
          letterSpacing: "-0.02em",
          color: "var(--color-fg)",
        }}
      >
        Alex <span style={{ color: "var(--color-accent)" }}>Shedrach</span>
      </span>
    </Link>
  );
}