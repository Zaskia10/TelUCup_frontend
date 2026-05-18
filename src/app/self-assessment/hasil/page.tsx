export default function HasilAssessmentPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[#B41F2A]">
                ⓘ Diproses oleh AI • Hasil Instan
              </span>
              <span className="text-gray-500">24 Mei 2024, 14:32 WIB</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Hasil Self-Assessment —{" "}
              <span className="text-[#B41F2A]">Bagus Setiawan</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-800 shadow-sm transition hover:bg-gray-50"
            >
              ▣ Export PDF
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
            >
              ⓘ
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr]">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Risk Card */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="h-1.5 bg-[#B41F2A]" />

              <div className="p-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-center">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[10px] border-[#B41F2A] bg-white">
                    <div className="text-center">
                      <p className="text-2xl font-extrabold text-gray-900">
                        87%
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Confidence
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[#B41F2A] px-10 py-3 text-sm font-extrabold text-white">
                        High Risk
                      </span>

                      <span className="text-sm font-bold text-[#B41F2A]">
                        Sangat Berisiko Cedera
                      </span>
                    </div>

                    <h2 className="max-w-xl text-2xl font-extrabold leading-snug tracking-tight text-gray-900">
                      Peringatan: Pemain tidak direkomendasikan untuk mengikuti
                      aktivitas intensitas tinggi.
                    </h2>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="rounded-lg bg-[#B41F2A] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#981A24]"
                      >
                        ↻ Minta Review Medis
                      </button>

                      <button
                        type="button"
                        className="rounded-lg border border-[#B41F2A] bg-white px-6 py-3 text-sm font-bold text-[#B41F2A] transition hover:bg-red-50"
                      >
                        ✈ Kirim ke Coach
                      </button>
                    </div>
                  </div>
                </div>

                <div className="my-8 border-t border-gray-100" />

                <div className="flex items-center justify-between gap-5 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-gray-400">⚠</span>

                    <div>
                      <p className="text-sm font-bold text-gray-700">
                        Override Admin: Izinkan Bermain
                      </p>
                      <p className="text-xs text-gray-400">
                        Hanya dapat diaktifkan oleh admin medis setelah review.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="relative h-7 w-14 shrink-0 rounded-full bg-gray-200 transition hover:bg-gray-300"
                    aria-label="Override admin izinkan bermain"
                  >
                    <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              </div>
            </section>

            {/* Explanation */}
            <section className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
              <div className="mb-5">
                <h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-gray-900">
                  <span className="text-[#B41F2A]">⌁</span>
                  Mengapa model memberi label ini?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  AI menganalisis data kualitatif asesmen dan riwayat pemain
                  untuk menentukan bobot risiko.
                </p>
              </div>

              <div className="space-y-5">
                <RiskBar
                  label="Nyeri Saat Ini (Skala 7/10)"
                  value={42}
                  strong
                />

                <RiskBar label="Riwayat Operasi ACL (Lutut Kiri)" value={28} />

                <RiskBar
                  label="Keterbatasan Mobilitas (Gerak Terbatas)"
                  value={15}
                />
              </div>

              <div className="mt-7 flex flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between">
                <p className="italic text-gray-500">
                  Model Confidence:{" "}
                  <span className="font-bold text-gray-700">87.4%</span>{" "}
                  (Kualitas data: Tinggi)
                </p>

                <button
                  type="button"
                  className="font-bold text-[#B41F2A] transition hover:underline"
                >
                  Tampilkan penjelasan lengkap ›
                </button>
              </div>
            </section>

            {/* Next Steps */}
            <section>
              <h2 className="mb-5 flex items-center gap-3 text-xl font-extrabold tracking-tight text-gray-900">
                <span className="text-gray-700">◉</span>
                Langkah Selanjutnya yang Direkomendasikan
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                <NextStepCard
                  title="Hentikan Latihan"
                  desc="Hentikan aktivitas intens segera."
                  button="Tandai Istirahat"
                />

                <NextStepCard
                  title="Review Medis"
                  desc="Konsultasi dengan tim medis FIK."
                  button="Kirim Data"
                />

                <NextStepCard
                  title="Update Profil"
                  desc="Catat kejadian di database pemain."
                  button="Simpan Log"
                />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="space-y-8">
            {/* Player Card */}
            <section className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl">
                  👤
                </div>

                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
                    Bagus Setiawan
                  </h2>

                  <p className="text-sm font-medium text-gray-500">
                    Fakultas Industri Kreatif • Futsal
                  </p>

                  <p className="mt-1 text-xs font-bold text-[#B41F2A]">
                    ID: #PLR-2024-0882
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-white p-4">
                <InfoItem label="Usia" value="21 Tahun" />
                <InfoItem label="Posisi" value="Anchor (Futsal)" alignRight />
                <InfoItem label="Terakhir Latihan" value="Kemarin" danger />
                <InfoItem label="Riwayat Cedera" value="ACL (2023)" alignRight />
              </div>

              <div className="mt-7 flex items-center justify-between gap-3">
                <h3 className="text-sm font-extrabold text-gray-900">
                  Ringkasan Gejala Utama
                </h3>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-extrabold text-[#B41F2A] transition hover:border-[#B41F2A] hover:bg-white"
                >
                  Unduh CSV
                </button>
              </div>

              <div className="mt-4 divide-y divide-gray-100">
                <SymptomItem
                  label="Nyeri Saat Ini"
                  value="Tingkat 7 (Nyeri Berat)"
                  danger
                />

                <SymptomItem
                  label="Keterbatasan Gerak"
                  value="Ya, pada Lutut & Pergelangan"
                  danger
                />

                <SymptomItem
                  label="Kualitas Tidur"
                  value="Sangat Buruk (3-4 jam)"
                  danger
                />

                <SymptomItem
                  label="Pernah ACL"
                  value="Ya, Lutut Kiri (Operasi)"
                  danger
                />

                <SymptomItem label="Kacamata Olahraga" value="Sports Eyewear" />
              </div>
            </section>

            {/* Medical Review */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-6">
                <h2 className="flex items-center gap-2 text-base font-extrabold text-gray-900">
                  <span className="text-[#B41F2A]">▱</span>
                  Panel Peninjauan Medis
                </h2>
              </div>

              <div className="p-6">
                <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-5 text-blue-600">
                  ⓘ Review medis belum dilakukan. Silakan berikan catatan
                  setelah pemeriksaan fisik.
                </div>

                <label className="text-xs font-extrabold uppercase text-gray-500">
                  Catatan Dokter / Fisioterapis
                </label>

                <textarea
                  placeholder="Masukkan hasil observasi klinis dan rekomendasi manual..."
                  className="mt-3 h-36 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#B41F2A]"
                />

                <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
                  <button
                    type="button"
                    className="rounded-lg bg-gray-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
                  >
                    Kirim Review ↗
                  </button>

                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                  >
                    Simpan Draft
                  </button>
                </div>
              </div>
            </section>

            {/* Audit Log */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-gray-500">
                ⟳ Audit Log
              </h2>

              <div className="divide-y divide-gray-100">
                <AuditItem label="Analisis AI Selesai" time="14:32" />
                <AuditItem label="PDF Laporan Diunduh" time="14:35" />
                <AuditItem label="Email ke Coach Sent" time="14:40" />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function RiskBar({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-gray-700">{label}</p>
        <p className="text-sm font-bold text-gray-400">{value}%</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${
            strong ? "bg-[#B41F2A]" : "bg-[#C85A63]"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function NextStepCard({
  title,
  desc,
  button,
}: {
  title: string;
  desc: string;
  button: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-base font-extrabold text-gray-900">{title}</h3>

      <p className="mt-3 min-h-10 text-sm leading-5 text-gray-500">{desc}</p>

      <button
        type="button"
        className="mt-5 w-full rounded-lg border border-gray-200 bg-white py-2 text-xs font-extrabold text-gray-700 transition hover:bg-gray-50"
      >
        {button}
      </button>
    </div>
  );
}

function InfoItem({
  label,
  value,
  danger = false,
  alignRight = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
  alignRight?: boolean;
}) {
  return (
    <div className={alignRight ? "text-right" : ""}>
      <p className="text-[10px] font-extrabold uppercase text-gray-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-extrabold ${
          danger ? "text-[#B41F2A]" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SymptomItem({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="flex gap-3 py-4">
      <span
        className={`mt-1 h-2 w-2 rounded-full ${
          danger ? "bg-[#B41F2A]" : "bg-gray-300"
        }`}
      />

      <div>
        <p className="text-xs font-extrabold uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p
          className={`mt-1 text-sm font-bold ${
            danger ? "text-[#B41F2A]" : "text-gray-700"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function AuditItem({ label, time }: { label: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-4 text-sm">
      <div className="flex items-center gap-3 text-gray-700">
        <span className="text-gray-400">◷</span>
        <span className="font-medium">{label}</span>
      </div>

      <span className="text-xs font-semibold text-gray-400">{time}</span>
    </div>
  );
}