import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api";
import PublicNavbar from "../shared/components/PublicNavbar";
import Roadmap from "../features/roadmap/Roadmap";
import Footer from "../shared/components/Footer";

export default function LandingPage() {
  const navigate = useNavigate();

  // 1. Backend Warm-up Logic
  useEffect(() => {
    // This makes a lightweight call in the background to wake up the Render free tier.
    // We catch the error silently so it doesn't disrupt the UI if it takes 15 seconds to spin up.
    apiClient
      .get("/api/health")
      .then(() => console.log("Backend is warmed up and ready."))
      .catch(() => console.log("Backend is spinning up..."));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white pb-20">
      <PublicNavbar />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-heading tracking-tight mb-6">
          Modern Invoice Management for SaaS
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl leading-relaxed">
          Manage your cashflow, track invoices, and streamline your customer
          billing from one unified dashboard.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 text-lg font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors shadow-theme"
          >
            Get Started Free
          </button>
        </div>
      </main>

      {/* Roadmap Section */}
      <section className="px-4 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-semibold text-heading mb-4">
            Product Roadmap
          </h2>
          <p className="text-foreground/80">
            See what we've built and what's coming next.
          </p>
        </div>

        {/* Render the Roadmap Component here */}
        <Roadmap />
      </section>

      <Footer />
    </div>
  );
}
