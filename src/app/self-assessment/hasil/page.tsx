"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  HeartPulse,
  Bone,
  Zap,
  Brain,
  ArrowLeft,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  RefreshCw,
  Calendar,
  Shield,
} from "lucide-react";
import { getMyLatestAssessment, getAssessmentById } from "@/services/selfAssessmentService";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Flag {
  code: string;
  text: string;
  reason: string;
}

interface AssessmentResult {
  id: number;
  player_id: number;
  player_name: string | null;
  sport_branch: string | null;
  contingent: string | null;
  snapshot: { age: number; bmi: number; is_kacamata: boolean };
  risk_label: "low" | "medium" | "high";
  total_score: number;
  confidence_score: number;
  requires_clearance: boolean;
  domain_scores: {
    cardiovascular: number;
    musculoskeletal: number;
    acute_readiness: number;
    psychosocial: number;
  };
  red_flags: Flag[];
  yellow_flags: Flag[];
  recommendation: string | null;
  questionnaire_version: string;
  algorithm_version: string;
  valid_until: string | null;
  is_valid: boolean;
  medical_review: {
    medical_notes: string | null;
    is_allowed_to_play: boolean | null;
    pic_confirmed: boolean;
    reviewed_at: string | null;
  };
  created_at: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const RISK_CONFIG = {
  high: {
    label: "Risiko Tinggi",
    description: "Pemain tidak direkomendasikan untuk mengikuti aktivitas intensitas tinggi.",
    badge: "bg-[#B41F2A] text-white",
    border: "border-[#B41F2A]",
    bg: "bg-red-50",
    text: "text-[#B41F2A]",
    bar: "bg-[#B41F2A]",
    headerBar: "bg-[#B41F2A]",
  },
  medium: {
    label: "Risiko Sedang",
    description: "Pemain perlu pengawasan tambahan sebelum bertanding.",
    badge: "bg-amber-500 text-white",
    border: "border-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
    bar: "bg-amber-500",
    headerBar: "bg-amber-500",
  },
  low: {
    label: "Risiko Rendah",
    description: "Pemain dalam kondisi baik dan siap untuk bertanding.",
    badge: "bg-green-600 text-white",
    border: "border-green-600",
    bg: "bg-green-50",
    text: "text-green-700",
    bar: "bg-green-600",
    headerBar: "bg-green-600",
  },
} as const;

const DOMAIN_CONFIG = [
  { key: "cardiovascular" as const, label: "Kardiovaskular", weight: "35%", Icon: HeartPulse },
  { key: "musculoskeletal" as const, label: "Muskuloskeletal", weight: "30%", Icon: Bone },
  { key: "acute_readiness" as const, label: "Kesiapan Akut", weight: "20%", Icon: Zap },
  { key: "psychosocial" as const, label: "Psikososial", weight: "15%", Icon: Brain },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDomainBarColor(score: number): string {
  if (score >= 51) return "bg-[#B41F2A]";
  if (score >= 26) return "bg-amber-500";
  return "bg-green-600";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Kurus";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Gemuk";
  return "Obesitas";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoItem({
  label,
  value,
  alignRight = false,
}: {
  label: string;
  value: string;
  alignRight?: boolean;
}) {
  return (
    <div className={alignRight ? "text-right" : ""}>
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-gray-800">{value}</p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  positive,
  neutral,
}: {
  label: string;
  value: string;
  positive?: boolean;
  neutral?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`text-xs font-bold ${
          neutral ? "text-gray-700" : positive ? "text-green-600" : "text-[#B41F2A]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ClipboardList className="text-[#B41F2A]" size={36} />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Belum Ada Assessment</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Anda belum pernah mengisi self-assessment kesehatan. Isi sekarang untuk mengetahui
          status risiko Anda sebelum bertanding.
        </p>
        <button
          onClick={onStart}
          className="w-full bg-[#B41F2A] text-white rounded-lg py-3 font-bold text-sm hover:bg-[#981A24] transition-colors shadow-sm"
        >
          Mulai Self Assessment →
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HasilAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<AssessmentResult | null>(null);
  const [hasNoAssessment, setHasNoAssessment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(window.location.search);
        const idParam = params.get("id");

        let result;
        if (idParam && !isNaN(Number(idParam))) {
          result = await getAssessmentById(Number(idParam));
        } else {
          result = await getMyLatestAssessment();
        }

        if (result.data === null || result.data === undefined) {
          setHasNoAssessment(true);
        } else {
          setData(result.data);
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat hasil assessment");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Loading state ──

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-[#b71c1c]" size={40} />
          <p className="text-sm text-gray-500 font-medium">Memuat hasil assessment...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──

  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-[#B41F2A]" size={28} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#B41F2A] text-white rounded-lg font-medium text-sm hover:bg-[#981A24] transition-colors"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => router.push("/self-assessment")}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Ke Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ──

  if (hasNoAssessment) {
    return <EmptyState onStart={() => router.push("/self-assessment")} />;
  }

  if (!data) return null;

  const risk = RISK_CONFIG[data.risk_label] ?? RISK_CONFIG.low;
  const confidence = Math.round(data.confidence_score ?? 0);
  const redFlags = data.red_flags ?? [];
  const yellowFlags = data.yellow_flags ?? [];

  // ── Main result view ──

  return (
    <main className="min-h-screen bg-[#f4f7f6] font-sans">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#B41F2A] transition-colors"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        {/* Page header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span
                className={`rounded-full border px-3 py-1 ${risk.bg} ${risk.text} ${risk.border}`}
              >
                Dianalisis oleh Algoritma • Hasil Instan
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <Calendar size={12} />
                {formatDate(data.created_at)}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 lg:text-3xl">
              Hasil Self-Assessment —{" "}
              <span className="text-[#B41F2A]">{data.player_name || "Peserta"}</span>
            </h1>
            {(data.contingent || data.sport_branch) && (
              <p className="mt-1 text-sm text-gray-500">
                {data.contingent}
                {data.contingent && data.sport_branch && " • "}
                {data.sport_branch}
              </p>
            )}
          </div>

          <button
            onClick={() => router.push("/self-assessment")}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <RefreshCw size={14} /> Isi Ulang Assessment
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className={`h-1.5 ${risk.headerBar}`} />
              <div className="p-7">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <div
                    className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[8px] ${risk.border} bg-white`}
                  >
                    <div className="text-center">
                      <p className="text-2xl font-extrabold text-gray-900">{confidence}%</p>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Conf.
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-6 py-2 text-sm font-extrabold ${risk.badge}`}>
                        {risk.label}
                      </span>
                      <span className={`text-sm font-bold ${risk.text}`}>
                        Skor Total: {data.total_score.toFixed(1)} / 100
                      </span>
                    </div>
                    <p className="max-w-lg text-base font-bold leading-snug text-gray-800">
                      {risk.description}
                    </p>

                    {data.requires_clearance && (
                      <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
                        <AlertTriangle size={15} className="shrink-0 text-[#B41F2A]" />
                        <p className="text-xs font-bold text-[#B41F2A]">
                          Memerlukan clearance medis sebelum diizinkan bertanding
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Domain scores */}
            <section className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-base font-extrabold text-gray-900">
                <Shield size={17} className="text-[#B41F2A]" />
                Skor Per Domain
              </h2>
              <div className="space-y-5">
                {DOMAIN_CONFIG.map(({ key, label, weight, Icon }) => {
                  const score = data.domain_scores?.[key] ?? 0;
                  return (
                    <div key={key}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="text-gray-400" />
                          <span className="text-sm font-semibold text-gray-700">{label}</span>
                          <span className="text-xs text-gray-400">({weight})</span>
                        </div>
                        <span className="text-sm font-bold text-gray-600">{score.toFixed(1)}</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getDomainBarColor(score)}`}
                          style={{ width: `${Math.min(score, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-gray-400">
                Interpretasi skor: 0–25 Rendah · 26–50 Sedang · 51–100 Tinggi
              </p>
            </section>

            {/* Red flags */}
            {redFlags.length > 0 && (
              <section className="rounded-2xl border border-red-200 bg-red-50 p-7 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#B41F2A]">
                  <XCircle size={18} />
                  Red Flag Terdeteksi ({redFlags.length})
                </h2>
                <div className="space-y-3">
                  {redFlags.map((flag, i) => (
                    <div key={i} className="rounded-lg border border-red-100 bg-white p-4">
                      <p className="text-sm font-bold text-gray-800">{flag.text}</p>
                      {flag.reason && (
                        <p className="mt-1 text-xs leading-relaxed text-[#B41F2A]">{flag.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Yellow flags */}
            {yellowFlags.length > 0 && (
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-7 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-amber-700">
                  <AlertTriangle size={18} />
                  Perhatian — {yellowFlags.length} Yellow Flag
                </h2>
                <div className="space-y-3">
                  {yellowFlags.map((flag, i) => (
                    <div key={i} className="rounded-lg border border-amber-100 bg-white p-4">
                      <p className="text-sm font-bold text-gray-800">{flag.text}</p>
                      {flag.reason && (
                        <p className="mt-1 text-xs leading-relaxed text-amber-700">{flag.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No flags at all */}
            {redFlags.length === 0 && yellowFlags.length === 0 && (
              <section className="rounded-2xl border border-green-100 bg-green-50 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={22} className="shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      Tidak Ada Red Flag atau Yellow Flag
                    </p>
                    <p className="mt-0.5 text-xs text-green-700">
                      Tidak ditemukan indikator risiko signifikan pada screening ini.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Recommendation */}
            {data.recommendation && (
              <section className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-gray-900">
                  <ClipboardList size={17} className="text-[#B41F2A]" />
                  Rekomendasi
                </h2>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
                    {data.recommendation}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-6">
            {/* Player info */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                  <User size={26} />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-extrabold text-gray-900 leading-tight">
                    {data.player_name || "—"}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">
                    {data.contingent || "Kontingen tidak diketahui"}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-[#B41F2A]">
                    {data.sport_branch || "Cabang olahraga tidak diketahui"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <InfoItem label="Usia" value={`${data.snapshot?.age ?? "—"} tahun`} />
                <InfoItem
                  label="BMI"
                  value={
                    data.snapshot?.bmi
                      ? `${data.snapshot.bmi.toFixed(1)} (${getBMICategory(data.snapshot.bmi)})`
                      : "—"
                  }
                  alignRight
                />
                <InfoItem label="Kacamata" value={data.snapshot?.is_kacamata ? "Ya" : "Tidak"} />
                <InfoItem
                  label="ID Assessment"
                  value={`#${String(data.id).padStart(5, "0")}`}
                  alignRight
                />
              </div>
            </section>

            {/* Assessment validity */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xs font-extrabold uppercase tracking-wide text-gray-500">
                Status Assessment
              </h2>
              <div className="divide-y divide-gray-50">
                <StatusRow
                  label="Status"
                  value={data.is_valid ? "Masih Berlaku" : "Sudah Kadaluarsa"}
                  positive={data.is_valid}
                />
                {data.valid_until && (
                  <StatusRow
                    label="Berlaku Hingga"
                    value={formatDateShort(data.valid_until)}
                    neutral
                  />
                )}
                <StatusRow
                  label="Versi Kuesioner"
                  value={`v${data.questionnaire_version}`}
                  neutral
                />
                <StatusRow
                  label="Versi Algoritma"
                  value={`v${data.algorithm_version}`}
                  neutral
                />
              </div>

              {!data.is_valid && (
                <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3">
                  <p className="text-xs text-amber-700">
                    Assessment ini sudah kadaluarsa. Silakan isi ulang untuk mendapatkan evaluasi
                    terbaru.
                  </p>
                  <button
                    onClick={() => router.push("/self-assessment")}
                    className="mt-2 text-xs font-bold text-amber-700 underline"
                  >
                    Isi Ulang Sekarang →
                  </button>
                </div>
              )}
            </section>

            {/* Medical review */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xs font-extrabold uppercase tracking-wide text-gray-500">
                Peninjauan Medis
              </h2>

              {data.medical_review?.reviewed_at ? (
                <div className="space-y-3">
                  <div
                    className={`flex items-center gap-2 rounded-lg px-4 py-3 ${
                      data.medical_review.is_allowed_to_play
                        ? "border border-green-100 bg-green-50"
                        : "border border-red-100 bg-red-50"
                    }`}
                  >
                    {data.medical_review.is_allowed_to_play ? (
                      <CheckCircle2 size={16} className="shrink-0 text-green-600" />
                    ) : (
                      <XCircle size={16} className="shrink-0 text-[#B41F2A]" />
                    )}
                    <p
                      className={`text-sm font-bold ${
                        data.medical_review.is_allowed_to_play
                          ? "text-green-700"
                          : "text-[#B41F2A]"
                      }`}
                    >
                      {data.medical_review.is_allowed_to_play
                        ? "Diizinkan Bermain"
                        : "Tidak Diizinkan / Perlu Istirahat"}
                    </p>
                  </div>

                  {data.medical_review.medical_notes && (
                    <div>
                      <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-gray-400">
                        Catatan Medis
                      </p>
                      <p className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
                        {data.medical_review.medical_notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={11} />
                    Direview: {formatDate(data.medical_review.reviewed_at)}
                  </div>

                  {data.medical_review.pic_confirmed && (
                    <div className="flex items-center gap-1.5 text-xs text-green-600">
                      <CheckCircle2 size={12} />
                      Dikonfirmasi oleh PIC Kontingen
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-600">
                  Review medis belum dilakukan oleh panitia medis.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
