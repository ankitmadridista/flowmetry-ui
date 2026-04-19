import { useContext } from 'react';
import { PermissionContext } from './PermissionContext';

import type { PermissionContextValue } from './PermissionContext';

export function usePermissionContext(): PermissionContextValue {
  return useContext(PermissionContext);
}
