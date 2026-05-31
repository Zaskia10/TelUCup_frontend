import { ReactNode } from "react";
import { Image as ImageIcon } from "lucide-react";

interface Props {
  title?: string;
  isEmpty: boolean;
  onEmptyAction?: () => void;
  emptyMessage?: string;
  emptyActionLabel?: string;
  children: ReactNode;
}

export function GalleryPhotoGrid({ 
  title, 
  isEmpty, 
  onEmptyAction, 
  emptyMessage = "Belum ada foto", 
  emptyActionLabel = "Upload Foto", 
  children 
}: Props) {
  return (
    <div>
      {title && <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">{title}</h2>}
      
      {isEmpty ? (
        <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">{emptyMessage}</h3>
          <p className="text-gray-500 text-sm max-w-md mb-6">Upload foto kegiatan agar dokumentasi muncul di gallery dan dapat diproses secara otomatis oleh AI.</p>
          {onEmptyAction && (
            <button 
              onClick={onEmptyAction}
              className="px-5 py-2.5 bg-[#a81d22] hover:bg-[#8b1518] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              + {emptyActionLabel}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {children}
        </div>
      )}
    </div>
  );
}
