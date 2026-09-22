interface PaginationControlsProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (ps: number) => void;
}

export function PaginationControls({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps): React.JSX.Element {
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / pageSize);
  const prevDisabled = page === 0 || totalCount === 0;
  const nextDisabled = (page + 1) * pageSize >= totalCount || totalCount === 0;
  const pageDisplay =
    totalCount === 0 ? "0 of 0 pages" : `Page ${page + 1} of ${totalPages}`;

  // Shared text style
  const infoClass = "text-[13px] text-foreground/75";

  // Shared button style
  const btnClass =
    "h-[34px] px-3.5 border border-border rounded-md bg-background text-heading text-[13px] font-medium cursor-pointer transition-colors hover:not-disabled:border-accent hover:not-disabled:text-accent disabled:opacity-35 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-wrap gap-3 py-1">
      <span className={infoClass}>
        {totalCount > 0
          ? `${totalCount} invoice${totalCount !== 1 ? "s" : ""}`
          : "No invoices"}
      </span>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Hidden on very small screens, matches original media query logic */}
        <span className={`hidden sm:inline ${infoClass}`}>Rows per page</span>

        <select
          className="h-8.5 px-2.5 border border-border rounded-md bg-background text-heading text-[13px] cursor-pointer outline-none focus:border-accent"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>

        <button
          type="button"
          className={btnClass}
          disabled={prevDisabled}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>

        <span className={infoClass}>{pageDisplay}</span>

        <button
          type="button"
          className={btnClass}
          disabled={nextDisabled}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
