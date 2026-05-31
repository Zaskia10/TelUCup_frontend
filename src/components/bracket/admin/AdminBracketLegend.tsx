export default function AdminBracketLegend() {
  return (
    <div className="flex flex-wrap justify-start items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500" /> LIVE
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-gray-300" /> SCHEDULED
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500" /> FINISHED
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-400" /> BYE
      </div>
      <div className="w-px h-4 bg-gray-200 mx-1" />
      <div className="flex items-center gap-1.5 text-[#b6252a] bg-red-50 px-3 py-1 rounded-full border border-red-100">
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        KLIK UNTUK EDIT
      </div>
      <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
        </svg>
        DRAG & DROP TIM
      </div>
    </div>
  );
}
