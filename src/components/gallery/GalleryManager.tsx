import { useState } from "react";
import { Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { useGalleryManager } from "@/hooks/useGalleryManager";
import { GalleryToolbar } from "./GalleryToolbar";
import { GalleryBreadcrumb } from "./GalleryBreadcrumb";
import { GalleryFolderGrid } from "./GalleryFolderGrid";
import { GalleryPhotoGrid } from "./GalleryPhotoGrid";
import { GalleryFolderCard } from "./GalleryFolderCard";
import { GalleryPhotoCard } from "./GalleryPhotoCard";
import { GalleryFolderModal } from "./GalleryFolderModal";
import { GalleryUploadModal } from "./GalleryUploadModal";
import { GalleryDeleteConfirmModal } from "./GalleryDeleteConfirmModal";
import { GalleryPhotoPreviewModal } from "./GalleryPhotoPreviewModal";
import { GalleryMovePhotoModal } from "./GalleryMovePhotoModal";
import { EventPhoto, GalleryFolder, GalleryFolderPayload } from "@/types/gallery";

export function GalleryManager() {
  const {
    currentFolderId,
    folders,
    photos,
    breadcrumbs,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
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
  } = useGalleryManager();

  // Modal States
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<GalleryFolder | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<GalleryFolder | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<EventPhoto | null>(null);
  const [photoToPreview, setPhotoToPreview] = useState<EventPhoto | null>(null);
  const [photoToMove, setPhotoToMove] = useState<EventPhoto | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Derived filtered & sorted data
  const filteredFolders = folders
    .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "Nama") return a.name.localeCompare(b.name);
      return sortOrder === "Terbaru" 
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  const filteredPhotos = photos
    .filter(p => {
      const uploaderStr = p.uploader ? p.uploader.name : `ID ${p.uploaded_by}`;
      return p.id.toString().includes(searchQuery) || uploaderStr.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      return sortOrder === "Terbaru" || sortOrder === "Nama" // Name sort doesn't apply to photos, fallback to latest
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  // Action Handlers
  const handleFolderSubmit = async (payload: GalleryFolderPayload) => {
    try {
      if (folderToEdit) {
        await renameFolder(folderToEdit.id, payload);
        showToast("success", "Folder berhasil diubah.");
      } else {
        await createFolder(payload);
        showToast("success", "Folder berhasil dibuat.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast("error", err.message);
      } else {
        showToast("error", "Terjadi kesalahan.");
      }
      throw err;
    }
  };

  const handleFolderDeleteConfirm = async () => {
    if (!folderToDelete) return;
    try {
      await deleteFolder(folderToDelete.id);
      showToast("success", "Folder berhasil dihapus.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast("error", err.message);
      } else {
        showToast("error", "Terjadi kesalahan.");
      }
      throw err;
    }
  };

  const handleUploadSubmit = async (file: File) => {
    try {
      await uploadPhoto(file);
      showToast("success", "Foto berhasil diunggah.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast("error", err.message);
      } else {
        showToast("error", "Terjadi kesalahan.");
      }
      throw err;
    }
  };

  const handlePhotoDeleteConfirm = async () => {
    if (!photoToDelete) return;
    try {
      await deletePhoto(photoToDelete.id);
      showToast("success", "Foto berhasil dihapus.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast("error", err.message);
      } else {
        showToast("error", "Terjadi kesalahan.");
      }
      throw err;
    }
  };

  const handlePhotoMoveSubmit = async (targetFolderId: number | null) => {
    if (!photoToMove) return;
    try {
      await movePhoto(photoToMove.id, targetFolderId);
      showToast("success", "Foto berhasil dipindahkan.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast("error", err.message);
      } else {
        showToast("error", "Terjadi kesalahan.");
      }
      throw err;
    }
  };

  return (
    <div className="space-y-6 pb-10 relative">
      
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg font-medium animate-in slide-in-from-top-2 fade-in duration-300 ${
          toast.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Camera className="text-[#b71c1c]" size={28} />
            Kelola Gallery Event
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kelola folder dan dokumentasi foto kegiatan Tel-U Cup.</p>
        </div>
      </div>

      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
          <AlertCircle size={18} />
          <p className="flex-1">{error}</p>
          <button onClick={fetchData} className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded font-medium transition-colors">
            Coba Lagi
          </button>
        </div>
      )}

      <GalleryToolbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onRefresh={fetchData}
        onCreateFolderClick={() => {
          setFolderToEdit(null);
          setIsFolderModalOpen(true);
        }}
        onUploadClick={() => setIsUploadModalOpen(true)}
        isLoading={isLoading}
      />

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm min-h-[50vh]">
        <GalleryBreadcrumb 
          breadcrumbs={breadcrumbs}
          onGoToRoot={goToRoot}
          onGoToFolder={goToFolder}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-gray-100 rounded-xl h-20 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-10">
            {/* Show Folders if they exist or if we are filtering and not finding any (for empty state) */}
            {(filteredFolders.length > 0 || (!searchQuery && folders.length === 0)) && (
              <GalleryFolderGrid 
                title={currentFolderId === null ? "Folder Utama" : "Subfolder"}
                isEmpty={folders.length === 0}
                onEmptyAction={() => {
                  setFolderToEdit(null);
                  setIsFolderModalOpen(true);
                }}
              >
                {filteredFolders.map(folder => (
                  <GalleryFolderCard 
                    key={folder.id} 
                    folder={folder} 
                    onClick={openFolder}
                    onRename={(f) => { setFolderToEdit(f); setIsFolderModalOpen(true); }}
                    onDelete={(f) => setFolderToDelete(f)}
                  />
                ))}
              </GalleryFolderGrid>
            )}

            {/* Show Photos if they exist or if we are filtering and not finding any */}
            {(filteredPhotos.length > 0 || (!searchQuery && photos.length === 0 && currentFolderId !== null)) && (
              <GalleryPhotoGrid 
                title="Dokumentasi Foto"
                isEmpty={photos.length === 0}
                onEmptyAction={() => setIsUploadModalOpen(true)}
              >
                {filteredPhotos.map(photo => (
                  <GalleryPhotoCard 
                    key={photo.id}
                    photo={photo}
                    onPreview={setPhotoToPreview}
                    onMove={setPhotoToMove}
                    onDelete={setPhotoToDelete}
                  />
                ))}
              </GalleryPhotoGrid>
            )}

            {searchQuery && filteredFolders.length === 0 && filteredPhotos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada hasil pencarian untuk &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <GalleryFolderModal 
        isOpen={isFolderModalOpen}
        folder={folderToEdit}
        onClose={() => setIsFolderModalOpen(false)}
        onSubmit={handleFolderSubmit}
      />

      <GalleryUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
      />

      <GalleryDeleteConfirmModal 
        isOpen={!!folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={handleFolderDeleteConfirm}
        title="Hapus Folder?"
        message={`Apakah Anda yakin ingin menghapus folder "${folderToDelete?.name}"? Folder ini hanya bisa dihapus jika kosong.`}
      />

      <GalleryDeleteConfirmModal 
        isOpen={!!photoToDelete}
        onClose={() => setPhotoToDelete(null)}
        onConfirm={handlePhotoDeleteConfirm}
        title="Hapus Foto Event?"
        message="Foto ini akan dihapus secara permanen dari gallery event dan Cloudinary. Tindakan ini tidak dapat dibatalkan."
        previewImageUrl={photoToDelete?.image_url}
      />

      <GalleryPhotoPreviewModal 
        photo={photoToPreview}
        onClose={() => setPhotoToPreview(null)}
      />

      <GalleryMovePhotoModal 
        isOpen={!!photoToMove}
        photo={photoToMove}
        onClose={() => setPhotoToMove(null)}
        onSubmit={handlePhotoMoveSubmit}
      />
    </div>
  );
}
