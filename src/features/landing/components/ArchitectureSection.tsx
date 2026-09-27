import { architectureNodes } from "../Data/architectureData";


export default function ArchitectureSection(): React.JSX.Element {
  return (
    <section className="px-6 py-24 max-w-4xl mx-auto w-full border-t border-border/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-heading font-semibold text-heading mb-4 tracking-tight">
          Clean Architecture
        </h2>
        <p className="text-foreground/70 text-lg">
          Strict separation of concerns ensuring domain logic remains completely
          isolated from infrastructure.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {architectureNodes.map((node, i) => (
          <div
            key={i}
            className="flex items-center gap-6 bg-background border border-border p-6 rounded-2xl relative overflow-hidden"
          >
            {/* Visual indicator for depth */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-2 ${i === 0 ? "bg-accent/40" : i === 1 ? "bg-accent/70" : "bg-accent"}`}
            ></div>

            <div className="pl-4">
              <h3 className="text-lg font-heading font-semibold text-heading mb-1">
                {node.title}
              </h3>
              <p className="text-sm text-foreground/70 m-0">
                {node.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
