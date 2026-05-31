import { Search, ChevronDown, Upload, FolderPlus, RefreshCw } from "lucide-react";

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: "Terbaru" | "Terlama" | "Nama";
  setSortOrder: (order: "Terbaru" | "Terlama" | "Nama") => void;
  onRefresh: () => void;
  onUploadClick: () => void;
  onCreateFolderClick: () => void;
  isLoading: boolean;
}

export function GalleryToolbar({
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  onRefresh,
  onUploadClick,
  onCreateFolderClick,
  isLoading
}: Props) {
  return (
    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="text" 
          placeholder="Cari folder atau foto..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        <div className="relative flex-1 md:flex-none">
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "Terbaru" | "Terlama" | "Nama")}
            className="w-full appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            <option value="Terbaru">Terbaru</option>
            <option value="Terlama">Terlama</option>
            <option value="Nama">Nama (A-Z)</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
        
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw size={18} className={isLoading ? "animate-spin text-gray-400" : ""} />
        </button>

        <button 
          onClick={onCreateFolderClick}
          className="px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <FolderPlus size={16} />
          <span className="hidden sm:inline">Buat Folder</span>
        </button>

        <button 
          onClick={onUploadClick}
          className="px-3 py-2 bg-[#a81d22] hover:bg-[#8b1518] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">Upload Foto</span>
        </button>
      </div>
    </div>
  );
}
