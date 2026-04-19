import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, type CustomerSummaryDto } from './customers.api';
import CreateCustomerModal from './CreateCustomerModal';
import { usePermission } from '../auth/usePermissions';
import { ObjId, OpId } from '../auth/permissions';
import './customers.css';

const riskClass: Record<string, string> = {
  Low: 'risk-low',
  Medium: 'risk-medium',
  High: 'risk-high',
};

export default function CustomerListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<CustomerSummaryDto[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const canCreateCustomer = usePermission(ObjId.CUSTOMERS, OpId.CREATE);
  const [refreshKey, setRefreshKey] = useState(0);
  const load = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCustomers();
        if (!cancelled) setCustomers(data);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
   
  }, [refreshKey]);

  const filtered = search.trim()
    ? customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      )
    : customers;

  if (loading) return <div className="page-loading">Loading…</div>;
  if (error) return <div className="page-error" role="alert">{error}</div>;

  return (
    <div className="customer-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Customers</h1>
        {canCreateCustomer && (
          <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Customer</button>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ height: '38px', padding: '0 12px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-h)', fontSize: '14px', fontFamily: 'var(--sans)', outline: 'none', width: '280px' }}
        />
      </div>

      <div className="customer-table-wrap">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={3}><div className="empty-state">No customers found</div></td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} onClick={() => navigate(`/customers/${c.id}`)}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>
                  <span className={`risk-badge ${riskClass[c.riskBand] ?? ''}`}>
                    {c.riskBand}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreateCustomerModal
          onClose={() => setShowCreate(false)}
          onCreated={id => {
            setShowCreate(false);
            load();
            navigate(`/customers/${id}`);
          }}
        />
      )}
    </div>
  );
}
