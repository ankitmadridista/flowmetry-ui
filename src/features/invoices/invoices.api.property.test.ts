// Feature: invoice-list-ui, Property 1: Filter serialization round-trip
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { serializeFilter, type InvoiceFilter } from './invoices.api';

// Validates: Requirements 1.6

const statusArb = fc.constantFrom('Draft', 'Sent', 'Paid', 'Overdue' as const);
const sortByArb = fc.constantFrom('dueDate', 'amount' as const);
const sortDirArb = fc.constantFrom('asc', 'desc' as const);

// ISO date string generator: YYYY-MM-DD (using integer ranges to avoid invalid Date objects)
const isoDateArb = fc
  .record({
    year: fc.integer({ min: 2000, max: 2099 }),
    month: fc.integer({ min: 1, max: 12 }),
    day: fc.integer({ min: 1, max: 28 }), // cap at 28 to avoid month-end edge cases
  })
  .map(({ year, month, day }) => {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  });

const invoiceFilterArb: fc.Arbitrary<InvoiceFilter> = fc.record(
  {
    customerId: fc.option(fc.uuid(), { nil: undefined }),
    status: fc.option(statusArb, { nil: undefined }),
    dueDateFrom: fc.option(isoDateArb, { nil: undefined }),
    dueDateTo: fc.option(isoDateArb, { nil: undefined }),
    overdue: fc.option(fc.boolean(), { nil: undefined }),
    page: fc.option(fc.nat({ max: 1000 }), { nil: undefined }),
    pageSize: fc.option(fc.constantFrom(10, 25, 50), { nil: undefined }),
    sortBy: fc.option(sortByArb, { nil: undefined }),
    sortDir: fc.option(sortDirArb, { nil: undefined }),
  },
  { requiredKeys: [] }
);

/**
 * Parse a URLSearchParams back into an InvoiceFilter.
 * Mirrors the serialization logic in serializeFilter — only known fields are parsed,
 * and types are coerced back to their original form.
 */
function parseFilter(params: URLSearchParams): InvoiceFilter {
  const result: InvoiceFilter = {};

  const customerId = params.get('customerId');
  if (customerId !== null) result.customerId = customerId;

  const status = params.get('status');
  if (status !== null) result.status = status as InvoiceFilter['status'];

  const dueDateFrom = params.get('dueDateFrom');
  if (dueDateFrom !== null) result.dueDateFrom = dueDateFrom;

  const dueDateTo = params.get('dueDateTo');
  if (dueDateTo !== null) result.dueDateTo = dueDateTo;

  const overdue = params.get('overdue');
  if (overdue !== null) result.overdue = overdue === 'true';

  const page = params.get('page');
  if (page !== null) result.page = Number(page);

  const pageSize = params.get('pageSize');
  if (pageSize !== null) result.pageSize = Number(pageSize);

  const sortBy = params.get('sortBy');
  if (sortBy !== null) result.sortBy = sortBy as InvoiceFilter['sortBy'];

  const sortDir = params.get('sortDir');
  if (sortDir !== null) result.sortDir = sortDir as InvoiceFilter['sortDir'];

  return result;
}

describe('Property 1: Filter serialization round-trip', () => {
  it('serializing and parsing back produces an equivalent filter for all defined fields', () => {
    fc.assert(
      fc.property(invoiceFilterArb, (filter) => {
        // Remove undefined keys so comparison is clean
        const defined = Object.fromEntries(
          Object.entries(filter).filter(([, v]) => v !== undefined)
        ) as InvoiceFilter;

        const params = serializeFilter(defined);
        const parsed = parseFilter(params);

        // Every defined field in the original should round-trip correctly
        for (const [key, value] of Object.entries(defined)) {
          const parsedValue = parsed[key as keyof InvoiceFilter];
          if (typeof value === 'boolean') {
            if (parsedValue !== value) return false;
          } else if (typeof value === 'number') {
            if (parsedValue !== value) return false;
          } else {
            if (parsedValue !== value) return false;
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
