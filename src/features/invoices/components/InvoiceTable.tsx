import type { InvoiceSummaryDto } from "../api/invoices.api";
import { formatCurrency } from "../../../utils/currency";

interface InvoiceTableProps {
  items: InvoiceSummaryDto[];
  sortBy: "dueDate" | "amount";
  sortDir: "asc" | "desc";
  onSortChange: (col: "dueDate" | "amount") => void;
  onRowClick?: (id: string) => void;
}

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

const statusLabel: Record<string, string> = {
  PartiallyPaid: "Partially Paid",
};

export function InvoiceTable({
  items,
  sortBy,
  sortDir,
  onSortChange,
  onRowClick,
}: InvoiceTableProps): React.JSX.Element {
  function indicator(col: "dueDate" | "amount") {
    if (col !== sortBy) return null;
    return (
      <span className="text-[10px] opacity-80 ml-1">
        {sortDir === "asc" ? "▲" : "▼"}
      </span>
    );
  }

  // Common header class
  const thClass =
    "p-3 sm:px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70 border-b border-border whitespace-nowrap";

  return (
    <table className="w-full min-w-140 border-collapse text-sm">
      <thead className="bg-code">
        <tr>
          <th className={thClass}>Invoice #</th>
          <th className={thClass}>Customer</th>
          <th className={thClass}>
            <button
              type="button"
              onClick={() => onSortChange("amount")}
              className={`flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer text-xs font-semibold uppercase tracking-wider hover:text-accent transition-colors ${sortBy === "amount" ? "text-accent" : "text-foreground/70"}`}
            >
              Amount {indicator("amount")}
            </button>
          </th>
          <th className={thClass}>
            <button
              type="button"
              onClick={() => onSortChange("dueDate")}
              className={`flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer text-xs font-semibold uppercase tracking-wider hover:text-accent transition-colors ${sortBy === "dueDate" ? "text-accent" : "text-foreground/70"}`}
            >
              Due Date {indicator("dueDate")}
            </button>
          </th>
          <th className={thClass}>Status</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={5}>
              <div className="text-center py-16 px-5 text-foreground/60 text-[15px]">
                No invoices found
              </div>
            </td>
          </tr>
        ) : (
          items.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item.id)}
              className={`border-b border-border last:border-b-0 hover:bg-accent-bg transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
            >
              <td className="p-3 sm:px-4 py-3.5 align-middle text-heading">
                <span className="font-mono text-xs text-foreground">
                  INV-{String(item.invoiceNumber).padStart(5, "0")}
                </span>
              </td>
              <td className="p-3 sm:px-4 py-3.5 align-middle text-heading">
                {item.customerName}
              </td>
              <td className="p-3 sm:px-4 py-3.5 align-middle text-heading">
                <span className="font-semibold tabular-nums">
                  {formatCurrency(item.amount)}
                </span>
              </td>
              <td className="p-3 sm:px-4 py-3.5 align-middle text-heading">
                {item.dueDate}
              </td>
              <td className="p-3 sm:px-4 py-3.5 align-middle text-heading">
                <span
                  className={`inline-block px-2.5 py-0.75 rounded-full text-xs font-semibold uppercase tracking-[0.4px] ${statusClass[item.status] ?? ""}`}
                >
                  {statusLabel[item.status] ?? item.status}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
