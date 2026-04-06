import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InvoiceTable } from './InvoiceTable';
import type { InvoiceSummaryDto } from './invoices.api';

const sampleItems: InvoiceSummaryDto[] = [
  { id: 'inv-1', customerId: 'cust-a', amount: 100.5, dueDate: '2024-03-15', status: 'Sent' },
  { id: 'inv-2', customerId: 'cust-b', amount: 200, dueDate: '2024-04-01', status: 'Paid' },
  { id: 'inv-3', customerId: 'cust-c', amount: 9.99, dueDate: '2024-05-20', status: 'Draft' },
];

describe('InvoiceTable', () => {
  it('renders correct number of rows for a given items array', () => {
    render(<InvoiceTable items={sampleItems} sortBy="dueDate" sortDir="asc" onSortChange={vi.fn()} />);
    const rows = screen.getAllByRole('row');
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4);
  });

  it('renders all five column headers', () => {
    render(<InvoiceTable items={sampleItems} sortBy="dueDate" sortDir="asc" onSortChange={vi.fn()} />);
    expect(screen.getByText('Invoice ID')).toBeInTheDocument();
    expect(screen.getByText('Customer ID')).toBeInTheDocument();
    expect(screen.getByText(/Amount/)).toBeInTheDocument();
    expect(screen.getByText(/Due Date/)).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('shows "No invoices found" when items is empty', () => {
    render(<InvoiceTable items={[]} sortBy="dueDate" sortDir="asc" onSortChange={vi.fn()} />);
    expect(screen.getByText('No invoices found')).toBeInTheDocument();
  });

  it('shows ▲ on active sort column when sortDir is asc', () => {
    render(<InvoiceTable items={sampleItems} sortBy="amount" sortDir="asc" onSortChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Amount.*▲/ })).toBeInTheDocument();
  });

  it('shows ▼ on active sort column when sortDir is desc', () => {
    render(<InvoiceTable items={sampleItems} sortBy="dueDate" sortDir="desc" onSortChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Due Date.*▼/ })).toBeInTheDocument();
  });

  it('does not show indicator on inactive sort column', () => {
    render(<InvoiceTable items={sampleItems} sortBy="dueDate" sortDir="asc" onSortChange={vi.fn()} />);
    const amountBtn = screen.getByRole('button', { name: /Amount/ });
    expect(amountBtn.textContent).toBe('Amount');
  });

  it('formats amount with two decimal places', () => {
    render(<InvoiceTable items={sampleItems} sortBy="dueDate" sortDir="asc" onSortChange={vi.fn()} />);
    expect(screen.getByText('100.50')).toBeInTheDocument();
    expect(screen.getByText('200.00')).toBeInTheDocument();
    expect(screen.getByText('9.99')).toBeInTheDocument();
  });

  it('displays date in YYYY-MM-DD format', () => {
    render(<InvoiceTable items={sampleItems} sortBy="dueDate" sortDir="asc" onSortChange={vi.fn()} />);
    expect(screen.getByText('2024-03-15')).toBeInTheDocument();
    expect(screen.getByText('2024-04-01')).toBeInTheDocument();
  });
});
