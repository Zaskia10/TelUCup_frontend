import { Search, ChevronDown, RefreshCw } from "lucide-react";

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  showStatusFilter?: boolean;
  showSearch?: boolean;
  showRefresh?: boolean;
}

export function MyGalleryToolbar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onRefresh,
  isLoading,
  showStatusFilter = true,
  showSearch = true,
  showRefresh = true,
}: Props) {
  if (!showSearch && !showStatusFilter && !showRefresh) return null;

  return (
    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between mb-6">
      {showSearch ? (
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari foto atau folder..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
        </div>
      ) : (
        <div className="hidden md:block" /> // Spacer
      )}
      
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        {showStatusFilter && (
          <div className="relative flex-1 md:flex-none">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="all">Semua Status</option>
              <option value="approved">Diterima</option>
              <option value="pending">Menunggu</option>
              <option value="rejected">Ditolak</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        )}
        
        {showRefresh && (
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin text-gray-400" : ""} />
          </button>
        )}
      </div>
    </div>
  );
}
