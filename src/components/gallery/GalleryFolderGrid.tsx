import { ReactNode } from "react";
import { Folder } from "lucide-react";

interface Props {
  title?: string;
  isEmpty: boolean;
  onEmptyAction?: () => void;
  emptyMessage?: string;
  emptyActionLabel?: string;
  children: ReactNode;
}

export function GalleryFolderGrid({ 
  title, 
  isEmpty, 
  onEmptyAction, 
  emptyMessage = "Belum ada folder", 
  emptyActionLabel = "Buat Folder", 
  children 
}: Props) {
  return (
    <div className="mb-8">
      {title && <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">{title}</h2>}
      
      {isEmpty ? (
        <div className="bg-white rounded-xl border border-gray-200 border-dashed p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-400">
            <Folder size={24} />
          </div>
          <p className="text-gray-500 text-sm mb-4">{emptyMessage}</p>
          {onEmptyAction && (
            <button 
              onClick={onEmptyAction}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
            >
              + {emptyActionLabel}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {children}
        </div>
      )}
    </div>
  );
}
