import { useEffect, useState } from "react";
import { getCashflowSummary, type CashflowSummary } from "./dashboard.api";
import { formatCurrency } from "../../utils/currency";

function fmt(value: number): string {
  return formatCurrency(value);
}

export default function DashboardPage(): React.JSX.Element {
  const [summary, setSummary] = useState<CashflowSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignored = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCashflowSummary();
        if (!ignored) setSummary(data);
      } catch (err) {
        if (!ignored) setError((err as Error).message);
      } finally {
        if (!ignored) setLoading(false);
      }
    }

    fetchData();
    return () => {
      ignored = true;
    };
  }, []);

  if (loading)
    return (
      <div className="py-16 px-10 text-center text-foreground/60 text-sm font-medium">
        Loading…
      </div>
    );

  if (error)
    return (
      <div
        className="my-8 mx-4 md:mx-10 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900 rounded-lg py-3.5 px-4 text-sm"
        role="alert"
      >
        {error}
      </div>
    );

  if (!summary) return <></>;

  return (
    <div className="p-5 md:p-8 md:px-10 max-w-300 mx-auto w-full">
      <h1 className="text-2xl md:text-[28px] font-heading font-semibold text-heading mb-1 md:mb-2 tracking-tight">
        Cashflow
      </h1>
      <p className="text-sm text-foreground/65 mb-8 md:mb-10">
        Live snapshot of your receivables and payments
      </p>

      {/* Metric Grid - Responsive grid layout equivalent to your auto-fill minmax */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-10">
        <div className="bg-background border border-border rounded-xl p-4 md:p-6 flex flex-col gap-2 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Total Receivable
          </span>
          <span className="text-xl md:text-[28px] font-bold text-heading tabular-nums tracking-tight">
            {fmt(summary.totalReceivable)}
          </span>
        </div>

        <div className="bg-background border border-border rounded-xl p-4 md:p-6 flex flex-col gap-2 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Total Paid
          </span>
          <span className="text-xl md:text-[28px] font-bold text-heading tabular-nums tracking-tight">
            {fmt(summary.totalPaid)}
          </span>
        </div>

        <div className="bg-background border border-border rounded-xl p-4 md:p-6 flex flex-col gap-2 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Total Unpaid
          </span>
          <span className="text-xl md:text-[28px] font-bold text-heading tabular-nums tracking-tight">
            {fmt(summary.totalUnpaid)}
          </span>
        </div>

        <div className="bg-background border border-border rounded-xl p-4 md:p-6 flex flex-col gap-2 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Monthly Inflow
          </span>
          <span className="text-xl md:text-[28px] font-bold text-heading tabular-nums tracking-tight">
            {fmt(summary.monthlyInflow)}
          </span>
        </div>

        {/* Overdue Card - Uses specific red colors with dark mode support */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-300 dark:border-red-900 rounded-xl p-4 md:p-6 flex flex-col gap-2 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Overdue
          </span>
          <span className="text-xl md:text-[28px] font-bold text-red-700 dark:text-red-400 tabular-nums tracking-tight">
            {fmt(summary.overdueAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
