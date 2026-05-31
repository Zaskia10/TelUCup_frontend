export default function AdminBracketPageHeader() {
  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b6252a] text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Panitia Only
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          🏆 Sistem Gugur
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
        Kelola <span className="text-[#b6252a]">Bagan Pertandingan</span>
      </h1>
      <p className="text-gray-500 text-sm md:text-base mt-2 max-w-2xl">
        Generate, acak posisi, dan kelola bagan pertandingan sistem gugur. Pilih
        cabang olahraga, generate bagan, lalu klik pertandingan untuk mengedit
        detail. Drag & drop tim untuk memindahkan posisi antar pertandingan.
      </p>
    </div>
  );
}
