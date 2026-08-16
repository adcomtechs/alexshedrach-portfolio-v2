// features/contact/LookingFor.jsx
// RSC — no client directive required.
//
// Elevated redesign — key changes over previous version:
//   — Flat icon rows → numbered entry cards with hover state
//   — Vertical connector thread between entries
//   — Index numbers signal curation over enumeration
//   — Accent left-edge flash on card hover — CSS only, no client boundary
//   — NOT_OPEN_TO reframed as a sealed restriction block with cross-hatch texture
//   — Decorative lead-in dash on the section label

import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";
import { LOOKING_FOR, NOT_OPEN_TO } from "./contact-data";

// ─── Entry card ───────────────────────────────────────────────────────────────

function EntryCard({ icon: Icon, label, sub, index, isLast }) {
  const displayIndex = String(index + 1).padStart(2, "0");

  return (
    <li className="relative group">
      {/* Connector thread — links cards, absent on last entry */}
      {!isLast && (
        <div
          aria-hidden="true"
          className="absolute left-[23px] w-px pointer-events-none"
          style={{
            top: "56px",
            bottom: "-12px",
            background:
              "linear-gradient(to bottom, rgba(181,242,61,0.2), transparent)",
          }}
        />
      )}

      {/* Card shell */}
      <div
        className="relative flex items-start gap-4 p-4 rounded-xl overflow-hidden"
        style={{
          border: "1px solid var(--color-border-sub)",
          background: "var(--color-surface)",
          transition: "border-color 200ms ease, box-shadow 200ms ease",
        }}
      >
        {/* Hover gradient wash — rendered via group-hover on parent li */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background:
              "linear-gradient(125deg, rgba(181,242,61,0.04) 0%, transparent 55%)",
            transition: "opacity 200ms ease",
          }}
        />

        {/* Accent left-edge flash */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full opacity-0 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-accent), rgba(181,242,61,0.3))",
            transition: "opacity 200ms ease",
          }}
        />

        {/* Left column — index badge + icon */}
        <div className="relative shrink-0 flex flex-col items-center gap-2 pt-px">
          {/* Index number */}
          <span
            aria-hidden="true"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              color: "var(--color-accent)",
              opacity: 0.65,
              lineHeight: 1,
            }}
          >
            {displayIndex}
          </span>

          {/* Icon container */}
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              background: "var(--color-accent-bg)",
              border: "1px solid rgba(181,242,61,0.2)",
            }}
          >
            <Icon
              size={14}
              aria-hidden="true"
              style={{ color: "var(--color-accent)" }}
              strokeWidth={1.75}
            />
          </div>
        </div>

        {/* Right column — label + supporting text */}
        <div className="relative flex flex-col gap-1 min-w-0 pt-px">
          <Heading as="p" size="5" balance={false}>
            {label}
          </Heading>
          <Text size="sm" color="faint">
            {sub}
          </Text>
        </div>
      </div>
    </li>
  );
}

// ─── Not open to block ────────────────────────────────────────────────────────
//
// Visual register is deliberately different from the entry cards —
// muted, textured, sealed. Signals a boundary without aggression.

function NotOpenTo({ text }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-4"
      style={{
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border-sub)",
      }}
    >
      {/* Cross-hatch texture — restriction signal, zero visual weight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            var(--color-border-sub) 0px,
            var(--color-border-sub) 1px,
            transparent 1px,
            transparent 10px
          )`,
          opacity: 0.5,
        }}
      />

      <div className="relative flex items-start gap-3">
        {/* Lock icon */}
        <div
          className="shrink-0 mt-0.5 w-6 h-6 rounded-md flex items-center justify-center"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
          aria-hidden="true"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--color-faint)" }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "var(--color-faint)",
            }}
          >
            Not open to
          </p>
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-faint)",
              lineHeight: "var(--leading-relaxed)",
            }}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── LookingFor ───────────────────────────────────────────────────────────────

export function LookingFor() {
  return (
    <div className="flex flex-col gap-4">
      {/* Section label with lead-in dash */}
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="w-4 h-px shrink-0"
          style={{ background: "var(--color-accent)", opacity: 0.55 }}
        />
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
          }}
        >
          Open to
        </p>
      </div>

      {/* Entry list */}
      <ul className="flex flex-col gap-3" role="list">
        {LOOKING_FOR.map(({ icon, label, sub }, index) => (
          <EntryCard
            key={index}
            icon={icon}
            label={label}
            sub={sub}
            index={index}
            isLast={index === LOOKING_FOR.length - 1}
          />
        ))}
      </ul>

      {/* Restriction block */}
      {NOT_OPEN_TO && <NotOpenTo text={NOT_OPEN_TO} />}
    </div>
  );
}

export default LookingFor;

// // features/contact/LookingFor/LookingFor.jsx
// // RSC — no client directive required.
// //
// // Renders the three LOOKING_FOR entries from contact-data.js.
// // Satisfies the spec requirement: "clear statement of what kind of work
// // or conversation is welcome."
// //
// // Sits in the right column on desktop (above QuickReach), above the form
// // on mobile — context before commitment.
// //
// // This is not a card grid. It is a structured signal list. Three entries,
// // each with an icon, a primary label, and a supporting line. No Card
// // wrapper — the visual weight lives in the icon and typography.

// import { Text } from "@/components/ui/Text";
// import { Heading } from "@/components/ui/Heading";
// import { LOOKING_FOR, NOT_OPEN_TO } from "./contact-data";

// export function LookingFor() {
//   return (
//     <div className="flex flex-col gap-6">
//       {/* Section label */}
//       <div>
//         <p
//           style={{
//             fontFamily: "var(--font-mono)",
//             fontSize: "var(--text-xs)",
//             letterSpacing: "0.09em",
//             textTransform: "uppercase",
//             color: "var(--color-accent)",
//           }}
//         >
//           Open to
//         </p>
//       </div>

//       {/* Entry list */}
//       <ul className="flex flex-col gap-5" role="list">
//         {LOOKING_FOR.map(({ icon: Icon, label, sub }, index) => (
//           <li key={index} className="flex items-start gap-4">
//             {/* Icon container */}
//             <div
//               className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg mt-0.5"
//               style={{
//                 background: "var(--color-accent-bg)",
//                 border: "1px solid rgba(181,242,61,0.2)",
//               }}
//               aria-hidden="true"
//             >
//               <Icon
//                 size={16}
//                 style={{ color: "var(--color-accent)" }}
//                 strokeWidth={1.75}
//               />
//             </div>

//             {/* Text */}
//             <div className="flex flex-col gap-0.5 min-w-0">
//               <Heading as="p" size="4" balance={false}>
//                 {label}
//               </Heading>
//               <Text size="sm" color="faint">
//                 {sub}
//               </Text>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {/* Not open to — a single statement, not a list.
//           Confidence signal: states constraints without defensiveness. */}
//       {NOT_OPEN_TO && (
//         <div
//           className="pt-5"
//           style={{ borderTop: "1px solid var(--color-border-sub)" }}
//         >
//           <p
//             style={{
//               fontSize: "var(--text-xs)",
//               color: "var(--color-faint)",
//               lineHeight: "var(--leading-snug)",
//             }}
//           >
//             <span
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 letterSpacing: "0.05em",
//                 textTransform: "uppercase",
//                 fontSize: "0.65rem",
//                 color: "var(--color-faint)",
//                 marginRight: "0.5rem",
//               }}
//             >
//               Not open to
//             </span>
//             {NOT_OPEN_TO}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default LookingFor;
