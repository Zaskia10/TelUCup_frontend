"use client";

import type { Sport, SportCategory, Registration } from "@/data/mockAdmin";

interface AdminBracketFilterProps {
  sports: Sport[];
  selectedSport: Sport | null;
  onSportChange: (sport: Sport) => void;
  selectedCategory: SportCategory | null;
  onCategoryChange: (category: SportCategory | null) => void;
  registrations: Registration[];
  hasBracket: boolean;
  onGenerate: () => void;
  onRandomize: () => void;
  onReset: () => void;
  isGenerating: boolean;
}

export default function AdminBracketFilter({
  sports,
  selectedSport,
  onSportChange,
  selectedCategory,
  onCategoryChange,
  registrations,
  hasBracket,
  onGenerate,
  onRandomize,
  onReset,
  isGenerating,
}: AdminBracketFilterProps) {
  const hasCategories = selectedSport && selectedSport.categories.length > 0;
  const isReady =
    selectedSport &&
    (!hasCategories || selectedCategory) &&
    registrations.length >= 2;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 mb-6">
      {/* Top section: Sport + Category selection */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Cabang Olahraga */}
        <div className="md:col-span-5">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Cabang Olahraga
          </label>
          <div className="relative">
            <select
              id="admin-sport-select"
              value={selectedSport?.id ?? ""}
              onChange={(e) => {
                const s = sports.find((sp) => sp.id === Number(e.target.value));
                if (s) onSportChange(s);
              }}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
            >
              <option value="" disabled>
                Pilih cabang olahraga...
              </option>
              {sports.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Sub-Kategori */}
        <div className="md:col-span-4">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Sub-Kategori
          </label>
          <div className="relative">
            <select
              id="admin-category-select"
              value={selectedCategory?.id ?? ""}
              onChange={(e) => {
                const c = selectedSport?.categories.find(
                  (cat) => cat.id === Number(e.target.value)
                );
                onCategoryChange(c ?? null);
              }}
              disabled={!hasCategories}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {!hasCategories ? (
                <option value="">Tidak ada sub-kategori</option>
              ) : (
                <>
                  <option value="" disabled>
                    Pilih sub-kategori...
                  </option>
                  {selectedSport?.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Team count info */}
        <div className="md:col-span-3 flex flex-col items-start md:items-center justify-end">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 w-full justify-center">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <div className="text-center">
              <span className="text-lg font-extrabold text-gray-900">
                {registrations.length}
              </span>
              <span className="text-[10px] font-bold text-gray-400 block -mt-1">
                TIM TERVERIFIKASI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-100 my-4" />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 items-center">
        {!hasBracket ? (
          <button
            id="btn-generate"
            type="button"
            onClick={onGenerate}
            disabled={!isReady || isGenerating}
            className="inline-flex items-center gap-2 bg-[#b6252a] hover:bg-[#9a1e22] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-sm hover:shadow-md"
          >
            <svg
              className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isGenerating ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              )}
            </svg>
            {isGenerating ? "Generating..." : "Generate Bagan"}
          </button>
        ) : (
          <>
            <button
              id="btn-randomize"
              type="button"
              onClick={onRandomize}
              className="inline-flex items-center gap-2 bg-[#b6252a] hover:bg-[#9a1e22] text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-sm hover:shadow-md"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Randomize Posisi
            </button>
            <button
              id="btn-reset"
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 bg-white hover:bg-red-50 border border-red-200 text-[#b6252a] text-sm font-bold py-2.5 px-5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Reset Bagan
            </button>
          </>
        )}

        {/* Status message */}
        {!selectedSport && (
          <span className="text-xs text-gray-400 font-medium italic ml-2">
            ← Pilih cabang olahraga terlebih dahulu
          </span>
        )}
        {selectedSport &&
          hasCategories &&
          !selectedCategory && (
            <span className="text-xs text-amber-500 font-medium italic ml-2">
              ⚠ Pilih sub-kategori untuk melanjutkan
            </span>
          )}
        {isReady && registrations.length < 2 && (
          <span className="text-xs text-red-500 font-medium italic ml-2">
            ⚠ Minimal 2 tim terverifikasi diperlukan
          </span>
        )}
      </div>
    </div>
  );
}
