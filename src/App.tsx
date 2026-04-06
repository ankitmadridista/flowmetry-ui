import { useState } from 'react';
import DashboardPage from './dashboard/DashboardPage';
import InvoiceListPage from './invoices/InvoiceListPage';
import InvoiceDetailPage from './invoices/InvoiceDetailPage';
import CustomerListPage from './customers/CustomerListPage';
import CustomerDetailPage from './customers/CustomerDetailPage';
import { useTheme } from './utils/useTheme';
import './dashboard/dashboard.css';

type TopPage = 'dashboard' | 'invoices' | 'customers';

type View =
  | { page: TopPage }
  | { page: 'invoice-detail'; invoiceId: string; from: TopPage | 'customer-detail' }
  | { page: 'customer-detail'; customerId: string };

export default function App(): React.JSX.Element {
  const [view, setView] = useState<View>({ page: 'dashboard' });
  const { theme, toggle } = useTheme();

  const activePage: TopPage =
    view.page === 'invoice-detail'
      ? (view.from === 'customer-detail' ? 'customers' : view.from)
      : view.page === 'customer-detail' ? 'customers'
      : view.page;

  return (
    <>
      <nav className="app-nav">
        <span className="app-nav-brand">Flowmetry</span>
        <button
          className={`nav-link${activePage === 'dashboard' ? ' active' : ''}`}
          onClick={() => setView({ page: 'dashboard' })}
        >
          Dashboard
        </button>
        <button
          className={`nav-link${activePage === 'invoices' ? ' active' : ''}`}
          onClick={() => setView({ page: 'invoices' })}
        >
          Invoices
        </button>
        <button
          className={`nav-link${activePage === 'customers' ? ' active' : ''}`}
          onClick={() => setView({ page: 'customers' })}
        >
          Customers
        </button>
        <button
          className="nav-link"
          onClick={toggle}
          style={{ marginLeft: 'auto' }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </nav>

      {view.page === 'dashboard' && <DashboardPage />}

      {view.page === 'invoices' && (
        <InvoiceListPage
          onInvoiceSelect={id => setView({ page: 'invoice-detail', invoiceId: id, from: 'invoices' })}
        />
      )}

      {view.page === 'invoice-detail' && (
        <InvoiceDetailPage
          invoiceId={view.invoiceId}
          onBack={() => {
            if (view.from === 'customer-detail') {
              // We don't have the customerId here — go back to customer list
              setView({ page: 'customers' });
            } else {
              setView({ page: view.from });
            }
          }}
        />
      )}

      {view.page === 'customers' && (
        <CustomerListPage
          onSelect={id => setView({ page: 'customer-detail', customerId: id })}
        />
      )}

      {view.page === 'customer-detail' && (
        <CustomerDetailPage
          customerId={view.customerId}
          onBack={() => setView({ page: 'customers' })}
          onInvoiceSelect={id => setView({ page: 'invoice-detail', invoiceId: id, from: 'customer-detail' })}
        />
      )}
    </>
  );
}
