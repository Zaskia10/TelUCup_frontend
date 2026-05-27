"use client";

import { useState, useEffect, useMemo } from "react";
import { getContingents, getPlayers, getPicKontingen, promoteToPic } from "./services";
import { 
  Building2, Users, UserCheck, UserMinus, Search, Filter, 
  MoreVertical, Edit2, Trash2, UserPlus, Eye, AlertCircle, CheckCircle2,
  ChevronDown, ArrowUpRight, Loader2, ShieldCheck
} from "lucide-react";
import ContingentDetailDrawer from "./components/ContingentDetailDrawer";
import { CreateContingentModal, EditContingentModal, DeleteContingentModal } from "./components/ContingentModals";
import { CreatePlayerModal, AssignPicModal, AssignPlayerToContingentModal, AssignPlayerContingentModal } from "./components/UserModals";

function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50 text-white ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75">&times;</button>
    </div>
  );
}

export default function ManajemenKontingenPage() {
  const [activeTab, setActiveTab] = useState<"kontingen" | "pic" | "player">("kontingen");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  // Data States
  const [contingents, setContingents] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [pics, setPics] = useState<any[]>([]);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [filterPic, setFilterPic] = useState("all");
  const [filterPlayer, setFilterPlayer] = useState("all");

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editContingent, setEditContingent] = useState<any>(null);
  const [deleteContingent, setDeleteContingent] = useState<any>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [assignPicContingent, setAssignPicContingent] = useState<any>(null);
  const [assignPlayerToPic, setAssignPlayerToPic] = useState<any>(null);
  const [assignContingentToPlayer, setAssignContingentToPlayer] = useState<any>(null);
  const [recentUser, setRecentUser] = useState<any>(null);
  const [detailContingentId, setDetailContingentId] = useState<number | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [contRes, playRes, picRes] = await Promise.all([
        getContingents(),
        getPlayers(),
        getPicKontingen()
      ]);
      setContingents(contRes.data || []);
      // Some APIs return data directly in res, some in res.data
      setPlayers(Array.isArray(playRes) ? playRes : (playRes.data || []));
      setPics(Array.isArray(picRes) ? picRes : (picRes.data || []));
    } catch (err: any) {
      showToast(err.message || "Gagal memuat data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleCreatePlayerSuccess = (msg: string, user: any) => {
    showToast(msg, "success");
    setRecentUser(user);
    if (window.confirm(`Berhasil! Apakah Anda ingin menugaskan ${user.name} sebagai PIC kontingen?`)) {
      showToast(`Silakan klik "Assign PIC" pada tabel Kontingen. ID pengguna: ${user.id} sudah tersimpan.`, "success");
    }
    fetchData();
  };

  const handlePromoteToPic = async (user: any) => {
    if (!window.confirm(`Promosikan ${user.name} menjadi PIC Kontingen?`)) return;
    try {
      const res = await promoteToPic(user.id);
      showToast(res.message || "User berhasil dipromosikan menjadi PIC");
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Gagal mempromosikan user", "error");
    }
  };

  // Derived Data (Summary)
  const totalContingents = contingents.length;
  const totalPlayers = contingents.reduce((acc, curr) => acc + (curr.players_count || 0), 0);
  const withPic = contingents.filter(c => c.pic).length;
  const withoutPic = totalContingents - withPic;

  // Filtered Data
  const filteredContingents = useMemo(() => {
    return contingents.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          (c.pic?.name || "").toLowerCase().includes(search.toLowerCase());
      const matchFilter = filterPic === "all" ? true : 
                          filterPic === "has_pic" ? !!c.pic : 
                          !c.pic;
      return matchSearch && matchFilter;
    });
  }, [contingents, search, filterPic]);

  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.user?.email || "").toLowerCase().includes(search.toLowerCase());
      const matchFilter = filterPlayer === "all" ? true :
                          filterPlayer === "no_contingent" ? !p.contingent_id :
                          !!p.contingent_id;
      return matchSearch && matchFilter;
    });
  }, [players, search, filterPlayer]);

  const filteredPics = useMemo(() => {
    return pics.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));
  }, [pics, search]);

  return (
    <div className="space-y-6 pb-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Kontingen & Pengguna</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola kontingen, anggota, dan penugasan PIC untuk Tel-U Cup.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsPlayerModalOpen(true)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2">
            <UserPlus size={16} /> Tambah Pengguna/Player
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-[#b71c1c] hover:bg-[#9c161a] text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2">
            <Building2 size={16} /> Tambah Kontingen
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Kontingen</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalContingents}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Building2 size={20} /></div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Anggota</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalPlayers}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Users size={20} /></div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Punya PIC</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{withPic}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><UserCheck size={20} /></div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Belum Ada PIC</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{withoutPic}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center"><UserMinus size={20} /></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button 
            onClick={() => setActiveTab("kontingen")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'kontingen' ? 'border-[#b71c1c] text-[#b71c1c]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Kontingen
          </button>
          <button 
            onClick={() => setActiveTab("pic")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'pic' ? 'border-[#b71c1c] text-[#b71c1c]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Daftar PIC
          </button>
          <button 
            onClick={() => setActiveTab("player")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'player' ? 'border-[#b71c1c] text-[#b71c1c]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Daftar Player
          </button>
        </nav>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder={`Cari ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#b71c1c] focus:ring-1 focus:ring-red-100 transition-colors"
            />
          </div>
          {activeTab === "kontingen" && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:border-[#b71c1c] cursor-pointer"
                  value={filterPic} onChange={(e) => setFilterPic(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="has_pic">Sudah ada PIC</option>
                  <option value="no_pic">Belum ada PIC</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"><ChevronDown size={14} /></div>
              </div>
            </div>
          )}
          {activeTab === "player" && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:border-[#b71c1c] cursor-pointer"
                  value={filterPlayer} onChange={(e) => setFilterPlayer(e.target.value)}
                >
                  <option value="all">Semua Player</option>
                  <option value="has_contingent">Sudah ada Kontingen</option>
                  <option value="no_contingent">Belum ada Kontingen</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"><ChevronDown size={14} /></div>
              </div>
            </div>
          )}
        </div>

        {/* Content Tabs */}
        <div className="overflow-x-auto">
          {activeTab === "kontingen" && (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Nama Kontingen</th>
                  <th className="px-6 py-4">PIC Kontingen</th>
                  <th className="px-6 py-4 text-center">Anggota</th>
                  <th className="px-6 py-4">Status PIC</th>
                  <th className="px-6 py-4 text-right">Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse"><td colSpan={5} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td></tr>
                  ))
                ) : filteredContingents.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Data tidak ditemukan</td></tr>
                ) : (
                  filteredContingents.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
                      <td className="px-6 py-4">
                        {item.pic ? (
                          <div><div className="font-medium text-gray-700">{item.pic.name}</div><div className="text-xs text-gray-400">{item.pic.email}</div></div>
                        ) : <span className="text-gray-400 italic text-xs">Belum ditugaskan</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">{item.players_count || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        {item.pic ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-100"><CheckCircle2 size={12} /> PIC Aktif</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full border border-orange-100"><AlertCircle size={12} /> Belum ada PIC</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setDetailContingentId(item.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Detail"><Eye size={16} /></button>
                          <button onClick={() => setAssignPicContingent(item)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded" title="Assign PIC"><UserPlus size={16} /></button>
                          <button onClick={() => setEditContingent(item)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Edit"><Edit2 size={16} /></button>
                          <button onClick={() => setDeleteContingent(item)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === "pic" && (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Nama PIC</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Kontingen yang Dikelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={3} className="px-6 py-4 text-center">Memuat...</td></tr>
                ) : filteredPics.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500">Tidak ada data PIC</td></tr>
                ) : (
                  filteredPics.map((pic) => (
                    <tr key={pic.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{pic.name}</td>
                      <td className="px-6 py-4">{pic.email}</td>
                      <td className="px-6 py-4">
                        {pic.managed_contingent ? (
                          <span className="font-semibold text-[#b71c1c] bg-red-50 px-3 py-1 rounded border border-red-100">
                            {pic.managed_contingent.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Belum diassign</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === "player" && (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Nama & Akun</th>
                  <th className="px-6 py-4">NIM / NIP</th>
                  <th className="px-6 py-4">Kontingen</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-4 text-center">Memuat...</td></tr>
                ) : filteredPlayers.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Tidak ada data Player</td></tr>
                ) : (
                  filteredPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{player.name}</div>
                        <div className="text-xs text-gray-400">{player.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">{player.nim_nip || "-"}</td>
                      <td className="px-6 py-4">{player.contingent?.name || <span className="text-gray-400 text-xs italic">N/A</span>}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                            player.verification_status === 'verified' ? 'bg-green-100 text-green-700' : 
                            player.verification_status === 'rejected' ? 'bg-red-100 text-red-700' : 
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {player.verification_status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col sm:flex-row gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setAssignContingentToPlayer(player)}
                            className="text-[11px] flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition-colors w-full sm:w-auto justify-center"
                            title="Assign Kontingen"
                          >
                            <Building2 size={12} /> Assign Kontingen
                          </button>
                          {player.user?.role !== 'pic_kontingen' && (
                            <button 
                              onClick={() => setAssignPlayerToPic(player)}
                              className="text-[11px] flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors w-full sm:w-auto justify-center"
                              title="Promote Player to PIC"
                            >
                              <ArrowUpRight size={12} /> Jadikan PIC
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ContingentDetailDrawer isOpen={detailContingentId !== null} onClose={() => setDetailContingentId(null)} contingentId={detailContingentId} />
      <CreateContingentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={(msg: string) => { showToast(msg); fetchData(); }} />
      <EditContingentModal isOpen={editContingent !== null} onClose={() => setEditContingent(null)} contingent={editContingent} onSuccess={(msg: string) => { showToast(msg); fetchData(); }} />
      <DeleteContingentModal isOpen={deleteContingent !== null} onClose={() => setDeleteContingent(null)} contingent={deleteContingent} onSuccess={(msg: string) => { showToast(msg); fetchData(); }} />
      <CreatePlayerModal isOpen={isPlayerModalOpen} onClose={() => setIsPlayerModalOpen(false)} onSuccess={handleCreatePlayerSuccess} />
      <AssignPicModal isOpen={assignPicContingent !== null} onClose={() => setAssignPicContingent(null)} contingent={assignPicContingent} recentUser={recentUser} onSuccess={(msg: string) => { showToast(msg); fetchData(); }} />
      <AssignPlayerToContingentModal isOpen={assignPlayerToPic !== null} onClose={() => setAssignPlayerToPic(null)} player={assignPlayerToPic} contingents={contingents} onSuccess={(msg: string) => { showToast(msg); fetchData(); }} />
      <AssignPlayerContingentModal isOpen={assignContingentToPlayer !== null} onClose={() => setAssignContingentToPlayer(null)} player={assignContingentToPlayer} contingents={contingents} onSuccess={(msg: string) => { showToast(msg); fetchData(); }} />
    </div>
  );
}
