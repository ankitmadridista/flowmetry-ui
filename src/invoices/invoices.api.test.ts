import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getInvoices, serializeFilter, type InvoiceFilter, type PagedResult } from './invoices.api';

const mockPagedResult: PagedResult = {
  items: [
    { id: 'inv-1', invoiceNumber: 1, customerName: 'Acme Corp', amount: 100.5, dueDate: '2025-01-15', status: 'Sent' },
  ],
  totalCount: 1,
  page: 0,
  pageSize: 25,
};

describe('serializeFilter', () => {
  it('includes defined string fields in params', () => {
    const filter: InvoiceFilter = { customerId: 'abc', status: 'Paid' };
    const params = serializeFilter(filter);
    expect(params.get('customerId')).toBe('abc');
    expect(params.get('status')).toBe('Paid');
  });

  it('includes defined number and boolean fields', () => {
    const filter: InvoiceFilter = { page: 2, pageSize: 10, overdue: true };
    const params = serializeFilter(filter);
    expect(params.get('page')).toBe('2');
    expect(params.get('pageSize')).toBe('10');
    expect(params.get('overdue')).toBe('true');
  });

  it('omits undefined fields', () => {
    const filter: InvoiceFilter = { customerId: undefined, status: 'Draft' };
    const params = serializeFilter(filter);
    expect(params.has('customerId')).toBe(false);
    expect(params.get('status')).toBe('Draft');
  });

  it('omits null fields', () => {
    const filter = { customerId: null, status: 'Sent' } as unknown as InvoiceFilter;
    const params = serializeFilter(filter);
    expect(params.has('customerId')).toBe(false);
    expect(params.get('status')).toBe('Sent');
  });

  it('returns empty params for empty filter', () => {
    const params = serializeFilter({});
    expect(params.toString()).toBe('');
  });
});

describe('getInvoices', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls GET /api/invoices with serialized filter fields', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPagedResult,
    } as Response);

    const filter: InvoiceFilter = { customerId: 'cust-1', status: 'Sent', page: 0, pageSize: 25 };
    await getInvoices(filter);

    expect(mockFetch).toHaveBeenCalledOnce();
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/invoices');
    expect(calledUrl).toContain('customerId=cust-1');
    expect(calledUrl).toContain('status=Sent');
    expect(calledUrl).toContain('page=0');
    expect(calledUrl).toContain('pageSize=25');
  });

  it('omits undefined/null fields from the query string', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPagedResult,
    } as Response);

    const filter: InvoiceFilter = { customerId: undefined, status: 'Draft' };
    await getInvoices(filter);

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).not.toContain('customerId');
    expect(calledUrl).toContain('status=Draft');
  });

  it('throws an error containing the HTTP status code on non-2xx response', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await expect(getInvoices({})).rejects.toThrow('404');
  });

  it('throws on 500 status', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(getInvoices({})).rejects.toThrow('500');
  });

  it('resolves with PagedResult on 2xx response', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPagedResult,
    } as Response);

    const result = await getInvoices({ page: 0, pageSize: 25 });
    expect(result).toEqual(mockPagedResult);
    expect(result.items).toHaveLength(1);
    expect(result.totalCount).toBe(1);
  });
});
