import { useState, useEffect } from "react";
import { createContingent, updateContingent, deleteContingent } from "../services";
import { X, Loader2, AlertTriangle } from "lucide-react";

// Generic Modal Base
function ModalBase({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 transition-opacity">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
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

// Tambah Kontingen Modal
export function CreateContingentModal({ isOpen, onClose, onSuccess }: any) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      setError("Nama kontingen minimal 3 karakter.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await createContingent({ name: trimmedName });
      onSuccess(res.message || "Kontingen berhasil dibuat");
      onClose();
    } catch (err: any) {
      if (err.errors && err.errors.name) {
        setError(err.errors.name[0]);
      } else {
        setError(err.message || "Terjadi kesalahan.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Tambah Kontingen">
      <form onSubmit={handleSubmit} className="p-5">
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kontingen <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[#b71c1c]'}`}
            placeholder="Contoh: Fakultas Informatika"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" disabled={isLoading}>
            Batal
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#b71c1c] hover:bg-[#9c161a] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70" disabled={isLoading}>
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Simpan"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

// Edit Kontingen Modal
export function EditContingentModal({ isOpen, onClose, onSuccess, contingent }: any) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && contingent) {
      setName(contingent.name || "");
      setError(null);
    }
  }, [isOpen, contingent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      setError("Nama kontingen minimal 3 karakter.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await updateContingent(contingent.id, { name: trimmedName });
      onSuccess(res.message || "Kontingen berhasil diperbarui");
      onClose();
    } catch (err: any) {
      if (err.errors && err.errors.name) {
        setError(err.errors.name[0]);
      } else {
        setError(err.message || "Terjadi kesalahan.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Edit Kontingen">
      <form onSubmit={handleSubmit} className="p-5">
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kontingen <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[#b71c1c]'}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" disabled={isLoading}>
            Batal
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#b71c1c] hover:bg-[#9c161a] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70" disabled={isLoading}>
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

// Delete Kontingen Modal
export function DeleteContingentModal({ isOpen, onClose, onSuccess, contingent }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setError(null);
  }, [isOpen]);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await deleteContingent(contingent.id);
      onSuccess(res.message || "Kontingen berhasil dihapus");
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menghapus.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !contingent) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Hapus Kontingen">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertTriangle size={24} className="shrink-0" />
          <p className="text-sm">Anda yakin ingin menghapus kontingen <strong>{contingent.name}</strong>?</p>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Tindakan ini tidak dapat dibatalkan. Semua data anggota yang terkait mungkin akan kehilangan asosiasi kontingen mereka sesuai dengan aturan sistem.
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
