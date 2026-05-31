import { useState, useEffect, useRef } from "react";
import type { SportsmanshipPoster, SportsmanshipPosterFormPayload } from "@/types/sportsmanshipPoster";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: SportsmanshipPosterFormPayload) => Promise<void>;
  poster?: SportsmanshipPoster; // If provided, it's edit mode
}

export default function SportsmanshipPosterFormModal({
  isOpen,
  onClose,
  onSubmit,
  poster,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (poster) {
        setTitle(poster.title);
        setDescription(poster.description || "");
        setIsActive(poster.is_active);
        setSortOrder(poster.sort_order);
        setImagePreview(poster.image_url);
        setImageFile(null);
      } else {
        setTitle("");
        setDescription("");
        setIsActive(true);
        setSortOrder(0);
        setImageFile(null);
        setImagePreview(null);
      }
      setError("");
    }
  }, [isOpen, poster]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPEG, PNG, WEBP)");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB");
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Judul wajib diisi");
      return;
    }

    if (!poster && !imageFile) {
      setError("Gambar wajib diunggah untuk poster baru");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title,
        description,
        is_active: isActive,
        sort_order: sortOrder,
        ...(imageFile && { image: imageFile }),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-[scaleIn_0.2s_ease-out]">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            {poster ? "Edit Poster" : "Tambah Poster Baru"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Image Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                Gambar Poster <span className="text-[#b6252a]">*</span>
              </label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors overflow-hidden ${
                  imagePreview ? "border-transparent bg-gray-900" : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#b6252a]/50"
                }`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-contain opacity-70" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-white px-4 py-2 rounded-lg text-sm font-bold text-gray-800 flex items-center gap-2 shadow-lg">
                        <Upload size={16} /> Ganti Gambar
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <ImageIcon size={32} className="mb-2 text-gray-400" />
                    <span className="text-sm font-bold">Klik untuk unggah gambar</span>
                    <span className="text-xs text-gray-400 mt-1">JPEG, PNG, WEBP (Maks 5MB)</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                Judul <span className="text-[#b6252a]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Misal: Junjung Tinggi Sportifitas"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#b6252a] focus:ring-1 focus:ring-[#b6252a]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                Deskripsi
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat tentang poster (opsional)"
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#b6252a] focus:ring-1 focus:ring-[#b6252a] resize-none"
              />
            </div>

            {/* Config row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Status
                </label>
                <label className="flex items-center gap-3 cursor-pointer group p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <div className={`block h-5 w-9 rounded-full transition-colors ${isActive ? "bg-emerald-500" : "bg-gray-200"}`} />
                    <div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${isActive ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </label>
              </div>

              <div className="w-32">
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Urutan
                </label>
                <input
                  type="number"
                  min="0"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#b6252a] focus:ring-1 focus:ring-[#b6252a]"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-[#b6252a]">
                {error}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-[#b6252a] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#961f23] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
