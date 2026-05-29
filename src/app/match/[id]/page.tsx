"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  ShieldAlert, 
  ShieldCheck, 
  Trophy 
} from "lucide-react";

// --- MOCK DATA ---
const mockMatchData = {
  id: 1,
  sport: "Basket Putra",
  round: "Semifinal",
  status: "scheduled", // scheduled, live, finished
  date: "12 Okt 2026",
  time: "10:00 WIB",
  location: "Lapangan Basket T-Rex",
  referee: "Bpk. Sudarsono",
  teamA: {
    id: 10,
    name: "Fakultas Informatika",
    score: 0,
    players: [
      { id: 101, name: "Ahmad Dani", nim: "1301204001", position: "Captain", medicalStatus: "Hijau" },
      { id: 102, name: "Budi Santoso", nim: "1301204002", position: "Player", medicalStatus: "Kuning" },
      { id: 103, name: "Candra Wijaya", nim: "1301204003", position: "Player", medicalStatus: "Hijau" },
      { id: 104, name: "Deni Pratama", nim: "1301204004", position: "Player", medicalStatus: "Hijau" },
      { id: 105, name: "Eko Saputra", nim: "1301204005", position: "Player", medicalStatus: "Merah" },
    ]
  },
  teamB: {
    id: 20,
    name: "Fakultas Rekayasa Industri",
    score: 0,
    players: [
      { id: 201, name: "Fajar Rizky", nim: "1201204001", position: "Captain", medicalStatus: "Hijau" },
      { id: 202, name: "Gilang Dirga", nim: "1201204002", position: "Player", medicalStatus: "Hijau" },
      { id: 203, name: "Hadi Kusuma", nim: "1201204003", position: "Player", medicalStatus: "Hijau" },
      { id: 204, name: "Indra Bekti", nim: "1201204004", position: "Player", medicalStatus: "Hijau" },
      { id: 205, name: "Joko Anwar", nim: "1201204005", position: "Player", medicalStatus: "Kuning" },
    ]
  }
};

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id;
  
  const [match, setMatch] = useState(mockMatchData); // In real app, fetch using matchId

  const getMedicalBadge = (status: string) => {
    switch (status) {
      case "Merah": return "bg-red-100 text-red-700 border-red-200";
      case "Kuning": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Hijau": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-gray-100 text-gray-600 border-gray-200";
      case "live": return "bg-red-100 text-red-600 border-red-200 animate-pulse";
      case "finished": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-bold text-gray-800 text-lg leading-tight">Detail Pertandingan</h1>
              <p className="text-xs text-gray-500">{match.sport} • {match.round}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadge(match.status)}`}>
            {match.status === 'live' ? 'LIVE NOW' : match.status}
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Match Info & Scoreboard Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 border-b border-gray-100">
            {/* Team A */}
            <div className="flex flex-col items-center flex-1 w-full max-w-[200px]">
              <div className="w-24 h-24 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-3xl font-black text-gray-400 mb-4">
                {match.teamA.name}
              </div>
              <h2 className="text-xl font-bold text-gray-800 text-center">{match.teamA.name}</h2>
              <p className="text-sm text-gray-500 text-center mt-1">{match.teamA.name}</p>
            </div>

            {/* Score & Versus */}
            <div className="flex flex-col items-center justify-center px-4">
              <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-2 uppercase">Score</div>
              <div className="flex items-center gap-6">
                <span className={`text-5xl md:text-6xl font-black ${match.status === 'scheduled' ? 'text-gray-300' : 'text-gray-900'}`}>
                  {match.status === 'scheduled' ? '-' : match.teamA.score}
                </span>
                <span className="text-2xl font-bold text-gray-300">VS</span>
                <span className={`text-5xl md:text-6xl font-black ${match.status === 'scheduled' ? 'text-gray-300' : 'text-gray-900'}`}>
                  {match.status === 'scheduled' ? '-' : match.teamB.score}
                </span>
              </div>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center flex-1 w-full max-w-[200px]">
              <div className="w-24 h-24 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-3xl font-black text-gray-400 mb-4">
                {match.teamB.name}
              </div>
              <h2 className="text-xl font-bold text-gray-800 text-center">{match.teamB.name}</h2>
              <p className="text-sm text-gray-500 text-center mt-1">{match.teamB.name}</p>
            </div>
          </div>

          {/* Match Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-white">
            <div className="p-4 flex flex-col items-center justify-center text-center">
              <Calendar className="text-gray-400 mb-2" size={20} />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tanggal</p>
              <p className="font-medium text-gray-800 mt-1">{match.date}</p>
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center">
              <Clock className="text-gray-400 mb-2" size={20} />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Waktu</p>
              <p className="font-medium text-gray-800 mt-1">{match.time}</p>
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center">
              <MapPin className="text-gray-400 mb-2" size={20} />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Lokasi</p>
              <p className="font-medium text-gray-800 mt-1 truncate w-full px-2" title={match.location}>{match.location}</p>
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center">
              <User className="text-gray-400 mb-2" size={20} />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Wasit</p>
              <p className="font-medium text-gray-800 mt-1">{match.referee || "TBD"}</p>
            </div>
          </div>
        </div>

        {/* Players Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team A Players */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                Daftar Pemain {match.teamA.name}
              </h3>
              <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full">
                {match.teamA.players.length} Pemain
              </span>
            </div>
            <ul className="divide-y divide-gray-100">
              {match.teamA.players.map((player) => (
                <li key={player.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {player.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 flex items-center gap-2">
                        {player.name}
                        {player.position === "Captain" && (
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">CAPT</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{player.nim}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${getMedicalBadge(player.medicalStatus)}`}>
                      {player.medicalStatus === 'Hijau' ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                      Medis: {player.medicalStatus}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Team B Players */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                Daftar Pemain {match.teamB.name}
              </h3>
              <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full">
                {match.teamB.players.length} Pemain
              </span>
            </div>
            <ul className="divide-y divide-gray-100">
              {match.teamB.players.map((player) => (
                <li key={player.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
                      {player.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 flex items-center gap-2">
                        {player.name}
                        {player.position === "Captain" && (
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">CAPT</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{player.nim}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${getMedicalBadge(player.medicalStatus)}`}>
                      {player.medicalStatus === 'Hijau' ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                      Medis: {player.medicalStatus}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
