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
  const pageDisplay = totalCount === 0 ? '0 of 0 pages' : `Page ${page + 1} of ${totalPages}`;

  return (
    <div className="pagination">
      <span className="pagination-info">
        {totalCount > 0 ? `${totalCount} invoice${totalCount !== 1 ? 's' : ''}` : 'No invoices'}
      </span>

      <div className="pagination-controls">
        <span className="page-size-label">Rows per page</span>
        <select
          className="page-size-select"
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>

        <button
          type="button"
          className="btn-page"
          disabled={prevDisabled}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>

        <span className="pagination-info">{pageDisplay}</span>

        <button
          type="button"
          className="btn-page"
          disabled={nextDisabled}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
