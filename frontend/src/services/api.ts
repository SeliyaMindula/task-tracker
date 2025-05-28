// src/services/api.ts
export const fetchFromApi = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const url = `${baseUrl}${endpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Add auth token if available
  const token = localStorage.getItem("authToken");
  if (token) {
    console.log("Using token:", token);
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};