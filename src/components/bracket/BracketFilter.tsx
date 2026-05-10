"use client";

export default function BracketFilter() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        {/* Cabang Olahraga */}
        <div className="md:col-span-3">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Cabang Olahraga
          </label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors">
              <option>Bola Basket (Putra)</option>
              <option>Bola Basket (Putri)</option>
              <option>Futsal</option>
              <option>Bulu Tangkis</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Fase Turnamen */}
        <div className="md:col-span-3">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Fase Turnamen
          </label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors">
              <option>Babak Gugur (Playoffs)</option>
              <option>Penyisihan Grup</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Cari Peserta */}
        <div className="md:col-span-4">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Cari Peserta
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Ketik nama fakultas..."
              className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex gap-2">
          <button className="flex-1 bg-[#b6252a] hover:bg-[#9a1e22] text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50">
            Cari
          </button>
          <button className="flex-none bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200">
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}
