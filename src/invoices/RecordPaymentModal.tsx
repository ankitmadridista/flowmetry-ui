import { useState } from 'react';
import { recordPayment } from './invoiceDetail.api';
import { formatCurrency } from '../utils/currency';

interface Props {
  invoiceId: string;
  remaining: number;
  onClose: () => void;
  onRecorded: () => void;
}

export default function RecordPaymentModal({ invoiceId, remaining, onClose, onRecorded }: Props): React.JSX.Element {
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Amount must be a positive number.');
      return;
    }
    if (amt > remaining) {
      setError(`Amount cannot exceed the remaining balance of ${formatCurrency(remaining)}.`);
      return;
    }
    setSubmitting(true);
    try {
      await recordPayment(invoiceId, amt);
      onRecorded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h2>Record Payment</h2>
        <p style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '20px' }}>
          Remaining balance: <strong>{formatCurrency(remaining)}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="rp-amount">Payment Amount (₹)</label>
            <input
              id="rp-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              autoFocus
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Recording…' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
