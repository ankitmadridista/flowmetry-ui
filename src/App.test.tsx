/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth/AuthContext';

vi.mock('./invoices/invoices.api', () => ({
  getInvoices: vi.fn().mockReturnValue(new Promise(() => {})),
}));

vi.mock('./dashboard/dashboard.api', () => ({
  getCashflowSummary: vi.fn().mockReturnValue(new Promise(() => {})),
}));

// Mock auth so the app renders the main layout (not the login page)
vi.mock('./auth/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./auth/AuthContext')>();
  return {
    ...actual,
    useAuth: () => ({
      isAuthenticated: true,
      user: { id: '1', email: 'test@test.com', displayName: 'Test User' },
      token: 'mock-token',
      signIn: vi.fn(),
      signOut: vi.fn(),
    }),
  };
});

function renderApp() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('App', () => {
  it('renders nav with all page links', () => {
    renderApp();
    expect(screen.getByText('Flowmetry')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Invoices' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Customers' })).toBeInTheDocument();
  });

  it('shows Dashboard page by default', () => {
    renderApp();
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveClass('active');
  });
});
