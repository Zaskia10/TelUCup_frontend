import { apiClient } from "@/lib/apiClient";
import { GalleryFolder, GalleryFolderPayload, EventPhoto } from "@/types/gallery";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getAuthHeadersForForm() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Helper to extract data from { status: 'success', data: ... } or { success: true, data: ... }
function extractData<T>(res: unknown): T {
  if (res && typeof res === "object" && "data" in res && res.data !== undefined) {
    return res.data as T;
  }
  return res as T;
}

export const galleryService = {
  getFolders: async (params?: Record<string, string | number | null | undefined>): Promise<GalleryFolder[]> => {
    const res = await apiClient.get("/gallery-folders", params);
    return extractData<GalleryFolder[]>(res);
  },

  getFolder: async (id: number): Promise<GalleryFolder> => {
    const res = await apiClient.get(`/gallery-folders/${id}`);
    return extractData<GalleryFolder>(res);
  },

  createFolder: async (payload: GalleryFolderPayload): Promise<GalleryFolder> => {
    const res = await apiClient.post("/gallery-folders", payload);
    return extractData<GalleryFolder>(res);
  },

  updateFolder: async (id: number, payload: Partial<GalleryFolderPayload>): Promise<GalleryFolder> => {
    const res = await apiClient.patch(`/gallery-folders/${id}`, payload);
    return extractData<GalleryFolder>(res);
  },

  deleteFolder: async (id: number): Promise<void> => {
    await apiClient.del(`/gallery-folders/${id}`);
  },

  getFolderPhotos: async (folderId: number, params?: Record<string, string | number | null | undefined>): Promise<EventPhoto[]> => {
    const res = await apiClient.get(`/gallery-folders/${folderId}/photos`, params);
    return extractData<EventPhoto[]>(res);
  },

  getEventPhotos: async (params?: Record<string, string | number | null | undefined>): Promise<EventPhoto[]> => {
    const res = await apiClient.get("/event-photos", params);
    return extractData<EventPhoto[]>(res);
  },

  uploadEventPhotoToFolder: async (folderId: number, file: File): Promise<EventPhoto> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("gallery_folder_id", folderId.toString());

    const response = await fetch(`${API_BASE_URL}/event-photos`, {
      method: "POST",
      headers: getAuthHeadersForForm(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upload photo");
    }

    const res = await response.json();
    return extractData<EventPhoto>(res);
  },

  uploadEventPhoto: async (file: File, galleryFolderId?: number): Promise<EventPhoto> => {
    const formData = new FormData();
    formData.append("image", file);
    if (galleryFolderId) {
      formData.append("gallery_folder_id", galleryFolderId.toString());
    }

    const response = await fetch(`${API_BASE_URL}/event-photos`, {
      method: "POST",
      headers: getAuthHeadersForForm(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upload photo");
    }

    const res = await response.json();
    return extractData<EventPhoto>(res);
  },

  deleteEventPhoto: async (id: number): Promise<void> => {
    await apiClient.del(`/event-photos/${id}`);
  },

  moveEventPhoto: async (id: number, galleryFolderId: number | null): Promise<EventPhoto> => {
    const res = await apiClient.patch(`/event-photos/${id}/move-folder`, {
      gallery_folder_id: galleryFolderId,
    });
    return extractData<EventPhoto>(res);
  },
};
