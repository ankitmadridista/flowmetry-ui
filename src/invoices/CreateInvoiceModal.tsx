import { useEffect, useState } from 'react';
import { createInvoice } from './invoiceDetail.api';
import { getCustomers, type CustomerSummaryDto } from '../customers/customers.api';
import DatePicker from '../components/DatePicker';

interface Props {
  onClose: () => void;
  onCreated: (id: string) => void;
}

export default function CreateInvoiceModal({ onClose, onCreated }: Props): React.JSX.Element {
  const [customers, setCustomers] = useState<CustomerSummaryDto[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCustomers().then(setCustomers).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const amt = parseFloat(amount);
    if (!customerId || isNaN(amt) || amt <= 0 || !dueDate) {
      setError('All fields are required and amount must be positive.');
      return;
    }
    setSubmitting(true);
    try {
      const id = await createInvoice({ customerId, amount: amt, dueDate });
      onCreated(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h2>Create Invoice</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="ci-customer">Customer</label>
            <select
              id="ci-customer"
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              style={{ height: '38px', padding: '0 12px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-h)', fontSize: '14px', fontFamily: 'var(--sans)', outline: 'none' }}
            >
              <option value="">— Select a customer —</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="ci-amount">Amount (₹)</label>
            <input
              id="ci-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="ci-due">Due Date</label>
            <DatePicker
              id="ci-due"
              value={dueDate}
              onChange={setDueDate}
              minDate={new Date()}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
