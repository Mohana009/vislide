import type { AuthUser, UserRole } from "../types/user";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuth(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function redirectPathForRole(role: UserRole): string {
  return role === "teacher" ? "/create" : "/join";
}

export async function login(
  email: string,
  password: string,
  role: UserRole
): Promise<{ user: AuthUser; token: string }> {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Sign in failed");
  }
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<{ user: AuthUser; token: string }> {
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Registration failed");
  }
  return data;
}
