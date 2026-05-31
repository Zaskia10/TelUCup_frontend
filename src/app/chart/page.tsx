"use client";

import BracketFilter from "@/components/bracket/BracketFilter";
import TournamentBracket from "@/components/bracket/TournamentBracket";
import ChampionsBanner from "@/components/bracket/ChampionsBanner";
import { useBracketData } from "@/hooks/useBracketData";

export default function BracketPage() {
  const {
    sports,
    selectedSport,
    setSelectedSport,
    selectedCategory,
    setSelectedCategory,
    bracketData,
    isLoading,
    error,
    loadBracket
  } = useBracketData();

  return (
    <div className="min-h-screen bg-[#fffafa]">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-xs font-bold text-[#b6252a] uppercase tracking-widest mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            TURNAMEN TAHUNAN
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Bagan <span className="text-[#b6252a]">Tel-U Cup</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
            Jelajahi peta persaingan olahraga terbesar di kampus. Pantau tim favorit Anda dari babak penyisihan hingga mencapai puncak kejayaan di Grand Final.
          </p>
        </div>

        <BracketFilter 
          sports={sports} 
          selectedSport={selectedSport} 
          onSportChange={(s) => { setSelectedSport(s); setSelectedCategory(null); }}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSearch={loadBracket}
        />

        <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-16">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> LIVE MATCH
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-300"></span> SCHEDULED
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span> FINISHED
          </div>
          <div className="hidden md:block w-px h-4 bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-1.5 text-[#b6252a] bg-red-50 px-3 py-1 rounded-full border border-red-100">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            GESER UNTUK MELIHAT BABAK LANJUTAN
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 text-center mb-8 max-w-2xl mx-auto">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-gray-500 py-20 font-medium">Memuat bagan...</div>
        ) : bracketData ? (
          <>
            <ChampionsBanner bracketData={bracketData} />
            <TournamentBracket bracketData={bracketData} />
          </>
        ) : (
          <div className="text-center text-gray-400 py-20 bg-white rounded-2xl shadow-sm border border-gray-100 mt-8">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>Silakan pilih cabang olahraga dan klik Cari untuk menampilkan bagan pertandingan.</p>
          </div>
        )}
      </main>
    </div>
  );
}
