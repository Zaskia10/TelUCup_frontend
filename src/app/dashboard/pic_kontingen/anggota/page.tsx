"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  Clock, 
  XCircle, 
  AlertCircle,
  Trash2,
  Trophy,
  ArrowRight,
  User,
  CheckCircle2,
  X
} from "lucide-react";
import { getMyContingentPlayers, removeContingentPlayer, addContingentPlayer } from "@/services/contingentService";

export default function AnggotaKontingenPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", nim: "", email: "", status: "Mahasiswa" });

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await getMyContingentPlayers();
      setMembers(res.data || []);
    } catch (error) {
      console.error("Failed to load contingent members", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const getVerificationStyle = (status: string) => {
    switch (status) {
      case "verified": return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", label: "Terverifikasi", icon: ShieldCheck };
      case "pending": return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", label: "Menunggu", icon: Clock };
      case "rejected": return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", label: "Ditolak", icon: XCircle };
      case "draft": return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", label: "Belum Diajukan", icon: AlertCircle };
      default: return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", label: status || "Belum Diajukan", icon: Clock };
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addContingentPlayer({
        name: newMember.name,
        nim_nip: newMember.nim,
        email: newMember.email,
        employee_status: newMember.status,
      });
      setIsAddModalOpen(false);
      setNewMember({ name: "", nim: "", email: "", status: "Mahasiswa" });
      await fetchMembers();
    } catch (error: any) {
      alert(error.message || "Gagal menambahkan anggota");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (id: number) => {
    if(confirm("Apakah Anda yakin ingin menghapus anggota ini dari kontingen?")) {
      try {
        await removeContingentPlayer(id);
        await fetchMembers();
      } catch (error: any) {
        alert(error.message || "Gagal menghapus anggota");
      }
    }
  };

  const filteredMembers = members.filter(member => {
    const searchString = `${member.name} ${member.nim_nip}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    
    // Asumsikan null/undefined status == draft
    const currentStatus = member.verification_status || "draft";
    const matchesFilter = statusFilter === "Semua" || 
      (statusFilter === "Terverifikasi" && currentStatus === "verified") ||
      (statusFilter === "Pending" && currentStatus === "pending") ||
      (statusFilter === "Draft" && currentStatus === "draft") ||
      (statusFilter === "Ditolak" && currentStatus === "rejected");
      
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-[#b71c1c]" size={24} />
            Anggota Kontingen
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kelola daftar anggota yang terdaftar dalam kontingen Anda.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href="/dashboard/pic_kontingen/registrasi"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            <Trophy size={16} />
            Ke Registrasi Tim
            <ArrowRight size={16} />
          </Link>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#b71c1c] hover:bg-[#9b1818] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <UserPlus size={16} />
            Tambah Anggota
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters & Search */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau NIM/NIP..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["Semua", "Terverifikasi", "Pending", "Draft", "Ditolak"].map((filter) => (
              <button 
                key={filter} 
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  statusFilter === filter 
                    ? 'bg-gray-800 text-white border-gray-800' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Member List - Table View */}
        <div className="overflow-x-auto">
          {isLoading ? (
             <div className="p-12 flex justify-center items-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b71c1c]"></div>
             </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Profil Anggota</th>
                  <th className="px-6 py-4">Status & Kelengkapan</th>
                  <th className="px-6 py-4">Verifikasi Panitia</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMembers.map((member) => {
                  const currentStatus = member.verification_status || "draft";
                  const statusStyle = getVerificationStyle(currentStatus);
                  const StatusIcon = statusStyle.icon;

                  // Placeholder logic for data completeness - adjust based on actual API fields
                  const isDataComplete = member.photo_path && member.work_location; 

                  return (
                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                            {member.photo_path ? (
                               <img src={member.photo_path} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                               <User size={20} />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{member.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{member.nim_nip} • {member.employee_status || "Belum diset"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {isDataComplete ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                              <CheckCircle2 size={14} /> Data Lengkap
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600">
                              <AlertCircle size={14} /> Data Belum Lengkap
                            </span>
                          )}
                          <Link href={`/player/${member.id}`} className="text-[10px] text-blue-600 hover:underline font-medium uppercase tracking-wider w-fit">
                            Lihat / Lengkapi Data
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                            <StatusIcon size={12} />
                            {statusStyle.label}
                          </span>
                          {member.reject_reason && (
                            <span className="text-[10px] text-red-500 mt-1 block max-w-[200px] truncate" title={member.reject_reason}>
                              Note: {member.reject_reason}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/player/${member.id}`}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Detail Profil"
                          >
                            <ArrowRight size={18} />
                          </Link>
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus dari kontingen"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          
          {!isLoading && filteredMembers.length === 0 && (
            <div className="text-center py-16 px-4">
              <Users size={48} className="mx-auto text-gray-200 mb-3" />
              <h3 className="text-lg font-medium text-gray-800">Tidak ada anggota ditemukan</h3>
              <p className="text-gray-500 text-sm mt-1">Gunakan kata kunci pencarian lain atau tambahkan anggota baru.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Member */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-800">Tambah Anggota Kontingen</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddMember}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                      value={newMember.name}
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIM / NIP <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                      value={newMember.nim}
                      onChange={(e) => setNewMember({...newMember, nim: e.target.value})}
                      placeholder="Masukkan NIM atau NIP"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email SSO <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                      value={newMember.email}
                      onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                      placeholder="email@telkomuniversity.ac.id"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status Kepegawaian <span className="text-red-500">*</span>
                    </label>
                    <select 
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                      value={newMember.status}
                      onChange={(e) => setNewMember({...newMember, status: e.target.value})}
                    >
                      <option value="Mahasiswa">Mahasiswa</option>
                      <option value="Dosen">Dosen</option>
                      <option value="Karyawan">Karyawan</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2 text-xs text-blue-800">
                  <ShieldCheck size={16} className="shrink-0 mt-0.5 text-blue-500" />
                  <p>Sistem akan membuatkan akun player otomatis berdasarkan email SSO. Akun akan ditautkan ke kontingen Anda.</p>
                </div>

                <div className="mt-8 flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#b71c1c] rounded-lg hover:bg-[#9b1818] disabled:opacity-50"
                  >
                    {isSubmitting ? "Menyimpan..." : "Buat Akun & Tambahkan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
