const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface ApiValidationError {
  status: 422;
  message: string;
  errors: Record<string, string[]>;
}

function isValidationError(value: unknown): value is ApiValidationError {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as ApiValidationError).status === 422
  );
}

async function handleResponse<T = unknown>(res: Response): Promise<T> {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new Error("Sesi telah berakhir. Silakan login kembali.");
  }

  if (res.status === 403) {
    throw new Error("Anda tidak memiliki akses untuk aksi ini.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 422) {
      return Promise.reject({
        status: 422,
        message: data.message || "Validasi gagal.",
        errors: data.errors || {},
      } satisfies ApiValidationError);
    }
    throw new Error(data.message || "Terjadi kesalahan server. Coba lagi nanti.");
  }

  return data as T;
}

function buildUrl(path: string, params?: Record<string, string | number | null | undefined>): string {
  const url = `${API_BASE_URL}${path}`;
  if (!params) return url;

  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== null && val !== undefined && val !== "") {
      qs.append(key, String(val));
    }
  });
  const queryString = qs.toString();
  return queryString ? `${url}?${queryString}` : url;
}

async function get<T = unknown>(
  path: string,
  params?: Record<string, string | number | null | undefined>,
): Promise<T> {
  const res = await fetch(buildUrl(path, params), {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse<T>(res);
}

async function post<T = unknown>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: getAuthHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return handleResponse<T>(res);
}

async function patch<T = unknown>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "PATCH",
    headers: getAuthHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return handleResponse<T>(res);
}

async function del<T = unknown>(
  path: string,
  params?: Record<string, string | number | null | undefined>,
): Promise<T> {
  const res = await fetch(buildUrl(path, params), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse<T>(res);
}

export const apiClient = { get, post, patch, del } as const;

export { API_BASE_URL, isValidationError };
