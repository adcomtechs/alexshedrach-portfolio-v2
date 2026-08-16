// app/about/page.jsx
// RSC — no client directive. All About sections are RSC.
//
// Thin composition shell. No styling logic. No raw Tailwind.
// Follows layout contract: RootLayout → Section → Container → [Feature Content].
// Section and Container are owned by each feature component — this file
// composes, it does not layout.
//
// Section order per DEC-044 build sequence:
//   1. AboutHero              editorial
//   2. EngineeringPhilosophy  minimal
//   3. DecisionMaking         minimal
//   4. WorkingApproach        minimal
//   5. ValuesInPractice       grid
//   6. CurrentlyExploring     editorial
//   7. ConnectToWork          mesh

import {
  AboutHero,
  ConnectToWork,
  CurrentlyExploring,
  DecisionMaking,
  EngineeringPhilosophy,
  ValuesInPractice,
  WorkingApproach,
} from "@/features/about";

export const metadata = {
  title: "About",
  description:
    "Engineering philosophy, decision-making approach, and working style not biography.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <EngineeringPhilosophy />
      <DecisionMaking />
      <WorkingApproach />
      <ValuesInPractice />
      <CurrentlyExploring />
      <ConnectToWork />
    </>
  );
}
