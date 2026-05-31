"use client";

import { useState } from "react";
import { GalleryManager } from "@/components/gallery/GalleryManager";
import { MyGalleryView } from "@/components/my-gallery/MyGalleryView";
import { Camera, Image as ImageIcon } from "lucide-react";

export default function GaleriPlayer() {
  const [activeTab, setActiveTab] = useState<"semua" | "foto-saya">("semua");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Camera className="text-[#b71c1c]" size={28} />
          Dokumentasi Event
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Lihat seluruh dokumentasi Tel-U Cup dan temukan foto yang menampilkan diri kamu.
        </p>
      </div>

      {/* Custom Tabs */}
      <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab("semua")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "semua"
              ? "bg-red-50 text-red-700 shadow-sm"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <ImageIcon size={18} />
          Semua Dokumentasi
        </button>
        <button
          onClick={() => setActiveTab("foto-saya")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "foto-saya"
              ? "bg-red-50 text-red-700 shadow-sm"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Camera size={18} />
          Foto Saya
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "semua" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* isViewer=true to disable CRUD actions for Player */}
            <GalleryManager isViewer={true} />
          </div>
        )}

        {activeTab === "foto-saya" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <MyGalleryView 
              title="" // Title already handled by the page header
              description=""
              emptyTitle="Belum ada foto yang cocok dengan wajah kamu."
              emptyDescription="Foto akan muncul setelah panitia mengunggah dokumentasi dan sistem selesai memproses wajah."
              defaultStatus="approved"
              showStatusFilter={true}
              showSearch={true}
              showRefresh={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
