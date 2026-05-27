import { useState, useEffect } from "react";
import { createPlayer, assignPic } from "../services";
import { X, Loader2, Info } from "lucide-react";

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

export function CreatePlayerModal({ isOpen, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirm_password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", email: "", password: "", confirm_password: "" });
      setError({});
      setGeneralError(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // clear specific error
    if (error[e.target.name]) {
      setError({ ...error, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    
    // Frontend validation
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Format email tidak valid";
    if (formData.password.length < 8) newErrors.password = "Password minimal 8 karakter";
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = "Konfirmasi password tidak sama";
    
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      };
      const res = await createPlayer(payload);
      onSuccess(res.message || "Player berhasil dibuat", res.user);
      onClose();
    } catch (err: any) {
      if (err.errors) {
        setError(err.errors);
      } else {
        setGeneralError(err.message || "Terjadi kesalahan.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Tambah Pengguna / Player">
      <form onSubmit={handleSubmit} className="p-5">
        {generalError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {generalError}
          </div>
        )}
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors ${error.name ? 'border-red-300' : 'border-gray-300 focus:border-[#b71c1c]'}`}
              disabled={isLoading}
            />
            {error.name && <p className="text-xs text-red-500 mt-1">{Array.isArray(error.name) ? error.name[0] : error.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors ${error.email ? 'border-red-300' : 'border-gray-300 focus:border-[#b71c1c]'}`}
              disabled={isLoading}
            />
            {error.email && <p className="text-xs text-red-500 mt-1">{Array.isArray(error.email) ? error.email[0] : error.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
            <input 
              type="password" name="password" value={formData.password} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors ${error.password ? 'border-red-300' : 'border-gray-300 focus:border-[#b71c1c]'}`}
              disabled={isLoading}
            />
            {error.password && <p className="text-xs text-red-500 mt-1">{Array.isArray(error.password) ? error.password[0] : error.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password <span className="text-red-500">*</span></label>
            <input 
              type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors ${error.confirm_password ? 'border-red-300' : 'border-gray-300 focus:border-[#b71c1c]'}`}
              disabled={isLoading}
            />
            {error.confirm_password && <p className="text-xs text-red-500 mt-1">{error.confirm_password}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" disabled={isLoading}>Batal</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#b71c1c] hover:bg-[#9c161a] rounded-lg transition-colors flex items-center gap-2" disabled={isLoading}>
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Buat Akun"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

export function AssignPicModal({ isOpen, onClose, onSuccess, contingent, recentUser }: any) {
  const [userIdStr, setUserIdStr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (recentUser) {
        setUserIdStr(recentUser.id.toString());
      } else {
        setUserIdStr("");
      }
    }
  }, [isOpen, recentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = parseInt(userIdStr, 10);
    
    if (isNaN(userId)) {
      setError("ID User harus berupa angka yang valid.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await assignPic(contingent.id, { user_id: userId });
      onSuccess(res.message || "PIC berhasil ditugaskan");
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !contingent) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Assign PIC Kontingen">
      <form onSubmit={handleSubmit} className="p-5">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Menugaskan PIC untuk kontingen <strong className="text-gray-800">{contingent.name}</strong>.
          </p>
          
          <div className="bg-blue-50 border border-blue-100 text-blue-700 p-3 rounded-lg text-xs mb-4 flex gap-2 items-start">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>
              Masukkan ID user yang akan dijadikan PIC. Jika baru membuat pengguna melalui tombol Tambah Pengguna/Player, gunakan user ID dari hasil pembuatan. 
              <br/><br/>
              <em>TODO: Replace manual user_id input with user search dropdown after backend provides GET /api/admin/users.</em>
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">User ID <span className="text-red-500">*</span></label>
          <input 
            type="number" 
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[#b71c1c]'}`}
            placeholder="Contoh: 12"
            value={userIdStr}
            onChange={(e) => setUserIdStr(e.target.value)}
            disabled={isLoading}
            required
          />
          {recentUser && (
            <p className="text-xs text-green-600 mt-1">
              * Diisi otomatis dengan pengguna baru: {recentUser.name} (ID: {recentUser.id})
            </p>
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" disabled={isLoading}>Batal</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#b71c1c] hover:bg-[#9c161a] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70" disabled={isLoading}>
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Tugaskan PIC"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

export function AssignPlayerToContingentModal({ isOpen, onClose, onSuccess, player, contingents }: any) {
  const [contingentId, setContingentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setContingentId("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contingentId) {
      setError("Pilih kontingen terlebih dahulu.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      // player.user.id is the ID of the user account linked to the player
      const res = await assignPic(parseInt(contingentId, 10), { user_id: player.user.id });
      onSuccess(res.message || "PIC berhasil ditugaskan");
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !player) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Tugaskan Player sebagai PIC">
      <form onSubmit={handleSubmit} className="p-5">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Anda akan menugaskan <strong className="text-gray-800">{player.name}</strong> sebagai PIC kontingen. 
            Pilih kontingen yang akan dikelola:
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Kontingen <span className="text-red-500">*</span></label>
          <select 
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[#b71c1c]'}`}
            value={contingentId}
            onChange={(e) => setContingentId(e.target.value)}
            disabled={isLoading}
            required
          >
            <option value="" disabled>-- Pilih Kontingen --</option>
            {contingents.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" disabled={isLoading}>Batal</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#b71c1c] hover:bg-[#9c161a] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70" disabled={isLoading}>
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Tugaskan PIC"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
