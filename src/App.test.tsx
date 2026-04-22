/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react';
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

// Mock permissions API so all objects are enabled and all permissions are granted
vi.mock('./auth/permissions.api', () => ({
  getPermissions: vi.fn().mockResolvedValue({
    securityObjectStatus: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true },
    permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  }),
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
  it('renders nav with all page links', async () => {
    renderApp();
    expect(screen.getByText('Flowmetry')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Invoices' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Customers' })).toBeInTheDocument();
  });

  it('shows Dashboard page by default', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveClass('active');
    });
  });
});
