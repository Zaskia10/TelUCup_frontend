"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Filter, 
  ChevronRight,
  Eye,
  X,
  AlertTriangle,
  Users,
  ChevronLeft,
  Activity,
  User
} from "lucide-react";

interface PIC {
  id: number;
  name: string;
  email: string;
}

interface Contingent {
  id: number;
  name: string;
  image_url?: string;
  pic: PIC;
}

interface Sport {
  id: number;
  name: string;
}

interface SportCategory {
  id: number;
  name: string;
}

interface Player {
  id: number;
  name: string;
  nim_nip: string;
  photo_path?: string;
  employee_status?: string;
  work_location?: string;
  verification_status?: string;
}

interface ApiRegistration {
  id: number;
  status: string;
  contingent: Contingent;
  sport: Sport;
  sport_category: SportCategory;
  max_members: number;
  current_members: number;
  slots_remaining: number;
  players: Player[];
  created_at: string;
}

interface ComplianceData {
  sport: Sport;
  sport_category: SportCategory;
  total_contingents: number;
  registered_count: number;
  not_registered_count: number;
  compliance_rate: number;
  not_registered: Contingent[];
}

export default function VerifikasiPendaftaranPage() {
  const [registrations, setRegistrations] = useState<ApiRegistration[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReg, setSelectedReg] = useState<ApiRegistration | null>(null);
  const [actionModal, setActionModal] = useState<{ type: "verify" | "reject", reg: ApiRegistration } | null>(null);

  // Pagination & Data state
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Summary state
  const [summary, setSummary] = useState({ total: 0, submitted: 0, verified: 0, rejected: 0 });

  // Compliance state
  const [showCompliance, setShowCompliance] = useState(false);
  const [complianceData, setComplianceData] = useState<ComplianceData[]>([]);
  const [isLoadingCompliance, setIsLoadingCompliance] = useState(false);

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  };

  const fetchStats = async () => {
    // Disabled to prevent 4 concurrent API requests on load which slows down the local server.
    // Wait for the backend to implement a proper /api/registrations/stats endpoint.
  };

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const headers = getHeaders();
      let statusQuery = "";
      if (filterStatus !== "all") {
        statusQuery = `&status=${filterStatus}`;
      }
      
      const res = await fetch(`${getApiUrl()}/registrations?page=${page}${statusQuery}`, { headers });
      const json = await res.json();
      
      if (json.status === "success") {
        setRegistrations(json.data.data || []);
        setTotalPages(json.data.last_page || 1);
      }
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompliance = async () => {
    setIsLoadingCompliance(true);
    setShowCompliance(true);
    try {
      const headers = getHeaders();
      const res = await fetch(`${getApiUrl()}/registrations/compliance`, { headers });
      const json = await res.json();
      if (json.status === "success") {
        setComplianceData(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch compliance", err);
    } finally {
      setIsLoadingCompliance(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [page, filterStatus]);

  const handleAction = async (id: number, newStatus: string) => {
    try {
      const headers = getHeaders();
      const res = await fetch(`${getApiUrl()}/registrations/${id}/verify`, {
        method: "POST",
        headers,
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.status === "success") {
        fetchRegistrations();
        fetchStats();
        setActionModal(null);
        setSelectedReg(null); // close detail modal as well to reflect changes
      } else {
        alert("Gagal memperbarui status");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan jaringan");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
      case "pending":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><Clock size={12} /> Pending</span>;
      case "verified":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><CheckCircle size={12} /> Verified</span>;
      case "rejected":
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><XCircle size={12} /> Rejected</span>;
      case "draft":
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><FileText size={12} /> Draft</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Local filtering for search
  const filteredData = useMemo(() => {
    return registrations.filter(reg => {
      const searchStr = searchQuery.toLowerCase();
      const matchContingent = reg.contingent?.name?.toLowerCase().includes(searchStr);
      const matchSport = reg.sport?.name?.toLowerCase().includes(searchStr);
      return matchContingent || matchSport;
    });
  }, [registrations, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Verifikasi Pendaftaran Tim</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola dan verifikasi pengajuan pendaftaran tim beserta kelengkapan pemainnya.</p>
        </div>
        <button 
          onClick={fetchCompliance}
          className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 border border-indigo-200"
        >
          <Activity size={18} /> Cek Kepatuhan Kontingen
        </button>
      </div>

      {/* Summary Cards Disabled (waiting for backend stats endpoint) */}
      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <button 
              onClick={() => { setFilterStatus("all"); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === "all" ? "bg-gray-800 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              Semua
            </button>
            <button 
              onClick={() => { setFilterStatus("submitted"); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === "submitted" ? "bg-yellow-500 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              Pending
            </button>
            <button 
              onClick={() => { setFilterStatus("verified"); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === "verified" ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              Verified
            </button>
            <button 
              onClick={() => { setFilterStatus("rejected"); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === "rejected" ? "bg-red-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              Rejected
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari kontingen, cabang..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#a81d22]/20 focus:border-[#a81d22]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-48 text-gray-500">
              <div className="w-6 h-6 border-2 border-[#a81d22] border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 font-medium">Memuat data...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Kontingen</th>
                  <th className="p-4 font-medium">Cabang Olahraga</th>
                  <th className="p-4 font-medium">Tanggal Pengajuan</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredData.length > 0 ? (
                  filteredData.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {reg.contingent?.image_url ? (
                            <img src={reg.contingent.image_url} alt="Logo" className="w-8 h-8 rounded-md object-cover border border-gray-200 bg-white" />
                          ) : (
                            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-400"><Users size={14}/></div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-800">{reg.contingent?.name || "-"}</div>
                            <div className="text-gray-500 text-xs mt-0.5">PIC: {reg.contingent?.pic?.name || "-"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-800 font-medium">{reg.sport?.name || "-"}</div>
                        <div className="text-gray-500 text-xs mt-0.5 mb-1">{reg.sport_category?.name || "-"}</div>
                        <span className="text-[11px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                          {reg.current_members} / {reg.max_members || "?"} Anggota
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {formatDate(reg.created_at)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(reg.status)}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setSelectedReg(reg)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors border border-gray-200"
                        >
                          <Eye size={14} /> Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Tidak ada data pendaftaran yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <span className="text-sm text-gray-600">
              Halaman <span className="font-semibold text-gray-800">{page}</span> dari <span className="font-semibold text-gray-800">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Detail Pendaftaran #{selectedReg.id}</h2>
              <button 
                onClick={() => setSelectedReg(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {selectedReg.contingent?.image_url ? (
                    <img src={selectedReg.contingent.image_url} alt="Logo" className="w-16 h-16 rounded-lg object-cover border border-gray-200 bg-white" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                      <Users size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedReg.contingent?.name || "-"}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">PIC: {selectedReg.contingent?.pic?.name || "-"} <span className="text-gray-400">({selectedReg.contingent?.pic?.email || "-"})</span></p>
                  </div>
                </div>
                {getStatusBadge(selectedReg.status)}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-1">Cabang Olahraga</p>
                  <p className="font-semibold text-gray-800">{selectedReg.sport?.name || "-"}</p>
                  <p className="text-sm text-gray-600 mt-0.5">Kategori: {selectedReg.sport_category?.name || "-"}</p>
                  
                  <div className="mt-3 flex gap-2 text-xs font-medium">
                    <span className="bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm text-gray-700">
                      Kapasitas Tim: {selectedReg.max_members || "-"}
                    </span>
                    <span className="bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 text-indigo-700">
                      Terisi: {selectedReg.current_members || "0"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-1">Informasi Pengajuan</p>
                  <p className="font-semibold text-gray-800">Status: <span className="capitalize">{selectedReg.status}</span></p>
                  <p className="text-sm text-gray-600 mt-0.5">Disubmit pada: {formatDate(selectedReg.created_at)}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Users size={18} className="text-gray-400" /> Daftar Pemain ({(selectedReg.players || []).length})
                </h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-600 w-12 text-center">No</th>
                        <th className="px-4 py-3 font-medium text-gray-600 w-16">Foto</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Pemain & Identitas</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Status / Unit</th>
                        <th className="px-4 py-3 font-medium text-gray-600 text-center">Verifikasi Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(selectedReg.players || []).length > 0 ? (
                        selectedReg.players.map((player, idx) => (
                          <tr key={player.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-center text-gray-500 align-top">{idx + 1}</td>
                            <td className="px-4 py-3 align-top">
                              {player.photo_path ? (
                                <img src={player.photo_path} alt={player.name} className="w-10 h-10 rounded-md object-cover border border-gray-200 bg-white" />
                              ) : (
                                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200"><User size={16}/></div>
                              )}
                            </td>
                            <td className="px-4 py-3 align-top">
                              <div className="font-medium text-gray-800">{player.name}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{player.nim_nip}</div>
                            </td>
                            <td className="px-4 py-3 align-top">
                              <div className="text-gray-800 text-sm font-medium">{player.employee_status || "-"}</div>
                              <div className="text-gray-500 text-xs mt-0.5 max-w-[150px] truncate" title={player.work_location}>{player.work_location || "-"}</div>
                            </td>
                            <td className="px-4 py-3 text-center align-top">
                              {player.verification_status === "verified" ? (
                                <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-green-200"><CheckCircle size={10}/>Verified</span>
                              ) : player.verification_status === "rejected" ? (
                                <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-red-200"><XCircle size={10}/>Rejected</span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-yellow-200"><Clock size={10}/>Pending</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-gray-500 italic">Belum ada pemain terdaftar di tim ini.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedReg(null)}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
              
              {selectedReg.status === "submitted" && (
                <>
                  <button 
                    onClick={() => setActionModal({ type: "reject", reg: selectedReg })}
                    className="px-5 py-2.5 rounded-xl font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-2"
                  >
                    <XCircle size={18} /> Tolak Pendaftaran
                  </button>
                  <button 
                    onClick={() => setActionModal({ type: "verify", reg: selectedReg })}
                    className="px-5 py-2.5 rounded-xl font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={18} /> Verifikasi
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6 text-center">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${actionModal.type === 'verify' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {actionModal.type === 'verify' ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {actionModal.type === 'verify' ? 'Verifikasi Pendaftaran?' : 'Tolak Pendaftaran?'}
            </h3>
            <p className="text-gray-500 mb-6">
              Apakah Anda yakin ingin {actionModal.type === 'verify' ? 'memverifikasi' : 'menolak'} pendaftaran dari <span className="font-semibold text-gray-800">{actionModal.reg.contingent?.name}</span>?
            </p>
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setActionModal(null)}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => handleAction(actionModal.reg.id, actionModal.type === 'verify' ? 'verified' : 'rejected')}
                className={`px-5 py-2.5 rounded-xl font-medium text-white transition-colors ${actionModal.type === 'verify' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                Ya, {actionModal.type === 'verify' ? 'Verifikasi' : 'Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Modal */}
      {showCompliance && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Activity size={20} className="text-indigo-600" /> Kepatuhan Pendaftaran Kontingen
              </h2>
              <button 
                onClick={() => setShowCompliance(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
              {isLoadingCompliance ? (
                <div className="flex justify-center items-center h-48 text-gray-500">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 font-medium">Memuat data kepatuhan...</span>
                </div>
              ) : complianceData.length > 0 ? (
                <div className="space-y-6">
                  {complianceData.map((comp, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{comp.sport?.name} <span className="text-gray-500 text-sm font-normal">({comp.sport_category?.name})</span></h3>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs font-medium text-gray-500">
                              Target: {comp.total_contingents} Kontingen
                            </span>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                              Terdaftar: {comp.registered_count}
                            </span>
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                              Belum: {comp.not_registered_count}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 font-medium mb-1">Tingkat Kepatuhan</p>
                            <p className="font-bold text-indigo-700">{comp.compliance_rate}%</p>
                          </div>
                          {/* Circular Progress */}
                          <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90">
                              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
                              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * comp.compliance_rate) / 100} className="text-indigo-600 transition-all duration-1000" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {comp.not_registered && comp.not_registered.length > 0 && (
                        <div className="p-5 bg-red-50/30">
                          <h4 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
                            <AlertTriangle size={16} /> Kontingen Belum Mendaftar ({comp.not_registered.length}):
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {comp.not_registered.map(nr => (
                              <span key={nr.id} className="px-3 py-1.5 bg-white border border-red-200 text-red-700 text-xs font-medium rounded-lg shadow-sm">
                                {nr.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Data kepatuhan tidak tersedia.
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 bg-white flex justify-end">
              <button 
                onClick={() => setShowCompliance(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Tutup Kepatuhan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
