import AboutTeaser from "@/features/about/AboutTeaser";
import SelectedSystemsSection from "@/features/home/SelectedSystemsSection";
import { WritingSection } from "@/features/home/WritingSection";
import PrinciplesSection from "@/features/home/PrinciplesSection";
import ResourcesCallout from "@/features/home/ResourcesCallout";
import TechSelectorSection from "@/features/home/TechSelectorSection";
import HeroSection from "@/features/home/HeroSection";
import HireMeSection from "@/features/home/HireMeSection";
import ProofOfWork from "@/features/home/ProofOfWorkSection/ProofOfWork";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SelectedSystemsSection />
      <ProofOfWork />
      <PrinciplesSection />
      <TechSelectorSection />
      <WritingSection />
      <AboutTeaser />
      <ResourcesCallout />
      <HireMeSection />
    </>
  );
}
