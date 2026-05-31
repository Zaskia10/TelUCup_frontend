import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (val: "all" | "active" | "inactive") => void;
  onCreateNew: () => void;
  onToggleReorderMode: () => void;
  isReorderMode: boolean;
  totalPosters: number;
}

export default function SportsmanshipPosterToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onCreateNew,
  onToggleReorderMode,
  isReorderMode,
  totalPosters,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari judul atau deskripsi..."
            disabled={isReorderMode}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#b6252a] focus:ring-1 focus:ring-[#b6252a] transition-all disabled:opacity-50"
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as "all" | "active" | "inactive")}
            disabled={isReorderMode}
            className="w-full sm:w-auto appearance-none pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-[#b6252a] focus:ring-1 focus:ring-[#b6252a] transition-all disabled:opacity-50 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-gray-400" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleReorderMode}
          disabled={totalPosters === 0}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors border ${
            isReorderMode
              ? "bg-gray-800 text-white border-gray-800 hover:bg-gray-900"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          <ArrowUpDown size={16} />
          {isReorderMode ? "Selesai Urutkan" : "Urutkan"}
        </button>

        <button
          onClick={onCreateNew}
          disabled={isReorderMode}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#b6252a] hover:bg-[#961f23] text-white font-bold rounded-xl transition-colors shadow-sm shadow-red-200 text-sm disabled:opacity-50"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Tambah Poster</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>
    </div>
  );
}
