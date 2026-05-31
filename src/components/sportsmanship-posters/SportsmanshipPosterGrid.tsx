import type { SportsmanshipPoster } from "@/types/sportsmanshipPoster";
import SportsmanshipPosterCard from "./SportsmanshipPosterCard";
import { AlertCircle, Image as ImageIcon } from "lucide-react";

interface Props {
  posters: SportsmanshipPoster[];
  isLoading: boolean;
  error: string | null;
  onEdit: (poster: SportsmanshipPoster) => void;
  onDelete: (poster: SportsmanshipPoster) => void;
  onToggle: (id: number, isActive: boolean) => void;
  onPreview: (poster: SportsmanshipPoster) => void;
  onRetry: () => void;
  onCreateNew: () => void;
}

export default function SportsmanshipPosterGrid({
  posters,
  isLoading,
  error,
  onEdit,
  onDelete,
  onToggle,
  onPreview,
  onRetry,
  onCreateNew,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="aspect-[4/5] bg-gray-200" />
            <div className="p-5">
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-3" />
              <div className="h-3 w-full bg-gray-100 rounded mb-2" />
              <div className="h-3 w-2/3 bg-gray-100 rounded" />
              <div className="mt-5 border-t border-gray-100 pt-4 flex justify-between">
                 <div className="h-5 w-9 bg-gray-200 rounded-full" />
                 <div className="flex gap-2">
                   <div className="h-6 w-6 bg-gray-100 rounded" />
                   <div className="h-6 w-6 bg-gray-100 rounded" />
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Gagal Memuat Data</h3>
        <p className="text-gray-500 max-w-sm mb-6 text-sm">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors text-sm"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (posters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <ImageIcon size={32} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Belum ada poster</h3>
        <p className="text-gray-500 max-w-sm mb-6 text-sm">
          Poster sportifitas yang Anda unggah akan muncul di sini. Poster aktif akan ditampilkan ke peserta.
        </p>
        <button
          onClick={onCreateNew}
          className="px-6 py-2.5 bg-[#b6252a] hover:bg-[#961f23] text-white font-bold rounded-xl transition-colors shadow-sm shadow-red-200 text-sm"
        >
          + Tambah Poster Pertama
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {posters.map((poster) => (
        <SportsmanshipPosterCard
          key={poster.id}
          poster={poster}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}
