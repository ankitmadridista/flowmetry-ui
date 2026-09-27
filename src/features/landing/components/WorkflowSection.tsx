import { steps } from "../Data/workflowData";

export default function WorkflowSection(): React.JSX.Element {
  return (
    <section className="px-6 py-24 max-w-5xl mx-auto w-full border-t border-border/50">
      <div className="mb-16">
        <h2 className="text-3xl font-heading font-semibold text-heading mb-4 tracking-tight">
          How Flowmetry Works
        </h2>
        <p className="text-foreground/70 text-lg">
          A streamlined workflow designed for rapid cashflow collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Decorative connecting line for desktop */}
        <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-border z-0"></div>

        {steps.map((step, i) => (
          <div
            key={i}
            className="relative z-10 flex flex-col md:items-center md:text-center"
          >
            <div className="h-12 w-12 rounded-full bg-background border-2 border-accent text-accent font-bold font-mono flex items-center justify-center mb-6 shadow-sm">
              {step.num}
            </div>
            <h3 className="text-lg font-heading font-semibold text-heading mb-3">
              {step.title}
            </h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
