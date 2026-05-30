"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Stethoscope,
  Users,
  HeartPulse,
  Bone,
  Zap,
  Brain,
  Shield,
  User,
  RefreshCw,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Flag {
  code: string;
  text: string;
  reason: string;
}

interface Assessment {
  id: number;
  player_id: number;
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

interface ContingentSummary {
  contingent: string | null;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  kacamata_count: number;
  total_assessed: number;
}

interface SportSummary {
  sport_branch: string | null;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  kacamata_count: number;
  total_assessed: number;
}

type RiskLevel = "low" | "medium" | "high";
type TabKey = "list" | "contingent" | "sport";
type RiskFilter = "" | "high" | "medium" | "low";

// ─── Constants ─────────────────────────────────────────────────────────────────

const DOMAIN_CONFIG = [
  { key: "cardiovascular" as const, label: "Kardiovaskular", Icon: HeartPulse, weight: "35%" },
  { key: "musculoskeletal" as const, label: "Muskuloskeletal", Icon: Bone, weight: "30%" },
  { key: "acute_readiness" as const, label: "Kesiapan Akut", Icon: Zap, weight: "20%" },
  { key: "psychosocial" as const, label: "Psikososial", Icon: Brain, weight: "15%" },
];

const RISK_CONFIG = {
  high: {
    badge: "bg-red-100 text-red-700 border-red-200",
    bar: "bg-[#B41F2A]",
    border: "border-[#B41F2A]",
    text: "text-[#B41F2A]",
    label: "High Risk",
    headerBar: "bg-[#B41F2A]",
  },
  medium: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    bar: "bg-amber-500",
    border: "border-amber-500",
    text: "text-amber-600",
    label: "Medium",
    headerBar: "bg-amber-500",
  },
  low: {
    badge: "bg-green-100 text-green-700 border-green-200",
    bar: "bg-green-600",
    border: "border-green-600",
    text: "text-green-700",
    label: "Low Risk",
    headerBar: "bg-green-600",
  },
} as const;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getDomainBarColor(score: number): string {
  if (score >= 51) return "bg-[#B41F2A]";
  if (score >= 26) return "bg-amber-500";
  return "bg-green-600";
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-5 h-5 border-2 border-[#a81d22] border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
}

function RiskBadge({ label }: { label: RiskLevel }) {
  const cfg = RISK_CONFIG[label];
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.badge}`}>
      {cfg.label}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  iconBg,
  iconColor,
  Icon,
  highlight = false,
}: {
  label: string;
  value: number | string;
  sub: string;
  iconBg: string;
  iconColor: string;
  Icon: React.ElementType;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl p-5 border flex items-start justify-between ${
        highlight
          ? "border-red-200 ring-1 ring-red-100 shadow-[0_0_15px_rgba(239,68,68,0.08)]"
          : "border-gray-100"
      }`}
    >
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
        <Icon size={22} strokeWidth={2} />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
      <p className="text-xs font-semibold text-gray-800">{value}</p>
    </div>
  );
}

// ─── Summary table (Kontingen / Sport) ─────────────────────────────────────────

function SummaryTable({
  loading,
  rows,
  groupKey,
  groupLabel,
}: {
  loading: boolean;
  rows: (ContingentSummary | SportSummary)[];
  groupKey: "contingent" | "sport_branch";
  groupLabel: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {loading ? (
        <div className="flex justify-center items-center h-48 gap-3 text-gray-500">
          <Spinner />
          <span className="font-medium">Memuat ringkasan...</span>
        </div>
      ) : rows.length === 0 ? (
        <div className="p-12 text-center text-gray-500">Belum ada data assessment.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">{groupLabel}</th>
                <th className="p-4 font-medium text-center">Total</th>
                <th className="p-4 font-medium text-center">High</th>
                <th className="p-4 font-medium text-center">Medium</th>
                <th className="p-4 font-medium text-center">Low</th>
                <th className="p-4 font-medium text-center">Kacamata</th>
                <th className="p-4 font-medium min-w-[200px]">Distribusi Risiko</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {rows.map((row, i) => {
                const name = (row as any)[groupKey] || "(Tidak diketahui)";
                const total = row.total_assessed || 0;
                const highPct = total ? Math.round((row.high_risk_count / total) * 100) : 0;
                const medPct = total ? Math.round((row.medium_risk_count / total) * 100) : 0;
                const lowPct = total ? Math.round((row.low_risk_count / total) * 100) : 0;

                return (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-800">{name}</td>
                    <td className="p-4 text-center font-bold text-gray-800">{total}</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">
                        {row.high_risk_count}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold">
                        {row.medium_risk_count}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">
                        {row.low_risk_count}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-600">{row.kacamata_count}</td>
                    <td className="p-4">
                      <div className="h-2.5 rounded-full overflow-hidden bg-gray-100 flex">
                        <div className="bg-[#B41F2A] h-full" style={{ width: `${highPct}%` }} />
                        <div className="bg-amber-500 h-full" style={{ width: `${medPct}%` }} />
                        <div className="bg-green-600 h-full" style={{ width: `${lowPct}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {highPct}% high · {medPct}% med · {lowPct}% low
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Detail & Review modal ─────────────────────────────────────────────────────

function DetailModal({
  assessment,
  reviewAllowed,
  setReviewAllowed,
  reviewNotes,
  setReviewNotes,
  reviewPicConfirmed,
  setReviewPicConfirmed,
  isSubmittingReview,
  reviewFeedback,
  onClose,
  onSubmitReview,
}: {
  assessment: Assessment;
  reviewAllowed: boolean | null;
  setReviewAllowed: (v: boolean | null) => void;
  reviewNotes: string;
  setReviewNotes: (v: string) => void;
  reviewPicConfirmed: boolean;
  setReviewPicConfirmed: (v: boolean) => void;
  isSubmittingReview: boolean;
  reviewFeedback: { type: "success" | "error"; msg: string } | null;
  onClose: () => void;
  onSubmitReview: () => void;
}) {
  const risk = RISK_CONFIG[assessment.risk_label] ?? RISK_CONFIG.low;
  const redFlags = assessment.red_flags ?? [];
  const yellowFlags = assessment.yellow_flags ?? [];
  const alreadyReviewed = !!assessment.medical_review?.reviewed_at;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* ── Modal header ── */}
        <div className="p-5 border-b border-gray-100 flex items-start justify-between bg-gray-50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Detail Assessment — {assessment.player_name || "Peserta"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {[assessment.contingent, assessment.sport_branch].filter(Boolean).join(" · ")}
              {" "}·{" "}
              <span className="text-gray-400">#{String(assessment.id).padStart(5, "0")}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 p-1.5 rounded-full transition-colors mt-0.5"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Modal body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-[1.6fr_1fr]">
            {/* ─ LEFT: Assessment data ─ */}
            <div className="p-6 space-y-5 border-r border-gray-100">
              {/* Risk summary card */}
              <div className="rounded-xl border border-gray-100 bg-white p-5 overflow-hidden relative shadow-sm">
                <div className={`absolute inset-x-0 top-0 h-1 ${risk.headerBar}`} />
                <div className="flex items-center gap-4 mt-1">
                  <div
                    className={`w-16 h-16 shrink-0 rounded-full border-[6px] ${risk.border} flex items-center justify-center bg-white`}
                  >
                    <div className="text-center">
                      <p className="text-base font-extrabold text-gray-800 leading-tight">
                        {Math.round(assessment.confidence_score ?? 0)}%
                      </p>
                      <p className="text-[9px] font-bold uppercase text-gray-400 leading-none">Conf.</p>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <RiskBadge label={assessment.risk_label} />
                      <span className={`text-sm font-bold ${risk.text}`}>
                        Skor: {assessment.total_score?.toFixed(1) ?? "—"}
                      </span>
                    </div>
                    {assessment.requires_clearance && (
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B41F2A] bg-red-50 border border-red-200 rounded-lg px-2.5 py-1">
                        <AlertTriangle size={11} /> Memerlukan clearance medis
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Domain scores */}
              {assessment.domain_scores && (
                <div className="rounded-xl border border-gray-100 bg-white p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Shield size={14} className="text-[#B41F2A]" /> Skor Per Domain
                  </h3>
                  <div className="space-y-3.5">
                    {DOMAIN_CONFIG.map(({ key, label, weight, Icon }) => {
                      const score = assessment.domain_scores?.[key] ?? 0;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <Icon size={12} className="text-gray-400" />
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
                  <p className="mt-3 text-[10px] text-gray-400">0–25 Rendah · 26–50 Sedang · 51–100 Tinggi</p>
                </div>
              )}

              {/* Red flags */}
              {redFlags.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                  <h3 className="text-sm font-bold text-[#B41F2A] mb-3 flex items-center gap-2">
                    <XCircle size={14} /> Red Flag Terdeteksi ({redFlags.length})
                  </h3>
                  <div className="space-y-2">
                    {redFlags.map((f, i) => (
                      <div key={i} className="bg-white rounded-lg border border-red-100 p-3">
                        <p className="text-xs font-bold text-gray-800">{f.text}</p>
                        {f.reason && (
                          <p className="text-xs text-[#B41F2A] mt-0.5 leading-relaxed">{f.reason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Yellow flags */}
              {yellowFlags.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <h3 className="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2">
                    <AlertTriangle size={14} /> Yellow Flag ({yellowFlags.length})
                  </h3>
                  <div className="space-y-2">
                    {yellowFlags.map((f, i) => (
                      <div key={i} className="bg-white rounded-lg border border-amber-100 p-3">
                        <p className="text-xs font-bold text-gray-800">{f.text}</p>
                        {f.reason && (
                          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">{f.reason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No flags */}
              {redFlags.length === 0 && yellowFlags.length === 0 && (
                <div className="rounded-xl border border-green-100 bg-green-50 p-4 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                  <p className="text-sm font-medium text-green-800">
                    Tidak ada red flag atau yellow flag terdeteksi.
                  </p>
                </div>
              )}

              {/* Recommendation */}
              {assessment.recommendation && (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Rekomendasi Sistem</h3>
                  <p className="text-xs leading-5 text-gray-600 whitespace-pre-line">
                    {assessment.recommendation}
                  </p>
                </div>
              )}
            </div>

            {/* ─ RIGHT: Player info + Review form ─ */}
            <div className="p-6 space-y-5">
              {/* Player info */}
              <div className="rounded-xl border border-gray-100 bg-white p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <User size={14} className="text-gray-400" /> Info Peserta
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem label="Nama" value={assessment.player_name || "—"} />
                  <InfoItem label="Kontingen" value={assessment.contingent || "—"} />
                  <InfoItem label="Cabang Olahraga" value={assessment.sport_branch || "—"} />
                  <InfoItem
                    label="Usia"
                    value={
                      assessment.snapshot?.age ? `${assessment.snapshot.age} tahun` : "—"
                    }
                  />
                  <InfoItem
                    label="BMI"
                    value={
                      assessment.snapshot?.bmi != null
                        ? assessment.snapshot.bmi.toFixed(1)
                        : "—"
                    }
                  />
                  <InfoItem
                    label="Kacamata"
                    value={assessment.snapshot?.is_kacamata ? "Ya" : "Tidak"}
                  />
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-400">
                  <span>Dibuat: {formatDate(assessment.created_at)}</span>
                  {assessment.valid_until && (
                    <span>Berlaku: {formatDateShort(assessment.valid_until)}</span>
                  )}
                  <span
                    className={
                      assessment.is_valid ? "text-green-600 font-medium" : "text-red-500 font-medium"
                    }
                  >
                    {assessment.is_valid ? "✓ Masih berlaku" : "✗ Kadaluarsa"}
                  </span>
                </div>
              </div>

              {/* Current review status (shown if already reviewed) */}
              {alreadyReviewed && (
                <div
                  className={`rounded-xl border p-4 ${
                    assessment.medical_review.is_allowed_to_play
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <p
                    className={`text-sm font-bold mb-1 ${
                      assessment.medical_review.is_allowed_to_play
                        ? "text-green-700"
                        : "text-[#B41F2A]"
                    }`}
                  >
                    {assessment.medical_review.is_allowed_to_play
                      ? "✓ Review: Diizinkan Bermain"
                      : "✕ Review: Tidak Diizinkan"}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Direview: {formatDate(assessment.medical_review.reviewed_at!)}
                    {assessment.medical_review.pic_confirmed && " · PIC dikonfirmasi"}
                  </p>
                  {assessment.medical_review.medical_notes && (
                    <p className="text-xs text-gray-600 mt-2 italic leading-relaxed">
                      "{assessment.medical_review.medical_notes}"
                    </p>
                  )}
                </div>
              )}

              {/* Review form */}
              <div className="rounded-xl border border-gray-100 bg-white p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Stethoscope size={14} className="text-[#B41F2A]" />
                  {alreadyReviewed ? "Perbarui Review Medis" : "Berikan Review Medis"}
                </h3>

                {/* Allowed / Disallowed */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-2">
                    Keputusan Medis
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReviewAllowed(true)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all ${
                        reviewAllowed === true
                          ? "bg-green-600 text-white border-green-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-green-50 hover:border-green-300"
                      }`}
                    >
                      ✓ Izinkan
                    </button>
                    <button
                      onClick={() => setReviewAllowed(false)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all ${
                        reviewAllowed === false
                          ? "bg-red-600 text-white border-red-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-red-50 hover:border-red-300"
                      }`}
                    >
                      ✕ Larang
                    </button>
                  </div>
                </div>

                {/* Medical notes */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-2">
                    Catatan Medis
                  </p>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Tuliskan hasil observasi klinis dan rekomendasi tindak lanjut..."
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B41F2A] focus:ring-1 focus:ring-[#B41F2A] resize-none"
                  />
                </div>

                {/* PIC confirmed */}
                <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={reviewPicConfirmed}
                    onChange={(e) => setReviewPicConfirmed(e.target.checked)}
                    className="h-4 w-4 accent-[#B41F2A] rounded"
                  />
                  PIC Kontingen sudah diinformasikan hasil review
                </label>

                {/* Feedback */}
                {reviewFeedback && (
                  <div
                    className={`mb-4 rounded-lg p-3 text-sm font-medium ${
                      reviewFeedback.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                  >
                    {reviewFeedback.type === "success" ? "✓ " : "✕ "}
                    {reviewFeedback.msg}
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={onSubmitReview}
                  disabled={reviewAllowed === null || isSubmittingReview}
                  className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-bold transition-colors hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmittingReview ? (
                    <>
                      <Spinner className="border-white border-t-transparent w-4 h-4" /> Menyimpan...
                    </>
                  ) : (
                    "Simpan Review →"
                  )}
                </button>

                {reviewAllowed === null && (
                  <p className="text-[11px] text-center text-gray-400 mt-2">
                    Pilih keputusan "Izinkan" atau "Larang" terlebih dahulu
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Modal footer ── */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function TinjauanMedisPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // ── List state ──
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // ── Filter state ──
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("");
  const [clearanceFilter, setClearanceFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Tab state ──
  const [activeTab, setActiveTab] = useState<TabKey>("list");

  // ── Summary state ──
  const [contingentSummary, setContingentSummary] = useState<ContingentSummary[]>([]);
  const [sportSummary, setSportSummary] = useState<SportSummary[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // ── Detail/Review modal state ──
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [reviewAllowed, setReviewAllowed] = useState<boolean | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewPicConfirmed, setReviewPicConfirmed] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // ── Fetch list ──
  const fetchAssessments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "20" });
      if (riskFilter) params.set("risk_label", riskFilter);
      if (clearanceFilter) params.set("requires_clearance", "true");

      const res = await fetch(`${API_URL}/self-assessment?${params}`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      if (json.status === "success") {
        setAssessments(json.data.data || []);
        setTotalPages(json.data.last_page || 1);
        setTotalItems(json.data.total || 0);
      }
    } catch (e) {
      console.error("Failed to fetch assessments", e);
    } finally {
      setLoading(false);
    }
  }, [page, riskFilter, clearanceFilter]);

  // ── Fetch summaries ──
  const fetchSummaries = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const [contingentRes, sportRes] = await Promise.all([
        fetch(`${API_URL}/self-assessment/summary/contingent`, { headers: getHeaders() }),
        fetch(`${API_URL}/self-assessment/summary/sport`, { headers: getHeaders() }),
      ]);
      const [contingentJson, sportJson] = await Promise.all([
        contingentRes.json(),
        sportRes.json(),
      ]);
      if (contingentJson.status === "success") setContingentSummary(contingentJson.data || []);
      if (sportJson.status === "success") setSportSummary(sportJson.data || []);
    } catch (e) {
      console.error("Failed to fetch summaries", e);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  useEffect(() => {
    fetchSummaries();
  }, [fetchSummaries]);

  // ── Open / close detail modal ──
  const openDetail = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setReviewAllowed(assessment.medical_review?.is_allowed_to_play ?? null);
    setReviewNotes(assessment.medical_review?.medical_notes || "");
    setReviewPicConfirmed(assessment.medical_review?.pic_confirmed || false);
    setReviewFeedback(null);
  };

  const closeDetail = () => {
    setSelectedAssessment(null);
    setReviewFeedback(null);
  };

  // ── Submit review ──
  const handleSubmitReview = async () => {
    if (!selectedAssessment || reviewAllowed === null) return;

    setIsSubmittingReview(true);
    setReviewFeedback(null);

    try {
      const res = await fetch(`${API_URL}/self-assessment/review/${selectedAssessment.id}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          is_allowed_to_play: reviewAllowed,
          medical_notes: reviewNotes,
          pic_confirmed: reviewPicConfirmed,
        }),
      });
      const json = await res.json();

      if (json.status === "success") {
        setReviewFeedback({ type: "success", msg: "Review medis berhasil disimpan." });
        // Update selected assessment state in-place
        setSelectedAssessment((prev) =>
          prev
            ? {
                ...prev,
                medical_review: {
                  ...prev.medical_review,
                  is_allowed_to_play: reviewAllowed,
                  medical_notes: reviewNotes,
                  pic_confirmed: reviewPicConfirmed,
                  reviewed_at: new Date().toISOString(),
                },
              }
            : null
        );
        // Refresh list in background
        fetchAssessments();
      } else {
        setReviewFeedback({ type: "error", msg: json.message || "Gagal menyimpan review." });
      }
    } catch {
      setReviewFeedback({ type: "error", msg: "Terjadi kesalahan jaringan." });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // ── Local search filter ──
  const filteredAssessments = assessments.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.player_name?.toLowerCase().includes(q) ||
      a.contingent?.toLowerCase().includes(q) ||
      a.sport_branch?.toLowerCase().includes(q)
    );
  });

  // ── Computed totals from summary data ──
  const totalAssessed = contingentSummary.reduce((s, c) => s + c.total_assessed, 0);
  const totalHighRisk = contingentSummary.reduce((s, c) => s + c.high_risk_count, 0);
  const totalMediumRisk = contingentSummary.reduce((s, c) => s + c.medium_risk_count, 0);
  const totalLowRisk = contingentSummary.reduce((s, c) => s + c.low_risk_count, 0);

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tinjauan Medis — Self-Assessment</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau status kesehatan peserta dan berikan review medis untuk clearance pertandingan.
          </p>
        </div>
        <button
          onClick={() => {
            fetchAssessments();
            fetchSummaries();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
        >
          <RefreshCw size={15} /> Refresh Data
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Terases"
          value={totalAssessed}
          sub="peserta telah mengisi"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          Icon={Users}
        />
        <SummaryCard
          label="High Risk"
          value={totalHighRisk}
          sub="perlu perhatian khusus"
          iconBg="bg-red-50"
          iconColor="text-[#B41F2A]"
          Icon={AlertTriangle}
          highlight
        />
        <SummaryCard
          label="Medium Risk"
          value={totalMediumRisk}
          sub="perlu pengawasan"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          Icon={Shield}
        />
        <SummaryCard
          label="Low Risk"
          value={totalLowRisk}
          sub="kondisi baik"
          iconBg="bg-green-50"
          iconColor="text-green-600"
          Icon={CheckCircle2}
        />
      </div>

      {/* ── Tab navigation ── */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
        {(
          [
            { key: "list", label: "Daftar Assessment" },
            { key: "contingent", label: "Ringkasan per Kontingen" },
            { key: "sport", label: "Ringkasan per Cabang" },
          ] as { key: TabKey; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-[#B41F2A] text-[#B41F2A]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Daftar Assessment ── */}
      {activeTab === "list" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-gray-50/50">
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 shrink-0">
              {(
                [
                  { key: "", label: "Semua", active: "bg-gray-800 text-white" },
                  { key: "high", label: "High Risk", active: "bg-red-600 text-white" },
                  { key: "medium", label: "Medium", active: "bg-amber-500 text-white" },
                  { key: "low", label: "Low Risk", active: "bg-green-600 text-white" },
                ] as { key: RiskFilter; label: string; active: string }[]
              ).map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    setRiskFilter(f.key);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    riskFilter === f.key
                      ? f.active
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setClearanceFilter(!clearanceFilter);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  clearanceFilter
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-orange-50"
                }`}
              >
                Perlu Clearance
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={15}
              />
              <input
                type="text"
                placeholder="Cari pemain, kontingen, cabor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#a81d22]/20 focus:border-[#a81d22]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[300px]">
            {loading ? (
              <div className="flex justify-center items-center h-48 gap-3 text-gray-500">
                <Spinner />
                <span className="font-medium">Memuat data...</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium">Peserta</th>
                    <th className="p-4 font-medium">Kontingen & Cabor</th>
                    <th className="p-4 font-medium">Risiko</th>
                    <th className="p-4 font-medium text-center">Skor</th>
                    <th className="p-4 font-medium text-center">Clearance</th>
                    <th className="p-4 font-medium text-center">Status Review</th>
                    <th className="p-4 font-medium">Tanggal</th>
                    <th className="p-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredAssessments.length > 0 ? (
                    filteredAssessments.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                        {/* Peserta */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                              <User size={13} className="text-gray-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 leading-tight">
                                {a.player_name || "—"}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                #{String(a.id).padStart(5, "0")}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Kontingen & Cabor */}
                        <td className="p-4">
                          <p className="text-gray-800 font-medium leading-tight">
                            {a.contingent || "—"}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{a.sport_branch || "—"}</p>
                        </td>

                        {/* Risiko */}
                        <td className="p-4">
                          <RiskBadge label={a.risk_label} />
                          {(a.red_flags?.length ?? 0) > 0 && (
                            <p className="text-[10px] text-[#B41F2A] font-bold mt-1">
                              {a.red_flags!.length} red flag
                            </p>
                          )}
                        </td>

                        {/* Skor */}
                        <td className="p-4 text-center">
                          <p className="font-bold text-gray-800">{a.total_score?.toFixed(1) ?? "—"}</p>
                          <p className="text-[10px] text-gray-400">
                            {a.confidence_score?.toFixed(0) ?? "—"}% conf.
                          </p>
                        </td>

                        {/* Clearance */}
                        <td className="p-4 text-center">
                          {a.requires_clearance ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-[11px] font-semibold">
                              <AlertTriangle size={9} /> Perlu
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>

                        {/* Status Review */}
                        <td className="p-4 text-center">
                          {a.medical_review?.reviewed_at ? (
                            a.medical_review.is_allowed_to_play ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] font-semibold">
                                <CheckCircle2 size={10} /> Izin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-[11px] font-semibold">
                                <XCircle size={10} /> Ditolak
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-[11px] font-semibold">
                              <Clock size={10} /> Belum
                            </span>
                          )}
                        </td>

                        {/* Tanggal */}
                        <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(a.created_at)}
                        </td>

                        {/* Aksi */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => openDetail(a)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors border border-gray-200"
                          >
                            <Eye size={13} /> Detail & Review
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-gray-500">
                        {searchQuery
                          ? "Tidak ada data yang cocok dengan pencarian."
                          : "Belum ada data self-assessment yang tersedia."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
              <span className="text-sm text-gray-600">
                Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong>{" "}
                <span className="text-gray-400">({totalItems} data)</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Ringkasan per Kontingen ── */}
      {activeTab === "contingent" && (
        <SummaryTable
          loading={loadingSummary}
          rows={contingentSummary}
          groupKey="contingent"
          groupLabel="Kontingen / Fakultas"
        />
      )}

      {/* ── Tab: Ringkasan per Cabang ── */}
      {activeTab === "sport" && (
        <SummaryTable
          loading={loadingSummary}
          rows={sportSummary}
          groupKey="sport_branch"
          groupLabel="Cabang Olahraga"
        />
      )}

      {/* ── Detail & Review Modal ── */}
      {selectedAssessment && (
        <DetailModal
          assessment={selectedAssessment}
          reviewAllowed={reviewAllowed}
          setReviewAllowed={setReviewAllowed}
          reviewNotes={reviewNotes}
          setReviewNotes={setReviewNotes}
          reviewPicConfirmed={reviewPicConfirmed}
          setReviewPicConfirmed={setReviewPicConfirmed}
          isSubmittingReview={isSubmittingReview}
          reviewFeedback={reviewFeedback}
          onClose={closeDetail}
          onSubmitReview={handleSubmitReview}
        />
      )}
    </div>
  );
}
