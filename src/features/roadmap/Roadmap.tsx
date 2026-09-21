import { roadmap, type RoadmapStatus } from "./roadmapData";

const StatusBadge = ({ status }: { status: RoadmapStatus }) => {
  const styles = {
    completed:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    "in-progress":
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    planned:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  };

  const labels = {
    completed: "Completed",
    "in-progress": "In Progress",
    planned: "Planned",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

export default function Roadmap() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-left">
      {roadmap.map((item, index) => (
        <div
          key={index}
          className="flex flex-col p-6 border border-border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          {/* Subtle colored accent strip at the top based on status */}
          <div
            className={`absolute top-0 left-0 w-full h-1 ${
              item.status === "completed"
                ? "bg-green-500"
                : item.status === "in-progress"
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
            }`}
          />

          <div className="flex justify-between items-start mb-4 mt-2">
            <h3 className="font-heading font-semibold text-heading text-lg leading-tight pr-2">
              {item.title}
            </h3>
            <StatusBadge status={item.status} />
          </div>
          <p className="text-foreground/80 text-sm leading-relaxed grow">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
