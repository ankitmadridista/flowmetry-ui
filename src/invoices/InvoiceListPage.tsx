import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInvoices } from './invoices.api';
import type { InvoiceFilter, InvoiceSummaryDto } from './invoices.api';
import { FilterBar } from './FilterBar';
import { InvoiceTable } from './InvoiceTable';
import { PaginationControls } from './PaginationControls';
import CreateInvoiceModal from './CreateInvoiceModal';
import { usePermission } from '../auth/usePermissions';
import { ObjId, OpId } from '../auth/permissions';
import './invoices.css';

export default function InvoiceListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<InvoiceFilter>({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState<'dueDate' | 'amount'>('dueDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [items, setItems] = useState<InvoiceSummaryDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const canCreateInvoice = usePermission(ObjId.INVOICES, OpId.CREATE);
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    let ignored = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const result = await getInvoices({ ...filter, page, pageSize, sortBy, sortDir });
        if (!ignored) { setItems(result.items); setTotalCount(result.totalCount); }
      } catch (err) {
        if (!ignored) setError((err as Error).message);
      } finally {
        if (!ignored) setLoading(false);
      }
    }
     
    fetchData();
    return () => { ignored = true; };
   
  }, [filter, page, pageSize, sortBy, sortDir, refreshKey]);

  function onFilterChange(f: InvoiceFilter) { setFilter(f); setPage(0); }

  function onSortChange(col: 'dueDate' | 'amount') {
    if (col === sortBy) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
    setPage(0);
  }

  return (
    <div className="invoice-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Invoices</h1>
        {canCreateInvoice && (
          <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Invoice</button>
        )}
      </div>
      <FilterBar value={filter} onFilterChange={onFilterChange} />
      {error && <p className="error-state" role="alert">{error}</p>}
      {loading
        ? <div className="loading-state">Loading…</div>
        : (
          <div className="invoice-table-wrap">
            <InvoiceTable
              items={items}
              sortBy={sortBy}
              sortDir={sortDir}
              onSortChange={onSortChange}
              onRowClick={id => navigate(`/invoices/${id}`)}
            />
          </div>
        )
      }
      <PaginationControls
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={ps => { setPageSize(ps); setPage(0); }}
      />
      {showCreate && (
        <CreateInvoiceModal
          onClose={() => setShowCreate(false)}
          onCreated={id => {
            setShowCreate(false);
            triggerRefresh();
            navigate(`/invoices/${id}`);
          }}
        />
      )}
    </div>
  );
}
