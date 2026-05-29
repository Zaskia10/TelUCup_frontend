"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  FileText, 
  Swords, 
  Clock,
  Building2,
  UserPlus,
  Trophy,
  ArrowRight
} from "lucide-react";

// --- MOCK DATA ---
const kontingenInfo = {
  name: "Fakultas Informatika (FIF)",
  picName: "Budi Santoso",
  contact: "081234567890",
};

const quickStats = [
  { 
    label: "Total Anggota", 
    value: "45", 
    subtext: "Pemain terdaftar", 
    icon: Users, 
    bgColor: "bg-blue-50", 
    textColor: "text-blue-600",
    border: "border-gray-100" 
  },
  { 
    label: "Tim Terdaftar", 
    value: "5", 
    subtext: "Dari 8 cabang olahraga", 
    icon: Building2, 
    bgColor: "bg-purple-50", 
    textColor: "text-purple-600",
    border: "border-gray-100" 
  },
  { 
    label: "Pertandingan Hari Ini", 
    value: "2", 
    subtext: "Jadwal aktif", 
    icon: Swords, 
    bgColor: "bg-emerald-50", 
    textColor: "text-emerald-600",
    border: "border-gray-100" 
  },
  { 
    label: "Menunggu Verifikasi", 
    value: "1", 
    subtext: "Tim perlu ditinjau", 
    icon: Clock, 
    bgColor: "bg-orange-50", 
    textColor: "text-orange-600",
    border: "border-orange-200 ring-1 ring-orange-100 shadow-[0_0_15px_rgba(249,115,22,0.1)]" 
  },
];

const todayMatches = [
  {
    id: 1,
    teamA: "FIF",
    teamB: "FRI",
    time: "10:00 WIB",
    venue: "Lapangan Basket T-Rex",
    sport: "Basket Putra"
  },
  {
    id: 2,
    teamA: "FIF",
    teamB: "FTE",
    time: "14:00 WIB",
    venue: "Gedung Tarung Derajat",
    sport: "Futsal Putra"
  }
];

const teamRegistrations = [
  { id: 1, sport: "Basket Putra", status: "Terverifikasi", players: 12 },
  { id: 2, sport: "Futsal Putra", status: "Terverifikasi", players: 10 },
  { id: 3, sport: "Voli Campuran", status: "Menunggu Verifikasi", players: 6 },
];

export default function PICKontingenDashboardOverview() {
  const [matches] = useState(todayMatches);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Terverifikasi": return "bg-green-100 text-green-700 border-green-200";
      case "Menunggu Verifikasi": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Draft": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard PIC Kontingen</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola kontingen {kontingenInfo.name} Anda dengan mudah.
          </p>
        </div>
        
        {/* Quick Actions / Shortcuts */}
        <div className="flex gap-3">
          <Link 
            href="/dashboard/pic_kontingen/anggota"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <UserPlus size={16} />
            Tambah Anggota
          </Link>
          <Link
            href="/dashboard/pic_kontingen/registrasi" 
            className="flex items-center gap-2 px-4 py-2 bg-[#b71c1c] hover:bg-[#9b1818] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Trophy size={16} />
            Registrasi Tim
          </Link>
        </div>
      </div>

      {/* A. Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => (
          <div key={idx} className={`bg-white rounded-xl p-5 border ${stat.border} flex items-start justify-between shadow-sm`}>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-xs text-gray-400">{stat.subtext}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor} ${stat.textColor}`}>
              <stat.icon size={24} strokeWidth={2} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* B. Widget 1: Jadwal Pertandingan Hari Ini */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Swords size={20} className="text-[#b71c1c]" />
              Pertandingan Hari Ini
            </h2>
            <Link href="/dashboard/pic_kontingen/jadwal" className="text-sm text-[#b71c1c] font-medium hover:underline flex items-center gap-1">
              Semua Jadwal <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
                {/* Accent Line */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#b71c1c]"></div>
                
                <div className="flex items-center gap-6 w-full sm:w-auto pl-2">
                  <div className="text-center w-24">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center border border-gray-200 shadow-inner">
                      <span className="font-bold text-gray-600">{match.teamA}</span>
                    </div>
                    <span className="text-sm font-semibold">{match.teamA}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-[#b71c1c] bg-red-50 px-2 py-0.5 rounded-full mb-1 uppercase tracking-wider">{match.sport}</span>
                    <span className="text-lg font-bold text-gray-800">{match.time}</span>
                    <span className="text-xs text-gray-500 mt-1 text-center w-32 truncate" title={match.venue}>
                      {match.venue}
                    </span>
                  </div>

                  <div className="text-center w-24">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center border border-gray-200 shadow-inner">
                      <span className="font-bold text-gray-600">{match.teamB}</span>
                    </div>
                    <span className="text-sm font-semibold">{match.teamB}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors flex-1 sm:flex-none text-center w-full shadow-sm">
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
            {matches.length === 0 && (
              <div className="text-center text-gray-500 py-10 bg-white border border-gray-200 rounded-xl shadow-sm">
                <Swords size={48} className="mx-auto text-gray-300 mb-3" />
                <p>Tidak ada pertandingan hari ini.</p>
              </div>
            )}
          </div>
        </div>

        {/* C. Widget 2: Status Registrasi Tim & Ringkasan Kontingen */}
        <div className="xl:col-span-1 space-y-6">
          {/* Kontingen Summary Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
             <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 relative z-10">Informasi Kontingen</h2>
             
             <div className="space-y-3 relative z-10">
                <div>
                  <p className="text-xs text-gray-400">Nama Kontingen</p>
                  <p className="font-semibold text-gray-800">{kontingenInfo.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">PIC Utama</p>
                  <p className="font-medium text-gray-700">{kontingenInfo.picName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Kontak</p>
                  <p className="font-medium text-gray-700">{kontingenInfo.contact}</p>
                </div>
             </div>
          </div>

          {/* Registrasi Tim Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2">
                <FileText size={18} className="text-[#b71c1c]" />
                Status Registrasi
              </h2>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Tim / Cabor</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teamRegistrations.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800 text-[13px]">{item.sport}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.players} Anggota</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center justify-center text-[10px] font-bold px-2 py-1 rounded-md border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
              <Link href="/dashboard/pic_kontingen/registrasi" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center justify-center gap-1">
                Kelola Semua Tim <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
