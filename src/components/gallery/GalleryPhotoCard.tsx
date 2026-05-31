import { EventPhoto } from "@/types/gallery";
import { Eye, Move, Trash2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface Props {
  photo: EventPhoto;
  onPreview: (photo: EventPhoto) => void;
  onMove: (photo: EventPhoto) => void;
  onDelete: (photo: EventPhoto) => void;
}

export function GalleryPhotoCard({ photo, onPreview, onMove, onDelete }: Props) {
  const isToday = new Date(photo.created_at).toDateString() === new Date().toDateString();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <Image 
          src={photo.image_url} 
          alt={`Photo ${photo.id}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
            Photo
          </span>
          {isToday && (
            <span className="bg-indigo-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
              <AlertCircle size={10} /> Diproses AI
            </span>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="mb-3">
          <p className="text-[12px] font-semibold text-gray-800">{formatDate(photo.created_at)}</p>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">
            Uploader: {photo.uploader ? photo.uploader.name : `ID ${photo.uploaded_by}`}
          </p>
        </div>

        <div className="flex gap-2 border-t border-gray-100 pt-2">
          <button 
            onClick={() => onPreview(photo)}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-md transition-colors"
          >
            <Eye size={14} /> Preview
          </button>
          <button 
            onClick={() => onMove(photo)}
            className="flex-none flex items-center justify-center p-1.5 bg-white hover:bg-blue-50 text-gray-400 hover:text-blue-600 border border-transparent hover:border-blue-100 rounded-md transition-colors"
            title="Pindahkan"
          >
            <Move size={14} />
          </button>
          <button 
            onClick={() => onDelete(photo)}
            className="flex-none flex items-center justify-center p-1.5 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 border border-transparent hover:border-red-100 rounded-md transition-colors"
            title="Hapus"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
