import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getCustomer, getCustomerRiskProfile, getCustomerInvoices,
  type CustomerSummaryDto, type RiskProfileDto, type CustomerInvoiceSummaryDto,
} from './customers.api';
import { formatCurrency } from '../utils/currency';
import './customers.css';

const riskClass: Record<string, string> = {
  Low: 'risk-low', Medium: 'risk-medium', High: 'risk-high',
};

const statusClass: Record<string, string> = {
  Draft: 'status-draft', Sent: 'status-sent', PartiallyPaid: 'status-partiallypaid',
  Paid: 'status-paid', Overdue: 'status-overdue', Cancelled: 'status-cancelled',
};

const statusLabel: Record<string, string> = { PartiallyPaid: 'Partially Paid' };

export default function CustomerDetailPage(): React.JSX.Element {
  const { id: customerId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerSummaryDto | null>(null);
  const [risk, setRisk] = useState<RiskProfileDto | null>(null);
  const [invoices, setInvoices] = useState<CustomerInvoiceSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;
    let ignored = false;
    async function fetchData() {
      setLoading(true);
      try {
        const [c, r, inv] = await Promise.all([
          getCustomer(customerId!),
          getCustomerRiskProfile(customerId!),
          getCustomerInvoices(customerId!),
        ]);
        if (!ignored) { setCustomer(c); setRisk(r); setInvoices(inv); }
      } catch (err) {
        if (!ignored) setError((err as Error).message);
      } finally {
        if (!ignored) setLoading(false);
      }
    }
     
    fetchData();
    return () => { ignored = true; };
  }, [customerId]);

  if (!customerId) return <div className="page-error">Invalid customer ID</div>;
  if (loading) return <div className="page-loading">Loading…</div>;
  if (error) return <div className="page-error" role="alert">{error}</div>;
  if (!customer || !risk) return <></>;

  return (
    <div className="detail-page">
      <button className="detail-back" onClick={() => navigate('/customers')}>← Back to Customers</button>

      <div className="detail-header">
        <div>
          <h1>{customer.name}</h1>
          <p>{customer.email}</p>
        </div>
        <span className={`risk-badge ${riskClass[customer.riskBand] ?? ''}`}>
          {customer.riskBand} Risk
        </span>
      </div>

      <div className="detail-section">
        <h2>Risk Profile</h2>
        <div className="detail-grid">
          <div className="detail-stat">
            <div className="detail-stat-label">Risk Score</div>
            <div className="detail-stat-value">{risk.riskScore}</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">Total Invoices</div>
            <div className="detail-stat-value">{risk.totalInvoices}</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">Overdue</div>
            <div className="detail-stat-value">{risk.overdueCount}</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">Partially Paid</div>
            <div className="detail-stat-value">{risk.partiallyPaidCount}</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">Late Payments</div>
            <div className="detail-stat-value">{risk.latePaymentCount}</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-label">Avg Days Late</div>
            <div className="detail-stat-value">{risk.averageDaysLate.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h2>Invoices</h2>
        <div className="detail-table-wrap">
          <table className="detail-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr><td colSpan={3}><div className="empty-detail">No invoices</div></td></tr>
              ) : invoices.map(inv => (
                <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/invoices/${inv.id}`)}>
                  <td>{formatCurrency(inv.amount)}</td>
                  <td>{inv.dueDate}</td>
                  <td>
                    <span className={`status-badge ${statusClass[inv.status] ?? ''}`}>
                      {statusLabel[inv.status] ?? inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
