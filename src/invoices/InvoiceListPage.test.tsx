/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvoiceListPage from './InvoiceListPage';
import type { PagedResult } from './invoices.api';

vi.mock('./invoices.api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./invoices.api')>();
  return {
    ...actual,
    getInvoices: vi.fn(),
  };
});

import { getInvoices } from './invoices.api';
const mockGetInvoices = getInvoices as ReturnType<typeof vi.fn>;

const emptyResult: PagedResult = { items: [], totalCount: 0, page: 0, pageSize: 25 };

const sampleItems: PagedResult = {
  items: [
    { id: 'inv-1', invoiceNumber: 1, customerName: 'Acme Corp', amount: 100.5, dueDate: '2024-01-15', status: 'Sent' },
    { id: 'inv-2', invoiceNumber: 2, customerName: 'Globex Ltd', amount: 200.0, dueDate: '2024-02-20', status: 'Paid' },
  ],
  totalCount: 2,
  page: 0,
  pageSize: 25,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('InvoiceListPage', () => {
  it('fetches with default filter on mount (Req 2.1)', async () => {
    mockGetInvoices.mockResolvedValue(emptyResult);

    render(<InvoiceListPage />);

    await waitFor(() => {
      expect(mockGetInvoices).toHaveBeenCalledWith(
        expect.objectContaining({ page: 0, pageSize: 25, sortBy: 'dueDate', sortDir: 'asc' })
      );
    });
  });

  it('shows loading indicator while fetch is pending (Req 2.2)', async () => {
    let resolve!: (v: PagedResult) => void;
    mockGetInvoices.mockReturnValue(new Promise<PagedResult>(r => { resolve = r; }));

    render(<InvoiceListPage />);

    expect(screen.getByText('Loading…')).toBeInTheDocument();

    await act(async () => { resolve(emptyResult); });
    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());
  });

  it('renders table rows on successful fetch (Req 2.3)', async () => {
    mockGetInvoices.mockResolvedValue(sampleItems);

    render(<InvoiceListPage />);

    await waitFor(() => {
      expect(screen.getByText('INV-00001')).toBeInTheDocument();
      expect(screen.getByText('INV-00002')).toBeInTheDocument();
    });
  });

  it('shows error message on fetch failure (Req 2.4)', async () => {
    mockGetInvoices.mockRejectedValue(new Error('Request failed with status 500'));

    render(<InvoiceListPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Request failed with status 500');
    });
  });

  it('filter change triggers new fetch and resets page to 0 (Req 2.5, 4.7)', async () => {
    mockGetInvoices.mockResolvedValue(sampleItems);

    render(<InvoiceListPage />);
    await waitFor(() => expect(mockGetInvoices).toHaveBeenCalledTimes(1));

    // Change a field then submit to trigger onFilterChange with a new filter value
    await act(async () => {
      await userEvent.type(screen.getByLabelText('customerName'), 'Acme');
      await userEvent.click(screen.getByRole('button', { name: /apply/i }));
    });

    await waitFor(() => {
      expect(mockGetInvoices).toHaveBeenCalledTimes(2);
      const lastCall = mockGetInvoices.mock.calls[1][0];
      expect(lastCall.page).toBe(0);
    });
  });

  it('sort change triggers new fetch and resets page to 0 (Req 2.5, 5.3)', async () => {
    mockGetInvoices.mockResolvedValue(sampleItems);

    render(<InvoiceListPage />);
    await waitFor(() => expect(mockGetInvoices).toHaveBeenCalledTimes(1));

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /amount/i }));
    });

    await waitFor(() => {
      expect(mockGetInvoices).toHaveBeenCalledTimes(2);
      const lastCall = mockGetInvoices.mock.calls[1][0];
      expect(lastCall.sortBy).toBe('amount');
      expect(lastCall.page).toBe(0);
    });
  });

  it('page size change triggers new fetch and resets page to 0 (Req 2.5, 6.6)', async () => {
    mockGetInvoices.mockResolvedValue(sampleItems);

    render(<InvoiceListPage />);
    await waitFor(() => expect(mockGetInvoices).toHaveBeenCalledTimes(1));

    await act(async () => {
      // Target the page size selector by its current displayed value (default 25)
      await userEvent.selectOptions(screen.getByDisplayValue('25'), '10');
    });

    await waitFor(() => {
      expect(mockGetInvoices).toHaveBeenCalledTimes(2);
      const lastCall = mockGetInvoices.mock.calls[1][0];
      expect(lastCall.pageSize).toBe(10);
      expect(lastCall.page).toBe(0);
    });
  });
});
