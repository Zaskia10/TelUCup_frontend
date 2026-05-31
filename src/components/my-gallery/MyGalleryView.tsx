import { useMyGallery } from "@/hooks/useMyGallery";
import { MyGalleryToolbar } from "./MyGalleryToolbar";
import { GalleryPhotoGrid } from "@/components/gallery/GalleryPhotoGrid";
import { GalleryPhotoCard } from "@/components/gallery/GalleryPhotoCard";
import { GalleryPhotoPreviewModal } from "@/components/gallery/GalleryPhotoPreviewModal";
import { AlertCircle, Camera } from "lucide-react";
import type { EventPhoto } from "@/types/gallery";

interface Props {
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  defaultStatus?: string;
  showStatusFilter?: boolean;
  showSearch?: boolean;
  showRefresh?: boolean;
  className?: string;
}

export function MyGalleryView({
  title = "Foto Saya",
  description = "Dokumentasi yang menampilkan wajah Anda.",
  emptyTitle = "Belum ada foto yang cocok.",
  emptyDescription = "Foto akan muncul setelah sistem memproses dokumentasi.",
  defaultStatus = "all",
  showStatusFilter = true,
  showSearch = true,
  showRefresh = true,
  className = "",
}: Props) {
  const {
    photos,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    selectedPhoto,
    openPhotoPreview,
    closePhotoPreview,
    refresh,
  } = useMyGallery(defaultStatus);

  return (
    <div className={`space-y-6 relative ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Camera className="text-[#b71c1c]" size={24} />
              {title}
            </h2>
          )}
          {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 text-sm mb-6">
          <AlertCircle size={18} />
          <p className="flex-1">{error}</p>
          <button onClick={refresh} className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded font-medium transition-colors">
            Coba Lagi
          </button>
        </div>
      )}

      <MyGalleryToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onRefresh={refresh}
        isLoading={isLoading}
        showStatusFilter={showStatusFilter}
        showSearch={showSearch}
        showRefresh={showRefresh}
      />

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm min-h-[50vh]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-gray-100 rounded-xl h-48 animate-pulse"></div>
            ))}
          </div>
        ) : photos.length > 0 ? (
          <GalleryPhotoGrid 
            title=""
            isEmpty={false}
          >
            {photos.map(photo => {
              const dummyEventPhoto: EventPhoto = {
                id: photo.id,
                gallery_folder_id: null,
                cloudinary_public_id: "",
                image_url: photo.imageUrl,
                uploaded_by: 0,
                created_at: photo.uploadedAt || new Date().toISOString(),
                updated_at: photo.uploadedAt || new Date().toISOString(),
                uploader: photo.raw.event_photo?.uploader || photo.raw.eventPhoto?.uploader,
              };
              
              return (
                <GalleryPhotoCard 
                  key={photo.id}
                  photo={dummyEventPhoto}
                  onPreview={() => openPhotoPreview(photo)}
                  onMove={() => {}}
                  onDelete={() => {}}
                  isViewer={true}
                />
              );
            })}
          </GalleryPhotoGrid>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={28} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">{emptyTitle}</h3>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">{emptyDescription}</p>
          </div>
        )}
      </div>

      <GalleryPhotoPreviewModal 
        photo={selectedPhoto}
        onClose={closePhotoPreview}
      />
    </div>
  );
}
