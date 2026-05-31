import { GalleryFolder } from "@/types/gallery";
import { Folder, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Props {
  folder: GalleryFolder;
  onClick: (id: number) => void;
  onRename: (folder: GalleryFolder) => void;
  onDelete: (folder: GalleryFolder) => void;
  isViewer?: boolean;
}

export function GalleryFolderCard({ folder, onClick, onRename, onDelete, isViewer = false }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 relative group">
      <div 
        className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
        onClick={() => onClick(folder.id)}
      >
        <Folder size={24} fill="currentColor" className="opacity-80" />
      </div>
      
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onClick(folder.id)}>
        <h3 className="text-sm font-semibold text-gray-800 truncate" title={folder.name}>
          {folder.name}
        </h3>
        <p className="text-xs text-gray-500 truncate">
          {folder.photos_count || 0} Foto • {folder.children_count || 0} Folder
        </p>
      </div>

      {!isViewer && (
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
              <button 
                onClick={() => { setShowMenu(false); onRename(folder); }}
                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 size={14} /> Rename
              </button>
              <button 
                onClick={() => { setShowMenu(false); onDelete(folder); }}
                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} /> Hapus
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
