import { type ReactNode } from "react";
import { usePermissionContext } from "../contexts/PermissionContext";
import { usePermission } from "../hooks/usePermissions";
import { OpId } from "../permissions";
import AccessDenied from "../../../shared/components/AccessDenied";

interface PermissionRouteProps {
  objId: number;
  children: ReactNode;
}

export default function PermissionRoute({
  objId,
  children,
}: PermissionRouteProps) {
  const { loading } = usePermissionContext();
  const canView = usePermission(objId, OpId.VIEW);

  if (loading) return null;
  if (!canView) return <AccessDenied />;

  return <>{children}</>;
}
