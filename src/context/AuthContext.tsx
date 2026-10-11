"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";

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
  const { data: sessionData, isPending } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync with BetterAuth reactive session (for Google/GitHub OAuth returns)
  useEffect(() => {
    let customName: string | undefined;
    try {
      const stored = localStorage.getItem("bazardor_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed &&
          (parsed.email === sessionData?.user?.email || !sessionData) &&
          parsed.name
        ) {
          customName = parsed.name;
        }
      }
    } catch {
      // Ignore
    }

    if (sessionData?.user) {
      const authUser: User = {
        id: sessionData.user.id,
        name: customName || sessionData.user.name,
        email: sessionData.user.email,
        image: sessionData.user.image || undefined,
      };
      setUser(authUser);
      localStorage.setItem("bazardor_user", JSON.stringify(authUser));
      setLoading(false);
    } else if (!isPending) {
      // Check stored user from email/password fallback if BetterAuth session is empty
      try {
        const stored = localStorage.getItem("bazardor_user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch {
        // Ignore parse error
      }
      setLoading(false);
    }
  }, [sessionData, isPending]);

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("bazardor_user", JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch {
      // Ignore
    }
    setUser(null);
    localStorage.removeItem("bazardor_user");
  };

  const updateUser = async (data: { name?: string; email?: string }) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("bazardor_user", JSON.stringify(updated));

    // Also update BetterAuth server if logged in via BetterAuth
    try {
      await (authClient as unknown as { updateUser?: (args: { name: string }) => Promise<unknown> })
        .updateUser?.({ name: updated.name });
    } catch {
      // Ignore
    }
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
