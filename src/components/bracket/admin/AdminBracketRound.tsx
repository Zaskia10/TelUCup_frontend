import AdminMatchCard from "@/components/bracket/AdminMatchCard";
import type { BracketMatch, MatchSlot } from "@/types/bracket";

interface AdminBracketRoundProps {
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

export default function AdminBracketRound({
  round,
  editingMatchId,
  onSelect,
  onDropTeam,
  onStart,
}: AdminBracketRoundProps) {
  return (
    <div className="flex flex-col flex-grow py-4">
      {round.matches.map((match, matchIndex) => {
        const connectorClass =
          matchIndex % 2 === 0 ? "connect-down" : "connect-up";

        return (
          <div
            key={match.id}
            className={`match-wrapper relative flex-1 py-4 px-2 ${connectorClass}`}
          >
            <AdminMatchCard
              match={match}
              isSelected={editingMatchId === match.id}
              onSelect={(m) => onSelect(m, false)}
              onDropTeam={onDropTeam}
              onStart={onStart}
              onFinish={(m) => onSelect(m, true)}
            />
          </div>
        );
      })}
    </div>
  );
}
