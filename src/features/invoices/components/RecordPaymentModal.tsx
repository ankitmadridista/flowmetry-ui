import { useState } from "react";
import { recordPayment } from "../api/invoiceDetail.api";
import { formatCurrency } from "../../../utils/currency";

interface Props {
  invoiceId: string;
  remaining: number;
  onClose: () => void;
  onRecorded: () => void;
}

export default function RecordPaymentModal({
  invoiceId,
  remaining,
  onClose,
  onRecorded,
}: Props): React.JSX.Element {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (amt > remaining) {
      setError(
        `Amount cannot exceed the remaining balance of ${formatCurrency(remaining)}.`,
      );
      return;
    }
    setSubmitting(true);
    try {
      await recordPayment(invoiceId, amt);
      onRecorded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldWrapperClass = "flex flex-col gap-1.5 mb-4";
  const labelClass =
    "text-xs font-semibold uppercase tracking-wider text-foreground/70";
  const inputClass =
    "h-[38px] px-3 border border-border rounded-md bg-background text-heading text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent-bg w-full";

  const btnSecondaryClass =
    "h-[38px] px-4 bg-background text-heading border border-border rounded-md text-sm font-medium cursor-pointer transition-colors hover:border-accent w-full sm:w-auto";
  const btnPrimaryClass =
    "h-[38px] px-5 bg-accent text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto shadow-theme";

  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-end sm:items-center justify-center z-100 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-background border border-border sm:border-border border-t-border border-x-transparent border-b-transparent rounded-t-2xl sm:rounded-xl p-6 sm:p-7 w-full max-w-110 shadow-theme max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-heading font-semibold text-heading m-0 mb-2">
          Record Payment
        </h2>

        <p className="text-[14px] text-foreground mb-5">
          Remaining balance:{" "}
          <strong className="text-heading">{formatCurrency(remaining)}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className={fieldWrapperClass}>
            <label htmlFor="rp-amount" className={labelClass}>
              Payment Amount (₹)
            </label>
            <input
              id="rp-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-700 mb-3 font-medium">{error}</p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end mt-5">
            <button
              type="button"
              className={btnSecondaryClass}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={btnPrimaryClass}
              disabled={submitting}
            >
              {submitting ? "Recording…" : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
