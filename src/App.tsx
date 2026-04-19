import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import DashboardPage from './dashboard/DashboardPage';
import InvoiceListPage from './invoices/InvoiceListPage';
import InvoiceDetailPage from './invoices/InvoiceDetailPage';
import CustomerListPage from './customers/CustomerListPage';
import CustomerDetailPage from './customers/CustomerDetailPage';
import LoginPage from './auth/LoginPage';
import { useAuth } from './auth/AuthContext';
import { useTheme } from './utils/useTheme';
import { PermissionProvider, usePermissionContext } from './auth/PermissionContext';
import { useObjectEnabled, usePermission } from './auth/usePermissions';
import { ObjId, OpId } from './auth/permissions';
import './dashboard/dashboard.css';

function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '12px', textAlign: 'center' }}>
      <span style={{ fontSize: '48px' }}>🔒</span>
      <h2 style={{ margin: 0 }}>Access Restricted</h2>
      <p style={{ color: 'var(--text)', opacity: 0.6, margin: 0 }}>You don't have permission to view this page.</p>
      <button className="btn-primary" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

function PermissionRoute({ objId, children }: { objId: number; children: ReactNode }) {
  const { loading } = usePermissionContext();
  const canView = usePermission(objId, OpId.VIEW);
  if (loading) return null;
  if (!canView) return <AccessDenied />;
  return <>{children}</>;
}

function NavBar() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const showDashboard = useObjectEnabled(ObjId.DASHBOARD) && usePermission(ObjId.DASHBOARD, OpId.VIEW);
  const showInvoices = useObjectEnabled(ObjId.INVOICES) && usePermission(ObjId.INVOICES, OpId.VIEW);
  const showCustomers = useObjectEnabled(ObjId.CUSTOMERS) && usePermission(ObjId.CUSTOMERS, OpId.VIEW);

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <nav className="app-nav">
      <span className="app-nav-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        Flowmetry
      </span>
      {showDashboard && (
        <button className={`nav-link${isActive('/') && !isActive('/invoices') && !isActive('/customers') ? ' active' : ''}`} onClick={() => navigate('/')}>Dashboard</button>
      )}
      {showInvoices && (
        <button className={`nav-link${isActive('/invoices') ? ' active' : ''}`} onClick={() => navigate('/invoices')}>Invoices</button>
      )}
      {showCustomers && (
        <button className={`nav-link${isActive('/customers') ? ' active' : ''}`} onClick={() => navigate('/customers')}>Customers</button>
      )}
      <button className="nav-link" onClick={toggle} style={{ marginLeft: 'auto' }} aria-label="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      {user && (
        <span style={{ fontSize: '13px', color: 'var(--text)', opacity: 0.7, marginLeft: '8px' }}>
          {user.displayName}
        </span>
      )}
      <button className="nav-link" onClick={signOut}>Sign out</button>
    </nav>
  );
}

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <PermissionProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={
          <PermissionRoute objId={ObjId.DASHBOARD}>
            <DashboardPage />
          </PermissionRoute>
        } />
        <Route path="/invoices" element={
          <PermissionRoute objId={ObjId.INVOICES}>
            <InvoiceListPage />
          </PermissionRoute>
        } />
        <Route path="/invoices/:id" element={
          <PermissionRoute objId={ObjId.INVOICES}>
            <InvoiceDetailPage />
          </PermissionRoute>
        } />
        <Route path="/customers" element={
          <PermissionRoute objId={ObjId.CUSTOMERS}>
            <CustomerListPage />
          </PermissionRoute>
        } />
        <Route path="/customers/:id" element={
          <PermissionRoute objId={ObjId.CUSTOMERS}>
            <CustomerDetailPage />
          </PermissionRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PermissionProvider>
  );
}

export default function App(): React.JSX.Element {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}
