export interface InvoiceSummaryDto {
  id: string;
  invoiceNumber: number;
  customerName: string;
  amount: number;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'PartiallyPaid' | 'Paid' | 'Overdue' | 'Cancelled';
}

export interface PagedResult {
  items: InvoiceSummaryDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface InvoiceFilter {
  customerId?: string;
  customerName?: string;
  status?: 'Draft' | 'Sent' | 'PartiallyPaid' | 'Paid' | 'Overdue' | 'Cancelled';
  dueDateFrom?: string;
  dueDateTo?: string;
  overdue?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'dueDate' | 'amount';
  sortDir?: 'asc' | 'desc';
}

export function serializeFilter(filter: InvoiceFilter): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  }
  return params;
}

import { fetchWithAuth } from '../auth/fetchWithAuth';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function getInvoices(filter: InvoiceFilter): Promise<PagedResult> {
  const params = serializeFilter(filter);
  const response = await fetchWithAuth(`${API_BASE}/api/invoices?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<PagedResult>;
}
