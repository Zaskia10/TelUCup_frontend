"use client";

import { useState } from "react";
import { BracketMatch, MatchTeam } from "@/types/bracket";
import MatchDetailModal from "./MatchDetailModal";

interface MatchCardProps {
  match: BracketMatch;
  sportName?: string;
}

function getStatusLabel(status: BracketMatch["status"]): string {
  switch (status) {
    case "scheduled": return "TBD";
    case "live": return "LIVE";
    case "finished": return "SELESAI";
    case "bye": return "BYE";
    default: return "TBD";
  }
}

function getStatusIndicatorClass(status: BracketMatch["status"]): string {
  switch (status) {
    case "live": return "bg-red-500 animate-pulse";
    case "finished": return "bg-gray-400";
    default: return "bg-gray-300";
  }
}

function isTeamWinner(match: BracketMatch, teamScore: number | null, opponentScore: number | null): boolean {
  if (match.status === "bye") return false;
  return teamScore !== null && opponentScore !== null && teamScore > opponentScore;
}

function MatchHeader({ match }: { match: BracketMatch }) {
  const matchTitle = match.isThirdPlace ? "Juara 3" : `M${match.match_number}`;
  
  return (
    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-50 bg-gray-50/50">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusIndicatorClass(match.status)}`} />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {matchTitle}
        </span>
      </div>
      <div className="text-[10px] font-bold text-gray-400">
        {match.status === "scheduled" ? (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {match.match_time ?? getStatusLabel(match.status)}
          </span>
        ) : match.status === "live" ? (
          <span className="text-red-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            {getStatusLabel(match.status)}
          </span>
        ) : (
          getStatusLabel(match.status)
        )}
      </div>
    </div>
  );
}

function TeamRow({
  team,
  score,
  opponentScore,
  matchStatus
}: {
  team: MatchTeam | null;
  score: number | null;
  opponentScore: number | null;
  matchStatus: BracketMatch["status"];
}) {
  const isWinner = isTeamWinner({ status: matchStatus } as BracketMatch, score, opponentScore);
  const teamInitial = team ? team.contingent.name.charAt(0) : "T";
  const teamName = team?.contingent.name || "TBD";
  const scoreDisplay = matchStatus === "bye" ? "-" : score;
  
  return (
    <div className="flex items-center justify-between z-10 bg-white group hover:bg-gray-50 transition-colors p-1 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 text-xs font-bold text-gray-400">
          {teamInitial}
        </div>
        <div className="flex flex-col">
          <span className={`text-sm font-semibold ${!team ? "text-gray-400" : "text-gray-800"}`}>
            {teamName}
          </span>
          {team && (
            <span className="text-[10px] text-gray-400 leading-tight max-w-[120px] truncate">
              {teamName}
            </span>
          )}
        </div>
      </div>
      <div className={`text-lg font-bold ${isWinner ? "text-red-600" : "text-gray-400"}`}>
        {scoreDisplay}
      </div>
    </div>
  );
}

function MatchFooter({ match, onDetailClick }: { match: BracketMatch; onDetailClick: () => void }) {
  return (
    <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center mt-1">
      <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {match.match_date || "TBD"}
      </div>
      <button
        onClick={onDetailClick}
        className="text-[10px] font-bold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 uppercase tracking-wider"
      >
        Detail Pertandingan
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default function MatchCard({ match, sportName }: MatchCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const cardClass = `bg-white rounded-xl shadow-sm border w-[280px] flex flex-col overflow-hidden border-gray-100 ${match.isThirdPlace ? "third-place-match" : ""}`;

  return (
    <>
      <div className={cardClass}>
        <MatchHeader match={match} />
        
        <div className="p-3 pb-1 flex flex-col gap-1 relative">
          <div className="absolute left-6 top-7 bottom-7 w-px bg-gray-100" />
          
          <TeamRow 
            team={match.team_a} 
            score={match.score_a} 
            opponentScore={match.score_b} 
            matchStatus={match.status} 
          />
          <TeamRow 
            team={match.team_b} 
            score={match.score_b} 
            opponentScore={match.score_a} 
            matchStatus={match.status} 
          />
        </div>

        <MatchFooter match={match} onDetailClick={() => setShowDetail(true)} />
      </div>

      {showDetail && (
        <MatchDetailModal
          match={match}
          sportName={sportName}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}
