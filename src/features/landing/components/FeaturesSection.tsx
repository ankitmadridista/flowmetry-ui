import { features } from "../Data/featuresData";

export default function FeaturesSection(): React.JSX.Element {
  return (
    <section
      id="features"
      className="px-6 py-24 max-w-6xl mx-auto w-full border-t border-border/50"
    >
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-3xl font-heading font-semibold text-heading mb-4 tracking-tight">
          Enterprise power, startup simplicity
        </h2>
        <p className="text-foreground/70 text-lg">
          Everything you need to manage your accounts receivable without the
          bloat of traditional ERPs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, i) => (
          <div
            key={i}
            className="bg-background border border-border p-6 rounded-2xl shadow-sm hover:border-accent/50 transition-colors group"
          >
            <div className="h-10 w-10 rounded-lg bg-accent-bg flex items-center justify-center text-xl mb-5 group-hover:scale-110 transition-transform">
              {feat.icon}
            </div>
            <h3 className="text-lg font-heading font-semibold text-heading mb-2">
              {feat.title}
            </h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {feat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
