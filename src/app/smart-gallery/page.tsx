"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  ImageUp,
  Info,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

export default function SmartGalleryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isAgreed, setIsAgreed] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const isValidType = ["image/jpeg", "image/png"].includes(file.type);
    const isValidSize = file.size <= 5 * 1024 * 1024;

    if (!isValidType) {
      alert("Format foto harus JPG atau PNG.");
      return;
    }

    if (!isValidSize) {
      alert("Ukuran foto maksimal 5MB.");
      return;
    }

    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setPreviewUrl(null);
    setFileName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!isAgreed) {
      alert("Setujui pemrosesan data wajah terlebih dahulu.");
      return;
    }

    if (!previewUrl) {
      alert("Unggah foto wajah terlebih dahulu.");
      return;
    }

    router.push("/smart-gallery/hasil");
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 md:text-5xl">
            Lihat Foto Saya
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-500">
            Temukan dokumentasi momen Anda di Tel-U Cup secara instan. Cukup
            unggah satu foto wajah sebagai referensi pencocokan.
          </p>
        </header>

        <section className="mx-auto mt-10 max-w-5xl rounded-2xl border border-red-100 bg-red-50 px-6 py-5">
          <div className="flex items-center gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-[#B41F2A]">
              <Info size={23} />
            </div>

            <p className="text-sm leading-6 text-gray-600">
              <span className="font-extrabold text-[#B41F2A]">Cara Kerja:</span>{" "}
              Pastikan wajah terlihat jelas, tanpa masker/kacamata hitam, dan
              pencahayaan cukup untuk hasil akurasi maksimal.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-6xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[0.48fr_1fr]">
          <aside className="border-b border-gray-200 bg-gray-50 p-8 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-3 text-[#B41F2A]">
              <ShieldCheck size={26} />
              <h2 className="text-xl font-extrabold">Privasi Aman</h2>
            </div>

            <p className="mt-7 text-sm leading-7 text-gray-500">
              Foto Anda hanya digunakan untuk pencocokan instan dan dihapus
              otomatis setelah sesi berakhir.
            </p>

            <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm font-bold leading-6 text-gray-700">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(event) => setIsAgreed(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#B41F2A]"
              />
              Saya setuju data wajah diproses untuk sistem pencocokan AI.
            </label>
          </aside>

          <div className="p-8">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleSelectFile}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-[230px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 text-center transition hover:border-[#B41F2A] hover:bg-red-50/40"
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview foto wajah"
                    className="mx-auto h-44 w-44 rounded-2xl object-cover shadow-sm"
                  />

                  <span className="mt-4 block max-w-xs truncate text-sm font-bold text-gray-800">
                    {fileName}
                  </span>

                  <span className="mt-1 block text-xs text-gray-400">
                    Klik area ini untuk mengganti foto
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#B41F2A]">
                    <Upload size={30} />
                  </div>

                  <p className="mt-5 text-lg font-extrabold text-gray-900">
                    Klik untuk Unggah Foto Wajah
                  </p>

                  <p className="mt-2 text-sm font-medium text-gray-400">
                    JPG atau PNG, maksimum 5MB
                  </p>
                </>
              )}
            </button>

            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#B41F2A]"
              >
                <X size={16} />
                Hapus foto
              </button>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-xl bg-[#B41F2A] px-8 py-4 text-base font-extrabold text-white shadow-sm transition hover:bg-[#981A24] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cari Foto Saya
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-14 w-16 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-700 transition hover:border-[#B41F2A] hover:text-[#B41F2A]"
                aria-label="Buka kamera atau pilih foto"
              >
                <Camera size={24} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
              <ImageUp size={15} />
              Sistem akan melakukan pencocokan wajah dengan dokumentasi galeri
              Tel-U Cup.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}