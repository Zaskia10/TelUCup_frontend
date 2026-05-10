"use client";

import { mockTournamentData } from "@/data/mockBracket";
import MatchCard from "./MatchCard";
import "./bracket.css";

export default function TournamentBracket() {
  return (
    <div className="w-full overflow-x-auto pb-8 pt-4">
      <div className="flex flex-nowrap items-center gap-12 min-w-max px-4">
        {mockTournamentData.map((round, roundIndex) => (
          <div key={round.id} className="flex flex-col relative" style={{ minHeight: '600px' }}>
            
            {/* Round Header */}
            <div className="absolute -top-16 left-0 w-full flex flex-col items-center justify-center">
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border ${
                roundIndex === mockTournamentData.length - 1 
                  ? "bg-[#b6252a] text-white border-[#b6252a]" 
                  : "bg-white text-gray-800 border-gray-200"
              }`}>
                {roundIndex === mockTournamentData.length - 1 && (
                  <span className="mr-1">🏆</span>
                )}
                {round.name}
              </div>
              <div className="text-[10px] text-gray-500 font-bold mt-1 tracking-wider">
                {round.subtitle}
              </div>
            </div>

            {/* Special Championship Arena Box for Grand Finals */}
            {roundIndex === mockTournamentData.length - 1 && (
              <div className="absolute inset-y-12 -inset-x-8 bg-red-50/50 border-2 border-red-100 rounded-3xl -z-10 shadow-inner flex flex-col items-center justify-end pb-8">
                <div className="flex items-end gap-4 opacity-20">
                   {/* Trophy decorative icons */}
                   <svg className="w-8 h-8 text-[#b6252a]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l-1 4h-4l3 3-1 4 3-2 3 2-1-4 3-3h-4z"/></svg>
                   <svg className="w-12 h-12 text-[#b6252a]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l-1 4h-4l3 3-1 4 3-2 3 2-1-4 3-3h-4z"/></svg>
                   <svg className="w-8 h-8 text-[#b6252a]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l-1 4h-4l3 3-1 4 3-2 3 2-1-4 3-3h-4z"/></svg>
                </div>
              </div>
            )}

            {/* Match Cards Container */}
            <div className="flex flex-col justify-around flex-grow py-12">
              {round.matches.map((match, matchIndex) => {
                // Determine connection classes
                const isLastRound = roundIndex === mockTournamentData.length - 1;
                const isFirstRound = roundIndex === 0;
                
                // For a standard 16 -> 8 -> 4 -> 2 bracket, 
                // pair connections happen every 2 matches.
                let connectorClass = "";
                if (!isLastRound) {
                  connectorClass = matchIndex % 2 === 0 ? "connect-down" : "connect-up";
                }

                return (
                  <div 
                    key={match.id} 
                    className={`match-wrapper relative my-4 ${connectorClass}`}
                  >
                    <MatchCard match={match} />
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
