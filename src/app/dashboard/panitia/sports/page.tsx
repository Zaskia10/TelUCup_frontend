"use client";

import { useState, useEffect, useMemo } from "react";
import { getSports } from "./services";
import { 
  Search, Plus, Edit2, Trash2, AlertCircle, CheckCircle2, Image as ImageIcon
} from "lucide-react";
import { SportFormModal, DeleteSportModal } from "./components/SportModals";

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

export default function SportsPage() {
  const [sports, setSports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [sportToEdit, setSportToEdit] = useState<any>(null);
  const [sportToDelete, setSportToDelete] = useState<any>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getSports();
      setSports(res.data || []);
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

  const filteredSports = useMemo(() => {
    return sports.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [sports, search]);

  const handleAddSport = () => {
    setSportToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditSport = (sport: any) => {
    setSportToEdit(sport);
    setIsFormModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengaturan Cabang Olahraga</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data cabang olahraga dan kategori perlombaan untuk Tel-U Cup.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAddSport} 
            className="px-4 py-2 bg-[#b71c1c] hover:bg-[#9c161a] text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Tambah Cabang Olahraga
          </button>
        </div>
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
              placeholder="Cari cabang olahraga..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#b71c1c] focus:ring-1 focus:ring-red-100 transition-colors"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-16 text-center">Icon</th>
                <th className="px-6 py-4">Nama Cabang Olahraga</th>
                <th className="px-6 py-4 w-[50%]">Kategori & Kuota Pemain</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={4} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td></tr>
                ))
              ) : filteredSports.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Data tidak ditemukan</td></tr>
              ) : (
                filteredSports.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-center align-top">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden mx-auto">
                        {item.icon_path ? (
                          <img src={item.icon_path} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('fallback-icon'); }} />
                        ) : (
                          <ImageIcon size={20} className="text-gray-400" />
                        )}
                        <ImageIcon size={20} className="text-gray-400 hidden fallback-icon" />
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-gray-800 text-base">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-wrap gap-2.5">
                        {item.categories && item.categories.length > 0 ? (
                          item.categories.map((cat: any) => (
                            <span key={cat.id} className="inline-flex items-center bg-[#b71c1c]/10 text-[#b71c1c] border border-[#b71c1c]/20 px-3 py-1.5 rounded-md text-xs font-bold shadow-sm">
                              {cat.name} 
                              {cat.max_members ? (
                                <span className="ml-1.5 pl-1.5 border-l border-[#b71c1c]/30">{cat.max_members} Pemain</span>
                              ) : (
                                <span className="ml-1.5 pl-1.5 border-l border-[#b71c1c]/30">Tidak dibatasi</span>
                              )}
                            </span>
                          ))
                        ) : (
                          item.max_members ? (
                            <span className="inline-flex items-center bg-[#b71c1c]/10 text-[#b71c1c] border border-[#b71c1c]/20 px-3 py-1.5 rounded-md text-xs font-bold shadow-sm">
                              Kuota Total: {item.max_members} Pemain
                            </span>
                          ) : (
                            <span className="inline-flex items-center bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-md text-xs font-bold shadow-sm">
                              Kuota Total: Tidak dibatasi
                            </span>
                          )
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right align-top">
                      <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                        <button onClick={() => handleEditSport(item)} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setSportToDelete(item)} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SportFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        sportToEdit={sportToEdit} 
        onSuccess={(msg: string) => { showToast(msg); fetchData(); }} 
      />
      <DeleteSportModal 
        isOpen={sportToDelete !== null} 
        onClose={() => setSportToDelete(null)} 
        sport={sportToDelete} 
        onSuccess={(msg: string) => { showToast(msg); fetchData(); }} 
      />
    </div>
  );
}
