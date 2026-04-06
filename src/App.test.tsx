import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import App from './App';

vi.mock('./invoices/invoices.api', () => ({
  getInvoices: vi.fn().mockReturnValue(new Promise(() => {})),
}));

vi.mock('./dashboard/dashboard.api', () => ({
  getCashflowSummary: vi.fn().mockReturnValue(new Promise(() => {})),
}));

describe('App', () => {
  it('renders nav with all page links', () => {
    render(<App />);
    expect(screen.getByText('Flowmetry')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Invoices' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Customers' })).toBeInTheDocument();
  });

  it('shows Dashboard page by default', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveClass('active');
  });
});
