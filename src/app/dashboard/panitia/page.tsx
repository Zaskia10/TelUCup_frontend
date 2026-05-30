"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  Clock, 
  Swords, 
  AlertTriangle,
  ChevronDown,
  UserPlus,
  ArrowUpRight
} from "lucide-react";
import MatchCard from "@/components/match/MatchCard";

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    totalKontingen: 0,
    timMenunggu: 0,
    pertandinganHariIni: 0,
    redFlags: 0
  });
  
  const [matches, setMatches] = useState<any[]>([]);
  const [contingents, setContingents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        // 1. Fetch Summary Risk
        let totalRedFlags = 0;
        try {
          const riskRes = await fetch(`${apiUrl}/self-assessment/summary/contingent`, { headers });
          if (riskRes.ok) {
            const riskData = await riskRes.json();
            if (Array.isArray(riskData)) {
              totalRedFlags = riskData.reduce((acc, curr) => acc + (curr.high_risk_count || 0), 0);
            }
          }
        } catch (e) {
          console.error("Failed to fetch risk summary", e);
        }

        // 2. Fetch Contingents & Registrations
        let contingentsList: any[] = [];
        let waitingVerification = 0;
        
        try {
          const contRes = await fetch(`${apiUrl}/contingents`, { headers });
          if (contRes.ok) {
            const contDataJson = await contRes.json();
            const contingentsData = contDataJson.data || [];
            
            contingentsList = contingentsData.map((c: any) => ({
              id: c.id,
              name: c.name,
              pic: c.pic?.name || "Tidak ada PIC",
              players: c.players_count || 0
            }));
          }
        } catch (e) {
          console.error("Failed to fetch contingents", e);
        }

        try {
          const regRes = await fetch(`${apiUrl}/registrations`, { headers });
          if (regRes.ok) {
            const regDataJson = await regRes.json();
            const regs = regDataJson.data?.data || [];
            waitingVerification = regs.filter((r: any) => r.status === "draft").length; 
          }
        } catch (e) {
          console.error("Failed to fetch registrations", e);
        }

        // 3. Fetch Schedules using MatchCard schema
        let mappedMatches: any[] = [];
        try {
          const today = new Date().toISOString().split('T')[0];
          const scheduleRes = await fetch(`${apiUrl}/matches?date=${today}`, { headers });
          if (scheduleRes.ok) {
            const resJson = await scheduleRes.json();
            const schedules = resJson.data || [];
            mappedMatches = schedules.map((sch: any) => {
              return {
                id: sch.id,
                sport: sch.sport?.name || "Cabang Olahraga",
                round: sch.round_name || "Round",
                status: sch.status,
                date: sch.match_date,
                time: sch.match_time,
                location: sch.location,
                teamA: {
                  name: sch.team_a?.contingent_name || "TBD",
                  score: sch.score_a,
                  logoUrl: sch.team_a?.image_url,
                  cloudinaryId: sch.team_a?.cloudinary_public_id,
                },
                teamB: {
                  name: sch.team_b?.contingent_name || "TBD",
                  score: sch.score_b,
                  logoUrl: sch.team_b?.image_url,
                  cloudinaryId: sch.team_b?.cloudinary_public_id,
                }
              };
            });
          }
        } catch (e) {
          console.error("Failed to fetch matches", e);
        }

        setStats({
          totalKontingen: contingentsList.length,
          timMenunggu: waitingVerification,
          pertandinganHariIni: mappedMatches.length,
          redFlags: totalRedFlags
        });
        setContingents(contingentsList);
        setMatches(mappedMatches);

      } catch (error) {
        console.error("Error in fetchDashboardData:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickStatsData = [
    { 
      label: "Total Kontingen", 
      value: stats.totalKontingen.toString(), 
      subtext: "Fakultas / Unit", 
      icon: Building2, 
      bgColor: "bg-blue-50", 
      textColor: "text-blue-600",
      border: "border-gray-100" 
    },
    { 
      label: "Tim Menunggu Verifikasi", 
      value: stats.timMenunggu.toString(), 
      subtext: "Perlu ditinjau", 
      icon: Clock, 
      bgColor: "bg-orange-50", 
      textColor: "text-orange-600",
      border: "border-orange-200 ring-1 ring-orange-100 shadow-[0_0_15px_rgba(249,115,22,0.1)]" 
    },
    { 
      label: "Pertandingan Hari Ini", 
      value: stats.pertandinganHariIni.toString(), 
      subtext: "Jadwal aktif", 
      icon: Swords, 
      bgColor: "bg-emerald-50", 
      textColor: "text-emerald-600",
      border: "border-gray-100" 
    },
    { 
      label: "Peringatan Medis", 
      value: stats.redFlags.toString(), 
      subtext: "High Risk", 
      icon: AlertTriangle, 
      bgColor: "bg-red-50", 
      textColor: "text-red-600",
      border: "border-red-200 ring-1 ring-red-100 shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b71c1c]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Selamat datang di panel kontrol kepanitiaan Tel-U Cup.</p>
      </div>

      {/* A. Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStatsData.map((stat, idx) => (
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
        {/* B. Widget 1: Live Matches */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Swords size={20} className="text-[#b71c1c]" />
              Pertandingan Hari ini
            </h2>
            <Link href="/dashboard/panitia/matches" className="text-sm text-[#b71c1c] font-medium hover:underline">Lihat Semua Jadwal</Link>
          </div>
          
          <div className="space-y-4">
            {matches.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-gray-500">
                Tidak ada pertandingan yang dijadwalkan hari ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* C. Widget 2: Risk Warnings & Top Contingents */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-red-50/30">
              <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500" />
                Peringatan Medis
              </h2>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-center items-center text-center">
               <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-3">
                 <AlertTriangle size={28} className="text-red-500" />
               </div>
               <h3 className="text-2xl font-black text-gray-800 mb-1">{stats.redFlags} Pemain</h3>
               <p className="text-sm text-gray-500 max-w-[200px] mb-4">
                 Terdeteksi memiliki riwayat medis berisiko tinggi (High Risk).
               </p>
               <Link href="/dashboard/panitia/medis" className="text-sm font-bold text-[#b71c1c] hover:underline flex items-center gap-1">
                 Tinjau Data Medis <ArrowUpRight size={16} />
               </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2">
                <Building2 size={18} className="text-[#b71c1c]" />
                Kontingen Terdaftar
              </h2>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Nama Kontingen</th>
                    <th className="px-4 py-3 text-right">Pemain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contingents.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800 text-[13px]">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">PIC: {item.pic}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center justify-center text-[11px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {item.players}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {contingents.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-gray-400">Belum ada kontingen terdaftar</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-gray-100 bg-gray-50 text-center shrink-0">
              <Link href="/dashboard/panitia/kontingen" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Lihat Seluruh Kontingen &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
