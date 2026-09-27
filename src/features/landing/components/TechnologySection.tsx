import { technologies } from "../Data/technologyData";

export default function TechnologySection(): React.JSX.Element {
  return (
    <section className="px-6 py-24 max-w-6xl mx-auto w-full border-t border-border/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="max-w-xl">
          <h2 className="text-3xl font-heading font-semibold text-heading mb-4 tracking-tight">
            Built on a Modern Stack
          </h2>
          <p className="text-foreground/70 text-lg">
            Engineered for performance, strict type safety, and seamless
            horizontal scaling.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {technologies.map((tech, i) => (
          <div key={i} className="bg-code border border-border p-5 rounded-xl">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground/50 mb-1">
              {tech.category}
            </div>
            <div className="text-base font-semibold text-heading">
              {tech.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
