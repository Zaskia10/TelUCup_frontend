import { apiClient } from "@/lib/apiClient";
import type { MyGalleryItem, MyGalleryParams } from "@/types/myGallery";

function extractData<T>(res: unknown): T {
  if (res && typeof res === "object" && "data" in res && res.data !== undefined) {
    return res.data as T;
  }
  return res as T;
}

export const myGalleryService = {
  getMyGallery: async (params?: MyGalleryParams): Promise<MyGalleryItem[]> => {
    // the backend route should be `/my-gallery`
    const res = await apiClient.get("/my-gallery", params as Record<string, string | number | null | undefined>);
    return extractData<MyGalleryItem[]>(res);
  },
};
