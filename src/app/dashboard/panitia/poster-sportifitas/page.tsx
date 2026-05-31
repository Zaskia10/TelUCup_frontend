"use client";

import { ShieldCheck } from "lucide-react";
import SportsmanshipPosterManager from "@/components/sportsmanship-posters/SportsmanshipPosterManager";

export default function PosterSportifitasPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 w-full min-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b6252a] text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Panitia Only
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Poster <span className="text-[#b6252a]">Sportifitas</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-2 max-w-2xl">
            Kelola poster reminder sportifitas yang akan ditampilkan setelah peserta (Player/PIC Kontingen) melakukan self-assessment. Aktifkan dan atur urutan poster untuk membuat kompilasi Carousel pada tampilan akhir mereka.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <SportsmanshipPosterManager />
        </div>
      </main>
    </div>
  );
}
