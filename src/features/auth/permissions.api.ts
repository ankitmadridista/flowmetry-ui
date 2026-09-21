import { fetchWithAuth } from './fetchWithAuth';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export interface PermissionsResponse {
  securityObjectStatus: Record<number, boolean>;
  permissions: number[];
}

export async function getPermissions(): Promise<PermissionsResponse> {
  const res = await fetchWithAuth(`${API_BASE}/api/auth/permissions`);
  if (!res.ok) {
    throw new Error(`Failed to fetch permissions: ${res.status}`);
  }
  return res.json();
}
