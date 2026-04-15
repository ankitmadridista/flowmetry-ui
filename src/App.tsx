import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import DashboardPage from './dashboard/DashboardPage';
import InvoiceListPage from './invoices/InvoiceListPage';
import InvoiceDetailPage from './invoices/InvoiceDetailPage';
import CustomerListPage from './customers/CustomerListPage';
import CustomerDetailPage from './customers/CustomerDetailPage';
import LoginPage from './auth/LoginPage';
import { useAuth } from './auth/AuthContext';
import { useTheme } from './utils/useTheme';
import './dashboard/dashboard.css';

function NavBar() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <nav className="app-nav">
      <span className="app-nav-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        Flowmetry
      </span>
      <button className={`nav-link${isActive('/') && !isActive('/invoices') && !isActive('/customers') ? ' active' : ''}`} onClick={() => navigate('/')}>Dashboard</button>
      <button className={`nav-link${isActive('/invoices') ? ' active' : ''}`} onClick={() => navigate('/invoices')}>Invoices</button>
      <button className={`nav-link${isActive('/customers') ? ' active' : ''}`} onClick={() => navigate('/customers')}>Customers</button>
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
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/invoices" element={<InvoiceListPage />} />
        <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
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
