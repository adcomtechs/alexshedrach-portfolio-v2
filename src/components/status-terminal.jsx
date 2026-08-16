"use client";

import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Wifi } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { Code2 } from "lucide-react";
import { Clock } from "lucide-react";
import { Terminal } from "lucide-react";
import { useSyncExternalStore } from "react";

const formatTime = () =>
  new Date().toLocaleTimeString("en-GB", {
    hour12: false,
  });

const SERVER_CLOCK = "--:--:--";

function subscribeClock(onStoreChange) {
  const interval = setInterval(onStoreChange, 1000);
  return () => clearInterval(interval);
}

// Latest activity feed shown in the status terminal card
// Replace with real project data / GitHub API data if desired
const ACTIVITY = [
  {
    type: "commit",
    text: "feat: gateway category stitching",
    time: "2m ago",
    repo: "AiAcadeVault",
  },
  {
    type: "deploy",
    text: "Deployed to production (Vercel)",
    time: "1h ago",
    repo: "portfolio-v2",
  },
  {
    type: "pr",
    text: "fix: material edit allowlist",
    time: "3h ago",
    repo: "AiAcadeVault",
  },
  {
    type: "commit",
    text: "docs: add API gateway README",
    time: "6h ago",
    repo: "AiAcadeVault",
  },
];

/** Floating "Status Terminal" card — the right-column visual anchor */
export default function StatusTerminal() {
  const clock = useSyncExternalStore(subscribeClock, formatTime, () => SERVER_CLOCK);
  const mounted = clock !== SERVER_CLOCK;

  return (
    <div
      aria-label="Developer activity feed"
      className={cn(
        "relative flex flex-col rounded-xl overflow-hidden",
        "border border-[var(--color-border-sub)]",
        "bg-[var(--color-surface)]",
        "shadow-[var(--shadow-lg)]",
        "animate-slide-up",
      )}
    >
      {/* Terminal titlebar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-sub)] bg-[var(--color-surface-2)]">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>

        <div className="flex items-center gap-1.5">
          <Terminal
            size={11}
            className="text-[var(--color-faint)]"
            aria-hidden="true"
          />
          <span
            className="text-[11px] font-medium"
            style={{
              color: "var(--color-faint)",
              fontFamily: "var(--font-mono)",
            }}
          >
            activity.log
          </span>
        </div>

        {/* Live clock */}
        <div
          className="flex items-center gap-1.5 text-[11px]"
          style={{
            color: "var(--color-faint)",
            fontFamily: "var(--font-mono)",
          }}
          aria-label={mounted ? `Current time: ${clock}` : "Current time"}
        >
          <Clock size={10} aria-hidden="true" />
          {mounted ? clock : SERVER_CLOCK}
        </div>
      </div>

      {/* System status line */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--color-border-sub)]">
        <Wifi
          size={11}
          className="text-[var(--color-success)]"
          aria-hidden="true"
        />
        <span
          className="text-[11px]"
          style={{
            color: "var(--color-faint)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span style={{ color: "var(--color-success)" }}>●</span> sys online ·{" "}
          <span style={{ color: "var(--color-accent)" }}>WAT UTC+1</span> ·{" "}
          <MapPin
            size={9}
            className="inline"
            aria-hidden="true"
            style={{ color: "var(--color-faint)" }}
          />{" "}
          Benin City, NG
        </span>
      </div>

      {/* Activity log */}
      <ul
        className="flex flex-col divide-y divide-[var(--color-border-sub)]"
        role="list"
      >
        {ACTIVITY.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 px-4 py-3 transition-colors duration-100 hover:bg-[var(--color-surface-2)]"
          >
            {/* Type icon */}
            <span
              aria-hidden="true"
              className="mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center"
              style={{
                background:
                  item.type === "commit"
                    ? "var(--color-accent-bg)"
                    : item.type === "deploy"
                      ? "rgba(96,165,250,0.08)"
                      : "rgba(245,158,11,0.08)",
                color:
                  item.type === "commit"
                    ? "var(--color-accent)"
                    : item.type === "deploy"
                      ? "var(--color-info)"
                      : "var(--color-warning)",
              }}
            >
              {item.type === "commit" && <Code2 size={10} />}
              {item.type === "deploy" && <CheckCircle2 size={10} />}
              {/* {item.type === "pr" && <Github size={10} />} */}
            </span>

            <div className="flex-1 min-w-0">
              <p
                className="text-[12px] truncate"
                style={{
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {item.text}
              </p>
              <p
                className="text-[11px] mt-0.5"
                style={{ color: "var(--color-faint)" }}
              >
                <span style={{ color: "var(--color-accent)", opacity: 0.7 }}>
                  {item.repo}
                </span>
                {" · "}
                {item.time}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer CTA */}
      <div className="px-4 py-3 border-t border-[var(--color-border-sub)] bg-[var(--color-surface-2)]">
        <a
          href="https://github.com/alexshedrach"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-[11px] transition-colors duration-150"
          style={{
            color: "var(--color-faint)",
            fontFamily: "var(--font-mono)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-faint)")
          }
        >
          {/* <Github size={11} aria-hidden="true" /> */}
          View full GitHub activity
          <ExternalLink size={9} aria-hidden="true" />
        </a>
      </div>

      {/* Decorative accent glow at top-right corner of card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 w-36 h-36 rounded-full opacity-[0.07] blur-2xl"
        style={{ background: "var(--color-accent)" }}
      />
    </div>
  );
}
