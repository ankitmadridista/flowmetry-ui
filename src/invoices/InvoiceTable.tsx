import type { InvoiceSummaryDto } from './invoices.api';

interface InvoiceTableProps {
  items: InvoiceSummaryDto[];
  sortBy: 'dueDate' | 'amount';
  sortDir: 'asc' | 'desc';
  onSortChange: (col: 'dueDate' | 'amount') => void;
}

const statusClass: Record<string, string> = {
  Draft:         'status-draft',
  Sent:          'status-sent',
  PartiallyPaid: 'status-partiallypaid',
  Paid:          'status-paid',
  Overdue:       'status-overdue',
  Cancelled:     'status-cancelled',
};

const statusLabel: Record<string, string> = {
  PartiallyPaid: 'Partially Paid',
};

export function InvoiceTable({ items, sortBy, sortDir, onSortChange }: InvoiceTableProps): React.JSX.Element {
  function indicator(col: 'dueDate' | 'amount') {
    if (col !== sortBy) return null;
    return <span className="sort-icon">{sortDir === 'asc' ? '▲' : '▼'}</span>;
  }

  return (
    <table className="invoice-table">
      <thead>
        <tr>
          <th>Invoice #</th>
          <th>Customer</th>
          <th className={`sortable${sortBy === 'amount' ? ' active' : ''}`}>
            <button type="button" onClick={() => onSortChange('amount')}>
              Amount {indicator('amount')}
            </button>
          </th>
          <th className={`sortable${sortBy === 'dueDate' ? ' active' : ''}`}>
            <button type="button" onClick={() => onSortChange('dueDate')}>
              Due Date {indicator('dueDate')}
            </button>
          </th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={5}>
              <div className="empty-state">No invoices found</div>
            </td>
          </tr>
        ) : (
          items.map(item => (
            <tr key={item.id}>
              <td><span className="invoice-id">INV-{String(item.invoiceNumber).padStart(5, '0')}</span></td>
              <td>{item.customerName}</td>
              <td><span className="amount">{item.amount.toFixed(2)}</span></td>
              <td>{item.dueDate}</td>
              <td>
                <span className={`status-badge ${statusClass[item.status] ?? ''}`}>
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
