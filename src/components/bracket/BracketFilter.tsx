"use client";

import { useState } from "react";
import type { Sport, SportCategory } from "@/types/bracket";

interface BracketFilterProps {
  sports: Sport[];
  selectedSport: Sport | null;
  onSportChange: (sport: Sport | null) => void;
  selectedCategory: SportCategory | null;
  onCategoryChange: (category: SportCategory | null) => void;
  onSearch: () => void;
}

export default function BracketFilter({
  sports,
  selectedSport,
  onSportChange,
  selectedCategory,
  onCategoryChange,
  onSearch
}: BracketFilterProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        {/* Cabang Olahraga */}
        <div className="md:col-span-3">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Cabang Olahraga
          </label>
          <div className="relative">
            <select 
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
              value={selectedSport ? selectedSport.id : ""}
              onChange={(e) => {
                const sportId = parseInt(e.target.value);
                const sport = sports.find(s => s.id === sportId) || null;
                onSportChange(sport);
              }}
            >
              <option value="">Pilih Cabang Olahraga</option>
              {sports.map(sport => (
                <option key={sport.id} value={sport.id}>{sport.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Kategori */}
        <div className="md:col-span-3">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Kategori
          </label>
          <div className="relative">
            <select 
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors disabled:bg-gray-50 disabled:text-gray-400"
              value={selectedCategory ? selectedCategory.id : ""}
              onChange={(e) => {
                if (!selectedSport) return;
                const catId = parseInt(e.target.value);
                const cat = selectedSport.categories.find(c => c.id === catId) || null;
                onCategoryChange(cat);
              }}
              disabled={!selectedSport || selectedSport.categories.length === 0}
            >
              <option value="">Semua Kategori</option>
              {selectedSport && selectedSport.categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Fase Turnamen (Placeholder) */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Fase Turnamen
          </label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors disabled:bg-gray-50" disabled>
              <option>Babak Gugur</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="md:col-span-4 flex gap-2">
          <button 
            className="flex-1 bg-[#b6252a] hover:bg-[#9a1e22] text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
            onClick={onSearch}
          >
            Cari
          </button>
        </div>

      </div>
    </div>
  );
}
