"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  UserCircle,
  ClipboardList,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";
import {
  getMyUser,
  updateProfile,
  enrollFace,
  type UserData,
  type UpdateProfilePayload,
} from "@/services/playerProfileService";
import { getMyLatestAssessment } from "@/services/selfAssessmentService";

// ─── Step Definitions ───────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Foto Wajah", icon: Camera },
  { id: 2, label: "Lengkapi Profil", icon: UserCircle },
  { id: 3, label: "Self Assessment", icon: ClipboardList },
  { id: 4, label: "Selesai", icon: CheckCircle2 },
] as const;

const EMPLOYEE_STATUS_OPTIONS = [
  "MAHASISWA",
  "DOSEN",
  "TENDIK",
  "PEGAWAI TETAP",
  "PEGAWAI KONTRAK",
  "TPA",
];

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Step 1 — Face Upload
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 — Profile
  const [nimNip, setNimNip] = useState("");
  const [employeeStatus, setEmployeeStatus] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileFieldErrors, setProfileFieldErrors] = useState<Record<string, string[]>>({});

  // ─── Determine starting step on mount ─────────────────────────────────────────

  useEffect(() => {
    checkOnboardingStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkOnboardingStatus = async () => {
    setLoading(true);
    try {
      const user = await getMyUser();
      setUserData(user);

      // Pre-fill form from existing data
      if (user.player) {
        setNimNip(user.player.nim_nip || "");
        setEmployeeStatus(user.player.employee_status || "");
        setWorkLocation(user.player.work_location || "");
      }

      // Determine which step to start from
      if (!user.player?.photo_path) {
        setCurrentStep(1);
      } else if (!user.player?.employee_status || !user.player?.work_location) {
        setCurrentStep(2);
      } else {
        // Check self-assessment
        try {
          const assessmentRes = await getMyLatestAssessment() as { data?: { is_valid?: boolean } | null };
          if (assessmentRes?.data && (assessmentRes.data as { is_valid?: boolean })?.is_valid) {
            // All done — redirect to dashboard
            router.replace("/dashboard/player");
            return;
          }
          setCurrentStep(3);
        } catch {
          setCurrentStep(3);
        }
      }
    } catch (err) {
      // If user fetch fails, they might not be logged in
      console.error("Onboarding status check failed:", err);
      router.replace("/login");
      return;
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 1: Face Upload Handlers ─────────────────────────────────────────────

  const handlePhotoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setUploadError("Format file harus JPEG atau PNG.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 5MB.");
      return;
    }

    setSelectedPhoto(file);
    setUploadError("");
    setPhotoPreview(URL.createObjectURL(file));
  }, []);

  const handleUploadPhoto = async () => {
    if (!selectedPhoto) return;

    setUploading(true);
    setUploadError("");
    try {
      await enrollFace(selectedPhoto);
      setUploadSuccess(true);
      // Auto-advance after brief delay
      setTimeout(() => setCurrentStep(2), 1200);
    } catch (err) {
      setUploadError(
        err instanceof Error
          ? err.message
          : "Gagal mengunggah foto. Pastikan wajah terlihat jelas."
      );
    } finally {
      setUploading(false);
    }
  };

  const clearPhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    setUploadError("");
    setUploadSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Step 2: Profile Save Handler ─────────────────────────────────────────────

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileError("");
    setProfileFieldErrors({});

    try {
      const payload: UpdateProfilePayload = {
        nim_nip: nimNip || undefined,
        employee_status: employeeStatus || null,
        work_location: workLocation || null,
      };

      await updateProfile(payload);

      setCurrentStep(3);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "status" in err && (err as { status: number }).status === 422) {
        const valErr = err as unknown as { message: string; errors: Record<string, string[]> };
        setProfileFieldErrors(valErr.errors || {});
        setProfileError(valErr.message || "Validasi gagal.");
      } else {
        setProfileError(err instanceof Error ? err.message : "Gagal menyimpan profil.");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  // ─── Step 3: Redirect to Self Assessment ──────────────────────────────────────

  const goToSelfAssessment = () => {
    router.push("/self-assessment");
  };

  // ─── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#b71c1c] mx-auto" size={40} />
          <p className="text-sm text-gray-500 mt-4">Memeriksa status onboarding...</p>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f0f0] via-[#f0f4f8] to-[#f0f2f8]">
      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                // Clear authentication tokens and user state
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.replace("/login");
              }}
              className="p-2 hover:bg-red-50 rounded-xl text-gray-500 hover:text-[#b71c1c] transition-all"
              title="Kembali ke Login"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Selamat Datang, {userData?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Lengkapi data berikut sebelum masuk dashboard.
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-[#b71c1c]/10 rounded-full shrink-0">
            <span className="text-xs font-bold text-[#b71c1c]">
              {currentStep} / {STEPS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center justify-between relative">
          {/* Connection line */}
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-200 z-0" />
          <div
            className="absolute top-5 left-8 h-0.5 bg-[#b71c1c] z-0 transition-all duration-500"
            style={{
              width: `${((Math.min(currentStep, STEPS.length) - 1) / (STEPS.length - 1)) * 100}%`,
              maxWidth: "calc(100% - 4rem)",
            }}
          />

          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isDone = currentStep > step.id;

            return (
              <div key={step.id} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isDone
                      ? "bg-[#b71c1c] text-white shadow-md"
                      : isActive
                      ? "bg-white border-2 border-[#b71c1c] text-[#b71c1c] shadow-md"
                      : "bg-gray-100 border-2 border-gray-200 text-gray-400"
                  }`}
                >
                  {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                </div>
                <span
                  className={`text-[10px] font-bold mt-1.5 ${
                    isActive ? "text-[#b71c1c]" : isDone ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ── STEP 1: Upload Foto Wajah ── */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#b71c1c] to-[#e53935] rounded-2xl flex items-center justify-center text-white shadow-md mb-4">
                <Camera size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Upload Foto Wajah</h2>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Foto ini digunakan untuk sistem pengenalan wajah saat check-in pertandingan. 
                Pastikan wajah terlihat jelas dan tidak tertutup.
              </p>
            </div>

            {/* Upload Area */}
            {!photoPreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-[#b71c1c]/40 hover:bg-[#b71c1c]/5 transition-colors group"
              >
                <Upload
                  size={40}
                  className="text-gray-300 mx-auto mb-3 group-hover:text-[#b71c1c]/60 transition-colors"
                />
                <p className="text-sm font-semibold text-gray-600">
                  Ambil Foto / Pilih dari Galeri
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Format: JPEG, JPG, atau PNG · Maks: 5MB
                </p>
              </div>
            ) : (
              <div className="relative max-w-xs mx-auto">
                <img
                  src={photoPreview}
                  alt="Preview foto wajah"
                  className="w-full aspect-square object-cover rounded-2xl border border-gray-200 shadow-sm"
                />
                {!uploadSuccess && (
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    <X size={14} className="text-gray-500" />
                  </button>
                )}
                {uploadSuccess && (
                  <div className="absolute inset-0 bg-green-500/20 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white rounded-full p-3 shadow-lg">
                      <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {uploadError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                <AlertCircle size={16} className="shrink-0" />
                {uploadError}
              </div>
            )}

            {selectedPhoto && !uploadSuccess && (
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ganti Foto
                </button>
                <button
                  type="button"
                  onClick={handleUploadPhoto}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#b71c1c] rounded-lg hover:bg-[#9b1818] transition-colors disabled:opacity-50 shadow-sm"
                >
                  {uploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {uploading ? "Mengunggah..." : "Upload Foto"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Lengkapi Profil ── */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#b71c1c] to-[#e53935] rounded-2xl flex items-center justify-center text-white shadow-md mb-4">
                <UserCircle size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Lengkapi Profil</h2>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Isi data berikut agar panitia bisa mengelola peserta dengan baik.
              </p>
            </div>

            {profileError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                <AlertCircle size={16} className="shrink-0" />
                {profileError}
              </div>
            )}

            <div className="space-y-4">
              {/* NIM/NIP */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  NIM / NIP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nimNip}
                  onChange={(e) => setNimNip(e.target.value)}
                  placeholder="Contoh: 1301214567"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#b71c1c] focus:ring-1 focus:ring-[#b71c1c]/20 transition-colors placeholder:text-gray-300"
                />
                {profileFieldErrors.nim_nip && (
                  <p className="text-xs text-red-500 mt-1">{profileFieldErrors.nim_nip[0]}</p>
                )}
              </div>

              {/* Employee Status */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Status Kepegawaian <span className="text-red-500">*</span>
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
                {profileFieldErrors.employee_status && (
                  <p className="text-xs text-red-500 mt-1">{profileFieldErrors.employee_status[0]}</p>
                )}
              </div>

              {/* Work Location */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Unit / Fakultas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  placeholder="Contoh: Fakultas Informatika"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#b71c1c] focus:ring-1 focus:ring-[#b71c1c]/20 transition-colors placeholder:text-gray-300"
                />
                {profileFieldErrors.work_location && (
                  <p className="text-xs text-red-500 mt-1">{profileFieldErrors.work_location[0]}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={savingProfile || !employeeStatus || !workLocation}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#b71c1c] rounded-lg hover:bg-[#9b1818] transition-colors disabled:opacity-50 shadow-sm"
              >
                {savingProfile ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowRight size={16} />
                )}
                {savingProfile ? "Menyimpan..." : "Simpan & Lanjut"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Self Assessment ── */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#b71c1c] to-[#e53935] rounded-2xl flex items-center justify-center text-white shadow-md mb-4">
                <ClipboardList size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Self Assessment Kesehatan</h2>
              <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                Langkah terakhir! Isi kuesioner kesehatan agar panitia bisa memastikan 
                keselamatan Anda selama bertanding.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">Penting</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Jawab semua pertanyaan dengan jujur. Data ini bersifat rahasia dan hanya 
                  digunakan untuk keperluan medis selama pertandingan.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={goToSelfAssessment}
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-[#b71c1c] rounded-lg hover:bg-[#9b1818] transition-colors shadow-sm"
              >
                <ClipboardList size={16} />
                Mulai Self Assessment
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Selesai ── */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Onboarding Selesai! 🎉</h2>
              <p className="text-sm text-gray-500 mt-1">
                Semua data Anda sudah lengkap. Anda siap untuk bertanding!
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.replace("/dashboard/player")}
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-[#b71c1c] rounded-lg hover:bg-[#9b1818] transition-colors shadow-sm"
            >
              Masuk Dashboard
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
