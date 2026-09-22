import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getInvoices } from "../api/invoices.api";
import type { InvoiceFilter, InvoiceSummaryDto } from "../api/invoices.api";
import { FilterBar } from "../components/FilterBar";
import { InvoiceTable } from "../components/InvoiceTable";
import { PaginationControls } from "../components/PaginationControls";
import CreateInvoiceModal from "../components/CreateInvoiceModal";
import { usePermission } from "../../auth/hooks/usePermissions";
import { ObjId, OpId } from "../../auth/permissions";

export default function InvoiceListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<InvoiceFilter>({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState<"dueDate" | "amount">("dueDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [items, setItems] = useState<InvoiceSummaryDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const canCreateInvoice = usePermission(ObjId.INVOICES, OpId.CREATE);
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let ignored = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const result = await getInvoices({
          ...filter,
          page,
          pageSize,
          sortBy,
          sortDir,
        });
        if (!ignored) {
          setItems(result.items);
          setTotalCount(result.totalCount);
        }
      } catch (err) {
        if (!ignored) setError((err as Error).message);
      } finally {
        if (!ignored) setLoading(false);
      }
    }

    fetchData();
    return () => {
      ignored = true;
    };
  }, [filter, page, pageSize, sortBy, sortDir, refreshKey]);

  function onFilterChange(f: InvoiceFilter) {
    setFilter(f);
    setPage(0);
  }

  function onSortChange(col: "dueDate" | "amount") {
    if (col === sortBy) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
    setPage(0);
  }

  return (
    <div className="p-5 md:p-8 md:px-10 max-w-300 mx-auto w-full text-foreground">
      <div className="flex items-center justify-between mb-6">
        <h1 className="m-0 text-2xl md:text-[28px] font-heading font-semibold text-heading tracking-tight">
          Invoices
        </h1>
        {canCreateInvoice && (
          <button
            className="h-9.5 px-5 bg-accent text-white border-none rounded-md text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap shadow-theme"
            onClick={() => setShowCreate(true)}
          >
            + New Invoice
          </button>
        )}
      </div>

      <FilterBar value={filter} onFilterChange={onFilterChange} />

      {error && (
        <p
          className="bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900 rounded-lg py-3.5 px-4 text-sm mb-4"
          role="alert"
        >
          {error}
        </p>
      )}

      {loading ? (
        <div className="py-10 text-center text-foreground/60 text-sm font-medium">
          Loading…
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-x-auto mb-4 shadow-sm">
          <InvoiceTable
            items={items}
            sortBy={sortBy}
            sortDir={sortDir}
            onSortChange={onSortChange}
            onRowClick={(id) => navigate(`/invoices/${id}`)}
          />
        </div>
      )}

      <PaginationControls
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={(ps) => {
          setPageSize(ps);
          setPage(0);
        }}
      />

      {showCreate && (
        <CreateInvoiceModal
          onClose={() => setShowCreate(false)}
          onCreated={(id) => {
            setShowCreate(false);
            triggerRefresh();
            navigate(`/invoices/${id}`);
          }}
        />
      )}
    </div>
  );
}
