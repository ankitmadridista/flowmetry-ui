import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomers, type CustomerSummaryDto } from "../api/customers.api";
import CreateCustomerModal from "../components/CreateCustomerModal";
import { usePermission } from "../../auth/hooks/usePermissions";
import { ObjId, OpId } from "../../auth/permissions";
// import './customers.css'; <-- Removed!

const riskClass: Record<string, string> = {
  Low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500",
  High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function CustomerListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<CustomerSummaryDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const canCreateCustomer = usePermission(ObjId.CUSTOMERS, OpId.CREATE);
  const [refreshKey, setRefreshKey] = useState(0);
  const load = useCallback(() => setRefreshKey((k) => k + 1), []);

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
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const filtered = search.trim()
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()),
      )
    : customers;

  if (loading)
    return (
      <div className="py-16 px-10 text-center text-foreground/60 text-sm font-medium">
        Loading…
      </div>
    );
  if (error)
    return (
      <div
        className="my-8 mx-4 md:mx-10 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900 rounded-lg py-3.5 px-4 text-sm"
        role="alert"
      >
        {error}
      </div>
    );

  return (
    <div className="p-5 md:p-8 md:px-10 max-w-300 mx-auto w-full text-foreground">
      <div className="flex items-center justify-between mb-5">
        <h1 className="m-0 text-2xl md:text-[28px] font-heading font-semibold text-heading tracking-tight">
          Customers
        </h1>
        {canCreateCustomer && (
          <button
            className="h-9.5 px-5 bg-accent text-white border-none rounded-md text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap shadow-theme"
            onClick={() => setShowCreate(true)}
          >
            + New Customer
          </button>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9.5 px-3 border border-border rounded-md bg-background text-heading text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent-bg w-full max-w-70"
        />
      </div>

      <div className="border border-border rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full min-w-100 border-collapse text-sm">
          <thead className="bg-code">
            <tr>
              <th className="p-3 sm:px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70 border-b border-border">
                Name
              </th>
              <th className="p-3 sm:px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70 border-b border-border">
                Email
              </th>
              <th className="p-3 sm:px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70 border-b border-border">
                Risk
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <div className="text-center py-16 px-5 text-foreground/60 text-[15px]">
                    No customers found
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/customers/${c.id}`)}
                  className="cursor-pointer border-b border-border last:border-b-0 hover:bg-accent-bg transition-colors"
                >
                  <td className="p-3 sm:px-4 py-3.5 align-middle text-heading">
                    {c.name}
                  </td>
                  <td className="p-3 sm:px-4 py-3.5 align-middle text-heading">
                    {c.email}
                  </td>
                  <td className="p-3 sm:px-4 py-3.5 align-middle">
                    <span
                      className={`inline-block px-2.5 py-0.75 rounded-full text-xs font-semibold uppercase tracking-[0.4px] ${riskClass[c.riskBand] ?? ""}`}
                    >
                      {c.riskBand}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreateCustomerModal
          onClose={() => setShowCreate(false)}
          onCreated={(id) => {
            setShowCreate(false);
            load();
            navigate(`/customers/${id}`);
          }}
        />
      )}
    </div>
  );
}
