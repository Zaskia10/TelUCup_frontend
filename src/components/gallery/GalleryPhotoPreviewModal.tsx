import { EventPhoto } from "@/types/gallery";
import { X, ExternalLink } from "lucide-react";

interface Props {
  photo: EventPhoto | null;
  onClose: () => void;
}

export function GalleryPhotoPreviewModal({ photo, onClose }: Props) {
  if (!photo) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Image Side */}
        <div className="w-full md:w-2/3 bg-gray-900 relative min-h-[300px] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={photo.image_url} 
            alt={`Photo ${photo.id}`}
            className="w-full h-full object-contain max-h-[90vh]"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Side */}
        <div className="w-full md:w-1/3 p-6 flex flex-col relative h-[40vh] md:h-auto overflow-y-auto bg-white">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hidden md:block bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-6 pr-6">
            <h3 className="text-xl font-bold text-gray-900">Detail Foto</h3>
            <p className="text-sm text-gray-500">ID Foto: {photo.id}</p>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tanggal Upload</p>
              <p className="text-sm text-gray-800">{formatDate(photo.created_at)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Diunggah Oleh</p>
              <p className="text-sm text-gray-800">{photo.uploader ? photo.uploader.name : `User ID: ${photo.uploaded_by}`}</p>
            </div>
            {photo.folder && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Folder</p>
                <p className="text-sm text-gray-800">{photo.folder.name}</p>
              </div>
            )}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cloudinary Public ID</p>
              <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 break-all font-mono">
                {photo.cloudinary_public_id}
              </p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3">
            <a 
              href={photo.image_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Buka Asli <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
