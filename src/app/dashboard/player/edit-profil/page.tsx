"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Camera,
  Upload,
} from "lucide-react";
import {
  getMyUser,
  updateProfile,
  enrollFace,
  type UserData,
  type UpdateProfilePayload,
} from "@/services/playerProfileService";

const EMPLOYEE_STATUS_OPTIONS = [
  "MAHASISWA",
  "DOSEN",
  "TENDIK",
  "PEGAWAI TETAP",
  "PEGAWAI KONTRAK",
  "TPA",
];

export default function EditProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [nimNip, setNimNip] = useState("");
  const [employeeStatus, setEmployeeStatus] = useState("");
  const [workLocation, setWorkLocation] = useState("");

  // Photo states
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");

  // Field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await getMyUser();
      setUserData(user);

      // Pre-fill form
      const player = user.player;
      setNimNip(player?.nim_nip || "");
      setEmployeeStatus(player?.employee_status || "");
      setWorkLocation(player?.work_location || "");
      setPhotoPath(player?.photo_path || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data profil.");
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace("/api", "");
    return `${baseUrl}/storage/${path}`;
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setPhotoError("Format file harus JPEG atau PNG.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Ukuran file maksimal 5MB.");
      return;
    }

    setPhotoError("");
    setUploadingPhoto(true);
    try {
      await enrollFace(file);
      // Refresh profile data to get the updated photo path
      await fetchProfile();
      setSuccessMsg("Foto wajah berhasil diperbarui!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Gagal mengunggah foto.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMsg("");
    setFieldErrors({});

    try {
      const payload: UpdateProfilePayload = {
        nim_nip: nimNip || undefined,
        employee_status: employeeStatus || null,
        work_location: workLocation || null,
      };

      await updateProfile(payload);
      setSuccessMsg("Profil berhasil diperbarui!");

      // Refresh to make sure data is fresh
      await fetchProfile();

      // Auto-dismiss success after 3s
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        (err as { status: number }).status === 422
      ) {
        const validationErr = err as unknown as { message: string; errors: Record<string, string[]> };
        setFieldErrors(validationErr.errors || {});
        setError(validationErr.message || "Validasi gagal.");
      } else {
        setError(err instanceof Error ? err.message : "Gagal menyimpan perubahan.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="animate-spin text-[#b71c1c]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Profil</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Perbarui data pribadi Anda sebagai peserta.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
          <CheckCircle2 size={16} className="shrink-0" />
          {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Photo Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#a81d22] to-[#e53935] flex items-center justify-center text-white text-4xl font-extrabold shadow-md border-4 border-white overflow-hidden">
              {getPhotoUrl(photoPath) ? (
                <img
                  src={getPhotoUrl(photoPath) || ""}
                  alt="Foto Wajah"
                  className="w-full h-full object-cover"
                />
              ) : (
                userData?.name?.charAt(0).toUpperCase() || "—"
              )}
            </div>
            {uploadingPhoto && (
              <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center text-white">
                <Loader2 className="animate-spin" size={20} />
              </div>
            )}
          </div>
          
          <div className="mt-4 flex flex-col items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 hover:border-[#b71c1c] hover:text-[#b71c1c] transition-colors cursor-pointer shadow-sm">
              <Camera size={14} />
              Ubah Foto Wajah
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={uploadingPhoto}
              />
            </label>
            <p className="text-[10px] text-gray-400">
              Format: JPEG atau PNG. Maks: 5MB
            </p>
            {photoError && (
              <p className="text-xs text-red-500 font-medium mt-1">{photoError}</p>
            )}
          </div>
        </div>

        {/* Profile info card — read-only */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Informasi Akun</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                Nama Lengkap
              </label>
              <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
                {userData?.name || "—"}
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                Email
              </label>
              <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
                {userData?.email || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Data Peserta</h3>
          <div className="space-y-4">
            {/* NIM/NIP */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                NIM / NIP
              </label>
              <input
                type="text"
                value={nimNip}
                onChange={(e) => setNimNip(e.target.value)}
                placeholder="Masukkan NIM atau NIP"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#b71c1c] focus:ring-1 focus:ring-[#b71c1c]/20 transition-colors placeholder:text-gray-300"
              />
              {fieldErrors.nim_nip && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.nim_nip[0]}</p>
              )}
            </div>

            {/* Employee Status */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Status Kepegawaian
              </label>
              <select
                value={employeeStatus}
                onChange={(e) => setEmployeeStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#b71c1c] focus:ring-1 focus:ring-[#b71c1c]/20 transition-colors bg-white"
              >
                <option value="">— Pilih Status —</option>
                {EMPLOYEE_STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {fieldErrors.employee_status && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.employee_status[0]}</p>
              )}
            </div>

            {/* Work Location */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Unit / Lokasi Kerja
              </label>
              <input
                type="text"
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                placeholder="Contoh: Fakultas Informatika"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#b71c1c] focus:ring-1 focus:ring-[#b71c1c]/20 transition-colors placeholder:text-gray-300"
              />
              {fieldErrors.work_location && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.work_location[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#b71c1c] rounded-lg hover:bg-[#9b1818] transition-colors disabled:opacity-50 shadow-sm"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
