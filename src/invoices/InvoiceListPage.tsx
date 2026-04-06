import { useEffect, useState } from 'react';
import { getInvoices } from './invoices.api';
import type { InvoiceFilter, InvoiceSummaryDto } from './invoices.api';
import { FilterBar } from './FilterBar';
import { InvoiceTable } from './InvoiceTable';
import { PaginationControls } from './PaginationControls';
import CreateInvoiceModal from './CreateInvoiceModal';
import './invoices.css';

interface Props {
  onInvoiceSelect?: (id: string) => void;
}

export default function InvoiceListPage({ onInvoiceSelect }: Props): React.JSX.Element {
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

  function fetchInvoices() {
    let ignored = false;
    setLoading(true);
    setError(null);
    getInvoices({ ...filter, page, pageSize, sortBy, sortDir })
      .then(result => {
        if (!ignored) { setItems(result.items); setTotalCount(result.totalCount); }
      })
      .catch(err => { if (!ignored) setError(err.message); })
      .finally(() => { if (!ignored) setLoading(false); });
    return () => { ignored = true; };
  }

  useEffect(fetchInvoices, [filter, page, pageSize, sortBy, sortDir]);

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
        <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Invoice</button>
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
              onRowClick={onInvoiceSelect}
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
            fetchInvoices();
            onInvoiceSelect?.(id);
          }}
        />
      )}
    </div>
  );
}
