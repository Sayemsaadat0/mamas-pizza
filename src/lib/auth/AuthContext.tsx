"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { LoginResponse, User } from "./types";

// Simple key names to persist session across reloads
const TOKEN_KEY = "auth.token";
const USER_KEY = "auth.user";

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

export type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<LoginResponse | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true, // start loading until we hydrate
    error: null,
  });

  // Hydrate from localStorage on client
  useEffect(() => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
      const userRaw = typeof window !== "undefined" ? localStorage.getItem(USER_KEY) : null;
      const user = userRaw ? (JSON.parse(userRaw) as User) : null;

      if (token && user) {
        setState({ user, token, isAuthenticated: true, loading: false, error: null });
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    } catch (e) {
      console.error(e);
      setState((s) => ({ ...s, loading: false }));
      // ignore corrupt storage
    }
  }, []);

  const persist = useCallback((user: User, token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, []);

  const clear = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      if (!base) throw new Error("Missing NEXT_PUBLIC_API_URL");
      const res = await fetch(`${base}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Login failed with status ${res.status}`);
      }
      const data = (await res.json()) as LoginResponse;
      if (!data?.status || !data.token || !data.user) {
        throw new Error("Invalid login response");
      }
      persist(data.user, data.token);
      setState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return data;
    } catch (e: any) {
      setState((s) => ({ ...s, loading: false, error: e?.message || "Login failed" }));
      return null;
    }
  }, [persist]);

  const logout = useCallback(() => {
    clear();
    setState({ user: null, token: null, isAuthenticated: false, loading: false, error: null });
  }, [clear]);

  const value = useMemo<AuthContextValue>(() => ({ ...state, login, logout }), [state, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}