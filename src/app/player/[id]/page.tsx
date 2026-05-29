"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Briefcase, 
  CreditCard,
  Phone,
  Mail,
  Calendar,
  XCircle,
  FileText,
  AlertCircle // Added missing import
} from "lucide-react";
import { getPlayerDetail } from "@/services/playerService";

export default function PlayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const playerId = params.id as string;
  
  const [player, setPlayer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      setIsLoading(true);
      try {
        const res = await getPlayerDetail(playerId);
        setPlayer(res.data);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat data pemain");
      } finally {
        setIsLoading(false);
      }
    };

    if (playerId) {
      fetchPlayer();
    }
  }, [playerId]);

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified": return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", label: "Terverifikasi", icon: ShieldCheck };
      case "pending": return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", label: "Menunggu Verifikasi", icon: Clock };
      case "rejected": return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", label: "Ditolak", icon: XCircle };
      case "draft": return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", label: "Belum Diajukan", icon: FileText };
      default: return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", label: status || "Belum Diajukan", icon: Clock };
    }
  };

  const getMedicalBadge = (status: string) => {
    switch (status) {
      case "Hijau": return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", icon: ShieldCheck };
      case "Kuning": return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", icon: ShieldAlert };
      case "Merah": return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", icon: XCircle };
      default: return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", icon: ShieldAlert };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b71c1c]"></div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex flex-col items-center justify-center p-4">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Gagal Memuat Data</h2>
        <p className="text-gray-500 text-center">{error || "Data pemain tidak ditemukan"}</p>
        <button 
          onClick={() => router.back()}
          className="mt-6 px-6 py-2 bg-[#b71c1c] text-white rounded-lg text-sm font-medium hover:bg-[#9b1818] transition-colors"
        >
          Kembali
        </button>
      </div>
    );
  }

  const vBadge = getVerificationBadge(player.verification_status);
  const VIcon = vBadge.icon;

  const mBadge = getMedicalBadge(player.medical_status || "Kuning"); // Assuming Kuning if not set
  const MIcon = mBadge.icon;

  return (
    <div className="min-h-screen bg-[#f4f7f6]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-bold text-gray-800 text-lg leading-tight">Detail Profil Pemain</h1>
              <p className="text-xs text-gray-500">
                {player.contingent?.name || `Kontingen ID: ${player.contingent_id}`}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider flex items-center gap-1.5 ${vBadge.bg} ${vBadge.text} ${vBadge.border}`}>
            <VIcon size={14} />
            {vBadge.label}
          </div>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {player.verification_status === "rejected" && player.reject_reason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
            <XCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-red-800 text-sm">Pendaftaran Ditolak</h3>
              <p className="text-red-600 text-sm mt-1">Alasan: {player.reject_reason}</p>
              <p className="text-red-500 text-xs mt-2 italic">Silakan perbaiki data terkait.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Basic Identity */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center text-gray-400 overflow-hidden mb-4 relative">
                  {player.photo_path ? (
                    <img src={player.photo_path} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} />
                  )}
                  {/* Status Indicator Dot */}
                  <div className={`absolute bottom-2 right-4 w-5 h-5 rounded-full border-2 border-white ${vBadge.bg} ${vBadge.text}`}></div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{player.name}</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">{player.nim_nip}</p>
                <div className="mt-3 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                  {player.employee_status || "Mahasiswa"}
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Status Medis (Self Assessment)</h3>
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${mBadge.bg} ${mBadge.text} ${mBadge.border}`}>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <MIcon size={20} className={mBadge.text} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Zona {player.medical_status || "Kuning"}</p>
                    <p className="text-[10px] leading-tight mt-0.5 opacity-80">
                      {player.medical_status === "Hijau" ? "Direkomendasikan bertanding" : 
                       player.medical_status === "Merah" ? "Tidak direkomendasikan bertanding" : 
                       "Perlu pemeriksaan / Menunggu hasil"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Information & Documents */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <User size={18} className="text-[#b71c1c]" />
                  Informasi Personal
                </h3>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Mail size={12} /> Email
                  </label>
                  <p className="font-medium text-gray-800 text-sm">{player.email || "-"}</p>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Phone size={12} /> No. Telepon
                  </label>
                  <p className="font-medium text-gray-800 text-sm">{player.phone || "-"}</p>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <User size={12} /> Jenis Kelamin
                  </label>
                  <p className="font-medium text-gray-800 text-sm">{player.gender || "-"}</p>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <AlertCircle size={12} /> Golongan Darah
                  </label>
                  <p className="font-medium text-gray-800 text-sm">{player.blood_type || "-"}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <MapPin size={12} /> Lokasi Kerja / Fakultas
                  </label>
                  <p className="font-medium text-gray-800 text-sm">{player.work_location || "-"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FileText size={18} className="text-[#b71c1c]" />
                  Dokumen Persyaratan
                </h3>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-red-300 transition-colors group cursor-pointer">
                  <div className="w-12 h-12 bg-gray-50 group-hover:bg-red-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#b71c1c] transition-colors">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">KTM / ID Card</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {player.id_card_path ? "File telah diunggah" : "Belum ada file"}
                    </p>
                  </div>
                  {player.id_card_path && (
                    <button className="mt-2 text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider transition-colors">
                      Lihat Dokumen
                    </button>
                  )}
                </div>

                <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-red-300 transition-colors group cursor-pointer">
                  <div className="w-12 h-12 bg-gray-50 group-hover:bg-red-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#b71c1c] transition-colors">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">Surat Keterangan Sehat</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {player.health_certificate_path ? "File telah diunggah" : "Belum ada file"}
                    </p>
                  </div>
                  {player.health_certificate_path && (
                    <button className="mt-2 text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider transition-colors">
                      Lihat Dokumen
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
