import { useState, useEffect, useCallback } from "react";
import { myGalleryService } from "@/services/myGalleryService";
import type { MyGalleryItem, NormalizedMyGalleryPhoto } from "@/types/myGallery";
import type { EventPhoto } from "@/types/gallery";

export function useMyGallery(defaultStatus?: string) {
  const [rawItems, setRawItems] = useState<MyGalleryItem[]>([]);
  const [photos, setPhotos] = useState<NormalizedMyGalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>(defaultStatus || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);

  const normalizeItem = (item: MyGalleryItem): NormalizedMyGalleryPhoto => {
    const eventPhoto = item.event_photo || item.eventPhoto;
    const imageUrl = eventPhoto?.image_url || item.image_url || "";
    const folderName = eventPhoto?.folder?.name || "Uncategorized";
    const uploadedAt = eventPhoto?.created_at || item.created_at;

    return {
      id: item.id,
      imageUrl,
      title: `Photo ${item.id}`,
      uploadedAt,
      folderName,
      status: item.status,
      confidence: item.confidence,
      source: "my-gallery",
      raw: item,
    };
  };

  const fetchMyGallery = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, string> = {};
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      
      const data = await myGalleryService.getMyGallery(params);
      const items = Array.isArray(data) ? data : [];
      
      setRawItems(items);
      setPhotos(items.map(normalizeItem));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Gagal memuat galeri foto Anda");
      } else {
        setError("Terjadi kesalahan saat memuat galeri");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    const fetchInit = async () => {
      await fetchMyGallery();
    };
    fetchInit();
  }, [fetchMyGallery]);

  const refresh = () => fetchMyGallery(true);

  // Client-side search
  const filteredPhotos = photos.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.folderName && p.folderName.toLowerCase().includes(q)) ||
      (p.status && p.status.toLowerCase().includes(q)) ||
      p.id.toString().includes(q)
    );
  });

  const openPhotoPreview = (photo: NormalizedMyGalleryPhoto) => {
    // Convert to EventPhoto format for the preview modal compatibility
    const eventPhoto = photo.raw.event_photo || photo.raw.eventPhoto;
    
    if (eventPhoto) {
      setSelectedPhoto(eventPhoto);
    } else {
      // Create a mock EventPhoto if only raw url is available
      setSelectedPhoto({
        id: photo.id,
        gallery_folder_id: null,
        cloudinary_public_id: "",
        image_url: photo.imageUrl,
        uploaded_by: 0,
        created_at: photo.uploadedAt || new Date().toISOString(),
        updated_at: photo.uploadedAt || new Date().toISOString(),
      });
    }
  };

  const closePhotoPreview = () => setSelectedPhoto(null);

  return {
    rawItems,
    photos: filteredPhotos,
    isLoading,
    isRefreshing,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    selectedPhoto,
    openPhotoPreview,
    closePhotoPreview,
    refresh,
    fetchMyGallery,
  };
}
