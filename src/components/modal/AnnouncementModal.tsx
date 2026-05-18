"use client";

import {
  AlertTriangle,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";

type AnnouncementModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPrimaryClick?: () => void;
  title?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
};

export default function AnnouncementModal({
  isOpen,
  onClose,
  onPrimaryClick,
  title = "Utamakan Keselamatan & Sportivitas",
  category = "Kampanye Budaya & Keselamatan",
  description = "Pahami nilai-nilai utama untuk menciptakan pertandingan yang aman, sehat, dan sportif.",
  imageUrl,
  primaryButtonText = "Lanjut ke Hasil",
  secondaryButtonText = "Saya Mengerti",
}: AnnouncementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/60 px-4 pb-8 pt-28">
      <section className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="relative border-b border-gray-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-3.5 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Tutup modal"
          >
            <X size={17} />
          </button>

          <div className="flex items-center gap-3 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#B41F2A]">
              <ShieldCheck size={22} strokeWidth={2.2} />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B41F2A]">
                {category}
              </p>

              <h2 className="mt-1 text-lg font-extrabold tracking-tight text-gray-900">
                {title}
              </h2>

              <p className="mt-1 max-w-lg text-xs leading-5 text-gray-500">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-4 px-5 py-4 md:grid-cols-[0.9fr_1.1fr]">
          {/* Poster / Image */}
          <div className="overflow-hidden rounded-xl border border-red-100 bg-red-50">
            <div className="h-1 w-1/3 bg-[#B41F2A]" />

            <div className="flex min-h-[155px] flex-col items-center justify-center p-4 text-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="h-full max-h-[155px] w-full rounded-lg object-cover"
                />
              ) : (
                <>
                  <div className="mb-3 flex h-16 w-32 items-center justify-center rounded-lg bg-[#D87982]/60 text-[#B41F2A]">
                    <svg
                      viewBox="0 0 220 120"
                      className="h-14 w-28"
                      fill="currentColor"
                    >
                      <path
                        d="M20 95L70 45L105 75L145 35L200 95H20Z"
                        opacity="0.65"
                      />
                      <circle cx="110" cy="35" r="22" opacity="0.65" />
                    </svg>
                  </div>

                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#D87982]">
                    Harmony: Kolaborasi tanpa batas
                  </p>

                  <p className="mt-2 max-w-xs text-[11px] leading-4 text-[#C98289]">
                    Membangun lingkungan pertandingan yang inklusif dan saling
                    menghargai untuk mencapai tujuan bersama.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Text Items */}
          <div>
            <p className="mb-3 text-xs font-bold leading-5 text-gray-700">
              Ingatkan tim:{" "}
              <span className="text-[#B41F2A]">fair play</span>, cek kesiapan
              medis, dan prioritaskan keselamatan saat bertanding.
            </p>

            <div className="space-y-3">
              <InfoRow
                icon={<Stethoscope size={15} />}
                title="Cek Kesiapan Medis"
                description="Pastikan pemain mengisi self-assessment sebelum bertanding."
              />

              <InfoRow
                icon={<HeartHandshake size={15} />}
                title="Prioritaskan Sportivitas"
                description="Hormati lawan dan keputusan wasit; utamakan keselamatan tim."
              />

              <InfoRow
                icon={<AlertTriangle size={15} />}
                title="Laporkan Cedera"
                description="Segera lapor dan hentikan permainan jika ada risiko cedera."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-3 md:flex-row md:items-center md:justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-[11px] font-medium text-gray-500">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-gray-300 accent-[#B41F2A]"
            />
            Jangan tampilkan lagi untuk sesi ini
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
            >
              {secondaryButtonText}
            </button>

            <button
              type="button"
              onClick={onPrimaryClick}
              className="rounded-lg bg-[#B41F2A] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#981A24]"
            >
              {primaryButtonText}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#B41F2A]">
        {icon}
      </div>

      <div>
        <h3 className="text-xs font-extrabold text-gray-900">{title}</h3>
        <p className="mt-0.5 text-[11px] leading-4 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}