"use client";

import { useState, useEffect } from "react";
import { 
  Trophy, 
  Plus, 
  Search, 
  Users, 
  ShieldCheck, 
  Clock, 
  XCircle,
  ChevronRight,
  UserPlus,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  FileCheck
} from "lucide-react";
import { 
  getMyRegistrations, 
  createRegistration, 
  addPlayersToRegistration, 
  removePlayerFromRegistration, 
  submitRegistration,
} from "@/services/registrationService";
import { getMyContingentPlayers } from "@/services/contingentService";
import { getSports } from "@/services/bracketService";

export default function RegistrasiTimPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [availableSports, setAvailableSports] = useState<any[]>([]);
  const [contingentMembers, setContingentMembers] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  
  // Form States
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeTeamId, setActiveTeamId] = useState<number | null>(null);
  const [playerSearchTerm, setPlayerSearchTerm] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [regRes, sportsRes, playersRes] = await Promise.all([
        getMyRegistrations(),
        getSports(),
        getMyContingentPlayers()
      ]);
      setTeams(regRes.data || []);
      setAvailableSports(sportsRes.data || []);
      setContingentMembers(playersRes.data || []);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "draft": return "Draft";
      case "submitted": return "Menunggu Verifikasi";
      case "verified": return "Terverifikasi";
      case "rejected": return "Ditolak";
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "verified": return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", icon: ShieldCheck };
      case "submitted": return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", icon: Clock };
      case "draft": return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", icon: FileCheck };
      case "rejected": return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", icon: XCircle };
      default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", icon: Clock };
    }
  };

  const handleRegisterTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSport) return;
    
    setIsSubmitting(true);
    try {
      await createRegistration({
        sport_id: parseInt(selectedSport),
        sport_category_id: selectedCategory ? parseInt(selectedCategory) : undefined,
        player_ids: []
      });
      await fetchData(); // Refresh data
      setIsRegisterModalOpen(false);
      setSelectedSport("");
      setSelectedCategory("");
    } catch (error: any) {
      alert(error.message || "Gagal mendaftarkan tim");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPlayer = async (playerId: number) => {
    if (!activeTeamId) return;
    try {
      await addPlayersToRegistration(activeTeamId, [playerId]);
      await fetchData();
    } catch (error: any) {
      alert(error.message || "Gagal menambahkan pemain");
    }
  };

  const handleRemovePlayer = async (teamId: number, playerId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pemain ini dari tim?")) return;
    try {
      await removePlayerFromRegistration(teamId, playerId);
      await fetchData();
    } catch (error: any) {
      alert(error.message || "Gagal menghapus pemain");
    }
  };

  const handleSubmitTeam = async (teamId: number) => {
    if (!confirm("Apakah Anda yakin ingin mengajukan pendaftaran tim ini ke panitia? Anda tidak dapat mengubah anggota setelah diajukan.")) return;
    try {
      await submitRegistration(teamId);
      await fetchData();
      setIsManageModalOpen(false);
    } catch (error: any) {
      alert(error.message || "Gagal mengajukan tim");
    }
  };

  const filteredTeams = teams.filter(team => {
    const sportName = team.sport?.name || "";
    const catName = team.sport_category?.name || "";
    const fullName = `${sportName} ${catName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const activeTeam = teams.find(t => t.id === activeTeamId);
  
  // Available players for the active team (not already in the team)
  const availablePlayers = activeTeam ? contingentMembers.filter(member => 
    !activeTeam.players.some((p: any) => p.id === member.id) && 
    (member.name.toLowerCase().includes(playerSearchTerm.toLowerCase()) || 
     member.nim_nip?.includes(playerSearchTerm))
  ) : [];

  const selectedSportObj = availableSports.find(s => s.id === parseInt(selectedSport));

  const renderRiskBadge = (risk_lvl?: string) => {
    switch (risk_lvl) {
      case "low":
        return <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">Risiko Rendah</span>;
      case "medium":
        return <span className="inline-flex items-center bg-orange-50 text-orange-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-orange-200">Risiko Sedang</span>;
      case "high":
        return <span className="inline-flex items-center bg-red-50 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-200">Risiko Tinggi</span>;
      case "not_yet":
      default:
        return <span className="inline-flex items-center bg-gray-50 text-gray-500 text-[10px] font-medium px-2 py-0.5 rounded border border-gray-200">Belum Mengisi</span>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Registrasi Tim</h1>
          <p className="text-gray-500 text-sm mt-1">Daftarkan tim kontingen Anda ke cabang olahraga yang tersedia.</p>
        </div>
        <button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#b71c1c] hover:bg-[#9b1818] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          Daftarkan Tim Baru
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari cabang olahraga..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b71c1c]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
            {filteredTeams.map((team) => {
              const statusStyle = getStatusStyle(team.status);
              const StatusIcon = statusStyle.icon;
              const isDraft = team.status === "draft";
              const displayName = team.sport_category 
                ? `${team.sport.name} - ${team.sport_category.name}`
                : team.sport.name;
              
              return (
                <div key={team.id} className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#b71c1c]">
                        <Trophy size={20} />
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        <StatusIcon size={12} />
                        {getStatusDisplay(team.status)}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 line-clamp-1">{displayName}</h3>
                    {team.status === "rejected" && team.reject_reason && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100 flex items-start gap-1.5">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <span>{team.reject_reason}</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <Users size={16} /> Anggota Terdaftar
                      </span>
                      <span className="font-semibold text-gray-700">
                        {team.current_members} <span className="text-gray-400 font-normal">/ {team.max_members}</span>
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${team.current_members === team.max_members ? 'bg-green-500' : 'bg-blue-500'}`} 
                        style={{ width: `${(team.current_members / team.max_members) * 100}%` }}
                      ></div>
                    </div>

                    <div className="space-y-2">
                      {team.players.slice(0, 3).map((player: any) => (
                        <div key={player.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 border border-gray-100">
                          <span className="font-medium text-gray-700 truncate mr-2">{player.name}</span>
                          <span className="text-gray-400">{player.nim_nip}</span>
                        </div>
                      ))}
                      {team.players.length > 3 && (
                        <div className="text-xs text-center text-gray-500 font-medium pt-1">
                          + {team.players.length - 3} anggota lainnya
                        </div>
                      )}
                      {team.players.length === 0 && (
                        <div className="text-xs text-center text-gray-400 italic p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                          Belum ada anggota tim
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <button 
                      onClick={() => {
                        setActiveTeamId(team.id);
                        setIsManageModalOpen(true);
                      }}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        isDraft 
                          ? "bg-white border border-[#b71c1c] text-[#b71c1c] hover:bg-red-50" 
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {isDraft ? "Kelola Anggota Tim" : "Lihat Detail Tim"}
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {!isLoading && filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <Trophy size={48} className="mx-auto text-gray-200 mb-3" />
            <h3 className="text-lg font-medium text-gray-800">Tidak ada tim yang ditemukan</h3>
            <p className="text-gray-500 text-sm mt-1">Belum ada tim yang didaftarkan untuk kontingen ini.</p>
          </div>
        )}
      </div>

      {/* MODAL: Register New Team */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-800">Daftarkan Tim Baru</h2>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleRegisterTeam}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Cabang Olahraga <span className="text-red-500">*</span>
                    </label>
                    <select 
                      required
                      value={selectedSport}
                      onChange={(e) => {
                        setSelectedSport(e.target.value);
                        setSelectedCategory("");
                      }}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                    >
                      <option value="" disabled>-- Pilih Cabang Olahraga --</option>
                      {availableSports.map(sport => (
                        <option key={sport.id} value={sport.id}>
                          {sport.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedSportObj && selectedSportObj.categories && selectedSportObj.categories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori Olahraga <span className="text-red-500">*</span>
                      </label>
                      <select 
                        required
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                      >
                        <option value="" disabled>-- Pilih Kategori --</option>
                        {selectedSportObj.categories.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} (Maks: {cat.max_members} orang)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {!selectedCategory && selectedSportObj && (!selectedSportObj.categories || selectedSportObj.categories.length === 0) && (
                     <p className="text-xs text-gray-500 mt-2">
                        Maksimal pemain: {selectedSportObj.max_members} orang.
                     </p>
                  )}
                </div>
                <div className="mt-8 flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#b71c1c] rounded-lg hover:bg-[#9b1818] disabled:opacity-50"
                  >
                    {isSubmitting ? "Menyimpan..." : "Buat Draft Tim"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Manage Team Players */}
      {isManageModalOpen && activeTeam && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <div>
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  {activeTeam.sport_category ? `${activeTeam.sport.name} - ${activeTeam.sport_category.name}` : activeTeam.sport.name}
                  <span className={`inline-flex text-[10px] px-2 py-0.5 rounded border font-semibold ${getStatusStyle(activeTeam.status).bg} ${getStatusStyle(activeTeam.status).text} ${getStatusStyle(activeTeam.status).border}`}>
                    {getStatusDisplay(activeTeam.status)}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">Kelola anggota tim untuk cabang olahraga ini.</p>
              </div>
              <button onClick={() => setIsManageModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Left Side: Current Team Members */}
              <div className="w-full md:w-1/2 flex flex-col border-r border-gray-100 bg-white">
                <div className="p-4 border-b border-gray-100 shrink-0 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-700">Anggota Tim</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${activeTeam.current_members === activeTeam.max_members ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {activeTeam.current_members} / {activeTeam.max_members}
                  </span>
                </div>
                <div className="p-4 overflow-y-auto flex-1 bg-gray-50/30">
                  {activeTeam.players.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">Belum ada anggota tim.</p>
                      <p className="text-xs mt-1">Tambahkan dari daftar di sebelah kanan.</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {activeTeam.players.map((player: any) => (
                        <li key={player.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{player.name}</p>
                            <p className="text-xs text-gray-500">{player.nim_nip}</p>
                            <div className="mt-1">
                              {renderRiskBadge(player.risk_lvl)}
                            </div>
                          </div>
                          {activeTeam.status === "draft" && (
                            <button 
                              onClick={() => handleRemovePlayer(activeTeam.id, player.id)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Hapus dari tim"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Submit to Panitia Button inside Left pane */}
                {activeTeam.status === "draft" && (
                  <div className="p-4 border-t border-gray-100 bg-white">
                    <button
                      onClick={() => handleSubmitTeam(activeTeam.id)}
                      disabled={activeTeam.players.length === 0}
                      className="w-full flex justify-center items-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle size={18} />
                      Ajukan Tim ke Panitia
                    </button>
                    {activeTeam.players.length === 0 && (
                      <p className="text-[10px] text-center text-gray-400 mt-2">
                        Tambahkan minimal 1 pemain untuk mengajukan tim.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side: Available Contingent Members (Only if Draft) */}
              <div className="w-full md:w-1/2 flex flex-col bg-gray-50/50">
                <div className="p-4 border-b border-gray-100 shrink-0">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Tersedia di Kontingen</h3>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Cari nama atau NIM..."
                      disabled={activeTeam.status !== "draft"}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-400 disabled:bg-gray-100"
                      value={playerSearchTerm}
                      onChange={(e) => setPlayerSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="p-4 overflow-y-auto flex-1">
                  {activeTeam.status !== "draft" ? (
                    <div className="text-center py-8 text-gray-400 px-4">
                      <ShieldCheck size={32} className="mx-auto text-green-300 mb-2" />
                      <p className="text-sm">Tim sudah diajukan.</p>
                      <p className="text-xs mt-1">Anda tidak dapat menambah atau menghapus anggota lagi.</p>
                    </div>
                  ) : activeTeam.current_members >= activeTeam.max_members ? (
                     <div className="text-center py-8 text-gray-400 px-4">
                      <AlertCircle size={32} className="mx-auto text-yellow-300 mb-2" />
                      <p className="text-sm">Kuota tim sudah penuh.</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {availablePlayers.map(player => (
                        <li key={player.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                          <div className="truncate pr-2">
                            <p className="text-sm font-medium text-gray-800 truncate">{player.name}</p>
                            <p className="text-xs text-gray-500">{player.nim_nip}</p>
                            <div className="mt-1">
                              {renderRiskBadge(player.risk_lvl)}
                            </div>
                          </div>
                          <button 
                            onClick={() => handleAddPlayer(player.id)}
                            className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1.5 rounded transition-colors shrink-0"
                          >
                            <UserPlus size={14} />
                            Tambah
                          </button>
                        </li>
                      ))}
                      {availablePlayers.length === 0 && (
                        <div className="text-center py-4 text-xs text-gray-400">
                          Tidak ada anggota yang cocok dengan pencarian.
                        </div>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
