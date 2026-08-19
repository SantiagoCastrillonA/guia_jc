import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, post } from './api';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: 'student' | 'admin';
  active: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

interface AuthValue {
  user: AuthUser | null;
  /** true mientras se resuelve la sesión al cargar la página. */
  loading: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  register: (name: string, username: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api<{ user: AuthUser | null }>('/auth/me')
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null); // sin backend se sigue en modo anónimo
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const data = await post<{ user: AuthUser }>('/auth/login', { username, password });
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name: string, username: string, password: string) => {
    const data = await post<{ user: AuthUser }>('/auth/register', { name, username, password });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await post<void>('/auth/logout');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth necesita estar dentro de <AuthProvider>.');
  return value;
}
