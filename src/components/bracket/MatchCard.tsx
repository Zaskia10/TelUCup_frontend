"use client";

import { Match } from "@/data/mockBracket";
import Image from "next/image";

export default function MatchCard({ match }: { match: Match }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border w-[280px] flex flex-col overflow-hidden border-gray-100 ${match.isThirdPlace ? "third-place-match" : ""}`}>
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          <div
            className={`w-2 h-2 rounded-full ${
              match.status === "LIVE"
                ? "bg-red-500 animate-pulse"
                : match.status === "SELESAI"
                ? "bg-gray-400"
                : "bg-gray-300"
            }`}
          />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {match.isThirdPlace ? "Juara 3" : match.matchNumber}
          </span>
        </div>
        <div className="text-[10px] font-bold text-gray-400">
          {match.status === "SCHEDULED" ? (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {match.time}
            </span>
          ) : match.status === "LIVE" ? (
            <span className="text-red-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
              LIVE
            </span>
          ) : (
            "SELESAI"
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="p-3 pb-1 flex flex-col gap-1 relative">
        {/* Connector Line (Vertical line connecting the two teams if we want, but usually it's just a separator) */}
        <div className="absolute left-6 top-7 bottom-7 w-px bg-gray-100" />
        
        {/* Team A */}
        <div className="flex items-center justify-between z-10 bg-white group hover:bg-gray-50 transition-colors p-1 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              {match.teamA?.logo ? (
                <div className="w-full h-full relative">
                  {/* Placeholder icon if image missing */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100 text-xs font-bold">
                    {match.teamA.name.charAt(0)}
                  </div>
                </div>
              ) : (
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
              )}
            </div>
            <span className={`text-sm font-semibold ${match.teamA?.name === "TBD" ? "text-gray-400" : "text-gray-800"}`}>
              {match.teamA?.name || "TBD"}
            </span>
          </div>
          <div className={`text-lg font-bold ${
            match.teamA?.score && match.teamB?.score && match.teamA.score > match.teamB.score
              ? "text-red-600"
              : "text-gray-400"
          }`}>
            {match.teamA?.score ?? "-"}
          </div>
        </div>

        {/* Team B */}
        <div className="flex items-center justify-between z-10 bg-white group hover:bg-gray-50 transition-colors p-1 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              {match.teamB?.logo ? (
                <div className="w-full h-full relative">
                  {/* Placeholder icon if image missing */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100 text-xs font-bold">
                    {match.teamB.name.charAt(0)}
                  </div>
                </div>
              ) : (
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
              )}
            </div>
            <span className={`text-sm font-semibold ${match.teamB?.name === "TBD" ? "text-gray-400" : "text-gray-800"}`}>
              {match.teamB?.name || "TBD"}
            </span>
          </div>
          <div className={`text-lg font-bold ${
            match.teamB?.score && match.teamA?.score && match.teamB.score > match.teamA.score
              ? "text-red-600"
              : "text-gray-400"
          }`}>
            {match.teamB?.score ?? "-"}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center mt-1">
        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {match.date}
        </div>
        <button className="text-[10px] font-bold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 uppercase tracking-wider">
          Detail Pertandingan
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
