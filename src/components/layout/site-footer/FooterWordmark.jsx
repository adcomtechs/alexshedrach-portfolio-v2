export { Wordmark as FooterWordmark } from "@/components/ui/Wordmark";

// // components/layout/site-footer/FooterWordmark.jsx
// // RSC — no client directive required

// import Link from "next/link";
// import { cn } from "@/lib/utils";

// /**
//  * FooterWordmark
//  *
//  * Brand mark for the footer column. Visually identical to the header
//  * Wordmark but kept as a separate component — footer and header have
//  * different layout contexts and may diverge independently.
//  */
// export function FooterWordmark() {
//   return (
//     <Link
//       href="/"
//       aria-label="Alex Shedrach — home"
//       className={cn(
//         "inline-flex items-center gap-2.5 group w-fit",
//         "focus-visible:outline-none focus-visible:ring-2",
//         "focus-visible:ring-[var(--color-accent)] rounded-sm",
//       )}
//     >
//       <span
//         aria-hidden="true"
//         className={cn(
//           "w-6 h-6 rounded-[5px] shrink-0",
//           "border border-[var(--color-border)] bg-[var(--color-surface-2)]",
//           "flex items-center justify-center",
//           "transition-[background,border-color] duration-200",
//           "group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent-bg)]",
//         )}
//       >
//         <span
//           className="w-2 h-2 rounded-sm"
//           style={{ background: "var(--color-accent)" }}
//         />
//       </span>
//       <span
//         className="font-semibold"
//         style={{
//           fontFamily: "var(--font-display)",
//           fontSize: "var(--text-sm)",
//           letterSpacing: "-0.02em",
//           color: "var(--color-fg)",
//         }}
//       >
//         Alex <span style={{ color: "var(--color-accent)" }}>Shedrach</span>
//       </span>
//     </Link>
//   );
// }
