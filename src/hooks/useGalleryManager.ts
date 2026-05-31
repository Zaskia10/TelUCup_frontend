import { useState, useEffect, useCallback } from "react";
import { GalleryFolder, EventPhoto, GalleryFolderPayload } from "@/types/gallery";
import { galleryService } from "@/services/galleryService";

export function useGalleryManager() {
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<GalleryFolder[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"Terbaru" | "Terlama" | "Nama">("Terbaru");

  const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<GalleryFolder | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (currentFolderId === null) {
        // Fetch root folders
        const [rootFolders, allPhotos] = await Promise.all([
          galleryService.getFolders().catch(() => []),
          galleryService.getEventPhotos().catch(() => []),
        ]);
        setFolders(rootFolders);
        setPhotos(allPhotos.filter(p => p.gallery_folder_id === null));
        setBreadcrumbs([]);
      } else {
        // Fetch specific folder content
        const [currentFolder, folderPhotos] = await Promise.all([
          galleryService.getFolder(currentFolderId),
          galleryService.getFolderPhotos(currentFolderId),
        ]);
        
        // Assume children are in currentFolder or we need to fetch them
        // If the backend returns children in the folder response, use that.
        // Otherwise, fetch folders by parent_id
        if (currentFolder.children) {
           setFolders(currentFolder.children);
        } else {
           const subFolders = await galleryService.getFolders({ parent_id: currentFolderId });
           setFolders(subFolders);
        }
        
        setPhotos(folderPhotos);
        setBreadcrumbs(currentFolder.breadcrumb || [currentFolder]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } else {
        setError("Terjadi kesalahan saat memuat data.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const openFolder = (id: number) => {
    setCurrentFolderId(id);
    setSearchQuery("");
  };

  const goToRoot = () => {
    setCurrentFolderId(null);
    setSearchQuery("");
  };

  const goToFolder = (id: number) => {
    setCurrentFolderId(id);
    setSearchQuery("");
  };

  const createFolder = async (payload: GalleryFolderPayload) => {
    try {
      await galleryService.createFolder({ ...payload, parent_id: currentFolderId });
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message || "Gagal membuat folder");
      }
      throw new Error("Gagal membuat folder");
    }
  };

  const renameFolder = async (id: number, payload: Partial<GalleryFolderPayload>) => {
    try {
      await galleryService.updateFolder(id, payload);
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message || "Gagal mengubah nama folder");
      }
      throw new Error("Gagal mengubah nama folder");
    }
  };

  const deleteFolder = async (id: number) => {
    try {
      await galleryService.deleteFolder(id);
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message || "Gagal menghapus folder");
      }
      throw new Error("Gagal menghapus folder");
    }
  };

  const uploadPhoto = async (file: File) => {
    setIsUploading(true);
    try {
      if (currentFolderId) {
        await galleryService.uploadEventPhotoToFolder(currentFolderId, file);
      } else {
        await galleryService.uploadEventPhoto(file);
      }
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message || "Gagal mengunggah foto");
      }
      throw new Error("Gagal mengunggah foto");
    } finally {
      setIsUploading(false);
    }
  };

  const deletePhoto = async (id: number) => {
    try {
      await galleryService.deleteEventPhoto(id);
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message || "Gagal menghapus foto");
      }
      throw new Error("Gagal menghapus foto");
    }
  };

  const movePhoto = async (id: number, targetFolderId: number | null) => {
    try {
      await galleryService.moveEventPhoto(id, targetFolderId);
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message || "Gagal memindahkan foto");
      }
      throw new Error("Gagal memindahkan foto");
    }
  };

  return {
    currentFolderId,
    folders,
    photos,
    breadcrumbs,
    isLoading,
    isUploading,
    error,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    selectedPhoto,
    setSelectedPhoto,
    selectedFolder,
    setSelectedFolder,
    fetchData,
    openFolder,
    goToRoot,
    goToFolder,
    createFolder,
    renameFolder,
    deleteFolder,
    uploadPhoto,
    deletePhoto,
    movePhoto,
  };
}
