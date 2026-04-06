import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterBar } from './FilterBar';
import type { InvoiceFilter } from './invoices.api';

const emptyFilter: InvoiceFilter = {};

describe('FilterBar', () => {
  it('renders customerId input', () => {
    render(<FilterBar value={emptyFilter} onFilterChange={vi.fn()} />);
    expect(screen.getByLabelText('customerName')).toBeInTheDocument();
  });

  it('renders status dropdown with All/Draft/Sent/Paid/Overdue options', () => {
    render(<FilterBar value={emptyFilter} onFilterChange={vi.fn()} />);
    const select = screen.getByLabelText('status');
    expect(select).toBeInTheDocument();
    const options = Array.from((select as HTMLSelectElement).options).map(o => o.value);
    expect(options).toEqual(['All', 'Draft', 'Sent', 'PartiallyPaid', 'Paid', 'Overdue', 'Cancelled']);
  });

  it('renders dueDateFrom and dueDateTo date inputs', () => {
    render(<FilterBar value={emptyFilter} onFilterChange={vi.fn()} />);
    expect(screen.getByLabelText('dueDateFrom')).toBeInTheDocument();
    expect(screen.getByLabelText('dueDateTo')).toBeInTheDocument();
  });

  it('selecting "Overdue" sets overdue=true and clears status in the emitted filter', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar value={{ status: 'Paid' }} onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByLabelText('status'), { target: { value: 'Overdue' } });
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(onFilterChange).toHaveBeenCalledOnce();
    const emitted: InvoiceFilter = onFilterChange.mock.calls[0][0];
    expect(emitted.overdue).toBe(true);
    expect(emitted.status).toBeUndefined();
  });

  it('selecting a non-Overdue status sets status and clears overdue in the emitted filter', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar value={{ overdue: true }} onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByLabelText('status'), { target: { value: 'Paid' } });
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(onFilterChange).toHaveBeenCalledOnce();
    const emitted: InvoiceFilter = onFilterChange.mock.calls[0][0];
    expect(emitted.status).toBe('Paid');
    expect(emitted.overdue).toBeUndefined();
  });

  it('submitting the form calls onFilterChange with current values', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar value={{ customerId: 'abc', dueDateFrom: '2024-01-01' }} onFilterChange={onFilterChange} />);

    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(onFilterChange).toHaveBeenCalledOnce();
    const emitted: InvoiceFilter = onFilterChange.mock.calls[0][0];
    expect(emitted.customerId).toBe('abc');
    expect(emitted.dueDateFrom).toBe('2024-01-01');
  });
});
