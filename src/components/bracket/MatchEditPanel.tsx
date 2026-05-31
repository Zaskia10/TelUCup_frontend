"use client";

import { useState } from "react";
import Link from "next/link";
import type { BracketMatch, Registration } from "@/types/bracket";

interface MatchEditModalProps {
  match: BracketMatch;
  registrations: Registration[];
  onClose: () => void;
  onSave: (matchId: number, updates: MatchUpdates) => void;
  onStart?: (matchId: number) => void;
  openInFinishMode?: boolean;
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
  onStart,
  openInFinishMode = false,
}: MatchEditModalProps) {
  const isBye = match.status === "bye";

  const isTeamLocked = isBye || match.status === "live" || match.status === "finished";
  const isScheduled = match.status === "scheduled";

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
    openInFinishMode
      ? "finished"
      : match.status === "bye"
      ? "scheduled"
      : (match.status as "scheduled" | "live" | "finished")
  );
  const [notes, setNotes] = useState(match.notes ?? "");
  const [winnerId, setWinnerId] = useState<number | null>(
    match.winner?.registration_id ?? null
  );
  const [scoreError, setScoreError] = useState(false);

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

    if (status === "finished" && winnerId === null) {
      setScoreError(true);
      return;
    }
    setScoreError(false);
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


  const handleScoreAChange = (val: number) => {
    setScoreA(val);
    setScoreError(false);
    if (val > scoreB && teamAId) setWinnerId(teamAId);
    else if (val < scoreB && teamBId) setWinnerId(teamBId);

  };

  const handleScoreBChange = (val: number) => {
    setScoreB(val);
    setScoreError(false);
    if (val > scoreA && teamBId) setWinnerId(teamBId);
    else if (val < scoreA && teamAId) setWinnerId(teamAId);
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
      
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[560px] max-h-[90vh] flex flex-col animate-[modalIn_0.25s_ease-out]">
        
        <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-gray-100">
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
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          
          <div className="flex justify-center">
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
            <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-100 text-xs font-bold text-amber-700 text-center">
              ⚠ Pertandingan BYE — Tim otomatis maju ke babak berikutnya
            </div>
          )}

          
          {!isBye && teamAId && teamBId && (
            <Link
              href={`/verifikasi?match_id=${match.id}`}
              className="w-full flex items-center justify-center gap-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lihat Check-in Pemain
            </Link>
          )}

          
          {isScheduled && !isBye && onStart && teamAId && teamBId && (
            <button
              type="button"
              onClick={() => {
                onStart(match.id);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Mulai Pertandingan
            </button>
          )}

          
          {match.status === "live" && (
            <div className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-100 rounded-xl py-2.5 text-sm font-bold text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              Pertandingan Sedang Berlangsung
            </div>
          )}

          
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Tim Pertandingan
            </label>

            
            <TeamSlot
              label="Tim A"
              slotColor="red"
              selectedId={teamAId}
              registrations={registrations}
              isLocked={isTeamLocked}
              onSelect={setTeamAId}
              onClear={() => setTeamAId(null)}
            />

            
            {!isBye && !isTeamLocked && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleLocalSwap}
                  title="Tukar posisi tim A dan B"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-400 hover:text-[#b6252a] hover:border-[#b6252a]/30 hover:bg-red-50 text-[11px] font-bold transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Tukar Posisi A ↔ B
                </button>
              </div>
            )}

            
            <TeamSlot
              label="Tim B"
              slotColor="blue"
              selectedId={teamBId}
              registrations={registrations}
              isLocked={isTeamLocked}
              onSelect={setTeamBId}
              onClear={() => setTeamBId(null)}
            />
          </div>

          
          {status === "finished" && !isBye && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Skor & Pemenang
              </label>

              {scoreError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Tentukan skor dan pemenang sebelum menyelesaikan pertandingan!
                </div>
              )}

              
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-400">
                    {teamA ? (teamA.contingent.abbreviation ?? teamA.contingent.name) : "Tim A"}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={scoreA}
                    onChange={(e) => handleScoreAChange(Number(e.target.value))}
                    className="w-16 h-14 rounded-xl border-2 border-gray-200 text-center text-2xl font-black text-gray-900 focus:outline-none focus:border-[#b6252a] focus:ring-2 focus:ring-[#b6252a]/10 transition-colors"
                  />
                </div>
                <span className="text-gray-300 font-bold text-2xl mt-4">—</span>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-400">
                    {teamB ? (teamB.contingent.abbreviation ?? teamB.contingent.name) : "Tim B"}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={scoreB}
                    onChange={(e) => handleScoreBChange(Number(e.target.value))}
                    className="w-16 h-14 rounded-xl border-2 border-gray-200 text-center text-2xl font-black text-gray-900 focus:outline-none focus:border-[#b6252a] focus:ring-2 focus:ring-[#b6252a]/10 transition-colors"
                  />
                </div>
              </div>

              
              <div className="flex flex-col items-center gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Pemenang
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
                    {teamA ? (teamA.contingent.abbreviation ?? teamA.contingent.name) : "Tim A"}
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
                    {teamB ? (teamB.contingent.abbreviation ?? teamB.contingent.name) : "Tim B"}
                  </button>
                </div>
              </div>
            </div>
          )}

          
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
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

          
          <div>
            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informasi Jadwal
            </h4>
            <div className="space-y-3">
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggal</span>
                  <input
                    type="date"
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 border-none focus:outline-none focus:ring-0 p-0 mt-0.5"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Waktu</span>
                  <input
                    type="time"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 border-none focus:outline-none focus:ring-0 p-0 mt-0.5"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Wasit</span>
                  <input
                    type="text"
                    value={refereeName}
                    onChange={(e) => setRefereeName(e.target.value)}
                    placeholder="Nama wasit"
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 mt-0.5"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lokasi</span>
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

        
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isBye}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}




function TeamSlot({
  label,
  slotColor,
  selectedId,
  registrations,
  isLocked,
  onSelect,
  onClear,
}: {
  label: string;
  slotColor: "red" | "blue";
  selectedId: number | null;
  registrations: Registration[];
  isLocked: boolean;
  onSelect: (id: number | null) => void;
  onClear: () => void;
}) {
  const selected = registrations.find((r) => r.id === selectedId) ?? null;

  const avatarBg =
    slotColor === "red"
      ? "bg-red-50 border-[#b6252a]/20 text-[#b6252a]"
      : "bg-blue-50 border-blue-200 text-blue-600";
  const emptyBg = "bg-gray-50 border-gray-200 text-gray-300";

  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
      
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 flex-shrink-0 ${
          selected ? avatarBg : emptyBg
        }`}
      >
        {selected ? (selected.contingent.abbreviation ?? selected.contingent.name).charAt(0) : "?"}
      </div>

      
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </span>
        {isLocked ? (
          <p className="text-sm font-bold text-gray-800 truncate">
            {selected ? selected.contingent.name : "Belum ditentukan"}
          </p>
        ) : (
          <select
            value={selectedId ?? ""}
            onChange={(e) =>
              onSelect(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full text-sm font-bold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0 appearance-none cursor-pointer mt-0.5"
          >
            <option value="">— Pilih tim —</option>
            {registrations.map((r) => (
              <option key={r.id} value={r.id}>
                {r.contingent.name} ({r.contingent.abbreviation})
              </option>
            ))}
          </select>
        )}
      </div>

      
      {!isLocked && selectedId && (
        <button
          type="button"
          onClick={onClear}
          title="Kosongkan slot ini"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition-all flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
