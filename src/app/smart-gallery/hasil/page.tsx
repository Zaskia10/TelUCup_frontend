"use client";

import { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Download,
  Info,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";

type PhotoMatch = {
  id: string;
  title: string;
  location: string;
  code: string;
  confidence: number;
  selected: boolean;
};

const initialMatches: PhotoMatch[] = [
  {
    id: "M-101",
    title: "Final Basket Putra",
    location: "GOR Tel-U",
    code: "M-101",
    confidence: 94.52,
    selected: false,
  },
  {
    id: "M-102",
    title: "Lomba Atletik",
    location: "Stadion Utama",
    code: "M-102",
    confidence: 82.1,
    selected: false,
  },
  {
    id: "M-103",
    title: "Pembukaan Tel-U Cup",
    location: "Plaza Utama",
    code: "M-103",
    confidence: 48.7,
    selected: false,
  },
  {
    id: "M-104",
    title: "E-Sport Champion",
    location: "Gedung Damar",
    code: "M-104",
    confidence: 93.1,
    selected: false,
  },
  {
    id: "M-105",
    title: "Supporter Gather",
    location: "Tribun Utara",
    code: "M-105",
    confidence: 76.4,
    selected: false,
  },
  {
    id: "M-106",
    title: "Awarding Night",
    location: "Auditorium",
    code: "M-106",
    confidence: 61.2,
    selected: false,
  },
];

const galleryData = Array.from({ length: 24 }, (_, index) => ({
  ...initialMatches[index % initialMatches.length],
  id: `${initialMatches[index % initialMatches.length].id}-${index + 1}`,
  code: `${initialMatches[index % initialMatches.length].code}-${index + 1}`,
}));

export default function SmartGalleryResultPage() {
  const [matches, setMatches] = useState<PhotoMatch[]>(galleryData);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMatch>(galleryData[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("time");

  const selectedCount = matches.filter((item) => item.selected).length;

  const filteredMatches = useMemo(() => {
    const query = searchQuery.toLowerCase();

    const filtered = matches.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
    );

    if (sortBy === "confidence") {
      return [...filtered].sort((a, b) => b.confidence - a.confidence);
    }

    return filtered;
  }, [matches, searchQuery, sortBy]);

  const toggleSelectPhoto = (photoId: string) => {
    setMatches((prev) =>
      prev.map((item) =>
        item.id === photoId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAll = () => {
    const isAllSelected =
      filteredMatches.length > 0 &&
      filteredMatches.every((item) => item.selected);

    setMatches((prev) =>
      prev.map((item) =>
        filteredMatches.some((match) => match.id === item.id)
          ? { ...item, selected: !isAllSelected }
          : item
      )
    );
  };

  const approveSelection = () => {
    alert(`${selectedCount} foto berhasil di-approve.`);
  };

  const rejectSelection = () => {
    alert(`${selectedCount} foto berhasil di-reject.`);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[1fr_360px]">
        <section className="min-w-0 border-r border-gray-200">
          <header className="border-b border-gray-100 px-7 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Pilih Foto Saya
                </p>

                <p className="mt-4 text-sm font-medium text-gray-500">
                  Pekerjaan ID:{" "}
                  <span className="font-extrabold">#JOB-001</span> • Referensi
                  diunggah 2 menit yang lalu
                </p>

                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950">
                  Verifikasi Matches: Ararya Maheswara
                </h1>
              </div>

              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-extrabold text-gray-700 hover:bg-gray-50">
                <CheckCircle2 size={18} />
                Approve Semua (90%+)
              </button>
            </div>
          </header>

          <div className="border-b border-gray-100 px-7 py-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-extrabold text-gray-700">
                  <input
                    type="checkbox"
                    checked={
                      filteredMatches.length > 0 &&
                      filteredMatches.every((item) => item.selected)
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 accent-[#B41F2A]"
                  />
                  Pilih Semua ({filteredMatches.length})
                </label>

                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={approveSelection}
                  className="inline-flex items-center gap-2 text-sm font-extrabold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Check size={16} />
                  Approve Seleksi
                </button>

                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={rejectSelection}
                  className="inline-flex items-center gap-2 text-sm font-extrabold text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={16} />
                  Reject Seleksi
                </button>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                  <Search size={16} className="text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Cari foto..."
                    className="w-40 bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 outline-none"
                >
                  <option value="time">Urutkan: Waktu</option>
                  <option value="confidence">Urutkan: Match</option>
                </select>
              </div>
            </div>
          </div>

          <div className="px-7 py-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredMatches.map((photo, index) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  isActive={selectedPhoto.id === photo.id}
                  onSelect={() => setSelectedPhoto(photo)}
                  onToggle={() => toggleSelectPhoto(photo.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <aside className="bg-white">
          <div className="sticky top-0">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
                <Info size={19} />
                Detail Analisis AI
              </h2>
            </div>

            <div className="space-y-7 px-6 py-6">
              <section>
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-gray-500">
                  Perbandingan Referensi
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <ReferenceCard label="Foto Referensi" />
                  <ReferenceCard label="Hasil Temuan" variant="found" />
                </div>

                <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-extrabold text-gray-500">
                      Confidence Score
                    </p>
                    <p className="text-sm font-extrabold text-gray-900">
                      {selectedPhoto.confidence.toFixed(2)}%
                    </p>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#B41F2A]"
                      style={{ width: `${selectedPhoto.confidence}%` }}
                    />
                  </div>

                  <p className="mt-4 text-xs italic leading-5 text-gray-500">
                    Pencocokan didasarkan pada fitur biometrik wajah. Kualitas
                    gambar cukup tinggi untuk verifikasi otomatis.
                  </p>
                </div>
              </section>

              <section className="border-t border-gray-200 pt-6">
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-gray-500">
                  Metadata Foto
                </p>

                <MetadataItem label="Photo ID" value={`${selectedPhoto.code}.jpg`} />
                <MetadataItem label="Ukuran" value="4.2 MB (3200×2400)" />
                <MetadataItem label="Kamera" value="Sony A7R IV - 85mm" />
                <MetadataItem label="Verifikasi User" value="Auto-Pass" badge />
              </section>

              <section className="border-t border-gray-200 pt-6">
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-gray-500">
                  Log Audit
                </p>

                <div className="space-y-4 border-l border-gray-200 pl-4">
                  <AuditItem title="Detected 12 matches" desc="AI System • 10:42" />
                  <AuditItem title="Previewed job" desc="Admin 02 • 10:45" />
                  <AuditItem title="Reviewing..." desc="Admin 01 • 11:02" />
                </div>
              </section>

              <section className="grid grid-cols-2 gap-3">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B41F2A] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#981A24]">
                  <Download size={16} />
                  Download
                </button>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-extrabold text-gray-700 hover:bg-gray-50">
                  <RotateCcw size={16} />
                  Cari Ulang
                </button>
              </section>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function PhotoCard({
  photo,
  index,
  isActive,
  onSelect,
  onToggle,
}: {
  photo: PhotoMatch;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const imageClass =
    index % 6 === 0
      ? "from-orange-800 to-slate-900"
      : index % 6 === 1
      ? "from-green-800 to-slate-900"
      : index % 6 === 2
      ? "from-sky-800 to-slate-900"
      : index % 6 === 3
      ? "from-indigo-800 to-slate-900"
      : index % 6 === 4
      ? "from-red-800 to-slate-900"
      : "from-yellow-800 to-slate-900";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`overflow-hidden rounded-xl border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isActive ? "border-[#B41F2A] ring-2 ring-red-100" : "border-gray-100"
      }`}
    >
      <div
        className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${imageClass}`}
      >
        <span className="text-center text-xs font-extrabold uppercase tracking-wide text-white/70">
          Tel-U Cup
          <br />
          Photo
        </span>

        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-extrabold text-white ${
            photo.confidence >= 90
              ? "bg-[#B41F2A]"
              : photo.confidence >= 70
              ? "bg-black/50"
              : "bg-red-500"
          }`}
        >
          {photo.confidence.toFixed(1)}% Match
        </span>

        <input
          type="checkbox"
          checked={photo.selected}
          onChange={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          onClick={(event) => event.stopPropagation()}
          className="absolute right-2 top-2 h-4 w-4 accent-[#B41F2A]"
        />

        <span className="absolute bottom-2 right-2 rounded-full bg-black/40 px-2 py-1 text-xs text-white">
          ⋮
        </span>
      </div>

      <div className="p-3">
        <h3 className="truncate text-xs font-extrabold uppercase text-gray-900">
          {photo.title}
        </h3>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-xs font-semibold text-gray-400">
            {photo.location}
          </p>
          <p className="shrink-0 text-xs font-semibold text-gray-400">
            {photo.code}
          </p>
        </div>
      </div>
    </button>
  );
}

function ReferenceCard({
  label,
  variant = "reference",
}: {
  label: string;
  variant?: "reference" | "found";
}) {
  return (
    <div>
      <div
        className={`flex h-36 items-center justify-center rounded-xl bg-gradient-to-br ${
          variant === "reference"
            ? "from-gray-100 to-gray-300"
            : "from-red-900 to-slate-900"
        }`}
      >
        <ShieldCheck
          size={40}
          className={variant === "reference" ? "text-gray-500" : "text-white"}
        />
      </div>
      <p className="mt-2 text-center text-xs font-extrabold text-gray-500">
        {label}
      </p>
    </div>
  );
}

function MetadataItem({
  label,
  value,
  badge = false,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 text-sm">
      <span className="font-semibold text-gray-500">{label}</span>
      {badge ? (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-extrabold text-gray-700">
          {value}
        </span>
      ) : (
        <span className="font-bold text-gray-800">{value}</span>
      )}
    </div>
  );
}

function AuditItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <p className="text-sm font-extrabold text-gray-800">{title}</p>
      <p className="mt-0.5 text-xs font-semibold text-gray-400">{desc}</p>
    </div>
  );
}