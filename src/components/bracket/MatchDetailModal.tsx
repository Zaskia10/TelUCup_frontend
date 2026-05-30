"use client";

import { useEffect } from "react";
import type { BracketMatch } from "@/types/bracket";

interface MatchDetailModalProps {
  match: BracketMatch;
  sportName?: string;
  onClose: () => void;
}

export default function MatchDetailModal({
  match,
  sportName,
  onClose,
}: MatchDetailModalProps) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const statusLabel =
    match.status === "live"
      ? "LIVE"
      : match.status === "finished"
      ? "SELESAI"
      : "TERJADWAL";

  const statusClass =
    match.status === "live"
      ? "bg-red-100 text-red-600 border-red-200 animate-pulse"
      : match.status === "finished"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-gray-100 text-gray-500 border-gray-200";

  const teamA = match.team_a;
  const teamB = match.team_b;

  const playersA = teamA?.players ?? [];
  const playersB = teamB?.players ?? [];

  const winner = match.winner;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Modal Panel */}
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-black text-gray-900">
              Detail Pertandingan
            </h2>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              {sportName ?? ""}{" "}
              {match.round_name ? `• ${match.round_name}` : ""}
              {" "}• Match #{match.match_number}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] font-bold border px-3 py-1 rounded-full uppercase tracking-wider ${statusClass}`}
            >
              {statusLabel}
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1">

          {/* Score banner */}
          <div className="flex items-center justify-between gap-2 px-6 py-5 bg-gradient-to-br from-[#b6252a]/5 via-white to-gray-50 border-b border-gray-100">
            {/* Team A */}
            <div className="flex flex-col items-center flex-1 min-w-0 gap-1">
              <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-100 shadow flex items-center justify-center text-xl font-black text-[#b6252a] flex-shrink-0">
                {teamA ? teamA.contingent.name.charAt(0) : "?"}
              </div>
              <span className="text-sm font-bold text-gray-800 text-center leading-tight truncate w-full px-1">
                {teamA?.contingent.name ?? "TBD"}
              </span>
              {teamA?.contingent.name && (
                <span className="text-[10px] text-gray-400 text-center truncate w-full px-1">
                  {teamA.contingent.name}
                </span>
              )}
              {winner && winner.registration_id === teamA?.registration_id && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  🏆 Pemenang
                </span>
              )}
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-1 px-2">
              {match.status !== "scheduled" ? (
                <div className="flex items-center gap-3">
                  <span
                    className={`text-4xl font-black ${
                      match.score_a !== null &&
                      match.score_b !== null &&
                      match.score_a > match.score_b
                        ? "text-[#b6252a]"
                        : "text-gray-700"
                    }`}
                  >
                    {match.score_a ?? 0}
                  </span>
                  <span className="text-gray-300 font-bold text-xl">—</span>
                  <span
                    className={`text-4xl font-black ${
                      match.score_b !== null &&
                      match.score_a !== null &&
                      match.score_b > match.score_a
                        ? "text-[#b6252a]"
                        : "text-gray-700"
                    }`}
                  >
                    {match.score_b ?? 0}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-gray-200">—</span>
                  <span className="text-gray-200 font-bold text-xl">VS</span>
                  <span className="text-4xl font-black text-gray-200">—</span>
                </div>
              )}
              {match.status === "live" && (
                <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                  SEDANG BERLANGSUNG
                </span>
              )}
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center flex-1 min-w-0 gap-1">
              <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-100 shadow flex items-center justify-center text-xl font-black text-[#b6252a] flex-shrink-0">
                {teamB ? teamB.contingent.name.charAt(0) : "?"}
              </div>
              <span className="text-sm font-bold text-gray-800 text-center leading-tight truncate w-full px-1">
                {teamB?.contingent.name ?? "TBD"}
              </span>
              {teamB?.contingent.name && (
                <span className="text-[10px] text-gray-400 text-center truncate w-full px-1">
                  {teamB.contingent.name}
                </span>
              )}
              {winner && winner.registration_id === teamB?.registration_id && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  🏆 Pemenang
                </span>
              )}
            </div>
          </div>

          {/* Info & Players grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-px sm:bg-gray-100">

            {/* ── Informasi Umum ── */}
            <div className="p-5 bg-white">
              <h3 className="text-[11px] font-black text-[#b6252a] uppercase tracking-wider border-l-[3px] border-[#b6252a] pl-2.5 mb-4">
                Informasi Umum
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ),
                    label: "Tanggal",
                    value: match.match_date ?? "Belum dijadwalkan",
                  },
                  {
                    icon: (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    label: "Waktu",
                    value: match.match_time ? `${match.match_time} WIB` : "Belum dijadwalkan",
                  },
                  {
                    icon: (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    ),
                    label: "Wasit",
                    value: match.referee_name ?? "—",
                  },
                  {
                    icon: (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    label: "Lokasi",
                    value: match.location ?? "—",
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
                {match.notes && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mt-2">
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Catatan</p>
                    <p className="text-xs text-amber-800">{match.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Daftar Pemain ── */}
            <div className="p-5 bg-white border-t sm:border-t-0 border-gray-100">
              <h3 className="text-[11px] font-black text-[#b6252a] uppercase tracking-wider border-l-[3px] border-[#b6252a] pl-2.5 mb-4">
                Daftar Pemain
              </h3>

              {playersA.length === 0 && playersB.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">Data pemain tidak tersedia</p>
              ) : (
                <div className="space-y-4">
                  {/* Team A players */}
                  {playersA.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {teamA?.contingent.name ?? "Tim A"}
                      </p>
                      <div className="space-y-1">
                        {playersA.map((p) => (
                          <div key={p.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50">
                            <div className="w-7 h-7 rounded-full bg-[#b6252a]/10 text-[#b6252a] flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {p.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                              {p.nim_nip && (
                                <p className="text-[10px] text-gray-400">{p.nim_nip}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Team B players */}
                  {playersB.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {teamB?.contingent.name ?? "Tim B"}
                      </p>
                      <div className="space-y-1">
                        {playersB.map((p) => (
                          <div key={p.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50">
                            <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {p.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                              {p.nim_nip && (
                                <p className="text-[10px] text-gray-400">{p.nim_nip}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
