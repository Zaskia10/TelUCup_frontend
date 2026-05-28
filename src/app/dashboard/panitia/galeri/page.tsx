"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Camera, 
  Upload, 
  Search, 
  Filter, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Image as ImageIcon,
  Clock,
  User,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import Image from "next/image";

// --- TYPES ---
interface EventPhoto {
  id: number;
  cloudinary_public_id: string;
  image_url: string;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
}

interface ToastMessage {
  type: "success" | "error";
  message: string;
}

export default function GaleriEventPanitia() {
  // --- STATES ---
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Toolbar States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTime, setFilterTime] = useState("Semua");
  const [sortOrder, setSortOrder] = useState("Terbaru");
  
  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<EventPhoto | null>(null);
  
  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- API URL ---
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // --- FETCH DATA ---
  const fetchPhotos = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/event-photos`, {
        headers: {
          "Accept": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        }
      });
      const data = await response.json();
      if (data.status === "success") {
        setPhotos(data.data);
      } else {
        showToast("error", "Gagal memuat foto event.");
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      showToast("error", "Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // --- HELPERS ---
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // --- HANDLERS ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", "Ukuran foto maksimal 5MB.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/event-photos`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === "success") {
        showToast("success", data.message || "Foto berhasil diunggah dan sedang diproses AI.");
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setFilePreview(null);
        fetchPhotos(); // Refresh list
      } else {
        showToast("error", data.message || "Gagal mengunggah foto.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast("error", "Terjadi kesalahan saat mengunggah foto.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!photoToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/event-photos/${photoToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === "success") {
        showToast("success", "Foto event berhasil dihapus.");
        setPhotos(photos.filter(p => p.id !== photoToDelete.id));
        setPhotoToDelete(null);
        if (selectedPhoto?.id === photoToDelete.id) {
          setSelectedPhoto(null);
        }
      } else {
        showToast("error", data.message || "Gagal menghapus foto.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast("error", "Terjadi kesalahan saat menghapus foto.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- FILTER & SORT ---
  const filteredPhotos = photos
    .filter(photo => {
      // Search
      const searchMatch = photo.id.toString().includes(searchQuery) || 
                          photo.uploaded_by.toString().includes(searchQuery);
      
      // Time filter (Simplified logic for Hari Ini & Minggu Ini based on Date object)
      const photoDate = new Date(photo.created_at);
      const today = new Date();
      let timeMatch = true;
      
      if (filterTime === "Hari Ini") {
        timeMatch = photoDate.toDateString() === today.toDateString();
      } else if (filterTime === "Minggu Ini") {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        timeMatch = photoDate >= weekAgo;
      }
      
      return searchMatch && timeMatch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "Terbaru" ? dateB - dateA : dateA - dateB;
    });

  // --- STATS ---
  const totalPhotos = photos.length;
  const uniqueUploaders = new Set(photos.map(p => p.uploaded_by)).size;
  const todayPhotos = photos.filter(p => new Date(p.created_at).toDateString() === new Date().toDateString()).length;

  return (
    <div className="space-y-6 pb-10">
      
      {/* --- TOAST --- */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg font-medium animate-in slide-in-from-top-2 fade-in duration-300 ${
          toast.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm">{toast.message}</span>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Camera className="text-[#b71c1c]" size={28} />
            Kelola Gallery Event
          </h1>
          <p className="text-gray-500 text-sm mt-1">Upload dan kelola dokumentasi foto kegiatan Tel-U Cup.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchPhotos}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
          >
            Refresh
          </button>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-[#a81d22] hover:bg-[#8b1518] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <Upload size={18} />
            Upload Foto
          </button>
        </div>
      </div>

      {/* --- SUMMARY SECTION --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Foto</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalPhotos}</h3>
            <p className="text-xs text-gray-400">Tersimpan di sistem</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
            <ImageIcon size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Foto Hari Ini</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{todayPhotos}</h3>
            <p className="text-xs text-gray-400">Upload terbaru</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Uploader</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{uniqueUploaders}</h3>
            <p className="text-xs text-gray-400">Panitia unik</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-50 text-orange-600">
            <User size={24} />
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-3 rounded-lg flex items-center gap-3 text-sm shadow-sm">
        <AlertCircle size={18} className="shrink-0" />
        <p><strong>Informasi AI Processing:</strong> Setiap foto yang diupload akan diproses otomatis oleh sistem AI di background untuk mendeteksi wajah peserta.</p>
      </div>

      {/* --- TOOLBAR --- */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari ID Foto / Uploader..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option>Semua</option>
              <option>Hari Ini</option>
              <option>Minggu Ini</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative flex-1 md:flex-none">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option>Terbaru</option>
              <option>Terlama</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- GALLERY MAIN --- */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-video bg-gray-200 w-full"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-100 rounded w-full mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 border-dashed p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Belum ada dokumentasi event</h3>
          <p className="text-gray-500 text-sm max-w-md mb-6">Upload foto kegiatan agar dokumentasi muncul di gallery dan dapat diproses secara otomatis oleh AI.</p>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-2.5 bg-[#a81d22] hover:bg-[#8b1518] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            + Upload Foto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => {
            // Check if uploaded today to show "Diproses AI" as simulated state
            const isToday = new Date(photo.created_at).toDateString() === new Date().toDateString();
            
            return (
              <div key={photo.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
                {/* Image Aspect Box */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={photo.image_url} 
                    alt={`Event Photo ${photo.id}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                      Event Photo
                    </span>
                    {isToday && (
                      <span className="bg-indigo-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                        <AlertCircle size={10} /> Diproses AI
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[13px] font-semibold text-gray-800">{formatDate(photo.created_at)}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Uploaded By: ID {photo.uploaded_by}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-gray-100 pt-3">
                    <button 
                      onClick={() => setSelectedPhoto(photo)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-md transition-colors"
                    >
                      <Eye size={14} /> Detail
                    </button>
                    <button 
                      onClick={() => setPhotoToDelete(photo)}
                      className="flex-none flex items-center justify-center p-1.5 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 border border-transparent hover:border-red-100 rounded-md transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- DETAIL MODAL --- */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Image Side */}
            <div className="w-full md:w-3/5 bg-gray-900 relative min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedPhoto.image_url} 
                alt={`Photo ${selectedPhoto.id}`}
                className="w-full h-full object-contain absolute inset-0"
              />
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 md:hidden"
              >
                <X size={20} />
              </button>
            </div>

            {/* Info Side */}
            <div className="w-full md:w-2/5 p-6 flex flex-col relative h-[400px] md:h-auto overflow-y-auto">
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hidden md:block"
              >
                <X size={24} />
              </button>

              <div className="mb-6 pr-6">
                <h3 className="text-xl font-bold text-gray-900">Detail Foto Event</h3>
                <p className="text-sm text-gray-500">ID Foto: {selectedPhoto.id}</p>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tanggal Upload</p>
                  <p className="text-sm text-gray-800">{formatDate(selectedPhoto.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Diunggah Oleh</p>
                  <p className="text-sm text-gray-800">User ID: {selectedPhoto.uploaded_by}</p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cloudinary Public ID</p>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 break-all font-mono">
                    {selectedPhoto.cloudinary_public_id}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3">
                <a 
                  href={selectedPhoto.image_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Buka Foto <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- UPLOAD MODAL --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Upload Foto Event</h3>
              <button 
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFile(null);
                  setFilePreview(null);
                }}
                className="text-gray-400 hover:text-gray-700"
                disabled={isUploading}
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Foto akan disimpan sebagai dokumentasi event dan diproses secara otomatis oleh AI. Maks 5MB.
            </p>

            <div className="space-y-4">
              {!filePreview ? (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={32} className="text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-700">Klik atau Drag file ke sini</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, JPG</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={filePreview} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}
                      className="bg-white text-red-600 p-1.5 rounded-md shadow hover:bg-red-50"
                      disabled={isUploading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleFileSelect}
              />
              
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <ImageIcon size={16} className="text-gray-400" />
                  <span className="truncate flex-1">{selectedFile.name}</span>
                  <span className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button 
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFile(null);
                  setFilePreview(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isUploading}
              >
                Batal
              </button>
              <button 
                onClick={handleUploadSubmit}
                disabled={!selectedFile || isUploading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${
                  (!selectedFile || isUploading) ? "bg-red-300 cursor-not-allowed" : "bg-[#a81d22] hover:bg-[#8b1518]"
                }`}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengunggah...
                  </>
                ) : "Upload Foto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {photoToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Foto Event?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Foto ini akan dihapus secara permanen dari gallery event dan Cloudinary. Tindakan ini tidak dapat dibatalkan.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 flex justify-center mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={photoToDelete.image_url} 
                  alt="Delete preview" 
                  className="h-24 w-auto object-contain rounded"
                />
              </div>

              <div className="flex items-center gap-3 w-full">
                <button 
                  onClick={() => setPhotoToDelete(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex justify-center items-center"
                >
                  {isDeleting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : "Hapus Foto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
