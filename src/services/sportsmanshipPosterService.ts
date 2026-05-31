import { apiClient, API_BASE_URL } from "@/lib/apiClient";
import type {
  SportsmanshipPoster,
  ActiveSportsmanshipPoster,
  SportsmanshipPosterFormPayload,
  SportsmanshipPosterReorderItem,
} from "@/types/sportsmanshipPoster";

function getAuthToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

async function customFetch<T>(path: string, options: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  // Important: DO NOT set Content-Type for FormData, the browser will set it with the correct boundary
  headers.set("Accept", "application/json");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

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
    throw new Error(data.message || "Terjadi kesalahan server. Coba lagi nanti.");
  }

  return data as T;
}

export const sportsmanshipPosterService = {
  getPosters: async (params?: Record<string, string | number | null | undefined>) => {
    return apiClient.get<{ data: SportsmanshipPoster[] }>("/sportsmanship-posters", params);
  },

  getPoster: async (id: number | string) => {
    return apiClient.get<{ data: SportsmanshipPoster }>(`/sportsmanship-posters/${id}`);
  },

  createPoster: async (payload: SportsmanshipPosterFormPayload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    if (payload.description) {
      formData.append("description", payload.description);
    }
    if (payload.image) {
      formData.append("image", payload.image);
    }
    formData.append("is_active", payload.is_active ? "1" : "0");
    formData.append("sort_order", payload.sort_order.toString());

    return customFetch<{ data: SportsmanshipPoster }>("/sportsmanship-posters", {
      method: "POST",
      body: formData,
    });
  },

  updatePoster: async (id: number | string, payload: Partial<SportsmanshipPosterFormPayload>) => {
    const formData = new FormData();
    
    // Laravel requires _method=PATCH when sending FormData for a PATCH/PUT request
    formData.append("_method", "PATCH");
    
    if (payload.title !== undefined) {
      formData.append("title", payload.title);
    }
    if (payload.description !== undefined) {
      formData.append("description", payload.description);
    }
    if (payload.image) {
      formData.append("image", payload.image);
    }
    if (payload.is_active !== undefined) {
      formData.append("is_active", payload.is_active ? "1" : "0");
    }
    if (payload.sort_order !== undefined) {
      formData.append("sort_order", payload.sort_order.toString());
    }

    return customFetch<{ data: SportsmanshipPoster }>(`/sportsmanship-posters/${id}`, {
      method: "POST", // Browser standard to send FormData with _method=PATCH
      body: formData,
    });
  },

  deletePoster: async (id: number | string) => {
    return apiClient.del<{ message: string }>(`/sportsmanship-posters/${id}`);
  },

  togglePoster: async (id: number | string, isActive: boolean) => {
    return apiClient.patch<{ message: string; data: SportsmanshipPoster }>(
      `/sportsmanship-posters/${id}/toggle`,
      { is_active: isActive }
    );
  },

  reorderPosters: async (items: SportsmanshipPosterReorderItem[]) => {
    return apiClient.patch<{ message: string }>("/sportsmanship-posters/reorder", { items });
  },

  getActivePosters: async () => {
    return apiClient.get<{ data: ActiveSportsmanshipPoster[] }>("/sportsmanship-posters/active");
  },
};
