import { X } from "lucide-react";
import type { SportsmanshipPoster } from "@/types/sportsmanshipPoster";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  poster: SportsmanshipPoster | null;
}

export default function SportsmanshipPosterPreviewModal({
  isOpen,
  onClose,
  poster,
}: Props) {
  if (!isOpen || !poster) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Close button top right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
      >
        <X size={24} />
      </button>

      {/* Content */}
      <div className="relative flex flex-col max-h-full max-w-4xl w-full animate-[scaleIn_0.2s_ease-out]">
        <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-2xl">
          <img
            src={poster.image_url}
            alt={poster.title}
            className="max-h-[80vh] w-auto object-contain"
          />
        </div>
        
        <div className="mt-4 bg-gray-900/90 backdrop-blur-md rounded-2xl p-5 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-1">
            {poster.title}
          </h2>
          <p className="text-sm text-gray-300">
            {poster.description || "Tidak ada deskripsi."}
          </p>
          <div className="mt-3 flex items-center gap-3">
             <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${poster.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {poster.is_active ? 'AKTIF' : 'NONAKTIF'}
             </span>
             <span className="text-[11px] text-gray-400">
               Urutan: {poster.sort_order}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}
