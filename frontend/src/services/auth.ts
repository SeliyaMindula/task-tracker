// src/services/auth.ts
import { fetchFromApi } from "./api";

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string; // access token
  refreshToken?: string;
  user: User;
}

export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await fetchFromApi("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
  return {
    token: response.access_token,
    refreshToken: response.refresh_token,
    user: response.user,
  };
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await fetchFromApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return {
    token: response.access_token,
    refreshToken: response.refresh_token,
    user: response.user,
  };
};

export const logout = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("currentUser");
  console.log("Current user from localStorage:", user);
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};