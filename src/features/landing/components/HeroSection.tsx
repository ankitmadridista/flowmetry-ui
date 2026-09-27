import { useNavigate } from "react-router-dom";

export default function HeroSection(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-bg text-accent text-sm font-semibold mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </span>
        v1.0 is now live
      </div>

      <h1 className="text-5xl md:text-6xl font-heading font-bold text-heading tracking-tight mb-6 leading-tight">
        Modern Invoice Management for SaaS
      </h1>

      <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl leading-relaxed">
        Manage your cashflow, track invoices, and streamline your customer
        billing from one unified dashboard with enterprise-grade security.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3.5 text-lg font-semibold bg-accent text-white rounded-lg hover:bg-accent/90 transition-all shadow-theme hover:shadow-lg hover:-translate-y-0.5"
        >
          Get Started Free
        </button>
        <button
          onClick={() =>
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="px-8 py-3.5 text-lg font-medium bg-background text-heading border border-border rounded-lg hover:border-accent transition-all"
        >
          View Features
        </button>
      </div>
    </section>
  );
}
