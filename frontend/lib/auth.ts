import { apiFetch, ApiError, serverApiFetch } from "./api";

export const AUTH_COOKIE_NAME = "auth_token";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: AuthUser;
}

export async function signup(input: {
  name: string;
  email: string;
  password: string;
}) {
  return apiFetch<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function login(input: { email: string; password: string }) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function logout() {
  return apiFetch<{ message: string }>("/api/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser() {
  const response = await apiFetch<AuthResponse>("/api/auth/me");
  return response.user;
}

export async function getCurrentUserServer() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const response = await serverApiFetch<AuthResponse>(
      "/api/auth/me",
      { method: "GET" },
      cookieStore.toString(),
    );

    return response.user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }

    throw error;
  }
}
