"use client";

import { useState, useEffect, useRef } from "react";
import {
  Building2,
  UploadCloud,
  Trash2,
  User,
  Users,
  Mail,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Camera,
} from "lucide-react";
import {
  getMyContingentProfile,
  uploadContingentImage,
  deleteContingentImage,
} from "./services";

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
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50 text-white ${
        type === "success" ? "bg-emerald-600" : "bg-red-600"
      }`}
    >
      {type === "success" ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75">
        &times;
      </button>
    </div>
  );
}

export default function ProfilKontingenPage() {
  const [loading, setLoading] = useState(true);
  const [contingent, setContingent] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const contRes = await getMyContingentProfile().catch(() => null);
      if (contRes && contRes.data) {
        setContingent(contRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Ukuran gambar maksimal 2MB", "error");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadContingentImage(file);
      showToast("Logo kontingen berhasil diperbarui");
      setContingent(res.data);
    } catch (err: any) {
      showToast(err.message || "Gagal mengunggah logo", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async () => {
    if (!contingent?.id) return;
    if (!confirm("Apakah Anda yakin ingin menghapus logo kontingen?")) return;

    try {
      setIsDeleting(true);
      const res = await deleteContingentImage(contingent.id);
      showToast("Logo kontingen berhasil dihapus");
      setContingent(
        res.data || { ...contingent, image_url: null, cloudinary_public_id: null }
      );
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus logo", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-[#b71c1c]" size={48} />
      </div>
    );
  }

  if (!contingent) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Kontingen Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">
            Anda belum terdaftar atau ditugaskan sebagai PIC di kontingen manapun.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Profil Kontingen</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola identitas dan informasi kontingen Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card: Kontingen Profile */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-2">
          <div className="h-24 bg-gradient-to-r from-[#8a1519] to-[#c21e24]" />

          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-12">
              {/* Logo Upload Section */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-2xl shadow-md border-4 border-white flex items-center justify-center overflow-hidden relative">
                  {contingent.image_url ? (
                    <img
                      src={contingent.image_url}
                      alt={contingent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 size={40} className="text-gray-300" />
                  )}

                  {/* Upload Overlay */}
                  <label
                    className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white ${
                      isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 className="animate-spin mb-1" size={24} />
                    ) : (
                      <Camera size={24} className="mb-1" />
                    )}
                    <span className="text-[10px] font-medium tracking-wider uppercase">
                      {isUploading ? "Mengunggah..." : "Ubah Logo"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      ref={fileInputRef}
                    />
                  </label>
                </div>

                {contingent.image_url && !isUploading && (
                  <button
                    onClick={handleDeleteImage}
                    disabled={isDeleting}
                    className="absolute -top-2 -right-2 bg-white text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-full shadow-md border border-gray-100 transition-colors z-10"
                    title="Hapus Logo"
                  >
                    {isDeleting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                )}
              </div>

              {/* Kontingen Details */}
              <div className="flex-1 text-center sm:text-left mt-2 sm:mt-14">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {contingent.name}
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                  <User size={14} /> Dikelola oleh Anda
                </p>

                <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-3">
                  <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 p-1.5 rounded-md">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Total Pemain</p>
                      <p className="text-sm font-bold text-gray-800">
                        {contingent.players_count} Terdaftar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card: PIC Detail */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-red-50 text-[#b71c1c] flex items-center justify-center">
              <User size={16} />
            </span>
            Informasi PIC Utama
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 mb-1">Nama Lengkap</p>
              <p className="font-semibold text-gray-800">{contingent.pic?.name || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 mb-1">Email</p>
              <p className="font-semibold text-gray-800 flex items-center gap-2">
                <Mail size={14} className="text-gray-400 shrink-0" />
                {contingent.pic?.email || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 mb-1">Peran Akses</p>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wider">
                {contingent.pic?.role || "-"}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 mb-1">
                Pengguna Kacamata Olahraga
              </p>
              <p className="font-semibold text-gray-800">
                {contingent.pic?.is_kacamata ? "Ya" : "Tidak"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
