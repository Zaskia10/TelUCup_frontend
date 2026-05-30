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
                    {/* The Grand Final Match */}
                    {(() => {
                      const gfMatch = round.matches.find((m) => !m.isThirdPlace);
                      if (!gfMatch) return null;
                      return (
                        <div className="match-wrapper relative flex flex-col items-center bg-red-50/40 border-2 border-red-100/60 rounded-[2.5rem] p-6 pt-10">
                          <div className="absolute -top-4 bg-white border border-red-200 text-[#b6252a] text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-wider shadow-sm">
                            Championship Arena
                          </div>
                          <div className="relative z-10 w-full flex justify-center">
                            <MatchCard match={gfMatch} />
                          </div>
                        </div>
                      );
                    })()}

                    {/* Third Place Container - Flowing naturally below GF Match */}
                    {(() => {
                       const tpMatch = round.matches.find((m) => m.isThirdPlace);
                       if (!tpMatch) return null;
                       return (
                         <div className="flex flex-col items-center mt-12">
                           <div className="bg-gradient-to-r from-orange-400 to-amber-500 text-white text-[11px] font-bold px-12 py-2.5 rounded-full uppercase shadow-md mb-6 tracking-widest border border-amber-200 z-10">
                             Perebutan Juara 3
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
