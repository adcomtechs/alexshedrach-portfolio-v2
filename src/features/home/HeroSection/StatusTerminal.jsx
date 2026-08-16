// features/home/HeroSection/StatusTerminal.jsx
"use client";
//
// Refinements applied:
//
//   1. `visible` + `mounted` → single `mounted` state.
//      Both were set in one useEffect synchronously. They were always equal.
//      Collapsed to `mounted`: false on server, true after first effect.
//      The entrance transition reads from `mounted` directly.
//
//   2. `onMouseEnter` / `onMouseLeave` inline DOM mutation removed.
//      Style mutations bypass React's reconciler and leave stale inline values
//      if the component unmounts during hover. Replaced with CSS transition
//      + `group` / `group-hover` class pattern.
//
//   3. `transition-all` → `transition-[opacity,transform]`.
//      `transition-all` recalculates layout on every frame for every property.
//      The card only animates opacity and translateY — scoped transition only.
//
//   4. `ACTIVITY_TYPE_CONFIG` lookup map introduced.
//      The icon/color ternary chain was duplicated across icon and background
//      rendering. A config object is the correct pattern — see STATUS_CONFIG
//      in ProjectCard.jsx for the same approach.
//
//   5. `GitPullRequest` replaces the commented-out GitHub icon for PR items.
//      An empty icon slot (colored box, no icon) is a visible UI defect.
//
//   6. GitHub URL extracted to a named constant. One change point.

import { cn } from "@/lib/utils";
import {
  MapPin,
  CheckCircle2,
  Wifi,
  ExternalLink,
  Code2,
  Clock,
  Terminal,
  GitPullRequest,
} from "lucide-react";
import { useSyncExternalStore } from "react";
import { Text } from "@/components/ui/Text";

// ── Constants ──────────────────────────────────────────────────────────────────

const GITHUB_URL = "https://github.com/alexshedrach";

const formatTime = () =>
  new Date().toLocaleTimeString("en-GB", { hour12: false });

const SERVER_CLOCK = "--:--:--";

function subscribeClock(onStoreChange) {
  const interval = setInterval(onStoreChange, 1000);
  return () => clearInterval(interval);
}

// ── Activity type config ───────────────────────────────────────────────────────
//
// Single source of truth for icon, background, and color per activity type.
// Eliminates the duplicated ternary chains that were spread across JSX.
// Adding a new type means adding one entry here — no JSX edits required.

const ACTIVITY_TYPE_CONFIG = {
  commit: {
    Icon: Code2,
    bg: "var(--color-accent-bg)",
    color: "var(--color-accent)",
    label: "Commit",
  },
  deploy: {
    Icon: CheckCircle2,
    bg: "rgba(96,165,250,0.08)",
    color: "var(--color-info)",
    label: "Deploy",
  },
  pr: {
    Icon: GitPullRequest,
    bg: "rgba(245,158,11,0.08)",
    color: "var(--color-warning)",
    label: "Pull request",
  },
};

// Fallback config for unknown types — prevents empty icon slots
const ACTIVITY_TYPE_FALLBACK = {
  Icon: Code2,
  bg: "var(--color-surface-2)",
  color: "var(--color-faint)",
  label: "Activity",
};

// ── Data ──────────────────────────────────────────────────────────────────────
//
// Static activity feed. If this is ever connected to a live GitHub API,
// the data shape here is the contract the API response must conform to.
// Replace this array with an API call in a parent RSC and pass as a prop.

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

// ── Sub-components ─────────────────────────────────────────────────────────────

/**
 * TerminalTitlebar
 *
 * macOS-style traffic lights + filename + live clock.
 * Clock renders "--:--:--" on server, real time on client after mount.
 */
function TerminalTitlebar({ clock, mounted }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-sub)] bg-[var(--color-surface-2)]">
      {/* Traffic lights — decorative only */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>

      {/* Filename */}
      <div className="flex items-center gap-1.5">
        <Terminal
          size={11}
          className="text-[var(--color-faint)]"
          aria-hidden="true"
        />
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            color: "var(--color-faint)",
            fontFamily: "var(--font-mono)",
          }}
        >
          activity.log
        </span>
      </div>

      {/* Live clock */}
      <div
        className="flex items-center gap-1.5"
        aria-label={mounted ? `Current time: ${clock}` : "Current time"}
        style={{
          fontSize: "11px",
          color: "var(--color-faint)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <Clock size={10} aria-hidden="true" />
        <span aria-live="off">{mounted ? clock : "--:--:--"}</span>
      </div>
    </div>
  );
}

/**
 * SystemStatusLine
 *
 * Online status + timezone + location. All static — no state required.
 */
function SystemStatusLine() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--color-border-sub)]">
      <Wifi
        size={11}
        className="text-[var(--color-success)] shrink-0"
        aria-hidden="true"
      />
      <span
        style={{
          fontSize: "11px",
          color: "var(--color-faint)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <span style={{ color: "var(--color-success)" }}>●</span>
        {" sys online · "}
        <span style={{ color: "var(--color-accent)" }}>WAT UTC+1</span>
        {" · "}
        <MapPin size={9} className="inline mb-px" aria-hidden="true" />
        {" Benin City, NG"}
      </span>
    </div>
  );
}

/**
 * ActivityItem
 *
 * A single row in the activity log. Icon is determined by the type config map.
 */
function ActivityItem({ item }) {
  const config = ACTIVITY_TYPE_CONFIG[item.type] ?? ACTIVITY_TYPE_FALLBACK;
  const { Icon, bg, color, label } = config;

  return (
    <li className="flex items-start gap-3 px-4 py-3 transition-colors duration-150 hover:bg-[var(--color-surface-2)]">
      {/* Type icon */}
      <span
        aria-label={label}
        className="mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center"
        style={{ background: bg, color }}
      >
        <Icon size={10} aria-hidden="true" />
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Commit message / deploy title */}
        <p
          className="truncate"
          style={{
            fontSize: "12px",
            color: "var(--color-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {item.text}
        </p>

        {/* Repo + relative time */}
        <p
          className="mt-0.5"
          style={{ fontSize: "11px", color: "var(--color-faint)" }}
        >
          <span style={{ color: "var(--color-accent)", opacity: 0.7 }}>
            {item.repo}
          </span>
          {" · "}
          {item.time}
        </p>
      </div>
    </li>
  );
}

/**
 * TerminalFooter
 *
 * GitHub link. Hover handled via CSS transition — no inline event handlers.
 * `group` + `group-hover` applies the accent color on hover without JS.
 */
function TerminalFooter() {
  return (
    <div className="px-4 py-3 border-t border-[var(--color-border-sub)] bg-[var(--color-surface-2)]">
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-1.5 transition-colors duration-150"
        style={{ fontSize: "11px", fontFamily: "var(--font-mono)" }}
        aria-label="View full GitHub activity (opens in new tab)"
      >
        <span className="text-[var(--color-faint)] group-hover:text-[var(--color-accent)] transition-colors duration-150">
          View full GitHub activity
        </span>
        <ExternalLink
          size={9}
          aria-hidden="true"
          className="text-[var(--color-faint)] group-hover:text-[var(--color-accent)] transition-colors duration-150 shrink-0"
        />
      </a>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

/**
 * StatusTerminal
 *
 * Developer activity feed card — right-column visual anchor in the HeroSection.
 *
 * Entrance: opacity-0 + translate-y-4 → opacity-100 + translate-y-0 on mount.
 * Transition is scoped to opacity and transform only — not transition-all.
 *
 * Props:
 *   activity — override the default ACTIVITY array (e.g., from a server-fetched feed)
 *
 * When GitHub API integration is added, fetch activity in a parent RSC and
 * pass it as the `activity` prop. This component stays a client component
 * only for the live clock — not for data fetching.
 */
export function StatusTerminal({ activity = ACTIVITY }) {
  const clock = useSyncExternalStore(subscribeClock, formatTime, () => SERVER_CLOCK);
  const mounted = clock !== SERVER_CLOCK;

  return (
    <div
      aria-label="Developer activity feed"
      className={cn(
        "relative flex flex-col h-full rounded-xl overflow-hidden",
        "border border-[var(--color-border-sub)]",
        "bg-[var(--color-surface)]",
        "shadow-[var(--shadow-lg)]",
        "animate-slide-up",
      )}
    >
      <TerminalTitlebar clock={clock} mounted={mounted} />
      <SystemStatusLine />

      {/* Activity log */}
      <ul
        className="flex flex-col divide-y divide-[var(--color-border-sub)] flex-1"
        role="list"
        aria-label="Recent activity"
      >
        {activity.map((item, i) => (
          // Index key is acceptable here — activity is static; items are never reordered
          <ActivityItem key={i} item={item} />
        ))}
      </ul>

      <TerminalFooter />

      {/* Decorative accent glow — top-right corner of the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 w-36 h-36 rounded-full blur-2xl"
        style={{ background: "var(--color-accent)", opacity: 0.07 }}
      />
    </div>
  );
}

export default StatusTerminal;
