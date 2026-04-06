import { useEffect, useState } from 'react';
import { getInvoiceDetails, getInvoiceReminders, sendInvoice, type InvoiceDetailsDto, type ReminderDto } from './invoiceDetail.api';
import { formatCurrency } from '../utils/currency';
import RecordPaymentModal from './RecordPaymentModal';
import '../customers/customers.css';
import './invoices.css';

const statusClass: Record<string, string> = {
  Draft: 'status-draft', Sent: 'status-sent', PartiallyPaid: 'status-partiallypaid',
  Paid: 'status-paid', Overdue: 'status-overdue', Cancelled: 'status-cancelled',
};
const statusLabel: Record<string, string> = { PartiallyPaid: 'Partially Paid' };
const reminderStatusClass: Record<string, string> = {
  Pending: 'status-sent', Sent: 'status-paid', Cancelled: 'status-cancelled',
};

interface Props {
  invoiceId: string;
  onBack: () => void;
}

export default function InvoiceDetailPage({ invoiceId, onBack }: Props): React.JSX.Element {
  const [invoice, setInvoice] = useState<InvoiceDetailsDto | null>(null);
  const [reminders, setReminders] = useState<ReminderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    Promise.all([getInvoiceDetails(invoiceId), getInvoiceReminders(invoiceId)])
      .then(([inv, rem]) => { setInvoice(inv); setReminders(rem); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [invoiceId]);

  if (loading) return <div className="page-loading">Loading…</div>;
  if (error) return <div className="page-error" role="alert">{error}</div>;
  if (!invoice) return <></>;

  const paidAmount = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = invoice.amount - paidAmount;
  const canPay = remaining > 0 && ['Sent', 'PartiallyPaid'].includes(invoice.status);
  const canSend = invoice.status === 'Draft';

  async function handleSend() {
    setSendError(null);
    setSending(true);
    try {
      await sendInvoice(invoiceId);
      load();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Failed to send invoice');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="detail-page">
      <button className="detail-back" onClick={onBack}>← Back</button>

      <div className="detail-header">
        <div>
          <h1>INV-{String(invoice.invoiceNumber).padStart(5, '0')}</h1>
          <p>{invoice.customerName}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className={`status-badge ${statusClass[invoice.status] ?? ''}`}>
            {statusLabel[invoice.status] ?? invoice.status}
          </span>
          {canSend && (
            <button className="btn-primary" onClick={handleSend} disabled={sending}>
              {sending ? 'Sending…' : 'Send Invoice'}
            </button>
          )}
          {canPay && (
            <button className="btn-primary" onClick={() => setShowPayment(true)}>
              Record Payment
            </button>
          )}
        </div>
      </div>
      {sendError && <p className="form-error" style={{ marginBottom: '16px' }}>{sendError}</p>}

      <div className="detail-section">
        <h2>Summary</h2>
        <div className="detail-grid">
          <div className="detail-stat">
            <div className="detail-stat-label">Invoice Amount</div>
            <div className="detail-stat-value">{formatCurrency(invoice.amount)}</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">Paid</div>
            <div className="detail-stat-value">{formatCurrency(paidAmount)}</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">Remaining</div>
            <div className="detail-stat-value">{formatCurrency(remaining)}</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">Due Date</div>
            <div className="detail-stat-value" style={{ fontSize: '16px' }}>{invoice.dueDate}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h2>Payments ({invoice.payments.length})</h2>
        <div className="detail-table-wrap">
          <table className="detail-table">
            <thead>
              <tr><th>Amount</th><th>Recorded At</th></tr>
            </thead>
            <tbody>
              {invoice.payments.length === 0 ? (
                <tr><td colSpan={2}><div className="empty-detail">No payments recorded</div></td></tr>
              ) : invoice.payments.map(p => (
                <tr key={p.id}>
                  <td>{formatCurrency(p.amount)}</td>
                  <td>{new Date(p.recordedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="detail-section">
        <h2>Reminders ({reminders.length})</h2>
        <div className="detail-table-wrap">
          <table className="detail-table">
            <thead>
              <tr><th>Type</th><th>Scheduled</th><th>Sent</th><th>Status</th></tr>
            </thead>
            <tbody>
              {reminders.length === 0 ? (
                <tr><td colSpan={4}><div className="empty-detail">No reminders</div></td></tr>
              ) : reminders.map(r => (
                <tr key={r.id}>
                  <td>{r.reminderType}</td>
                  <td>{new Date(r.scheduledAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                  <td>{r.sentAt ? new Date(r.sentAt).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—'}</td>
                  <td>
                    <span className={`status-badge ${reminderStatusClass[r.status] ?? ''}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPayment && (
        <RecordPaymentModal
          invoiceId={invoiceId}
          remaining={remaining}
          onClose={() => setShowPayment(false)}
          onRecorded={() => { setShowPayment(false); load(); }}
        />
      )}
    </div>
  );
}
