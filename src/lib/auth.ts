export interface User {
  id: number;
  name: string;
  email: string;
  role: "player" | "panitia" | "admin" | "pic_kontingen" | "pic";
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export function getDashboardPathForRole(role: string): string {
  switch (role) {
    case "player":
      return "/dashboard/player";
    case "panitia":
    case "admin":
      return "/dashboard/panitia";
    case "pic_kontingen":
    case "pic":
      return "/dashboard/pic_kontingen";
    default:
      return "/";
  }
}

export async function logout(): Promise<void> {
  try {
    const token = getStoredToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    await fetch(`${apiUrl}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    // Ignore logout API errors — we clear local state regardless
  } finally {
    clearAuth();
  }
}
