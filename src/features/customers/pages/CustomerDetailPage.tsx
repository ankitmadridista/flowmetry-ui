import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCustomer,
  getCustomerRiskProfile,
  getCustomerInvoices,
  type CustomerSummaryDto,
  type RiskProfileDto,
  type CustomerInvoiceSummaryDto,
} from "../api/customers.api";
import { formatCurrency } from "../../../utils/currency";
// import './customers.css'; <-- Removed!

const riskClass: Record<string, string> = {
  Low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500",
  High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusClass: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  Sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PartiallyPaid:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500",
  Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Cancelled:
    "bg-gray-100 text-gray-400 line-through dark:bg-gray-800 dark:text-gray-500",
};

const statusLabel: Record<string, string> = { PartiallyPaid: "Partially Paid" };

export default function CustomerDetailPage(): React.JSX.Element {
  const { id: customerId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerSummaryDto | null>(null);
  const [risk, setRisk] = useState<RiskProfileDto | null>(null);
  const [invoices, setInvoices] = useState<CustomerInvoiceSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;
    let ignored = false;
    async function fetchData() {
      setLoading(true);
      try {
        const [c, r, inv] = await Promise.all([
          getCustomer(customerId!),
          getCustomerRiskProfile(customerId!),
          getCustomerInvoices(customerId!),
        ]);
        if (!ignored) {
          setCustomer(c);
          setRisk(r);
          setInvoices(inv);
        }
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
  }, [customerId]);

  if (!customerId)
    return (
      <div className="my-8 mx-4 md:mx-10 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900 rounded-lg py-3.5 px-4 text-sm">
        Invalid customer ID
      </div>
    );
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
  if (!customer || !risk) return <></>;

  // Common UI Classes
  const thClass =
    "bg-code p-3 sm:px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70 border-b border-border whitespace-nowrap";
  const tdClass =
    "p-3 sm:px-4 py-3.5 align-middle text-heading border-b border-border group-last:border-b-0";

  return (
    <div className="p-5 md:p-8 md:px-10 max-w-300 mx-auto w-full text-foreground">
      <button
        className="text-sm font-medium text-foreground/70 hover:text-foreground cursor-pointer bg-transparent border-none p-0 mb-6 flex items-center transition-colors"
        onClick={() => navigate("/customers")}
      >
        ← Back to Customers
      </button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="m-0 text-2xl md:text-[28px] font-heading font-semibold text-heading tracking-tight mb-1">
            {customer.name}
          </h1>
          <p className="m-0 text-foreground/80 text-base">{customer.email}</p>
        </div>
        <span
          className={`inline-block px-2.5 py-0.75 rounded-full text-xs font-semibold uppercase tracking-[0.4px] mt-1 md:mt-0 ${riskClass[customer.riskBand] ?? ""}`}
        >
          {customer.riskBand} Risk
        </span>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-heading font-semibold text-heading mb-4">
          Risk Profile
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-1.5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Risk Score
            </div>
            <div className="text-xl font-bold text-heading tabular-nums tracking-tight">
              {risk.riskScore}
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-1.5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Total Invoices
            </div>
            <div className="text-xl font-bold text-heading tabular-nums tracking-tight">
              {risk.totalInvoices}
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-1.5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Overdue
            </div>
            <div className="text-xl font-bold text-heading tabular-nums tracking-tight">
              {risk.overdueCount}
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-1.5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Partially Paid
            </div>
            <div className="text-xl font-bold text-heading tabular-nums tracking-tight">
              {risk.partiallyPaidCount}
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-1.5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Late Payments
            </div>
            <div className="text-xl font-bold text-heading tabular-nums tracking-tight">
              {risk.latePaymentCount}
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-1.5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Avg Days Late
            </div>
            <div className="text-xl font-bold text-heading tabular-nums tracking-tight">
              {risk.averageDaysLate.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-heading font-semibold text-heading mb-4">
          Invoices
        </h2>
        <div className="border border-border rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full min-w-90 border-collapse text-sm">
            <thead>
              <tr>
                <th className={thClass}>Amount</th>
                <th className={thClass}>Due Date</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <div className="text-center py-10 text-foreground/60 text-[15px]">
                      No invoices
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="group cursor-pointer hover:bg-accent-bg transition-colors"
                    onClick={() => navigate(`/invoices/${inv.id}`)}
                  >
                    <td className={tdClass}>
                      <span className="font-semibold tabular-nums">
                        {formatCurrency(inv.amount)}
                      </span>
                    </td>
                    <td className={tdClass}>{inv.dueDate}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-block px-2.5 py-0.75 rounded-full text-xs font-semibold uppercase tracking-[0.4px] ${statusClass[inv.status] ?? ""}`}
                      >
                        {statusLabel[inv.status] ?? inv.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
