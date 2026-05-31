import { useState, useEffect } from "react";
import { GalleryFolder, EventPhoto } from "@/types/gallery";
import { X, Folder, Move } from "lucide-react";
import { galleryService } from "@/services/galleryService";

interface Props {
  photo: EventPhoto | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (targetFolderId: number | null) => Promise<void>;
}

export function GalleryMovePhotoModal({ photo, isOpen, onClose, onSubmit }: Props) {
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchFolders = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Fetch all folders flat if possible, or we could just fetch root for now.
          // Assuming getting all folders without parent_id filter returns all of them.
          const res = await galleryService.getFolders();
          setFolders(res);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message || "Gagal memuat daftar folder.");
          } else {
            setError("Gagal memuat daftar folder.");
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchFolders();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFolderId(undefined);
    }
  }, [isOpen]);

  if (!isOpen || !photo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFolderId === undefined) {
      setError("Pilih folder tujuan.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(selectedFolderId);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Terjadi kesalahan.");
      } else {
        setError("Terjadi kesalahan.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Move size={20} className="text-blue-500" />
            Pindahkan Foto
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          <div className="flex gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.image_url} alt="thumbnail" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">Pilih folder tujuan untuk foto ini.</p>
              <p className="text-xs text-gray-500">
                Lokasi saat ini: {photo.gallery_folder_id ? (folders.find(f => f.id === photo.gallery_folder_id)?.name || "Dalam Folder") : "Tanpa Folder"}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {isLoading ? (
              <p className="text-center text-sm text-gray-500 py-4">Memuat daftar folder...</p>
            ) : (
              <>
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedFolderId === null ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input 
                    type="radio" 
                    name="folder" 
                    value="null"
                    checked={selectedFolderId === null}
                    onChange={() => setSelectedFolderId(null)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <Folder size={20} className={selectedFolderId === null ? "text-blue-600" : "text-gray-400"} />
                  <span className={`text-sm font-medium ${selectedFolderId === null ? "text-blue-900" : "text-gray-700"}`}>
                    Tanpa Folder (Root)
                  </span>
                </label>
                
                {folders.map(folder => (
                  <label key={folder.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedFolderId === folder.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                    <input 
                      type="radio" 
                      name="folder" 
                      value={folder.id}
                      checked={selectedFolderId === folder.id}
                      onChange={() => setSelectedFolderId(folder.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Folder size={20} className={selectedFolderId === folder.id ? "text-blue-600" : "text-gray-400"} />
                    <span className={`text-sm font-medium ${selectedFolderId === folder.id ? "text-blue-900" : "text-gray-700"}`}>
                      {folder.name}
                    </span>
                  </label>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-8">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || selectedFolderId === undefined || selectedFolderId === photo.gallery_folder_id}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${
                (isSubmitting || selectedFolderId === undefined || selectedFolderId === photo.gallery_folder_id) 
                  ? "bg-blue-300 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Memindahkan..." : "Pindahkan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
