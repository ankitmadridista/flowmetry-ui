import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthUser } from './auth.api';
import { isTokenExpired } from './tokenUtils';

const TOKEN_KEY = 'flowmetry_token';
const USER_KEY = 'flowmetry_user';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (token: string, user: AuthUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Module-level signOut reference so fetchWithAuth can call it without React context
     
let _signOut: (() => void) | null = null;
// eslint-disable-next-line react-refresh/only-export-components
export function getSignOut(): (() => void) | null { return _signOut; }

function clearStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    // Clear immediately if already expired
    if (stored && isTokenExpired(stored)) {
      clearStorage();
      return null;
    }
    return stored;
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  function signOut() {
    clearStorage();
    setToken(null);
    setUser(null);
  }

  // Register the signOut function so fetchWithAuth can call it on 401
  useEffect(() => {
    _signOut = signOut;
    return () => { _signOut = null; };
  });

  // Proactively check expiry when the tab regains focus
  useEffect(() => {
    function handleFocus() {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (stored && isTokenExpired(stored)) {
        signOut();
      }
    }
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  function signIn(newToken: string, newUser: AuthUser) {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
