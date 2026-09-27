export type RoadmapStatus = "completed" | "in-progress" | "planned";

export interface RoadmapItem {
  title: string;
  description: string;
  status: RoadmapStatus;
}

export const roadmap: RoadmapItem[] = [
  // --- Completed ---
  {
    title: "Project Foundation",
    description:
      "Architecture, CI/CD, and multi-repo setup (DotNet API & React UI) deployed on Render/Vercel.",
    status: "completed",
  },
  {
    title: "RBAC & Security Framework",
    description:
      "Granular permissions, object-level access control, and Security Admin UI.",
    status: "completed",
  },
  {
    title: "Core Modules",
    description:
      "Customer management, Invoice creation UI, and basic Dashboard metrics.",
    status: "completed",
  },
  // --- In Progress ---
  {
    title: "User Management Flow",
    description:
      "Invite new users from the UI and handle first-login password setup.",
    status: "in-progress",
  },
  {
    title: "Session Persistence",
    description:
      "Long-lived refresh token (httpOnly cookie) to silently re-issue access tokens.",
    status: "in-progress",
  },
  {
    title: "Dashboard Enhancements",
    description:
      "Date range filters, inline overdue invoice lists, and cashflow trend charts.",
    status: "in-progress",
  },
  // --- Planned ---
  {
    title: "Audit Logging",
    description:
      "Track and log every RBAC change (role assignment, permission toggle) with user/timestamp.",
    status: "planned",
  },
  {
    title: "Email Notifications",
    description:
      "Wire up SendGrid/Resend to the existing LoggingNotificationService for actual payment reminders.",
    status: "planned",
  },
  {
    title: "Payments & Reports Modules",
    description:
      "Build out standalone UI pages for the existing PAYMENTS and REPORTS security objects.",
    status: "planned",
  },
  {
    title: "Reminders Engine (Phase 5)",
    description:
      "Priority queuing and background processing for automated follow-ups.",
    status: "planned",
  },
  {
    title: "Intelligence Layer (Phase 6)",
    description: "Risk scoring and AI-driven predictive features.",
    status: "planned",
  },
];
