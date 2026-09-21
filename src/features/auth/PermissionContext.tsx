import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getPermissions } from './permissions.api';

export interface PermissionContextValue {
  securityObjectStatus: Record<number, boolean>;
  permissions: number[];
  loading: boolean;
  error: string | null;
}

const defaultValue: PermissionContextValue = {
  securityObjectStatus: {},
  permissions: [],
  loading: false,
  error: null,
};

const PermissionContext = createContext<PermissionContextValue>(defaultValue);

// eslint-disable-next-line react-refresh/only-export-components
export function usePermissionContext(): PermissionContextValue {
  return useContext(PermissionContext);
}

export function PermissionProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const { isAuthenticated } = useAuth();

  const [securityObjectStatus, setSecurityObjectStatus] = useState<Record<number, boolean>>({});
  const [permissions, setPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear all state on sign-out (Req 5.5)
      setSecurityObjectStatus({});
      setPermissions([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch once per authenticated session (Req 5.6)
    let cancelled = false;

    async function fetchPermissions() {
      setLoading(true); // Req 5.3
      setError(null);
      try {
        const data = await getPermissions();
        if (!cancelled) {
          setSecurityObjectStatus(data.securityObjectStatus);
          setPermissions(data.permissions);
        }
      } catch (err) {
        if (!cancelled) {
          // Req 5.4: on failure, set error and keep defaults
          setError(err instanceof Error ? err.message : 'Failed to fetch permissions');
          setSecurityObjectStatus({});
          setPermissions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPermissions();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]); // Req 5.6: only re-run when isAuthenticated changes

  return (
    <PermissionContext.Provider value={{ securityObjectStatus, permissions, loading, error }}>
      {children}
    </PermissionContext.Provider>
  );
}
