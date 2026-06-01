import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api, { setToken, removeToken, getToken, setOnUnauthorized } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    await removeToken();
    setUser(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
    });
  }, [logout]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getToken();
        if (!token) {
          if (mounted) setIsLoading(false);
          return;
        }
        const res = await api.get('/api/auth/me');
        if (mounted) {
          setUser(res?.data?.user ?? null);
        }
      } catch {
        await removeToken();
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    const token = res?.data?.token;
    const u = res?.data?.user;
    if (token) await setToken(token);
    setUser(u ?? null);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await api.post('/api/signup', { name, email, password });
    const token = res?.data?.token;
    const u = res?.data?.user;
    if (token) await setToken(token);
    setUser(u ?? null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
