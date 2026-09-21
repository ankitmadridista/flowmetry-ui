import { useState } from 'react';
import { createCustomer } from './customers.api';
import '../invoices/invoices.css';

interface Props {
  onClose: () => void;
  onCreated: (id: string) => void;
}

export default function CreateCustomerModal({ onClose, onCreated }: Props): React.JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setSubmitting(true);
    try {
      const id = await createCustomer(name.trim(), email.trim());
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
        <h2>New Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="cc-name">Name</label>
            <input
              id="cc-name"
              type="text"
              placeholder="Full name or company"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-field">
            <label htmlFor="cc-email">Email</label>
            <input
              id="cc-email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
