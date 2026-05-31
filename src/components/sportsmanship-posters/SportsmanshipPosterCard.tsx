import type { SportsmanshipPoster } from "@/types/sportsmanshipPoster";
import { Edit2, Trash2, Eye, GripVertical } from "lucide-react";

interface Props {
  poster: SportsmanshipPoster;
  onEdit: (poster: SportsmanshipPoster) => void;
  onDelete: (poster: SportsmanshipPoster) => void;
  onToggle: (id: number, isActive: boolean) => void;
  onPreview: (poster: SportsmanshipPoster) => void;
}

export default function SportsmanshipPosterCard({
  poster,
  onEdit,
  onDelete,
  onToggle,
  onPreview,
}: Props) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all hover:shadow-md">
      {/* Image Container */}
      <div 
        className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => onPreview(poster)}
      >
        <img
          src={poster.image_url}
          alt={poster.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
          }}
        />
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 flex items-center justify-center">
           <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-gray-700 shadow-sm">
             <Eye size={14} /> Preview
           </div>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold tracking-wider shadow-sm">
          <span
            className={`h-2 w-2 rounded-full ${
              poster.is_active ? "bg-emerald-500" : "bg-gray-400"
            }`}
          />
          <span className={poster.is_active ? "text-emerald-700" : "text-gray-600"}>
            {poster.is_active ? "AKTIF" : "NONAKTIF"}
          </span>
        </div>
        <div className="absolute top-3 left-3 flex items-center justify-center h-6 w-6 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-bold shadow-sm">
          {poster.sort_order}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1.5" title={poster.title}>
          {poster.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 flex-1 leading-relaxed">
          {poster.description || "Tidak ada deskripsi."}
        </p>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <label className="flex items-center gap-2 cursor-pointer group/switch">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={poster.is_active}
                onChange={(e) => onToggle(poster.id, e.target.checked)}
              />
              <div
                className={`block h-5 w-9 rounded-full transition-colors ${
                  poster.is_active ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                  poster.is_active ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-500 group-hover/switch:text-gray-900 transition-colors uppercase tracking-wider">
              Tampilkan
            </span>
          </label>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(poster)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit Poster"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(poster)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Hapus Poster"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
