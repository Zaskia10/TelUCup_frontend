"use client";

import { useState } from "react";
import { 
  Building2, 
  Clock, 
  Swords, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  UserPlus,
  ArrowUpRight,
  UserCheck
} from "lucide-react";

// --- MOCK DATA ---
const quickStats = [
  { 
    label: "Total Kontingen", 
    value: "24", 
    subtext: "Fakultas / Unit", 
    icon: Building2, 
    bgColor: "bg-blue-50", 
    textColor: "text-blue-600",
    border: "border-gray-100" 
  },
  { 
    label: "Tim Menunggu Verifikasi", 
    value: "12", 
    subtext: "Perlu ditinjau", 
    icon: Clock, 
    bgColor: "bg-orange-50", 
    textColor: "text-orange-600",
    border: "border-orange-200 ring-1 ring-orange-100 shadow-[0_0_15px_rgba(249,115,22,0.1)]" 
  },
  { 
    label: "Pertandingan Hari Ini", 
    value: "8", 
    subtext: "Jadwal aktif", 
    icon: Swords, 
    bgColor: "bg-emerald-50", 
    textColor: "text-emerald-600",
    border: "border-gray-100" 
  },
  { 
    label: "Peringatan Medis (Red Flag)", 
    value: "3", 
    subtext: "Pemain", 
    icon: AlertTriangle, 
    bgColor: "bg-red-50", 
    textColor: "text-red-600",
    border: "border-red-200 ring-1 ring-red-100 shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
  },
];

const initialLiveMatches = [
  {
    id: 1,
    teamA: "FTE",
    teamB: "FRI",
    time: "10:00 WIB",
    venue: "Lapangan Basket T-Rex",
    status: "Akan Datang",
    players: [
      { id: 101, name: "Ahmad Dani", team: "FTE", medicalStatus: "Hijau", checkedIn: false },
      { id: 102, name: "Budi Santoso", team: "FTE", medicalStatus: "Kuning", checkedIn: true },
      { id: 103, name: "Candra Wijaya", team: "FRI", medicalStatus: "Merah", checkedIn: false },
      { id: 104, name: "Deni Pratama", team: "FRI", medicalStatus: "Hijau", checkedIn: false },
    ]
  },
  {
    id: 2,
    teamA: "FIF",
    teamB: "FKB",
    time: "13:00 WIB",
    venue: "Gedung Tarung Derajat",
    status: "Persiapan",
    players: [
      { id: 201, name: "Eko Prasetyo", team: "FIF", medicalStatus: "Hijau", checkedIn: false },
      { id: 202, name: "Fajar Rizky", team: "FKB", medicalStatus: "Hijau", checkedIn: false },
    ]
  }
];

const contingents = [
  { id: 1, name: "Fakultas Informatika (FIF)", pic: "Rizky Ramadhan", players: 45 },
  { id: 2, name: "Fakultas Teknik Elektro (FTE)", pic: "Bima Arya", players: 38 },
  { id: 3, name: "Fakultas Rekayasa Industri (FRI)", pic: "Sarah Amelia", players: 42 },
];

export default function AdminDashboardOverview() {
  const [matches, setMatches] = useState(initialLiveMatches);
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(1);

  const toggleMatchExpand = (id: number) => {
    setExpandedMatchId(expandedMatchId === id ? null : id);
  };

  const togglePlayerCheckIn = (matchId: number, playerId: number) => {
    setMatches(matches.map(match => {
      if (match.id === matchId) {
        return {
          ...match,
          players: match.players.map(p => 
            p.id === playerId ? { ...p, checkedIn: !p.checkedIn } : p
          )
        };
      }
      return match;
    }));
  };

  const getMedicalBadgeClass = (status: string) => {
    switch (status) {
      case "Merah": return "bg-red-100 text-red-700 border-red-200";
      case "Kuning": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Hijau": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getMedicalBadgeLabel = (status: string) => {
    switch (status) {
      case "Merah": return "High Risk";
      case "Kuning": return "Mod. Risk";
      case "Hijau": return "Low Risk";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Selamat datang di panel kontrol kepanitiaan Tel-U Cup.</p>
      </div>

      {/* A. Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => (
          <div key={idx} className={`bg-white rounded-xl p-5 border ${stat.border} flex items-start justify-between`}>
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
        {/* B. Widget 1: Live Bracket & Field Verification Preview */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Swords size={20} className="text-[#b71c1c]" />
              Live Matches & Verifikasi Lapangan
            </h2>
            <button className="text-sm text-[#b71c1c] font-medium hover:underline">Lihat Semua Jadwal</button>
          </div>
          
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* Match Card Header */}
                <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="text-center w-24">
                      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center border border-gray-200 shadow-inner">
                        <span className="font-bold text-gray-600">{match.teamA}</span>
                      </div>
                      <span className="text-sm font-semibold">{match.teamA}</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full mb-2">
                        {match.time}
                      </span>
                      <span className="text-lg font-bold text-gray-300">VS</span>
                      <span className="text-xs text-gray-500 mt-1 text-center w-24 truncate" title={match.venue}>
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
                    <button className="px-4 py-2 border border-[#b71c1c] text-[#b71c1c] hover:bg-red-50 text-sm font-medium rounded-lg transition-colors flex-1 sm:flex-none text-center">
                      Update Skor
                    </button>
                    <button 
                      onClick={() => toggleMatchExpand(match.id)}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
                    >
                      Verifikasi Check-in
                      {expandedMatchId === match.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expendable Drawer: Verifikasi Lapangan */}
                {expandedMatchId === match.id && (
                  <div className="bg-slate-50 border-t border-gray-200 p-5">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <UserCheck size={16} className="text-gray-500" />
                      Daftar Pemain & Status Medis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Group by Team for better layout */}
                      {[match.teamA, match.teamB].map(team => (
                        <div key={team} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">
                            Tim {team}
                          </div>
                          <ul className="space-y-3">
                            {match.players.filter(p => p.team === team).map(player => (
                              <li key={player.id} className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-gray-800">{player.name}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold flex items-center gap-1 ${getMedicalBadgeClass(player.medicalStatus)}`}>
                                      {player.medicalStatus === "Merah" && <ShieldAlert size={10} />}
                                      {getMedicalBadgeLabel(player.medicalStatus)}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => togglePlayerCheckIn(match.id, player.id)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${player.checkedIn ? "bg-green-500" : "bg-gray-300"}`}
                                >
                                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${player.checkedIn ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                              </li>
                            ))}
                            {match.players.filter(p => p.team === team).length === 0 && (
                              <li className="text-xs text-gray-400 italic">Tidak ada pemain yang terdaftar.</li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* C. Widget 2: Ringkasan Kontingen & Manajemen Akun */}
        <div className="xl:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Building2 size={20} className="text-[#b71c1c]" />
              Manajemen Kontingen
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Kontingen & PIC</th>
                    <th className="px-4 py-3 text-center">Pemain</th>
                    <th className="px-4 py-3 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contingents.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800 text-[13px]">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">PIC: {item.pic}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                          {item.players}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <button 
                            className="text-[11px] flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors w-full sm:w-auto justify-center sm:justify-end"
                            title="Promote Player to PIC"
                          >
                            <ArrowUpRight size={12} />
                            Jadikan PIC
                          </button>
                          <button 
                            className="text-[11px] flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition-colors w-full sm:w-auto justify-center sm:justify-end"
                            title="Generate Player Account"
                          >
                            <UserPlus size={12} />
                            Generate Akun
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Lihat Seluruh Kontingen &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
