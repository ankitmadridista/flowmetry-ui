/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useObjectEnabled, usePermission } from './usePermissions';
import { ObjId, OpId } from './permissions';

// ---------------------------------------------------------------------------
// Mock PermissionContext — controls what all hooks read from context
// ---------------------------------------------------------------------------
const mockContextValue = {
  securityObjectStatus: {} as Record<number, boolean>,
  permissions: [] as number[],
  loading: false,
  error: null,
};

vi.mock('./PermissionContext', () => ({
  usePermissionContext: () => mockContextValue,
}));

// ---------------------------------------------------------------------------
// Mock AuthContext for InvoiceListPage (needs useAuth)
// ---------------------------------------------------------------------------
vi.mock('../auth/AuthContext', () => ({
  useAuth: () => ({
    token: 'fake-token',
    user: { displayName: 'Test User' },
    isAuthenticated: true,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}));

// ---------------------------------------------------------------------------
// Mock invoices.api so InvoiceListPage doesn't make real network calls
// ---------------------------------------------------------------------------
vi.mock('../invoices/invoices.api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../invoices/invoices.api')>();
  return {
    ...actual,
    getInvoices: vi.fn().mockResolvedValue({ items: [], totalCount: 0, page: 0, pageSize: 25 }),
  };
});

// ---------------------------------------------------------------------------
// Helper components for hook tests
// ---------------------------------------------------------------------------
function UsePermissionHelper({ objId, operationId }: { objId: number; operationId: number }) {
  const result = usePermission(objId, operationId);
  return <div data-testid="result">{String(result)}</div>;
}

function UseObjectEnabledHelper({ objId }: { objId: number }) {
  const result = useObjectEnabled(objId);
  return <div data-testid="result">{String(result)}</div>;
}

// ---------------------------------------------------------------------------
// Test Group 1: usePermission hook (Req 6.2, 6.3, 6.4)
// ---------------------------------------------------------------------------
describe('usePermission hook', () => {
  beforeEach(() => {
    mockContextValue.securityObjectStatus = {};
    mockContextValue.permissions = [];
  });

  it('returns false when the security object is disabled (Req 6.2)', () => {
    // INVOICES disabled; permission 6 = Invoices-Create is present but object is off
    mockContextValue.securityObjectStatus = { [ObjId.INVOICES]: false };
    mockContextValue.permissions = [6];

    render(<UsePermissionHelper objId={ObjId.INVOICES} operationId={OpId.CREATE} />);

    expect(screen.getByTestId('result')).toHaveTextContent('false');
  });

  it('returns true when object is enabled and permission is present (Req 6.3)', () => {
    // INVOICES enabled; permission 6 = Invoices-Create
    mockContextValue.securityObjectStatus = { [ObjId.INVOICES]: true };
    mockContextValue.permissions = [6];

    render(<UsePermissionHelper objId={ObjId.INVOICES} operationId={OpId.CREATE} />);

    expect(screen.getByTestId('result')).toHaveTextContent('true');
  });

  it('returns false when object is enabled but permission is absent (Req 6.4)', () => {
    // INVOICES enabled; only View (5) present, not Create (6)
    mockContextValue.securityObjectStatus = { [ObjId.INVOICES]: true };
    mockContextValue.permissions = [5];

    render(<UsePermissionHelper objId={ObjId.INVOICES} operationId={OpId.CREATE} />);

    expect(screen.getByTestId('result')).toHaveTextContent('false');
  });
});

// ---------------------------------------------------------------------------
// Test Group 2: useObjectEnabled hook (Req 7.2, 7.3)
// ---------------------------------------------------------------------------
describe('useObjectEnabled hook', () => {
  beforeEach(() => {
    mockContextValue.securityObjectStatus = {};
    mockContextValue.permissions = [];
  });

  it('returns true when the object is enabled (Req 7.2)', () => {
    mockContextValue.securityObjectStatus = { [ObjId.INVOICES]: true };

    render(<UseObjectEnabledHelper objId={ObjId.INVOICES} />);

    expect(screen.getByTestId('result')).toHaveTextContent('true');
  });

  it('returns false when the object is disabled (Req 7.3)', () => {
    mockContextValue.securityObjectStatus = { [ObjId.INVOICES]: false };

    render(<UseObjectEnabledHelper objId={ObjId.INVOICES} />);

    expect(screen.getByTestId('result')).toHaveTextContent('false');
  });

  it('returns false when the object is not in the status map (Req 7.3)', () => {
    mockContextValue.securityObjectStatus = {};

    render(<UseObjectEnabledHelper objId={ObjId.INVOICES} />);

    expect(screen.getByTestId('result')).toHaveTextContent('false');
  });
});

// ---------------------------------------------------------------------------
// Test Group 3: InvoiceListPage — action button visibility (Req 9.1)
// ---------------------------------------------------------------------------
import InvoiceListPage from '../invoices/InvoiceListPage';

describe('InvoiceListPage — action button visibility', () => {
  beforeEach(() => {
    mockContextValue.securityObjectStatus = {};
    mockContextValue.permissions = [];
  });

  it('does NOT render "+ New Invoice" when user lacks Create permission (Req 9.1)', async () => {
    // No permissions, INVOICES disabled → canCreateInvoice = false
    mockContextValue.securityObjectStatus = { [ObjId.INVOICES]: true };
    mockContextValue.permissions = []; // no Create permission

    render(<MemoryRouter><InvoiceListPage /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /\+ New Invoice/i })).not.toBeInTheDocument();
    });
  });

  it('renders "+ New Invoice" when user has Create permission (Req 9.1)', async () => {
    // INVOICES enabled + permission 6 = Invoices-Create
    mockContextValue.securityObjectStatus = { [ObjId.INVOICES]: true };
    mockContextValue.permissions = [6];

    render(<MemoryRouter><InvoiceListPage /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /\+ New Invoice/i })).toBeInTheDocument();
    });
  });
});
