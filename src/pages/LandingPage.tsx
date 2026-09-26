import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api";
import PublicNavbar from "../shared/components/PublicNavbar";
import Roadmap from "../features/roadmap/Roadmap";
import Footer from "../shared/components/Footer";

export default function LandingPage() {
  const navigate = useNavigate();

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
        {/* ADDED: pb-20 here to ensure a gap between the cards and the footer */}
        <section className="px-4 max-w-6xl mx-auto w-full pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-semibold text-heading mb-4">
              Product Roadmap
            </h2>
            <p className="text-foreground/80">
              See what we've built and what's coming next.
            </p>
          </div>

          <Roadmap />
        </section>
      </div>

      <Footer />
    </div>
  );
}
