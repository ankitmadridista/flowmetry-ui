import { fetchWithAuth } from '../auth/fetchWithAuth';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export interface CashflowSummary {
  totalReceivable: number;
  totalPaid: number;
  totalUnpaid: number;
  monthlyInflow: number;
  overdueAmount: number;
}

export async function getCashflowSummary(): Promise<CashflowSummary> {
  const response = await fetchWithAuth(`${API_BASE}/api/dashboard/cashflow`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<CashflowSummary>;
}
