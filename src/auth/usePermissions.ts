import { usePermissionContext } from './PermissionContext';
import { PERMISSION_MAP } from './permissions';

export function useObjectEnabled(objId: number): boolean {
  const { securityObjectStatus } = usePermissionContext();
  return securityObjectStatus[objId] ?? false;
}

export function usePermission(objId: number, operationId: number): boolean {
  const { permissions } = usePermissionContext();
  const objectEnabled = useObjectEnabled(objId);

  if (!objectEnabled) return false;

  const permissionId = Object.keys(PERMISSION_MAP).find(
    (id) => PERMISSION_MAP[Number(id)].objId === objId && PERMISSION_MAP[Number(id)].operationId === operationId
  );

  if (permissionId === undefined) return false;

  return permissions.includes(Number(permissionId));
}
