import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getInvoiceDetails,
  getInvoiceReminders,
  sendInvoice,
  type InvoiceDetailsDto,
  type ReminderDto,
} from "../api/invoiceDetail.api";
import { formatCurrency } from "../../../utils/currency";
import RecordPaymentModal from "../components/RecordPaymentModal";

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

const reminderStatusClass: Record<string, string> = {
  Pending: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", // Matches 'Sent' logic
  Sent: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", // Matches 'Paid' logic
  Cancelled:
    "bg-gray-100 text-gray-400 line-through dark:bg-gray-800 dark:text-gray-500",
};

export default function InvoiceDetailPage(): React.JSX.Element {
  const { id: invoiceId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceDetailsDto | null>(null);
  const [reminders, setReminders] = useState<ReminderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!invoiceId) return;
    setLoading(true);
    setError(null);
    try {
      const [inv, rem] = await Promise.all([
        getInvoiceDetails(invoiceId),
        getInvoiceReminders(invoiceId),
      ]);
      setInvoice(inv);
      setReminders(rem);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!invoiceId)
    return (
      <div className="my-8 mx-4 md:mx-10 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900 rounded-lg py-3.5 px-4 text-sm">
        Invalid invoice ID
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
  if (!invoice) return <></>;

  const paidAmount = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = invoice.amount - paidAmount;
  const canPay =
    remaining > 0 && ["Sent", "PartiallyPaid"].includes(invoice.status);
  const canSend = invoice.status === "Draft";

  async function handleSend() {
    setSendError(null);
    setSending(true);
    try {
      await sendInvoice(invoiceId!);
      load();
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Failed to send invoice",
      );
    } finally {
      setSending(false);
    }
  }

  // Common UI Classes
  const btnPrimaryClass =
    "h-[38px] px-5 bg-accent text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-theme";
  const thClass =
    "bg-code p-3 sm:px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70 border-b border-border whitespace-nowrap";
  const tdClass =
    "p-3 sm:px-4 py-3.5 align-middle text-heading border-b border-border group-last:border-b-0";

  return (
    <div className="p-5 md:p-8 md:px-10 max-w-300 mx-auto w-full text-foreground">
      <button
        className="text-sm font-medium text-foreground/70 hover:text-foreground cursor-pointer bg-transparent border-none p-0 mb-6 flex items-center transition-colors"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="m-0 text-2xl md:text-[28px] font-semibold text-heading tracking-tight font-mono mb-1">
            INV-{String(invoice.invoiceNumber).padStart(5, "0")}
          </h1>
          <p className="m-0 text-foreground/80 text-base">
            {invoice.customerName}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-block px-2.5 py-0.75 rounded-full text-xs font-semibold uppercase tracking-[0.4px] ${statusClass[invoice.status] ?? ""}`}
          >
            {statusLabel[invoice.status] ?? invoice.status}
          </span>
          {canSend && (
            <button
              className={btnPrimaryClass}
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? "Sending…" : "Send Invoice"}
            </button>
          )}
          {canPay && (
            <button
              className={btnPrimaryClass}
              onClick={() => setShowPayment(true)}
            >
              Record Payment
            </button>
          )}
        </div>
      </div>

      {sendError && (
        <p className="text-[13px] text-red-700 dark:text-red-400 mb-4 font-medium">
          {sendError}
        </p>
      )}

      {/* Summary Section */}
      <div className="mb-10">
        <h2 className="text-lg font-heading font-semibold text-heading mb-4">
          Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background border border-border rounded-xl p-4 sm:p-5 flex flex-col gap-1.5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Invoice Amount
            </div>
            <div className="text-xl font-bold text-heading tabular-nums tracking-tight">
              {formatCurrency(invoice.amount)}
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 sm:p-5 flex flex-col gap-1.5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Paid
            </div>
            <div className="text-xl font-bold text-heading tabular-nums tracking-tight">
              {formatCurrency(paidAmount)}
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 sm:p-5 flex flex-col gap-1.5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Remaining
            </div>
            <div className="text-xl font-bold text-heading tabular-nums tracking-tight">
              {formatCurrency(remaining)}
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 sm:p-5 flex flex-col gap-1.5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Due Date
            </div>
            <div className="text-base font-bold text-heading tracking-tight mt-1">
              {invoice.dueDate}
            </div>
          </div>
        </div>
      </div>

      {/* Payments Section */}
      <div className="mb-10">
        <h2 className="text-lg font-heading font-semibold text-heading mb-4">
          Payments ({invoice.payments.length})
        </h2>
        <div className="border border-border rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-sm border-collapse min-w-125">
            <thead>
              <tr>
                <th className={thClass}>Amount</th>
                <th className={thClass}>Recorded At</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments.length === 0 ? (
                <tr>
                  <td colSpan={2}>
                    <div className="text-center py-10 text-foreground/60 text-[15px]">
                      No payments recorded
                    </div>
                  </td>
                </tr>
              ) : (
                invoice.payments.map((p) => (
                  <tr key={p.id} className="group">
                    <td className={tdClass}>{formatCurrency(p.amount)}</td>
                    <td className={tdClass}>
                      {new Date(p.recordedAt).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reminders Section */}
      <div className="mb-10">
        <h2 className="text-lg font-heading font-semibold text-heading mb-4">
          Reminders ({reminders.length})
        </h2>
        <div className="border border-border rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-sm border-collapse min-w-125">
            <thead>
              <tr>
                <th className={thClass}>Type</th>
                <th className={thClass}>Scheduled</th>
                <th className={thClass}>Sent</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reminders.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="text-center py-10 text-foreground/60 text-[15px]">
                      No reminders
                    </div>
                  </td>
                </tr>
              ) : (
                reminders.map((r) => (
                  <tr key={r.id} className="group">
                    <td className={tdClass}>{r.reminderType}</td>
                    <td className={tdClass}>
                      {new Date(r.scheduledAt).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                      })}
                    </td>
                    <td className={tdClass}>
                      {r.sentAt
                        ? new Date(r.sentAt).toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                          })
                        : "—"}
                    </td>
                    <td className={tdClass}>
                      <span
                        className={`inline-block px-2.5 py-0.75 rounded-full text-xs font-semibold uppercase tracking-[0.4px] ${reminderStatusClass[r.status] ?? ""}`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPayment && (
        <RecordPaymentModal
          invoiceId={invoiceId}
          remaining={remaining}
          onClose={() => setShowPayment(false)}
          onRecorded={() => {
            setShowPayment(false);
            load();
          }}
        />
      )}
    </div>
  );
}
