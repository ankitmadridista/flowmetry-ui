import { useEffect } from "react";
import { apiClient } from "../api";
import PublicNavbar from "../shared/components/PublicNavbar";
import Footer from "../shared/components/Footer";
import HeroSection from "../features/landing/components/HeroSection";
import WorkflowSection from "../features/landing/components/WorkflowSection";
import TechnologySection from "../features/landing/components/TechnologySection";
import FeaturesSection from "../features/landing/components/FeaturesSection";
import ArchitectureSection from "../features/landing/components/ArchitectureSection";
import RoadmapSection from "../features/landing/components/RoadmapSection";

export default function LandingPage() {
  useEffect(() => {
    apiClient
      .get("/api/health")
      .then(() => console.log("Backend is warmed up and ready."))
      .catch(() => console.log("Backend is spinning up..."));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent selection:text-white">
      <PublicNavbar />

      <div className="flex-1 w-full">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <TechnologySection />
        <ArchitectureSection />
        <RoadmapSection />
      </div>

      <Footer />
    </div>
  );
}
