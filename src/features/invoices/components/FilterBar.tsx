import { useState } from "react";
import type { InvoiceFilter } from "../api/invoices.api";
import DatePicker from "../../../components/DatePicker";

interface FilterBarProps {
  value: InvoiceFilter;
  onFilterChange: (f: InvoiceFilter) => void;
}

type StatusOption =
  | "All"
  | "Draft"
  | "Sent"
  | "PartiallyPaid"
  | "Paid"
  | "Overdue"
  | "Cancelled";

function toStatusOption(filter: InvoiceFilter): StatusOption {
  if (filter.overdue) return "Overdue";
  if (filter.status) return filter.status;
  return "All";
}

export function FilterBar({
  value,
  onFilterChange,
}: FilterBarProps): React.JSX.Element {
  const [draft, setDraft] = useState<InvoiceFilter>(value);

  function handleStatusChange(option: StatusOption) {
    if (option === "Overdue") {
      setDraft((prev) => ({ ...prev, overdue: true, status: undefined }));
    } else if (option === "All") {
      setDraft((prev) => ({ ...prev, status: undefined, overdue: undefined }));
    } else {
      setDraft((prev) => ({
        ...prev,
        status: option as InvoiceFilter["status"],
        overdue: undefined,
      }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onFilterChange(draft);
  }

  // Common classes for inputs and selects to keep the JSX clean
  const inputBaseClass =
    "h-[38px] px-3 border border-border rounded-md bg-background text-foreground text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent-bg w-full";
  const labelClass =
    "text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-1.5";

  return (
    <form
      className="bg-background border border-border rounded-xl p-4 sm:p-5 sm:px-6 mb-6 flex flex-wrap gap-4 items-end shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col flex-1 min-w-40">
        <label htmlFor="customerName" className={labelClass}>
          Customer
        </label>
        <input
          id="customerName"
          type="text"
          placeholder="Search by name..."
          value={draft.customerName ?? ""}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              customerName: e.target.value || undefined,
            }))
          }
          aria-label="customerName"
          className={inputBaseClass}
        />
      </div>

      <div className="flex flex-col flex-1 min-w-40">
        <label htmlFor="status" className={labelClass}>
          Status
        </label>
        <select
          id="status"
          value={toStatusOption(draft)}
          onChange={(e) => handleStatusChange(e.target.value as StatusOption)}
          aria-label="status"
          className={inputBaseClass}
        >
          <option value="All">All</option>
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="PartiallyPaid">Partially Paid</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex flex-col flex-1 min-w-40">
        <label htmlFor="dueDateFrom" className={labelClass}>
          Due From
        </label>
        {/* Note: DatePicker internal input should also match these styles if possible */}
        <DatePicker
          id="dueDateFrom"
          value={draft.dueDateFrom ?? ""}
          onChange={(v) =>
            setDraft((prev) => ({ ...prev, dueDateFrom: v || undefined }))
          }
          ariaLabel="dueDateFrom"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-40">
        <label htmlFor="dueDateTo" className={labelClass}>
          Due To
        </label>
        <DatePicker
          id="dueDateTo"
          value={draft.dueDateTo ?? ""}
          onChange={(v) =>
            setDraft((prev) => ({ ...prev, dueDateTo: v || undefined }))
          }
          ariaLabel="dueDateTo"
        />
      </div>

      <div className="flex items-end w-full sm:w-auto">
        <button
          type="submit"
          className="h-9.5 px-5 w-full sm:w-auto bg-accent text-white border-none rounded-md text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap shadow-theme"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}
