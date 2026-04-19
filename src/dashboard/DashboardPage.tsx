import { useEffect, useState } from 'react';
import { getCashflowSummary, type CashflowSummary } from './dashboard.api';
import { formatCurrency } from '../utils/currency';
import './dashboard.css';

function fmt(value: number): string {
  return formatCurrency(value);
}

export default function DashboardPage(): React.JSX.Element {
  const [summary, setSummary] = useState<CashflowSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignored = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCashflowSummary();
        if (!ignored) setSummary(data);
      } catch (err) {
        if (!ignored) setError((err as Error).message);
      } finally {
        if (!ignored) setLoading(false);
      }
    }
     
    fetchData();
    return () => { ignored = true; };
  }, []);

  if (loading) return <div className="page-loading">Loading…</div>;
  if (error) return <div className="page-error" role="alert">{error}</div>;
  if (!summary) return <></>;

  return (
    <div className="dashboard-page">
      <h1>Cashflow</h1>
      <p className="dashboard-subtitle">Live snapshot of your receivables and payments</p>

      <div className="metric-grid">
        <div className="metric-card">
          <span className="metric-label">Total Receivable</span>
          <span className="metric-value">{fmt(summary.totalReceivable)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Total Paid</span>
          <span className="metric-value">{fmt(summary.totalPaid)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Total Unpaid</span>
          <span className="metric-value">{fmt(summary.totalUnpaid)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Monthly Inflow</span>
          <span className="metric-value">{fmt(summary.monthlyInflow)}</span>
        </div>
        <div className="metric-card overdue">
          <span className="metric-label">Overdue</span>
          <span className="metric-value">{fmt(summary.overdueAmount)}</span>
        </div>
      </div>
    </div>
  );
}
