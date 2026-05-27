import { useState, useEffect } from "react";
import { createSport, updateSport, deleteSport } from "../services";
import { X, Loader2, AlertTriangle, Plus, Trash2 } from "lucide-react";

function ModalBase({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export function SportFormModal({ isOpen, onClose, onSuccess, sportToEdit = null }: any) {
  const [formData, setFormData] = useState<{
    name: string;
    icon: File | null;
    max_members: string;
    categories: Array<{ id?: number, name: string, max_members: string }>;
  }>({
    name: "",
    icon: null,
    max_members: "",
    categories: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (sportToEdit) {
        setFormData({
          name: sportToEdit.name || "",
          icon: null, // Don't pre-fill file input
          max_members: sportToEdit.max_members ? sportToEdit.max_members.toString() : "",
          categories: (sportToEdit.categories || []).map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            max_members: cat.max_members ? cat.max_members.toString() : ""
          }))
        });
      } else {
        setFormData({
          name: "",
          icon: null,
          max_members: "",
          categories: []
        });
      }
    }
  }, [isOpen, sportToEdit]);

  const handleAddCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, { name: "", max_members: "" }]
    }));
  };

  const handleRemoveCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const handleCategoryChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newCats = [...prev.categories];
      newCats[index] = { ...newCats[index], [field]: value };
      return { ...prev, categories: newCats };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Nama Cabang Olahraga wajib diisi.");
      return;
    }
    
    // Prepare FormData payload
    const payload = new FormData();
    payload.append("name", formData.name.trim());
    
    if (formData.max_members) {
      payload.append("max_members", formData.max_members);
    }
    
    if (formData.icon) {
      payload.append("icon", formData.icon);
    }

    formData.categories.forEach((c, index) => {
      if (c.id) payload.append(`categories[${index}][id]`, c.id.toString());
      payload.append(`categories[${index}][name]`, c.name.trim());
      if (c.max_members) payload.append(`categories[${index}][max_members]`, c.max_members);
    });

    setIsLoading(true);
    setError(null);
    try {
      let res;
      if (sportToEdit) {
        res = await updateSport(sportToEdit.id, payload);
      } else {
        res = await createSport(payload);
      }
      onSuccess(res.message || "Data Cabang Olahraga berhasil disimpan");
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={sportToEdit ? "Edit Cabang Olahraga" : "Tambah Cabang Olahraga"}>
      <form onSubmit={handleSubmit} className="p-5">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Cabang Olahraga <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="cth: Badminton"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#b71c1c] focus:ring-1 focus:ring-red-100"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maksimal Pemain Keseluruhan</label>
              <input 
                type="number" 
                value={formData.max_members} 
                onChange={e => setFormData(prev => ({ ...prev, max_members: e.target.value }))}
                placeholder="Kosongkan jika tidak ada batas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#b71c1c] focus:ring-1 focus:ring-red-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon / Logo</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setFormData(prev => ({ ...prev, icon: e.target.files ? e.target.files[0] : null }))}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#b71c1c] focus:ring-1 focus:ring-red-100 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-[#b71c1c] hover:file:bg-red-100"
              />
              {sportToEdit && sportToEdit.icon_path && (
                <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah icon.</p>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Category Section */}
        <div className="mb-6 border border-gray-200 rounded-xl p-4 bg-gray-50/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-800">Kategori Perlombaan</h4>
            <button 
              type="button" 
              onClick={handleAddCategory}
              className="text-xs font-medium bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors shadow-sm"
            >
              <Plus size={14} /> Tambah Kategori
            </button>
          </div>

          {formData.categories.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-400 bg-white border border-dashed border-gray-200 rounded-lg">
              Belum ada kategori yang ditambahkan.
            </div>
          ) : (
            <div className="space-y-3">
              {formData.categories.map((cat, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Kategori <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={cat.name} 
                      onChange={e => handleCategoryChange(index, "name", e.target.value)}
                      placeholder="cth: Tunggal Putra"
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#b71c1c]"
                      required
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Maks Pemain</label>
                    <input 
                      type="number" 
                      value={cat.max_members} 
                      onChange={e => handleCategoryChange(index, "max_members", e.target.value)}
                      placeholder="cth: 1"
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#b71c1c]"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveCategory(index)}
                    className="mt-5 sm:mt-5 p-2 text-red-500 hover:bg-red-50 rounded transition-colors self-end"
                    title="Hapus Kategori"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" disabled={isLoading}>Batal</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#b71c1c] hover:bg-[#9c161a] rounded-lg transition-colors flex items-center gap-2" disabled={isLoading}>
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Simpan Data"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

export function DeleteSportModal({ isOpen, onClose, onSuccess, sport }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setError(null);
  }, [isOpen]);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await deleteSport(sport.id);
      onSuccess(res.message || "Cabang Olahraga berhasil dihapus");
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menghapus.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !sport) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Hapus Cabang Olahraga">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertTriangle size={24} className="shrink-0" />
          <p className="text-sm">Anda yakin ingin menghapus cabang olahraga <strong>{sport.name}</strong>?</p>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Tindakan ini tidak dapat dibatalkan. Menghapus cabang olahraga akan menghapus data kategori yang terkait dengannya.
        </p>
        
        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
        
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" disabled={isLoading}>
            Batal
          </button>
          <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70" disabled={isLoading}>
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
