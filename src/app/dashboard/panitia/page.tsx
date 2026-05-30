"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  Clock, 
  Swords, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserPlus,
  ArrowUpRight,
  Briefcase
} from "lucide-react";

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    totalKontingen: 0,
    timMenunggu: 0,
    pertandinganHariIni: 0,
    redFlags: 0
  });
  
  const [matches, setMatches] = useState<any[]>([]);
  const [contingents, setContingents] = useState<any[]>([]);
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);
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

        // 2. Fetch Registrations
        let contingentsList: any[] = [];
        let waitingVerification = 0;
        try {
          const regRes = await fetch(`${apiUrl}/registrations`, { headers });
          if (regRes.ok) {
            const regDataJson = await regRes.json();
            const regs = regDataJson.data?.data || [];
            
            // Count waiting verification (assuming 'draft' or 'pending' status)
            waitingVerification = regs.filter((r: any) => r.status === "draft").length; 
            
            // Extract unique contingents
            const uniqueContingentsMap = new Map();
            regs.forEach((r: any) => {
              if (r.contingent && !uniqueContingentsMap.has(r.contingent.id)) {
                uniqueContingentsMap.set(r.contingent.id, {
                  id: r.contingent.id,
                  name: r.contingent.name,
                  pic: r.contingent.pic?.name || "Tidak ada PIC",
                  players: r.contingent.players_count || 0
                });
              }
            });
            contingentsList = Array.from(uniqueContingentsMap.values());
          }
        } catch (e) {
          console.error("Failed to fetch registrations", e);
        }

        // 3. Fetch Schedules
        let mappedMatches: any[] = [];
        try {
          const today = new Date().toISOString().split('T')[0];
          const scheduleRes = await fetch(`${apiUrl}/admin/schedules?date=${today}`, { headers });
          if (scheduleRes.ok) {
            const schedules = await scheduleRes.json();
            mappedMatches = schedules.map((sch: any) => {
              const teamAName = sch.team_a?.contingent?.name || "TBD";
              const teamBName = sch.team_b?.contingent?.name || "TBD";
              
              const mapPlayers = (teamData: any, teamName: string) => {
                return (teamData?.players || []).map((p: any) => ({
                  id: p.id,
                  name: p.name,
                  team: teamName,
                  checkedIn: !!p.checked_in_at,
                  employeeStatus: p.employee_status || "Unknown"
                }));
              };

              return {
                id: sch.id,
                teamA: teamAName,
                teamB: teamBName,
                time: sch.match_time,
                venue: sch.location,
                status: sch.status,
                players: [
                  ...mapPlayers(sch.team_a, teamAName), 
                  ...mapPlayers(sch.team_b, teamBName)
                ]
              };
            });
          }
        } catch (e) {
          console.error("Failed to fetch schedules", e);
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

  const toggleMatchExpand = (id: number) => {
    setExpandedMatchId(expandedMatchId === id ? null : id);
  };

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
            {matches.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-gray-500">
                Tidak ada pertandingan yang dijadwalkan hari ini.
              </div>
            ) : (
              matches.map((match) => (
                <div key={match.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  {/* Match Card Header */}
                  <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="text-center w-24">
                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center border border-gray-200 shadow-inner p-2">
                          <span className="font-bold text-gray-600 text-xs truncate max-w-full">{match.teamA}</span>
                        </div>
                        <span className="text-sm font-semibold truncate w-24 block" title={match.teamA}>{match.teamA}</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full mb-2">
                          {match.time || "TBD"}
                        </span>
                        <span className="text-lg font-bold text-gray-300">VS</span>
                        <span className="text-xs text-gray-500 mt-1 text-center w-24 truncate" title={match.venue}>
                          {match.venue || "Lokasi belum ditentukan"}
                        </span>
                      </div>

                      <div className="text-center w-24">
                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center border border-gray-200 shadow-inner p-2">
                          <span className="font-bold text-gray-600 text-xs truncate max-w-full">{match.teamB}</span>
                        </div>
                        <span className="text-sm font-semibold truncate w-24 block" title={match.teamB}>{match.teamB}</span>
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
                        Daftar Pemain & Status
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Group by Team for better layout */}
                        {[match.teamA, match.teamB].map((team, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">
                              Tim {team}
                            </div>
                            <ul className="space-y-3">
                              {match.players.filter((p: any) => p.team === team).map((player: any) => (
                                <li key={player.id} className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-800">{player.name}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1">
                                        <Briefcase size={10} />
                                        {player.employeeStatus}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    {player.checkedIn ? (
                                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                                        Checked In
                                      </span>
                                    ) : (
                                      <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                        Menunggu
                                      </span>
                                    )}
                                  </div>
                                </li>
                              ))}
                              {match.players.filter((p: any) => p.team === team).length === 0 && (
                                <li className="text-xs text-gray-400 italic">Tidak ada pemain yang terdaftar.</li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
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
            <div className="overflow-x-auto flex-1 max-h-[500px] overflow-y-auto">
              {contingents.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  Belum ada data kontingen.
                </div>
              ) : (
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Kontingen & PIC</th>
                      <th className="px-4 py-3 text-center">Pemain</th>
                      <th className="px-4 py-3 text-right">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {contingents.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
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
                            <Link 
                              href="/dashboard/panitia/kontingen"
                              className="text-[11px] flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors w-full sm:w-auto justify-center sm:justify-end"
                            >
                              <ArrowUpRight size={12} />
                              Kelola Kontingen
                            </Link>
                            <Link 
                              href="/dashboard/panitia/kontingen"
                              className="text-[11px] flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition-colors w-full sm:w-auto justify-center sm:justify-end"
                            >
                              <UserPlus size={12} />
                              Tambah Anggota
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
