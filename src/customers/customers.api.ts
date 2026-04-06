const API_BASE = import.meta.env.VITE_API_URL ?? '';

export interface CustomerSummaryDto {
  id: string;
  name: string;
  email: string;
  riskScore: number;
  riskBand: 'Low' | 'Medium' | 'High';
}

export interface RiskProfileDto {
  riskScore: number;
  riskBand: 'Low' | 'Medium' | 'High';
  totalInvoices: number;
  overdueCount: number;
  partiallyPaidCount: number;
  latePaymentCount: number;
  averageDaysLate: number;
}

export interface CustomerInvoiceSummaryDto {
  id: string;
  amount: number;
  dueDate: string;
  status: string;
}

export async function getCustomers(): Promise<CustomerSummaryDto[]> {
  const res = await fetch(`${API_BASE}/api/customers`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function getCustomer(id: string): Promise<CustomerSummaryDto> {
  const res = await fetch(`${API_BASE}/api/customers/${id}`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function getCustomerRiskProfile(id: string): Promise<RiskProfileDto> {
  const res = await fetch(`${API_BASE}/api/customers/${id}/risk-profile`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function getCustomerInvoices(id: string): Promise<CustomerInvoiceSummaryDto[]> {
  const res = await fetch(`${API_BASE}/api/customers/${id}/invoices`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function createCustomer(name: string, email: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.errors?.[0] ?? body?.message ?? `Request failed with status ${res.status}`);
  }
  const data = await res.json();
  return data.id as string;
}
