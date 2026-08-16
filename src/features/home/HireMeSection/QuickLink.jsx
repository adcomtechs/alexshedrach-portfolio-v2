import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import React, { memo } from "react";

const QuickLink = memo(function QuickLink({
  href,
  label,
  icon: Icon,
  external,
}) {
  const props = external
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <a
      {...props}
      className={cn(
        "group flex items-center gap-2.5",
        "px-3.5 py-2.5 rounded-lg border",
        "transition-[background,border-color,color] duration-150",
        "border-(--color-border-sub) bg-(--color-surface)",
        "hover:border-[rgba(181,242,61,0.3)] hover:bg-(--color-accent-bg)",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
      )}
    >
      <span
        className="flex items-center justify-center w-7 h-7 rounded-md shrink-0 transition-[background] duration-150"
        style={{
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          color: "var(--color-muted)",
        }}
      >
        <Icon size={13} aria-hidden="true" />
      </span>
      <span
        className="text-[12.5px] font-medium transition-colors duration-150 truncate"
        style={{ color: "var(--color-muted)" }}
      >
        {label}
      </span>
      <ArrowUpRight
        size={11}
        aria-hidden="true"
        className="ml-auto shrink-0 opacity-0 group-hover:opacity-60 transition-opacity duration-150"
        style={{ color: "var(--color-accent)" }}
      />
    </a>
  );
});

export default QuickLink;
