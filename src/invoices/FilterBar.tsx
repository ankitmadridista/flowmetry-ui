import { useState } from 'react';
import type { InvoiceFilter } from './invoices.api';

interface FilterBarProps {
  value: InvoiceFilter;
  onFilterChange: (f: InvoiceFilter) => void;
}

type StatusOption = 'All' | 'Draft' | 'Sent' | 'PartiallyPaid' | 'Paid' | 'Overdue' | 'Cancelled';

function toStatusOption(filter: InvoiceFilter): StatusOption {
  if (filter.overdue) return 'Overdue';
  if (filter.status) return filter.status;
  return 'All';
}

export function FilterBar({ value, onFilterChange }: FilterBarProps): React.JSX.Element {
  const [draft, setDraft] = useState<InvoiceFilter>(value);

  function handleStatusChange(option: StatusOption) {
    if (option === 'Overdue') {
      setDraft(prev => ({ ...prev, overdue: true, status: undefined }));
    } else if (option === 'All') {
      setDraft(prev => ({ ...prev, status: undefined, overdue: undefined }));
    } else {
      setDraft(prev => ({ ...prev, status: option as InvoiceFilter['status'], overdue: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onFilterChange(draft);
  }

  return (
    <form className="filter-bar" onSubmit={handleSubmit}>
      <div className="filter-field">
        <label htmlFor="customerName">Customer</label>
        <input
          id="customerName"
          type="text"
          placeholder="Search by name..."
          value={draft.customerName ?? ''}
          onChange={e => setDraft(prev => ({ ...prev, customerName: e.target.value || undefined }))}
          aria-label="customerName"
        />
      </div>

      <div className="filter-field">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={toStatusOption(draft)}
          onChange={e => handleStatusChange(e.target.value as StatusOption)}
          aria-label="status"
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

      <div className="filter-field">
        <label htmlFor="dueDateFrom">Due From</label>
        <input
          id="dueDateFrom"
          type="date"
          value={draft.dueDateFrom ?? ''}
          onChange={e => setDraft(prev => ({ ...prev, dueDateFrom: e.target.value || undefined }))}
          aria-label="dueDateFrom"
        />
      </div>

      <div className="filter-field">
        <label htmlFor="dueDateTo">Due To</label>
        <input
          id="dueDateTo"
          type="date"
          value={draft.dueDateTo ?? ''}
          onChange={e => setDraft(prev => ({ ...prev, dueDateTo: e.target.value || undefined }))}
          aria-label="dueDateTo"
        />
      </div>

      <div className="filter-actions">
        <button type="submit" className="btn-primary">Apply Filters</button>
      </div>
    </form>
  );
}
