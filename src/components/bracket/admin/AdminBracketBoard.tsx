import type { BracketData, BracketMatch, MatchSlot } from "@/types/bracket";
import ChampionsBanner from "@/components/bracket/ChampionsBanner";
import AdminBracketLegend from "./AdminBracketLegend";
import AdminBracketRound from "./AdminBracketRound";
import AdminFinalRound from "./AdminFinalRound";

interface AdminBracketBoardProps {
  bracketData: BracketData;
  editingMatchId?: number;
  onMatchSelect: (match: BracketMatch, isFinishMode?: boolean) => void;
  onDropTeam: (
    targetMatchId: number,
    targetSlot: MatchSlot,
    sourceMatchId: number,
    sourceSlot: MatchSlot
  ) => void;
  onStartMatch: (matchId: number) => void;
}

export default function AdminBracketBoard({
  bracketData,
  editingMatchId,
  onMatchSelect,
  onDropTeam,
  onStartMatch,
}: AdminBracketBoardProps) {
  return (
    <div>
      <ChampionsBanner bracketData={bracketData} />
      <AdminBracketLegend />

      <div className="w-full overflow-x-auto pb-[20rem] pt-24">
        <div className="flex flex-nowrap items-stretch gap-12 min-w-max px-4">
          {bracketData.rounds.map((round, roundIndex) => (
            <div
              key={round.round}
              className="bracket-column flex flex-col relative"
              style={{ minHeight: "600px" }}
            >
              <div className="absolute -top-16 left-0 w-full flex flex-col items-center justify-center">
                <div
                  className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border ${
                    roundIndex === bracketData.rounds.length - 1
                      ? "bg-[#b6252a] text-white border-[#b6252a]"
                      : "bg-white text-gray-800 border-gray-200"
                  }`}
                >
                  {roundIndex === bracketData.rounds.length - 1 && (
                    <span className="mr-1">🏆</span>
                  )}
                  {round.name}
                </div>
                <div className="text-[10px] text-gray-500 font-bold mt-1 tracking-wider">
                  {round.matches.filter((m) => !m.isThirdPlace).length} MATCH
                </div>
              </div>

              {roundIndex === bracketData.rounds.length - 1 ? (
                <AdminFinalRound
                  round={round}
                  editingMatchId={editingMatchId}
                  onSelect={onMatchSelect}
                  onDropTeam={onDropTeam}
                  onStart={onStartMatch}
                />
              ) : (
                <AdminBracketRound
                  round={round}
                  editingMatchId={editingMatchId}
                  onSelect={onMatchSelect}
                  onDropTeam={onDropTeam}
                  onStart={onStartMatch}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
