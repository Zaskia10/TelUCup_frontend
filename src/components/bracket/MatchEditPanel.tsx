"use client";

import { useState } from "react";
import type { BracketMatch, Registration } from "@/types/bracket";

interface MatchEditModalProps {
  match: BracketMatch;
  registrations: Registration[];
  onClose: () => void;
  onSave: (matchId: number, updates: MatchUpdates) => void;
  onSwap: (matchId: number) => void;
}

export interface MatchUpdates {
  registrationAId: number | null;
  registrationBId: number | null;
  scoreA: number;
  scoreB: number;
  matchDate: string;
  matchTime: string;
  location: string;
  refereeName: string;
  status: "scheduled" | "live" | "finished";
  notes: string;
  winnerId: number | null;
}

export default function MatchEditModal({
  match,
  registrations,
  onClose,
  onSave,
  onSwap,
}: MatchEditModalProps) {
  const isBye = match.status === "bye";

  const [teamAId, setTeamAId] = useState<number | null>(
    match.team_a?.registration_id ?? null
  );
  const [teamBId, setTeamBId] = useState<number | null>(
    match.team_b?.registration_id ?? null
  );
  const [scoreA, setScoreA] = useState(match.score_a);
  const [scoreB, setScoreB] = useState(match.score_b);
  const [matchDate, setMatchDate] = useState(match.match_date ?? "");
  const [matchTime, setMatchTime] = useState(match.match_time ?? "");
  const [location, setLocation] = useState(match.location ?? "");
  const [refereeName, setRefereeName] = useState(match.referee_name ?? "");
  const [status, setStatus] = useState<"scheduled" | "live" | "finished">(
    match.status === "bye"
      ? "scheduled"
      : (match.status as "scheduled" | "live" | "finished")
  );
  const [notes, setNotes] = useState(match.notes ?? "");
  const [winnerId, setWinnerId] = useState<number | null>(
    match.winner?.registration_id ?? null
  );

  const teamA = teamAId
    ? registrations.find((r) => r.id === teamAId) || match.team_a
    : null;
  const teamB = teamBId
    ? registrations.find((r) => r.id === teamBId) || match.team_b
    : null;

  const statusLabel: Record<string, string> = {
    scheduled: "SCHEDULED",
    live: "LIVE",
    finished: "SELESAI",
  };

  const statusColor: Record<string, string> = {
    scheduled: "bg-gray-100 text-gray-600 border-gray-200",
    live: "bg-emerald-500 text-white border-emerald-500",
    finished: "bg-gray-700 text-white border-gray-700",
  };

  const handleSave = () => {
    onSave(match.id, {
      registrationAId: teamAId,
      registrationBId: teamBId,
      scoreA,
      scoreB,
      matchDate,
      matchTime,
      location,
      refereeName,
      status,
      notes,
      winnerId,
    });
  };

  const handleLocalSwap = () => {
    const tmpId = teamAId;
    const tmpScore = scoreA;
    setTeamAId(teamBId);
    setTeamBId(tmpId);
    setScoreA(scoreB);
    setScoreB(tmpScore);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[540px] max-h-[85vh] flex flex-col animate-[modalIn_0.25s_ease-out]">
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Detail Pertandingan
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              {match.round_name} · Match #{match.match_number}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Status badge row */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2">
              {(["scheduled", "live", "finished"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    if (!isBye) {
                      setStatus(s);
                      if (s === "finished") {
                        if (scoreA > scoreB && teamAId) setWinnerId(teamAId);
                        else if (scoreB > scoreA && teamBId) setWinnerId(teamBId);
                      }
                    }
                  }}
                  disabled={isBye}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border transition-all duration-200 ${
                    status === s
                      ? statusColor[s]
                      : "bg-white text-gray-300 border-gray-100 hover:border-gray-300 hover:text-gray-500"
                  } ${isBye ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                >
                  {statusLabel[s]}
                </button>
              ))}
            </div>
          </div>

          {isBye && (
            <div className="mb-5 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-100 text-xs font-bold text-amber-700 text-center">
              ⚠ Pertandingan BYE — Tim otomatis maju ke babak berikutnya
            </div>
          )}

          {/* ── Versus layout ── */}
          <div className="flex items-center justify-center gap-3 mb-2">
            {/* Team A */}
            <div className="flex flex-col items-center w-[140px]">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black border-2 mb-2 ${
                  teamA
                    ? "bg-red-50 border-[#b6252a]/20 text-[#b6252a]"
                    : "bg-gray-50 border-gray-200 text-gray-300"
                }`}
              >
                {teamA ? teamA.contingent.abbreviation.charAt(0) : "?"}
              </div>
              <select
                value={teamAId ?? ""}
                onChange={(e) =>
                  setTeamAId(e.target.value ? Number(e.target.value) : null)
                }
                disabled={isBye || status === "live" || status === "finished"}
                className="w-full text-center text-xs font-bold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0 appearance-none cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 truncate"
                title="Klik untuk ganti tim"
              >
                <option value="">TBD</option>
                {registrations.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.contingent.abbreviation}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-full text-center">
                {teamA ? teamA.contingent.name : "Belum ditentukan"}
              </p>
            </div>

            {/* Scores */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={scoreA}
                onChange={(e) => setScoreA(Number(e.target.value))}
                disabled={isBye}
                className="w-12 h-12 rounded-xl border-2 border-gray-200 text-center text-xl font-black text-gray-900 focus:outline-none focus:border-[#b6252a] focus:ring-2 focus:ring-[#b6252a]/10 transition-colors disabled:bg-gray-50 disabled:text-gray-300"
              />
              <span className="text-gray-300 font-bold text-lg">—</span>
              <input
                type="number"
                min={0}
                value={scoreB}
                onChange={(e) => setScoreB(Number(e.target.value))}
                disabled={isBye}
                className="w-12 h-12 rounded-xl border-2 border-gray-200 text-center text-xl font-black text-gray-900 focus:outline-none focus:border-[#b6252a] focus:ring-2 focus:ring-[#b6252a]/10 transition-colors disabled:bg-gray-50 disabled:text-gray-300"
              />

              {/* Swap button */}
              <button
                type="button"
                onClick={handleLocalSwap}
                disabled={isBye || status === "live" || status === "finished"}
                title="Tukar posisi tim"
                className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#b6252a] hover:border-[#b6252a]/30 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </button>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center w-[140px]">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black border-2 mb-2 ${
                  teamB
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : "bg-gray-50 border-gray-200 text-gray-300"
                }`}
              >
                {teamB ? teamB.contingent.abbreviation.charAt(0) : "?"}
              </div>
              <select
                value={teamBId ?? ""}
                onChange={(e) =>
                  setTeamBId(e.target.value ? Number(e.target.value) : null)
                }
                disabled={isBye || status === "live" || status === "finished"}
                className="w-full text-center text-xs font-bold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0 appearance-none cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 truncate"
                title="Klik untuk ganti tim"
              >
                <option value="">TBD</option>
                {registrations.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.contingent.abbreviation}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-full text-center">
                {teamB ? teamB.contingent.name : "Belum ditentukan"}
              </p>
            </div>
          </div>

          {/* Winner Selection */}
          {!isBye && (
            <div className="mt-4 mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col items-center">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Pemenang Pertandingan
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWinnerId(teamAId)}
                  disabled={!teamAId}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    winnerId === teamAId && teamAId !== null
                      ? "bg-red-50 text-[#b6252a] border-[#b6252a]/30"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {teamA ? teamA.contingent.abbreviation : "Tim A"}
                </button>
                <button
                  type="button"
                  onClick={() => setWinnerId(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    winnerId === null
                      ? "bg-gray-200 text-gray-700 border-gray-300"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Belum Ada
                </button>
                <button
                  type="button"
                  onClick={() => setWinnerId(teamBId)}
                  disabled={!teamBId}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    winnerId === teamBId && teamBId !== null
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {teamB ? teamB.contingent.abbreviation : "Tim B"}
                </button>
              </div>
            </div>
          )}

          {/* ── Aksi Wasit / Notes ── */}
          <div className="mt-5 mb-5">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 text-center">
              Catatan
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan pertandingan..."
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-300 transition-colors resize-none"
            />
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-gray-100 my-1" />

          {/* ── Informasi Umum ── */}
          <div className="pt-4">
            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Informasi Umum
            </h4>

            <div className="space-y-3">
              {/* Tanggal */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Tanggal
                  </span>
                  <input
                    type="date"
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 border-none focus:outline-none focus:ring-0 p-0 mt-0.5"
                  />
                </div>
              </div>

              {/* Waktu */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Waktu
                  </span>
                  <input
                    type="time"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 border-none focus:outline-none focus:ring-0 p-0 mt-0.5"
                  />
                </div>
              </div>

              {/* Wasit */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Wasit
                  </span>
                  <input
                    type="text"
                    value={refereeName}
                    onChange={(e) => setRefereeName(e.target.value)}
                    placeholder="Nama wasit"
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 mt-0.5"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Lokasi
                  </span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Sport Center"
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 mt-0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <a
            href="/verifikasi"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#b6252a] hover:bg-[#9a1e22] text-white text-sm font-bold py-3 px-5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Check-in ke Verifikasi Lapangan
          </a>
          <button
            type="button"
            onClick={handleSave}
            disabled={isBye}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold py-3 px-5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
