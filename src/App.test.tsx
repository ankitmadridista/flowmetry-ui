import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import App from './App';

vi.mock('./invoices/invoices.api', () => ({
  getInvoices: vi.fn().mockReturnValue(new Promise(() => {})),
}));

describe('App', () => {
  it('renders InvoiceListPage', () => {
    render(<App />);
    // InvoiceListPage renders a filter form and invoice table
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
