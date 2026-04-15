import { getStoredToken, getSignOut } from './AuthContext';

export async function fetchWithAuth(url: string, init?: RequestInit): Promise<Response> {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...init, headers });

  // Token expired or invalid — sign out and let the UI redirect to login
  if (response.status === 401) {
    getSignOut()?.();
  }

  return response;
}
