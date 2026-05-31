import AdminMatchCard from "@/components/bracket/AdminMatchCard";
import type { BracketMatch, MatchSlot } from "@/types/bracket";

interface AdminFinalRoundProps {
  round: { matches: BracketMatch[] };
  editingMatchId?: number;
  onSelect: (m: BracketMatch, isFinishMode?: boolean) => void;
  onDropTeam: (
    targetMatchId: number,
    targetSlot: MatchSlot,
    sourceMatchId: number,
    sourceSlot: MatchSlot
  ) => void;
  onStart: (matchId: number) => void;
}

export default function AdminFinalRound({
  round,
  editingMatchId,
  onSelect,
  onDropTeam,
  onStart,
}: AdminFinalRoundProps) {
  const gfMatch = round.matches.find((m) => !m.isThirdPlace);
  const tpMatch = round.matches.find((m) => m.isThirdPlace);

  return (
    <div className="flex flex-col flex-grow relative w-full pt-8 min-w-[320px]">
      <div className="flex-1 flex flex-col justify-center items-center relative">
        <div className="relative z-10 w-full flex flex-col items-center">
          {gfMatch && (
            <div className="match-wrapper relative flex flex-col items-center bg-red-50/40 border-2 border-red-100/60 rounded-[2.5rem] p-6 pt-10">
              <div className="absolute -top-4 bg-white border border-red-200 text-[#b6252a] text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-wider shadow-sm">
                Championship Arena
              </div>
              <div className="relative z-10 w-full flex justify-center">
                <AdminMatchCard
                  match={gfMatch}
                  isSelected={editingMatchId === gfMatch.id}
                  onSelect={(m) => onSelect(m, false)}
                  onDropTeam={onDropTeam}
                  onStart={onStart}
                  onFinish={(m) => onSelect(m, true)}
                />
              </div>
            </div>
          )}

          {tpMatch && (
            <div className="flex flex-col items-center mt-12">
              <div className="bg-gradient-to-r from-orange-400 to-amber-500 text-white text-[11px] font-bold px-12 py-2.5 rounded-full uppercase shadow-md mb-6 tracking-widest border border-amber-200 z-10">
                Perebutan Juara 3
              </div>
              <div className="relative">
                <AdminMatchCard
                  match={tpMatch}
                  isSelected={editingMatchId === tpMatch.id}
                  onSelect={(m) => onSelect(m, false)}
                  onDropTeam={onDropTeam}
                  onStart={onStart}
                  onFinish={(m) => onSelect(m, true)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
