import { useState, useRef } from "react";
import { X, Upload, Trash2, Image as ImageIcon } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => Promise<void>;
}

export function GalleryUploadModal({ isOpen, onClose, onSubmit }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran foto maksimal 5MB.");
        return;
      }
      setError(null);
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setFilePreview(null);
      setError(null);
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError(null);
    try {
      await onSubmit(selectedFile);
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Gagal mengunggah foto");
      } else {
        setError("Gagal mengunggah foto");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Upload Foto Event</h3>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
            disabled={isUploading}
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          Foto akan disimpan sebagai dokumentasi event dan diproses secara otomatis oleh AI. Maks 5MB (JPEG, PNG, JPG).
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!filePreview ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={32} className="text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-700">Klik atau Drag file ke sini</p>
              <p className="text-xs text-gray-500 mt-1">Maksimal 5MB</p>
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
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            Batal
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${
              (!selectedFile || isUploading) ? "bg-red-300 cursor-not-allowed" : "bg-[#a81d22] hover:bg-[#8b1518]"
            }`}
          >
            {isUploading ? "Mengunggah..." : "Upload Foto"}
          </button>
        </div>
      </div>
    </div>
  );
}
