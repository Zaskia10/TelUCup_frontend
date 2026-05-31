"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Flag,
  Loader2,
  MapPin,
  RefreshCw,
  Shield,
  Users,
  UserCheck,
  XCircle,
} from "lucide-react";
import {
  useMatchCheckin,
  type CheckinPlayer,
  type CheckinTeam,
  type CheckinMatchData,
  type ActivityLog,
} from "@/hooks/useMatchCheckin";

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

function formatTime(isoString: string | null): string {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function getStatusLabel(status: string): { label: string; color: string } {
  switch (status) {
    case "live":
      return { label: "MATCH STARTED", color: "bg-green-100 text-green-700" };
    case "finished":
      return { label: "FINISHED", color: "bg-gray-200 text-gray-600" };
    default:
      return { label: "WAITING CHECK-IN", color: "bg-amber-100 text-amber-700" };
  }
}

function getStepperStep(status: string, allCheckedIn: boolean): number {
  if (status === "finished") return 4;
  if (status === "live") return 3;
  if (allCheckedIn) return 2;
  return 1;
}

// ─────────────────────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  color: "blue" | "green" | "orange" | "red" | "gray";
}) {
  const colorMap = {
    blue:   "bg-blue-50 text-blue-600",
    green:  "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-500",
    red:    "bg-red-50 text-[#b6252a]",
    gray:   "bg-gray-50 text-gray-500",
  };
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${colorMap[color]}`}>{icon}</div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 text-2xl font-black text-gray-900">{value}</p>
      <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }: {
  icon: React.ReactNode; label: string; value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
        <div className="mt-0.5 text-sm font-semibold text-gray-800">{value}</div>
      </div>
    </div>
  );
}

function ProgressStepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { n: 1, title: "Check-in Lapangan", sub: "Pemain melakukan check-in" },
    { n: 2, title: "Verifikasi", sub: "Admin verifikasi kehadiran & kelayakan" },
    { n: 3, title: "Match Started", sub: "Pertandingan berlangsung" },
    { n: 4, title: "Finished", sub: "Input skor & selesaikan match" },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-start">
        {steps.map((step, idx) => {
          const done = currentStep > step.n;
          const active = currentStep === step.n;
          return (
            <div key={step.n} className="flex flex-1 items-start">
              <div className="flex flex-col items-center">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all ${
                  done ? "bg-green-500 text-white" : active ? "bg-[#b6252a] text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> : step.n}
                </div>
                <div className="mt-2 max-w-[90px] text-center">
                  <p className={`text-xs font-bold ${active ? "text-[#b6252a]" : done ? "text-green-600" : "text-gray-400"}`}>
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400 leading-tight">{step.sub}</p>
                </div>
              </div>
              {idx < 3 && (
                <div className={`mt-3.5 h-px flex-1 transition-all ${currentStep > step.n ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MatchHeader({ matchData, statusInfo, allCheckedIn }: {
  matchData: CheckinMatchData;
  statusInfo: { label: string; color: string };
  allCheckedIn: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
        {matchData.round_name} &bull; Match #{matchData.match_number}
      </p>
      <div className="flex flex-wrap items-center gap-5">
        {/* Team A */}
        <div className="flex flex-1 min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#b6252a] text-sm font-black text-white shadow-md">
            {initials(matchData.team_a?.contingent.name ?? "?")}
          </div>
          <div className="min-w-0">
            <p className="font-black text-gray-900 leading-tight truncate">
              {matchData.team_a?.contingent.name ?? "TBD"}
            </p>
            <p className="text-xs text-gray-400">
              {matchData.team_a?.players.filter((p) => p.checked_in).length ?? 0}/
              {matchData.team_a?.players.length ?? 0} hadir
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-black text-gray-500">VS</div>

        {/* Team B */}
        <div className="flex flex-1 min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-md">
            {initials(matchData.team_b?.contingent.name ?? "?")}
          </div>
          <div className="min-w-0">
            <p className="font-black text-gray-900 leading-tight truncate">
              {matchData.team_b?.contingent.name ?? "TBD"}
            </p>
            <p className="text-xs text-gray-400">
              {matchData.team_b?.players.filter((p) => p.checked_in).length ?? 0}/
              {matchData.team_b?.players.length ?? 0} hadir
            </p>
          </div>
        </div>

        <div className="hidden lg:block h-14 w-px bg-gray-100" />

        {/* Info */}
        <div className="flex flex-col gap-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="font-medium">Lapangan Utama</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="font-medium">Hari ini</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="font-medium">Segera</span>
          </div>
        </div>

        {/* Status */}
        <div className="shrink-0 text-right">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">STATUS MATCH</p>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-black ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          {!allCheckedIn && matchData.status === "scheduled" && (
            <p className="mt-1.5 text-[10px] text-gray-400 max-w-[160px]">
              Check-in semua pemain untuk melanjutkan
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayerRow({
  player,
  idx,
  isLoading: isPlayerLoading,
  onCheckin,
}: {
  player: CheckinPlayer;
  idx: number;
  isLoading: boolean;
  onCheckin: (player: CheckinPlayer) => void;
}) {
  const isHighRisk = player.risk_lvl?.toLowerCase() === "high";

  return (
    <tr className={`transition hover:bg-gray-50/60 ${player.checked_in ? "bg-green-50/40" : ""}`}>
      <td className="px-4 py-3.5 font-bold text-gray-400">{idx + 1}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black overflow-hidden ${
            isHighRisk ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
          }`}>
            {player.photo_path
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={player.photo_path} alt={player.name} className="h-8 w-8 object-cover" />
              : initials(player.name)}
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">{player.name}</p>
            <p className="text-[11px] text-gray-400">{player.nim_nip ?? "-"}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 font-mono text-xs text-gray-500">{player.nim_nip ?? "-"}</td>
      <td className="px-4 py-3.5">
        {player.checked_in ? (
          <div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Checked-in
            </span>
            <span className="text-[10px] text-gray-400">{formatTime(player.checked_in_at)}</span>
          </div>
        ) : (
          <button onClick={() => onCheckin(player)} disabled={isPlayerLoading}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-[#b6252a] hover:bg-red-100 disabled:opacity-50 transition">
            {isPlayerLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserCheck className="h-3 w-3" />}
            Check-in
          </button>
        )}
      </td>
      <td className="px-4 py-3.5">
        {isHighRisk ? (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-black text-red-700 w-max">
            {player.risk_lvl?.toUpperCase() || "HIGH RISK"} <AlertTriangle className="h-3 w-3" />
          </span>
        ) : player.risk_lvl?.toLowerCase() === "medium" ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black text-amber-700 w-max">
            {player.risk_lvl.toUpperCase()}
          </span>
        ) : !player.risk_lvl || player.risk_lvl?.toLowerCase() === "low" ? (
          <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-black text-green-700 w-max">
            {player.risk_lvl?.toUpperCase() || "LAYAK"}
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-black text-gray-500 w-max">
            {player.risk_lvl.toUpperCase()}
          </span>
        )}
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          {player.checked_in && (
            <button onClick={() => onCheckin(player)} disabled={isPlayerLoading}
              title="Batalkan check-in"
              className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-400 hover:text-red-500 hover:border-red-200 disabled:opacity-50 transition">
              {isPlayerLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
            </button>
          )}
          <button title="Lihat detail"
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition">
            <Eye className="h-3.5 w-3.5" /> Lihat
          </button>
        </div>
      </td>
    </tr>
  );
}

function ActivityLogSection({ logs, showAll, onToggle }: {
  logs: ActivityLog[];
  showAll: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-50 px-4 py-3.5 flex items-center justify-between">
        <h2 className="text-sm font-black text-gray-900">Aktivitas Match</h2>
        <Clock className="h-4 w-4 text-gray-300" />
      </div>
      <div className="divide-y divide-gray-50">
        {logs.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-gray-400">Belum ada aktivitas.</div>
        ) : (
          (showAll ? logs : logs.slice(0, 6)).map((log, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                log.isNew ? "bg-green-500" : log.isPending ? "bg-amber-400" : "bg-gray-200"
              }`} />
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 font-medium">{log.time} &bull; {log.actor}</p>
                <p className="mt-0.5 text-xs font-semibold text-gray-700 leading-snug">{log.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
      {logs.length > 6 && (
        <div className="border-t border-gray-50 px-4 py-3 text-center">
          <button onClick={onToggle}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#b6252a] transition">
            {showAll ? "Sembunyikan" : "Lihat Log Lengkap"}
            <span>{showAll ? "↑" : "→"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Main Component (Orchestrator)
// ─────────────────────────────────────────────────────────────

export default function VerifikasiContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const matchId = searchParams ? Number(searchParams.get("match_id")) || null : null;

  const {
    matchData,
    loading,
    refreshing,
    error,
    loadingPlayers,
    isStarting,
    logs,
    totalPlayers,
    checkedInCount,
    notCheckedInCount,
    highRiskCount,
    allCheckedIn,
    fetchData,
    handleCheckin,
    handleCheckinAll,
    handleStartMatch,
  } = useMatchCheckin(matchId);

  const [activeTab, setActiveTab] = useState<"a" | "b">("a");
  const [showAllLogs, setShowAllLogs] = useState(false);

  const activeTeam = activeTab === "a" ? matchData?.team_a : matchData?.team_b;
  const inactiveTeam = activeTab === "a" ? matchData?.team_b : matchData?.team_a;
  const activeTeamNotIn = activeTeam?.players.filter((p) => !p.checked_in).length ?? 0;
  const statusInfo = matchData
    ? getStatusLabel(matchData.status)
    : { label: "LOADING...", color: "bg-gray-100 text-gray-500" };
  const currentStep = matchData ? getStepperStep(matchData.status, allCheckedIn) : 1;

  // ── Loading / Error ──

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-[#b6252a]" />
          <p className="text-sm font-medium">Memuat data pertandingan...</p>
        </div>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-7 w-7 text-[#b6252a]" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-gray-900">Pertandingan Tidak Ditemukan</h2>
          <p className="mb-6 text-sm text-gray-500">
            {error ?? "Pilih pertandingan dari halaman bagan terlebih dahulu."}
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#b6252a] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#9a1e22]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Bagan
          </button>
        </div>
      </div>
    );
  }

  // ── Main Render ──

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Bagan
          </button>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="grid gap-5 xl:grid-cols-[1fr_280px]">

          {/* LEFT COLUMN */}
          <div className="min-w-0 space-y-4">
            <MatchHeader matchData={matchData} statusInfo={statusInfo} allCheckedIn={allCheckedIn} />
            <ProgressStepper currentStep={currentStep} />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard icon={<Users className="h-5 w-5" />} label="Pemain di Match Ini"
                value={`${totalPlayers} / ${totalPlayers}`} sub="Total pemain" color="blue" />
              <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Sudah Check-in"
                value={String(checkedInCount)}
                sub={`${totalPlayers > 0 ? Math.round((checkedInCount / totalPlayers) * 100) : 0}%`}
                color="green" />
              <StatCard icon={<XCircle className="h-5 w-5" />} label="Belum Hadir"
                value={String(notCheckedInCount)}
                sub={`${totalPlayers > 0 ? Math.round((notCheckedInCount / totalPlayers) * 100) : 0}%`}
                color="orange" />
              <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="High Risk"
                value={String(highRiskCount)}
                sub={highRiskCount > 0 ? "Perlu perhatian" : "Semua aman"}
                color={highRiskCount > 0 ? "red" : "gray"} />
            </div>

            {/* Team Tabs + Player Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex border-b border-gray-100">
                {(["a", "b"] as const).map((slot) => {
                  const team = slot === "a" ? matchData.team_a : matchData.team_b;
                  const isActive = activeTab === slot;
                  return (
                    <button key={slot} onClick={() => setActiveTab(slot)}
                      className={`flex-1 py-3.5 px-4 text-sm font-bold transition border-b-2 ${
                        isActive ? "border-[#b6252a] text-[#b6252a]" : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}>
                      {team?.contingent.name ?? `Tim ${slot.toUpperCase()}`}
                    </button>
                  );
                })}
              </div>

              {activeTeam && (
                <div className="flex items-center justify-between gap-3 border-b border-gray-50 px-4 py-3">
                  <button
                    onClick={() => handleCheckinAll(activeTeam)}
                    disabled={activeTeamNotIn === 0 || activeTeam.players.some((p) => loadingPlayers.has(p.id))}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Check-in Semua Tim {activeTeam.contingent.name.split(" ")[0]}
                  </button>
                  {activeTeamNotIn > 0 && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-red-500">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Belum hadir semua ({activeTeamNotIn})
                    </span>
                  )}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                      <th className="w-10 px-4 py-3 text-left">No.</th>
                      <th className="px-4 py-3 text-left">Nama Pemain</th>
                      <th className="px-4 py-3 text-left">NIM</th>
                      <th className="px-4 py-3 text-left">Check-in</th>
                      <th className="px-4 py-3 text-left">Status Risiko</th>
                      <th className="px-4 py-3 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activeTeam?.players.length ? (
                      activeTeam.players.map((player, idx) => (
                        <PlayerRow
                          key={player.id}
                          player={player}
                          idx={idx}
                          isLoading={loadingPlayers.has(player.id)}
                          onCheckin={handleCheckin}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                          Tim ini belum memiliki pemain terdaftar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center gap-4 border-t border-gray-50 px-4 py-3 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500 inline-block" />Checked-in</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gray-300 inline-block" />Pending</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#b6252a] inline-block" />Belum Check-in</span>
                <span className="flex items-center gap-1.5"><AlertTriangle className="h-3 w-3 text-red-500" />High Risk</span>
                <span className="ml-auto italic text-gray-400 hidden sm:block">
                  Semua pemain harus check-in untuk melanjutkan ke input skor.
                </span>
              </div>
            </div>

            {/* Footer Action Bar */}
            {matchData?.status === "scheduled" && (
              <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-sm">
                <p className="text-xs text-gray-400 font-medium">
                  {checkedInCount} / {totalPlayers} pemain sudah check-in
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleStartMatch(() => router.back())}
                    disabled={!allCheckedIn || isStarting}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                      allCheckedIn
                        ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                        : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed border"
                    }`}
                  >
                    {isStarting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />}
                    {isStarting ? "Memulai..." : "Mulai Pertandingan"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Sidebar */}
          <div className="space-y-4">
            {/* Ringkasan Match */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-50 px-4 py-3.5">
                <h2 className="text-sm font-black text-gray-900">Ringkasan Match</h2>
              </div>
              <div className="space-y-3.5 p-4">
                <InfoRow icon={<Calendar className="h-4 w-4 text-gray-400" />} label="Jadwal" value="Hari ini" />
                <InfoRow icon={<MapPin className="h-4 w-4 text-gray-400" />} label="Lapangan" value="Lapangan Utama" />
                <InfoRow icon={<Flag className="h-4 w-4 text-gray-400" />} label="Kategori" value={matchData.round_name} />
                <InfoRow
                  icon={<Shield className="h-4 w-4 text-gray-400" />}
                  label="Status Match"
                  value={
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  }
                />
              </div>
            </div>

            {/* Progress Tim Lawan */}
            {inactiveTeam && (
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Tim Lawan</p>
                <p className="font-bold text-gray-800 text-sm mb-2">{inactiveTeam.contingent.name}</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-400 transition-all duration-500"
                      style={{
                        width: `${inactiveTeam.players.length > 0
                          ? (inactiveTeam.players.filter((p) => p.checked_in).length / inactiveTeam.players.length) * 100
                          : 0}%`,
                      }}
                    />
                  </div>
                  <span className="shrink-0 text-xs font-bold text-gray-500">
                    {inactiveTeam.players.filter((p) => p.checked_in).length}/{inactiveTeam.players.length}
                  </span>
                </div>
              </div>
            )}

            {/* Aktivitas */}
            <ActivityLogSection logs={logs} showAll={showAllLogs} onToggle={() => setShowAllLogs((p) => !p)} />
          </div>
        </div>
      </div>
    </div>
  );
}
