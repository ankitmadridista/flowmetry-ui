const API_BASE = import.meta.env.VITE_API_URL ?? '';

export interface PaymentDto {
  id: string;
  amount: number;
  recordedAt: string;
}

export interface InvoiceDetailsDto {
  id: string;
  invoiceNumber: number;
  customerId: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: string;
  payments: PaymentDto[];
}

export interface ReminderDto {
  id: string;
  reminderType: string;
  scheduledAt: string;
  sentAt: string | null;
  status: string;
}

export async function getInvoiceDetails(id: string): Promise<InvoiceDetailsDto> {
  const res = await fetch(`${API_BASE}/api/invoices/${id}`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function getInvoiceReminders(id: string): Promise<ReminderDto[]> {
  const res = await fetch(`${API_BASE}/api/invoices/${id}/reminders`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export interface CreateInvoiceRequest {
  customerId: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
}

export async function createInvoice(req: CreateInvoiceRequest): Promise<string> {
  const res = await fetch(`${API_BASE}/api/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.errors?.[0] ?? `Request failed with status ${res.status}`);
  }
  const data = await res.json();
  return data.id as string;
}

export async function recordPayment(invoiceId: string, amount: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/invoices/${invoiceId}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.errors?.[0] ?? `Request failed with status ${res.status}`);
  }
}

export async function sendInvoice(invoiceId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/invoices/${invoiceId}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed with status ${res.status}`);
  }
}
