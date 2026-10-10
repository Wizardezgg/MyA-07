"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: { name?: string; email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bazardor_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore parse error
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("bazardor_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bazardor_user");
  };

  const updateUser = async (data: { name?: string; email?: string }) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("bazardor_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
