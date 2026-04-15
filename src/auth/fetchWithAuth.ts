import { getStoredToken } from './AuthContext';

export function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

export async function fetchWithAuth(url: string, init?: RequestInit): Promise<Response> {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...init, headers });
}
