// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { User, login, register, logout as authLogout, getCurrentUser, isAuthenticated } from "../services/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    const { token, refreshToken, user } = await login(username, password);
    localStorage.setItem("authToken", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("currentUser", JSON.stringify(user));
    setUser(user);
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    const { token, refreshToken, user } = await register(username, email, password);
    localStorage.setItem("authToken", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("currentUser", JSON.stringify(user));
    setUser(user);
  };

  const handleLogout = () => {
    authLogout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/login");
  };

  if (!authChecked) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};