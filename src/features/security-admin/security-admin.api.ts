import { fetchWithAuth } from '../auth/fetchWithAuth';

const API_BASE = import.meta.env.VITE_API_URL ?? '';
const BASE = `${API_BASE}/api/security-admin`;

export interface SecurityObjectDto {
  id: number;
  title: string;
  description: string | null;
  parentId: number | null;
  isEnabled: boolean;
}

export interface RoleWithPermissionsDto {
  id: number;
  roleName: string;
  permissionIds: number[];
}

export interface UserWithRolesDto {
  userId: string;
  displayName: string;
  email: string;
  roleIds: number[];
}

export async function getSecurityObjects(): Promise<SecurityObjectDto[]> {
  const res = await fetchWithAuth(`${BASE}/objects`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function patchSecurityObject(id: number, isEnabled: boolean): Promise<SecurityObjectDto> {
  const res = await fetchWithAuth(`${BASE}/objects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ isEnabled }),
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function getRoles(): Promise<RoleWithPermissionsDto[]> {
  const res = await fetchWithAuth(`${BASE}/roles`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function addPermissionToRole(roleId: number, permissionId: number): Promise<RoleWithPermissionsDto> {
  const res = await fetchWithAuth(`${BASE}/roles/${roleId}/permissions`, {
    method: 'POST',
    body: JSON.stringify({ permissionId }),
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function removePermissionFromRole(roleId: number, permissionId: number): Promise<RoleWithPermissionsDto> {
  const res = await fetchWithAuth(`${BASE}/roles/${roleId}/permissions/${permissionId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function getUsers(): Promise<UserWithRolesDto[]> {
  const res = await fetchWithAuth(`${BASE}/users`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function addRoleToUser(userId: string, roleId: number): Promise<UserWithRolesDto> {
  const res = await fetchWithAuth(`${BASE}/users/${userId}/roles`, {
    method: 'POST',
    body: JSON.stringify({ roleId }),
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function removeRoleFromUser(userId: string, roleId: number): Promise<UserWithRolesDto> {
  const res = await fetchWithAuth(`${BASE}/users/${userId}/roles/${roleId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}
