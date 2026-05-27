"use client";

import type { AdminMatch } from "@/data/mockAdmin";

interface AdminMatchCardProps {
  match: AdminMatch;
  isSelected: boolean;
  onSelect: (match: AdminMatch) => void;
  onDropTeam: (
    targetMatchId: string,
    targetSlot: "a" | "b",
    sourceMatchId: string,
    sourceSlot: "a" | "b"
  ) => void;
}

export default function AdminMatchCard({
  match,
  isSelected,
  onSelect,
  onDropTeam,
}: AdminMatchCardProps) {
  const isBye = match.status === "bye";

  const statusConfig = {
    live: {
      label: "LIVE",
      dotClass: "bg-red-500 animate-pulse",
      labelClass: "text-red-500",
    },
    finished: {
      label: "SELESAI",
      dotClass: "bg-emerald-500",
      labelClass: "text-emerald-600",
    },
    bye: {
      label: "BYE",
      dotClass: "bg-amber-400",
      labelClass: "text-amber-600",
    },
    scheduled: {
      label: match.matchTime ?? "TBD",
      dotClass: "bg-gray-300",
      labelClass: "text-gray-400",
    },
  };

  const cfg = statusConfig[match.status];

  return (
    <div
      className={`
        group relative bg-white rounded-xl shadow-sm border w-[280px] flex flex-col overflow-hidden
        transition-all duration-200
        ${
          isSelected
            ? "border-[#b6252a] ring-2 ring-[#b6252a]/20 shadow-md"
            : "border-gray-100 hover:border-gray-300 hover:shadow-md"
        }
        ${isBye ? "opacity-60" : ""}
        ${match.isThirdPlace ? "third-place-match border-gray-100 hover:border-gray-300 hover:shadow-md" : ""}
      `}
    >
      {/* Header — click to open modal */}
      <button
        type="button"
        onClick={() => onSelect(match)}
        className="flex justify-between items-center px-4 py-2 border-b border-gray-50 bg-gray-50/50 cursor-pointer text-left w-full hover:bg-gray-100/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {match.isThirdPlace ? "Juara 3" : `M${match.matchNumber}`}
          </span>
          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">
            {match.roundName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold ${cfg.labelClass}`}>
            {match.status === "live" ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                LIVE
              </span>
            ) : (
              cfg.label
            )}
          </span>
          {/* Edit icon */}
          <span className="text-gray-300 group-hover:text-[#b6252a] transition-colors">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </span>
        </div>
      </button>

      {/* Teams — draggable */}
      <div className="p-3 pb-1 flex flex-col gap-1 relative">
        <div className="absolute left-6 top-7 bottom-7 w-px bg-gray-100" />

        <DraggableTeamRow
          matchId={match.id}
          slot="a"
          name={match.teamA?.contingent.abbreviation ?? "TBD"}
          fullName={match.teamA?.contingent.name}
          score={match.status === "bye" ? null : match.scoreA}
          isWinner={
            match.winner !== null &&
            match.teamA !== null &&
            match.winner.registrationId === match.teamA.registrationId
          }
          isBye={isBye && !match.teamA}
          isEmpty={!match.teamA}
          onDropTeam={onDropTeam}
        />

        <DraggableTeamRow
          matchId={match.id}
          slot="b"
          name={match.teamB?.contingent.abbreviation ?? "TBD"}
          fullName={match.teamB?.contingent.name}
          score={match.status === "bye" ? null : match.scoreB}
          isWinner={
            match.winner !== null &&
            match.teamB !== null &&
            match.winner.registrationId === match.teamB.registrationId
          }
          isBye={isBye && !match.teamB}
          isEmpty={!match.teamB}
          onDropTeam={onDropTeam}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center mt-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          {match.matchDate ? (
            <>
              <svg
                className="w-3 h-3"
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
              {match.matchDate}
            </>
          ) : (
            <span className="text-gray-300 italic text-[10px]">
              Belum dijadwalkan
            </span>
          )}
        </div>
        {match.location && (
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
            <svg
              className="w-3 h-3"
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
            {match.location}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  Draggable Team Row
// ─────────────────────────────────────────────────────

function DraggableTeamRow({
  matchId,
  slot,
  name,
  fullName,
  score,
  isWinner,
  isBye,
  isEmpty,
  onDropTeam,
}: {
  matchId: string;
  slot: "a" | "b";
  name: string;
  fullName?: string;
  score: number | null;
  isWinner: boolean;
  isBye: boolean;
  isEmpty: boolean;
  onDropTeam: (
    targetMatchId: string,
    targetSlot: "a" | "b",
    sourceMatchId: string,
    sourceSlot: "a" | "b"
  ) => void;
}) {
  const hasDraggableTeam = !isBye && !isEmpty;

  const handleDragStart = (e: React.DragEvent) => {
    if (!hasDraggableTeam) return;
    e.dataTransfer.setData(
      "application/bracket-team",
      JSON.stringify({ matchId, slot })
    );
    e.dataTransfer.effectAllowed = "move";

    // Style the dragged element
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const el = e.currentTarget as HTMLElement;
    el.classList.add("ring-2", "ring-[#b6252a]/40", "bg-red-50/50", "rounded-lg");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.classList.remove("ring-2", "ring-[#b6252a]/40", "bg-red-50/50", "rounded-lg");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    el.classList.remove("ring-2", "ring-[#b6252a]/40", "bg-red-50/50", "rounded-lg");

    const raw = e.dataTransfer.getData("application/bracket-team");
    if (!raw) return;

    try {
      const source = JSON.parse(raw) as { matchId: string; slot: "a" | "b" };
      // Don't drop on itself
      if (source.matchId === matchId && source.slot === slot) return;
      onDropTeam(matchId, slot, source.matchId, source.slot);
    } catch {
      // ignore
    }
  };

  return (
    <div
      draggable={hasDraggableTeam}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex items-center justify-between z-10 bg-white p-1.5 rounded-lg transition-all ${
        hasDraggableTeam
          ? "cursor-grab active:cursor-grabbing hover:bg-gray-50"
          : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        {hasDraggableTeam && (
          <div className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 -mr-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="6" r="1.5" />
              <circle cx="15" cy="6" r="1.5" />
              <circle cx="9" cy="12" r="1.5" />
              <circle cx="15" cy="12" r="1.5" />
              <circle cx="9" cy="18" r="1.5" />
              <circle cx="15" cy="18" r="1.5" />
            </svg>
          </div>
        )}

        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
            isBye
              ? "bg-amber-50 border-amber-200 text-amber-400"
              : isEmpty
              ? "bg-gray-50 border-gray-200 text-gray-300"
              : isWinner
              ? "bg-red-50 border-red-200 text-[#b6252a]"
              : "bg-gray-100 border-gray-200 text-gray-500"
          }`}
        >
          {isBye ? "—" : name.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span
            className={`text-sm font-semibold ${
              isBye
                ? "text-amber-400 italic"
                : isEmpty
                ? "text-gray-300"
                : isWinner
                ? "text-gray-900 font-bold"
                : "text-gray-700"
            }`}
            title={fullName}
          >
            {isBye ? "BYE" : name}
          </span>
          {fullName && !isBye && !isEmpty && (
            <span className="text-[10px] text-gray-400 leading-tight max-w-[120px] truncate">
              {fullName}
            </span>
          )}
        </div>
      </div>
      {score !== null && (
        <div
          className={`text-lg font-bold min-w-[28px] text-right ${
            isWinner ? "text-[#b6252a]" : "text-gray-300"
          }`}
        >
          {score}
        </div>
      )}
    </div>
  );
}
