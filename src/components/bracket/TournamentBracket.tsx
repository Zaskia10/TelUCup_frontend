"use client";

import { BracketData } from "@/types/bracket";
import MatchCard from "./MatchCard";
import "./bracket.css";

export default function TournamentBracket({ bracketData }: { bracketData: BracketData }) {
  if (!bracketData || !bracketData.rounds) return null;

  return (
    <div className="w-full overflow-x-auto pb-[20rem] pt-24">
      <div className="flex flex-nowrap items-stretch gap-12 min-w-max px-4">
        {bracketData.rounds.map((round, roundIndex) => (
          <div key={round.round} className="bracket-column flex flex-col relative" style={{ minHeight: '600px' }}>
            
            {/* Round Header */}
            <div className="absolute -top-16 left-0 w-full flex flex-col items-center justify-center">
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border ${
                roundIndex === bracketData.rounds.length - 1 
                  ? "bg-[#b6252a] text-white border-[#b6252a]" 
                  : "bg-white text-gray-800 border-gray-200"
              }`}>
                {roundIndex === bracketData.rounds.length - 1 && (
                  <span className="mr-1">🏆</span>
                )}
                {round.name}
              </div>
              <div className="text-[10px] text-gray-500 font-bold mt-1 tracking-wider uppercase">
                {round.matches.length} MATCH
              </div>
            </div>

            {/* Render Match Cards based on Round */}
            {roundIndex === bracketData.rounds.length - 1 ? (
              <div className="flex flex-col flex-grow relative w-full pt-8 min-w-[320px]">
                {/* Grand Final Container */}
                <div className="flex-1 flex flex-col justify-center items-center relative">
                  {/* The Grand Final Match Wrapper - Centered */}
                  <div className="relative z-10 w-full flex flex-col items-center">
                    {/* Championship Arena Box */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[320px] bg-red-50/40 border-2 border-red-100/60 rounded-[2.5rem] -z-10 flex flex-col items-center justify-between pt-6 pb-6 mt-[-20px]">
                      <div className="bg-white border border-red-200 text-[#b6252a] text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-wider shadow-sm">
                        Championship Arena
                      </div>
                      <div className="flex items-end gap-4 opacity-30 mt-auto">
                        <svg className="w-6 h-6 text-[#b6252a]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l-1 4h-4l3 3-1 4 3-2 3 2-1-4 3-3h-4z" />
                        </svg>
                        <svg className="w-10 h-10 text-[#b6252a]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l-1 4h-4l3 3-1 4 3-2 3 2-1-4 3-3h-4z" />
                        </svg>
                        <svg className="w-6 h-6 text-[#b6252a]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l-1 4h-4l3 3-1 4 3-2 3 2-1-4 3-3h-4z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* The Grand Final Match */}
                    {(() => {
                      const gfMatch = round.matches.find((m) => !m.isThirdPlace);
                      if (!gfMatch) return null;
                      return (
                        <div className="match-wrapper relative z-10 w-full flex justify-center mt-[-40px]">
                          <MatchCard match={gfMatch} />
                        </div>
                      );
                    })()}

                    {/* Third Place Container - Hung absolutely below GF Match */}
                    {(() => {
                       const tpMatch = round.matches.find((m) => m.isThirdPlace);
                       if (!tpMatch) return null;
                       return (
                         <div className="absolute top-full left-1/2 -translate-x-1/2 mt-[60px] flex flex-col items-center">
                           <div className="bg-[#b6252a] text-white text-[11px] font-bold px-12 py-2.5 rounded-full uppercase shadow-md mb-6 relative z-10 tracking-widest">
                             Juara 3
                           </div>
                           <div className="relative">
                             <MatchCard match={tpMatch} />
                           </div>
                         </div>
                       );
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-grow py-4">
                {round.matches.map((match, matchIndex) => {
                  const isLastRound = roundIndex === bracketData.rounds.length - 1;
                  let connectorClass = "";
                  if (!isLastRound) {
                    connectorClass = matchIndex % 2 === 0 ? "connect-down" : "connect-up";
                  }

                  return (
                    <div 
                      key={match.id} 
                      className={`match-wrapper relative flex-1 py-4 px-2 ${connectorClass}`}
                    >
                      <MatchCard match={match} />
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
