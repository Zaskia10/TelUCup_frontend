"use client";

import { BracketData, BracketRound } from "@/types/bracket";
import MatchCard from "./MatchCard";
import "./bracket.css";

const COLUMN_MIN_HEIGHT = 600;

function RoundHeader({ round, isLastRound }: { round: BracketRound; isLastRound: boolean }) {
  const headerClass = isLastRound
    ? "bg-[#b6252a] text-white border-[#b6252a]"
    : "bg-white text-gray-800 border-gray-200";

  return (
    <div className="absolute -top-16 left-0 w-full flex flex-col items-center justify-center">
      <div className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border ${headerClass}`}>
        {isLastRound && <span className="mr-1">🏆</span>}
        {round.name}
      </div>
      <div className="text-[10px] text-gray-500 font-bold mt-1 tracking-wider uppercase">
        {round.matches.length} MATCH
      </div>
    </div>
  );
}

function FinalRound({ round, sportName }: { round: BracketRound; sportName?: string }) {
  const finalMatch = round.matches.find((m) => !m.isThirdPlace);
  const thirdPlaceMatch = round.matches.find((m) => m.isThirdPlace);

  return (
    <div className="flex flex-col flex-grow relative w-full pt-8 min-w-[320px]">
      <div className="flex-1 flex flex-col justify-center items-center relative">
        <div className="relative z-10 w-full flex flex-col items-center">
          {finalMatch && (
            <div className="match-wrapper relative flex flex-col items-center bg-red-50/40 border-2 border-red-100/60 rounded-[2.5rem] p-6 pt-10">
              <div className="absolute -top-4 bg-white border border-red-200 text-[#b6252a] text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-wider shadow-sm">
                Championship Arena
              </div>
              <div className="relative z-10 w-full flex justify-center">
                <MatchCard match={finalMatch} sportName={sportName} />
              </div>
            </div>
          )}

          {thirdPlaceMatch && (
            <div className="flex flex-col items-center mt-12">
              <div className="bg-gradient-to-r from-orange-400 to-amber-500 text-white text-[11px] font-bold px-12 py-2.5 rounded-full uppercase shadow-md mb-6 tracking-widest border border-amber-200 z-10">
                Perebutan Juara 3
              </div>
              <div className="relative">
                <MatchCard match={thirdPlaceMatch} sportName={sportName} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NormalRound({ round, sportName }: { round: BracketRound; sportName?: string }) {
  return (
    <div className="flex flex-col flex-grow py-4">
      {round.matches.map((match, matchIndex) => {
        const connectorClass = matchIndex % 2 === 0 ? "connect-down" : "connect-up";
        return (
          <div
            key={match.id}
            className={`match-wrapper relative flex-1 py-4 px-2 ${connectorClass}`}
          >
            <MatchCard match={match} sportName={sportName} />
          </div>
        );
      })}
    </div>
  );
}

export default function TournamentBracket({ bracketData }: { bracketData: BracketData }) {
  if (!bracketData || !bracketData.rounds) return null;

  const totalRounds = bracketData.rounds.length;

  return (
    <div className="w-full overflow-x-auto pb-[20rem] pt-24">
      <div className="flex flex-nowrap items-stretch gap-12 min-w-max px-4">
        {bracketData.rounds.map((round, roundIndex) => {
          const isLastRound = roundIndex === totalRounds - 1;

          return (
            <div
              key={round.round}
              className="bracket-column flex flex-col relative"
              style={{ minHeight: `${COLUMN_MIN_HEIGHT}px` }}
            >
              <RoundHeader round={round} isLastRound={isLastRound} />
              
              {isLastRound ? (
                <FinalRound round={round} sportName={bracketData.sport?.name} />
              ) : (
                <NormalRound round={round} sportName={bracketData.sport?.name} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
