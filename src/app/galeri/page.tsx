"use client";

import React from "react";
import { Camera } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { GalleryManager } from "@/components/gallery/GalleryManager";

export default function GaleriPublikPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-[#B41F2A] mb-6">
            <Camera size={16} />
            Dokumentasi Resmi
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 md:text-5xl lg:text-6xl">
            Galeri Tel-U Cup 2026
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500">
            Jelajahi momen-momen terbaik dan sorotan pertandingan dari seluruh cabang olahraga.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <GalleryManager isViewer={true} />
        </div>
      </section>
    </main>
  );
}
