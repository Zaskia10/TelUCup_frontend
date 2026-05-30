"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
  ZoomIn,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface GalleryPhoto {
  photo_face_id: number;
  image_url?: string;
  face_crop_url?: string;
  event_photo_url?: string;
  full_photo_url?: string;
  confidence_score?: number;
  is_validated?: boolean;
  validated_at?: string | null;
  created_at?: string;
}

type FilterTab = "all" | "validated" | "pending";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getPhotoUrl(photo: GalleryPhoto): string {
  return (
    photo.face_crop_url ||
    photo.image_url ||
    photo.event_photo_url ||
    photo.full_photo_url ||
    ""
  );
}

function getFullPhotoUrl(photo: GalleryPhoto): string {
  return photo.event_photo_url || photo.full_photo_url || getPhotoUrl(photo);
}

// ─── Toast ─────────────────────────────────────────────────────────────────────

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
        type === "success" ? "bg-emerald-600" : "bg-red-600"
      }`}
    >
      {type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
      <button onClick={onClose} className="ml-1 hover:opacity-75">
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Photo Card ────────────────────────────────────────────────────────────────

function PhotoCard({
  photo,
  onValidate,
  onPreview,
  validatingId,
}: {
  photo: GalleryPhoto;
  onValidate: (id: number) => void;
  onPreview: (photo: GalleryPhoto) => void;
  validatingId: number | null;
}) {
  const photoUrl = getPhotoUrl(photo);
  const confidence = photo.confidence_score
    ? Math.round(photo.confidence_score * 100)
    : null;
  const isValidating = validatingId === photo.photo_face_id;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group transition-shadow hover:shadow-md">
      {/* Image */}
      <div
        className="relative aspect-square bg-gray-100 cursor-pointer overflow-hidden"
        onClick={() => onPreview(photo)}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Foto event"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "";
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera size={36} className="text-gray-300" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={28} className="text-white" />
        </div>

        {/* Validated badge */}
        {photo.is_validated && (
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow">
            <CheckCircle2 size={14} />
          </div>
        )}

        {/* Confidence badge */}
        {confidence !== null && (
          <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {confidence}% match
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          {photo.is_validated ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={10} /> Dikonfirmasi
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
              <Clock size={10} /> Belum Dikonfirmasi
            </span>
          )}
          {photo.created_at && (
            <span className="text-[10px] text-gray-400">{formatDate(photo.created_at)}</span>
          )}
        </div>

        {!photo.is_validated && (
          <button
            onClick={() => onValidate(photo.photo_face_id)}
            disabled={isValidating}
            className="w-full mt-1 py-2 rounded-lg bg-[#b71c1c] text-white text-xs font-bold hover:bg-[#9b1818] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {isValidating ? (
              <><Loader2 size={12} className="animate-spin" /> Memvalidasi...</>
            ) : (
              "✓ Ini Foto Saya"
            )}
          </button>
        )}

        {photo.is_validated && photo.validated_at && (
          <p className="text-[10px] text-gray-400 text-center mt-1">
            Dikonfirmasi {formatDate(photo.validated_at)}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Preview Modal ─────────────────────────────────────────────────────────────

function PreviewModal({
  photo,
  onClose,
  onValidate,
  validatingId,
}: {
  photo: GalleryPhoto;
  onClose: () => void;
  onValidate: (id: number) => void;
  validatingId: number | null;
}) {
  const fullUrl = getFullPhotoUrl(photo);
  const cropUrl = getPhotoUrl(photo);
  const confidence = photo.confidence_score
    ? Math.round(photo.confidence_score * 100)
    : null;
  const isValidating = validatingId === photo.photo_face_id;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Detail Foto</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 p-1.5 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {/* Full photo */}
          {fullUrl && (
            <div className="rounded-xl overflow-hidden bg-gray-100 mb-4 max-h-80 flex items-center justify-center">
              <img
                src={fullUrl}
                alt="Foto lengkap"
                className="max-h-80 w-auto object-contain"
              />
            </div>
          )}

          {/* Face crop (if different from full) */}
          {cropUrl && cropUrl !== fullUrl && (
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Wajah Terdeteksi</p>
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                <img src={cropUrl} alt="Wajah" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-4">
            {confidence !== null && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <p className="text-[10px] font-bold uppercase text-gray-400">Kemiripan</p>
                <p className="text-sm font-bold text-gray-800">{confidence}%</p>
              </div>
            )}
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <p className="text-[10px] font-bold uppercase text-gray-400">Status</p>
              <p
                className={`text-sm font-bold ${
                  photo.is_validated ? "text-green-600" : "text-gray-600"
                }`}
              >
                {photo.is_validated ? "Dikonfirmasi" : "Belum dikonfirmasi"}
              </p>
            </div>
            {photo.created_at && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <p className="text-[10px] font-bold uppercase text-gray-400">Tanggal</p>
                <p className="text-sm font-bold text-gray-800">{formatDate(photo.created_at)}</p>
              </div>
            )}
          </div>

          {!photo.is_validated && (
            <button
              onClick={() => onValidate(photo.photo_face_id)}
              disabled={isValidating}
              className="w-full py-3 bg-[#b71c1c] text-white font-bold rounded-lg hover:bg-[#9b1818] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <><Loader2 size={16} className="animate-spin" /> Memvalidasi...</>
              ) : (
                "✓ Konfirmasi Ini Foto Saya"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PlayerGaleriPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [validatingId, setValidatingId] = useState<number | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<GalleryPhoto | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/my-gallery`, { headers: getHeaders() });
      const json = await res.json();
      if (res.ok) {
        const data = json.data ?? json ?? [];
        setPhotos(Array.isArray(data) ? data : []);
      } else {
        setError(json.message || "Gagal memuat galeri");
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleValidate = async (photoFaceId: number) => {
    setValidatingId(photoFaceId);
    try {
      const res = await fetch(`${API_URL}/my-gallery/${photoFaceId}/validate`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      const json = await res.json();
      if (res.ok) {
        setPhotos((prev) =>
          prev.map((p) =>
            p.photo_face_id === photoFaceId
              ? { ...p, is_validated: true, validated_at: new Date().toISOString() }
              : p
          )
        );
        if (previewPhoto?.photo_face_id === photoFaceId) {
          setPreviewPhoto((p) =>
            p ? { ...p, is_validated: true, validated_at: new Date().toISOString() } : null
          );
        }
        setToast({ type: "success", msg: "Foto berhasil dikonfirmasi sebagai foto Anda." });
      } else {
        setToast({ type: "error", msg: json.message || "Gagal mengonfirmasi foto." });
      }
    } catch {
      setToast({ type: "error", msg: "Terjadi kesalahan jaringan." });
    } finally {
      setValidatingId(null);
    }
  };

  // ── Filtered photos ──
  const filteredPhotos = photos.filter((p) => {
    if (filterTab === "validated") return p.is_validated === true;
    if (filterTab === "pending") return !p.is_validated;
    return true;
  });

  const validatedCount = photos.filter((p) => p.is_validated).length;
  const pendingCount = photos.filter((p) => !p.is_validated).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Preview modal */}
      {previewPhoto && (
        <PreviewModal
          photo={previewPhoto}
          onClose={() => setPreviewPhoto(null)}
          onValidate={handleValidate}
          validatingId={validatingId}
        />
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Galeri Saya</h1>
          <p className="text-gray-500 text-sm mt-1">
            Foto-foto dari event Tel-U Cup yang menampilkan Anda, terdeteksi oleh sistem AI.
          </p>
        </div>
        <button
          onClick={fetchGallery}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* ── Summary cards ── */}
      {!loading && !error && photos.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-extrabold text-gray-900">{photos.length}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Total Foto</p>
          </div>
          <div className="bg-white rounded-xl border border-green-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-extrabold text-green-600">{validatedCount}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Dikonfirmasi</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-extrabold text-amber-500">{pendingCount}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Belum Dikonfirmasi</p>
          </div>
        </div>
      )}

      {/* ── Filter tabs ── */}
      {!loading && !error && photos.length > 0 && (
        <div className="flex gap-1 border-b border-gray-200">
          {(
            [
              { key: "all", label: `Semua (${photos.length})` },
              { key: "validated", label: `Dikonfirmasi (${validatedCount})` },
              { key: "pending", label: `Belum (${pendingCount})` },
            ] as { key: FilterTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key)}
              className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                filterTab === tab.key
                  ? "border-[#B41F2A] text-[#B41F2A]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-[#b71c1c]" size={36} />
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700 mb-2">Gagal Memuat Galeri</h3>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button
            onClick={fetchGallery}
            className="px-5 py-2.5 bg-[#b71c1c] text-white rounded-lg text-sm font-bold hover:bg-[#9b1818] transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      ) : photos.length === 0 ? (
        /* Empty state */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Camera size={36} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Belum Ada Foto</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Foto Anda dari event Tel-U Cup akan muncul di sini setelah sistem AI mendeteksi
            wajah Anda pada foto-foto event.
          </p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-gray-500 text-sm">
            Tidak ada foto di kategori ini.
          </p>
        </div>
      ) : (
        /* Photo grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.photo_face_id}
              photo={photo}
              onValidate={handleValidate}
              onPreview={setPreviewPhoto}
              validatingId={validatingId}
            />
          ))}
        </div>
      )}

      {/* Info note */}
      {!loading && !error && photos.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <Camera size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Cara kerja Galeri Saya:</strong> Sistem AI kami secara otomatis mencocokkan
            wajah Anda dengan foto-foto event. Tekan <strong>"Ini Foto Saya"</strong> untuk
            mengonfirmasi bahwa foto tersebut benar-benar menampilkan Anda. Foto yang belum
            dikonfirmasi tidak akan ditampilkan di galeri publik.
          </p>
        </div>
      )}
    </div>
  );
}
