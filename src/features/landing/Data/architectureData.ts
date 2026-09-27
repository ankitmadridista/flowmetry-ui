export interface ArchitectureNode {
  title: string;
  description: string;
}

export const architectureNodes: ArchitectureNode[] = [
  {
    title: "API Layer",
    description:
      "RESTful Minimal APIs, secure authentication, and edge routing.",
  },
  {
    title: "Application Layer",
    description:
      "CQRS-driven business workflows and asynchronous job orchestration.",
  },
  {
    title: "Business Domain",
    description:
      "Strict DDD aggregates, value objects, and invariant business rules.",
  },
];