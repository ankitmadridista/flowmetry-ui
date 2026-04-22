import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, type ReactNode } from 'react';
import DashboardPage from './dashboard/DashboardPage';
import InvoiceListPage from './invoices/InvoiceListPage';
import InvoiceDetailPage from './invoices/InvoiceDetailPage';
import CustomerListPage from './customers/CustomerListPage';
import CustomerDetailPage from './customers/CustomerDetailPage';
import LoginPage from './auth/LoginPage';
import SecurityAdminPage from './security-admin/SecurityAdminPage';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const showDashboard = useObjectEnabled(ObjId.DASHBOARD) && usePermission(ObjId.DASHBOARD, OpId.VIEW);
  const showInvoices = useObjectEnabled(ObjId.INVOICES) && usePermission(ObjId.INVOICES, OpId.VIEW);
  const showCustomers = useObjectEnabled(ObjId.CUSTOMERS) && usePermission(ObjId.CUSTOMERS, OpId.VIEW);
  const showSecurity = useObjectEnabled(ObjId.SECURITY) && usePermission(ObjId.SECURITY, OpId.VIEW);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  function go(path: string) {
    navigate(path);
    setMenuOpen(false);
  }

  return (
    <nav className="app-nav">
      {/* ── Brand ── */}
      <span className="app-nav-brand" style={{ cursor: 'pointer' }} onClick={() => go('/')}>
        Flowmetry
      </span>

      {/* ── Desktop links ── */}
      <div className="nav-links-desktop">
        {showDashboard && (
          <button className={`nav-link${isActive('/') && !isActive('/invoices') && !isActive('/customers') && !isActive('/security') ? ' active' : ''}`} onClick={() => go('/')}>Dashboard</button>
        )}
        {showInvoices && (
          <button className={`nav-link${isActive('/invoices') ? ' active' : ''}`} onClick={() => go('/invoices')}>Invoices</button>
        )}
        {showCustomers && (
          <button className={`nav-link${isActive('/customers') ? ' active' : ''}`} onClick={() => go('/customers')}>Customers</button>
        )}
        {showSecurity && (
          <button className={`nav-link${isActive('/security') ? ' active' : ''}`} onClick={() => go('/security')}>Security</button>
        )}
      </div>

      {/* ── Right side ── */}
      <div className="nav-right">
        <button className="nav-link" onClick={toggle} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <span className="nav-user-name">
          {user?.displayName}
        </span>
        <button className="nav-link" onClick={signOut}>Sign out</button>
      </div>

      {/* ── Hamburger (mobile only) ── */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(o => !o)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span className={`nav-hamburger-icon${menuOpen ? ' open' : ''}`} />
      </button>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          {showDashboard && (
            <button className={`nav-mobile-link${isActive('/') && !isActive('/invoices') && !isActive('/customers') && !isActive('/security') ? ' active' : ''}`} onClick={() => go('/')}>Dashboard</button>
          )}
          {showInvoices && (
            <button className={`nav-mobile-link${isActive('/invoices') ? ' active' : ''}`} onClick={() => go('/invoices')}>Invoices</button>
          )}
          {showCustomers && (
            <button className={`nav-mobile-link${isActive('/customers') ? ' active' : ''}`} onClick={() => go('/customers')}>Customers</button>
          )}
          {showSecurity && (
            <button className={`nav-mobile-link${isActive('/security') ? ' active' : ''}`} onClick={() => go('/security')}>Security</button>
          )}
          <div className="nav-mobile-divider" />
          <button className="nav-mobile-link" onClick={toggle}>
            {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
          </button>
          {user && <span className="nav-mobile-user">{user.displayName}</span>}
          <button className="nav-mobile-link nav-mobile-signout" onClick={() => { signOut(); setMenuOpen(false); }}>Sign out</button>
        </div>
      )}
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
        <Route path="/security" element={
          <PermissionRoute objId={ObjId.SECURITY}>
            <SecurityAdminPage />
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
