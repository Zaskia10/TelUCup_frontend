import { AlertTriangle, Loader2 } from "lucide-react";
import type { SportsmanshipPoster } from "@/types/sportsmanshipPoster";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  poster: SportsmanshipPoster | null;
}

export default function SportsmanshipPosterDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  poster,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !poster) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      setError("");
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl animate-[scaleIn_0.2s_ease-out]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertTriangle size={28} />
        </div>
        
        <h3 className="mb-2 text-lg font-bold text-gray-900">Hapus Poster?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Apakah Anda yakin ingin menghapus poster <span className="font-bold text-gray-700">"{poster.title}"</span>? Tindakan ini tidak dapat dibatalkan.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-2 text-xs font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-600 shadow-md shadow-red-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
