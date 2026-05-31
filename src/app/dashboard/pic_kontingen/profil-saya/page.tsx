"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Shield,
  ClipboardList,
  HeartPulse,
  Bone,
  Zap,
  Brain,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Loader2,
  Building2,
  Eye,
} from "lucide-react";
import { getMyLatestAssessment } from "@/services/selfAssessmentService";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  is_kacamata?: boolean;
}

interface ContingentInfo {
  id: number;
  name: string;
  image_url: string | null;
  players_count: number;
  pic?: {
    name: string;
    email: string;
    role: string;
    is_kacamata?: boolean;
  };
}

interface Flag {
  code: string;
  text: string;
  reason: string;
}

interface AssessmentData {
  id: number;
  player_name: string | null;
  sport_branch: string | null;
  contingent: string | null;
  snapshot: { age: number; bmi: number; is_kacamata: boolean } | null;
  risk_label: "low" | "medium" | "high";
  total_score: number;
  confidence_score: number;
  requires_clearance: boolean;
  domain_scores: {
    cardiovascular: number;
    musculoskeletal: number;
    acute_readiness: number;
    psychosocial: number;
  } | null;
  red_flags: Flag[] | null;
  yellow_flags: Flag[] | null;
  recommendation: string | null;
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

// ─── Constants ─────────────────────────────────────────────────────────────────

const DOMAIN_CONFIG = [
  { key: "cardiovascular" as const, label: "Kardiovaskular", Icon: HeartPulse, weight: "35%" },
  { key: "musculoskeletal" as const, label: "Muskuloskeletal", Icon: Bone, weight: "30%" },
  { key: "acute_readiness" as const, label: "Kesiapan Akut", Icon: Zap, weight: "20%" },
  { key: "psychosocial" as const, label: "Psikososial", Icon: Brain, weight: "15%" },
];

const RISK_CONFIG = {
  high: {
    label: "Risiko Tinggi",
    badge: "bg-[#B41F2A] text-white",
    border: "border-[#B41F2A]",
    text: "text-[#B41F2A]",
    bg: "bg-red-50",
    headerBar: "bg-[#B41F2A]",
    bar: "bg-[#B41F2A]",
  },
  medium: {
    label: "Risiko Sedang",
    badge: "bg-amber-500 text-white",
    border: "border-amber-500",
    text: "text-amber-600",
    bg: "bg-amber-50",
    headerBar: "bg-amber-500",
    bar: "bg-amber-500",
  },
  low: {
    label: "Risiko Rendah",
    badge: "bg-green-600 text-white",
    border: "border-green-600",
    text: "text-green-700",
    bg: "bg-green-50",
    headerBar: "bg-green-600",
    bar: "bg-green-600",
  },
} as const;

// ─── Helpers ───────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

function getDomainBarColor(score: number): string {
  if (score >= 51) return "bg-[#B41F2A]";
  if (score >= 26) return "bg-amber-500";
  return "bg-green-600";
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Kurus";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Gemuk";
  return "Obesitas";
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ProfilSayaPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [contingent, setContingent] = useState<ContingentInfo | null>(null);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [hasNoAssessment, setHasNoAssessment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [contingentRes, assessmentRes] = await Promise.allSettled([
        fetch(`${API_URL}/contingents/my`, { headers: getHeaders() }).then((r) => r.json()),
        getMyLatestAssessment(),
      ]);

      if (contingentRes.status === "fulfilled" && contingentRes.value?.data) {
        setContingent(contingentRes.value.data);
      }

      if (assessmentRes.status === "fulfilled") {
        if (assessmentRes.value.data) {
          setAssessment(assessmentRes.value.data as any);
        } else {
          setHasNoAssessment(true);
        }
      }
    } catch (e: any) {
      setError(e.message || "Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {}
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="animate-spin text-[#b71c1c]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center max-w-sm">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-800 mb-2">Gagal Memuat</h2>
          <p className="text-gray-500 text-sm mb-5">{error}</p>
          <button
            onClick={fetchData}
            className="px-5 py-2 bg-[#b71c1c] text-white rounded-lg text-sm font-bold hover:bg-[#9b1818] transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const displayName = user?.name || contingent?.pic?.name || "—";
  const displayEmail = user?.email || contingent?.pic?.email || "—";
  const displayRole = user?.role || "pic_kontingen";
  const isKacamata =
    assessment?.snapshot?.is_kacamata ?? user?.is_kacamata ?? contingent?.pic?.is_kacamata ?? false;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6 pb-10">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
          <p className="text-gray-500 text-sm mt-1">
            Data pribadi dan status kesehatan Anda sebagai PIC Kontingen.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ─ LEFT: Personal Info (1/3) ─ */}
        <div className="lg:col-span-1 space-y-5">
          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Top gradient bar */}
            <div className="h-20 bg-gradient-to-r from-[#8a1519] to-[#c21e24]" />

            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="flex justify-center -mt-10 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#a81d22] to-[#e53935] flex items-center justify-center text-white text-3xl font-extrabold shadow-md border-4 border-white">
                  {initial}
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {displayName}
                </h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1.5">
                  <Mail size={13} className="text-gray-400" />
                  {displayEmail}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wide">
                    <Shield size={11} />
                    {displayRole.replace("_", " ")}
                  </span>
                  {isKacamata && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      👓 Kacamata
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detail info card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Detail Akun</h3>
            <div className="space-y-3">
              <InfoField label="Nama Lengkap" value={displayName} />
              <InfoField label="Email" value={displayEmail} />
              <InfoField
                label="Peran"
                value={displayRole === "pic_kontingen" ? "PIC Kontingen" : displayRole}
              />
              <InfoField label="Pengguna Kacamata" value={isKacamata ? "Ya" : "Tidak"} />
              {contingent && (
                <>
                  <div className="border-t border-gray-100 pt-3 mt-1">
                    <InfoField label="Kontingen" value={contingent.name} />
                  </div>
                  <InfoField
                    label="Jumlah Pemain"
                    value={`${contingent.players_count} terdaftar`}
                  />
                </>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <Link
                href="/dashboard/pic_kontingen/profil-kontingen"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b71c1c] hover:underline"
              >
                <Building2 size={12} /> Lihat Profil Kontingen →
              </Link>
            </div>
          </div>
        </div>

        {/* ─ RIGHT: Self-Assessment (2/3) ─ */}
        <div className="lg:col-span-2 space-y-5">
          {/* Assessment header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ClipboardList size={20} className="text-[#b71c1c]" />
              Status Self-Assessment
            </h2>
            {(hasNoAssessment || !assessment) && (
              <Link
                href="/self-assessment"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#b71c1c] text-white text-sm font-bold rounded-lg hover:bg-[#9b1818] transition-colors shadow-sm"
              >
                Mulai Assessment →
              </Link>
            )}
          </div>

          {/* Empty state */}
          {(hasNoAssessment || !assessment) ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <ClipboardList size={52} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-700 mb-2">Belum Ada Assessment</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                Anda belum pernah mengisi self-assessment kesehatan. Isi sekarang untuk mengetahui
                status risiko sebelum bertanding.
              </p>
              <Link
                href="/self-assessment"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#b71c1c] text-white text-sm font-bold rounded-lg hover:bg-[#9b1818] transition-colors shadow-sm"
              >
                Mulai Self-Assessment →
              </Link>
            </div>
          ) : (
            <>
              {/* ── Risk Summary Card ── */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className={`h-1.5 ${RISK_CONFIG[assessment.risk_label].headerBar}`} />
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Confidence circle */}
                    <div
                      className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[7px] ${RISK_CONFIG[assessment.risk_label].border} bg-white`}
                    >
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-gray-900 leading-tight">
                          {Math.round(assessment.confidence_score ?? 0)}%
                        </p>
                        <p className="text-[9px] font-bold uppercase text-gray-400 leading-none">
                          Conf.
                        </p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span
                          className={`rounded-full px-5 py-1.5 text-sm font-extrabold ${RISK_CONFIG[assessment.risk_label].badge}`}
                        >
                          {RISK_CONFIG[assessment.risk_label].label}
                        </span>
                        <span
                          className={`text-sm font-bold ${RISK_CONFIG[assessment.risk_label].text}`}
                        >
                          Skor: {assessment.total_score?.toFixed(1) ?? "—"} / 100
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-gray-400" />
                          Diisi: {formatDateTime(assessment.created_at)}
                        </span>
                        <span
                          className={`flex items-center gap-1 font-semibold ${
                            assessment.is_valid ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {assessment.is_valid ? (
                            <><CheckCircle2 size={11} /> Berlaku hingga {formatDate(assessment.valid_until!)}</>
                          ) : (
                            <><XCircle size={11} /> Kadaluarsa</>
                          )}
                        </span>
                      </div>

                      {assessment.requires_clearance && (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#B41F2A] bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                          <AlertTriangle size={11} /> Memerlukan clearance medis
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/self-assessment/hasil?id=${assessment.id}`}
                      className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 hover:border-[#b71c1c] hover:text-[#b71c1c] transition-colors"
                    >
                      <Eye size={14} /> Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── Domain Scores ── */}
              {assessment.domain_scores && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Skor Per Domain</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {DOMAIN_CONFIG.map(({ key, label, weight, Icon }) => {
                      const score = assessment.domain_scores?.[key] ?? 0;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <Icon size={13} className="text-gray-400" />
                              <span className="text-xs font-medium text-gray-600">{label}</span>
                              <span className="text-[10px] text-gray-400">({weight})</span>
                            </div>
                            <span className="text-xs font-bold text-gray-700">{score.toFixed(1)}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getDomainBarColor(score)}`}
                              style={{ width: `${Math.min(score, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-[10px] text-gray-400">
                    Interpretasi: 0–25 Rendah · 26–50 Sedang · 51–100 Tinggi
                  </p>
                </div>
              )}

              {/* ── Flags ── */}
              {((assessment.red_flags?.length ?? 0) > 0 ||
                (assessment.yellow_flags?.length ?? 0) > 0) && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Red flags */}
                  {(assessment.red_flags?.length ?? 0) > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                      <h3 className="text-sm font-bold text-[#B41F2A] mb-3 flex items-center gap-2">
                        <XCircle size={14} /> Red Flag ({assessment.red_flags!.length})
                      </h3>
                      <div className="space-y-2">
                        {assessment.red_flags!.map((f, i) => (
                          <div key={i} className="bg-white rounded-lg border border-red-100 px-3 py-2">
                            <p className="text-xs font-bold text-gray-800">{f.text}</p>
                            {f.reason && (
                              <p className="text-xs text-[#B41F2A] mt-0.5">{f.reason}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Yellow flags */}
                  {(assessment.yellow_flags?.length ?? 0) > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                      <h3 className="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2">
                        <AlertTriangle size={14} /> Perhatian ({assessment.yellow_flags!.length})
                      </h3>
                      <div className="space-y-2">
                        {assessment.yellow_flags!.map((f, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-lg border border-amber-100 px-3 py-2"
                          >
                            <p className="text-xs font-bold text-gray-800">{f.text}</p>
                            {f.reason && (
                              <p className="text-xs text-amber-700 mt-0.5">{f.reason}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* No flags */}
              {(assessment.red_flags?.length ?? 0) === 0 &&
                (assessment.yellow_flags?.length ?? 0) === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
                    <CheckCircle2 size={22} className="text-green-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-800">
                        Tidak Ada Red Flag atau Yellow Flag
                      </p>
                      <p className="text-xs text-green-700 mt-0.5">
                        Tidak ditemukan indikator risiko signifikan.
                      </p>
                    </div>
                  </div>
                )}

              {/* ── Medical Review & Recommendation ── */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Medical review status */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Status Review Medis</h3>
                  {assessment.medical_review?.reviewed_at ? (
                    <div className="space-y-3">
                      <div
                        className={`flex items-center gap-2 rounded-lg px-3 py-2.5 ${
                          assessment.medical_review.is_allowed_to_play
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        {assessment.medical_review.is_allowed_to_play ? (
                          <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                        ) : (
                          <XCircle size={15} className="text-[#B41F2A] shrink-0" />
                        )}
                        <p
                          className={`text-sm font-bold ${
                            assessment.medical_review.is_allowed_to_play
                              ? "text-green-700"
                              : "text-[#B41F2A]"
                          }`}
                        >
                          {assessment.medical_review.is_allowed_to_play
                            ? "Diizinkan Bermain"
                            : "Tidak Diizinkan"}
                        </p>
                      </div>
                      {assessment.medical_review.medical_notes && (
                        <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100 italic leading-relaxed">
                          "{assessment.medical_review.medical_notes}"
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        Direview: {formatDateTime(assessment.medical_review.reviewed_at)}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-600">
                      Review medis belum dilakukan oleh panitia.
                    </div>
                  )}
                </div>

                {/* Snapshot data */}
                {assessment.snapshot && (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Data Fisik Saat Ini</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <InfoField
                        label="Usia"
                        value={`${assessment.snapshot.age} tahun`}
                      />
                      <InfoField
                        label="BMI"
                        value={`${assessment.snapshot.bmi.toFixed(1)} (${getBMICategory(
                          assessment.snapshot.bmi
                        )})`}
                      />
                      <InfoField
                        label="Kacamata Olahraga"
                        value={assessment.snapshot.is_kacamata ? "Ya" : "Tidak"}
                      />
                      <InfoField
                        label="Cabang Olahraga"
                        value={assessment.sport_branch || "—"}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendation */}
              {assessment.recommendation && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <ClipboardList size={14} className="text-[#b71c1c]" /> Rekomendasi Sistem
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-4 border border-gray-100">
                    {assessment.recommendation}
                  </p>
                </div>
              )}

              {/* Expired warning */}
              {!assessment.is_valid && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">Assessment Sudah Kadaluarsa</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Masa berlaku assessment Anda telah habis. Silakan isi ulang untuk mendapatkan
                      evaluasi kesehatan terbaru sebelum bertanding.
                    </p>
                    <Link
                      href="/self-assessment"
                      className="inline-block mt-3 text-xs font-bold text-amber-700 underline"
                    >
                      Isi Ulang Sekarang →
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
