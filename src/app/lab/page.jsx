// app/lab/page.jsx
// RSC — no client directive required.
//
// Thin shell per architectural contract. All data fetching and condition
// evaluation lives here. Feature components receive data as props.
//
// Layout contract: RootLayout → Section → Container → [Feature Content]
// Both Section → Container pairs are owned by the feature components —
// this page is wiring only.

import { getAllLabEntries } from "@/lib/data/lab";
import { LabHero } from "@/features/lab/LabHero";
import { LabIndex } from "@/features/lab/LabIndex";

export const metadata = {
  title: "Lab",
  description:
    "Experiments, explorations, and tools built outside of production constraints. Where the goal is to learn, not to ship.",
};

export default function LabPage() {
  const entries = getAllLabEntries();

  return (
    <>
      <LabHero entryCount={entries.length} />
      <LabIndex entries={entries} />
    </>
  );
}
