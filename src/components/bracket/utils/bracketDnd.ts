import type { BracketData, BracketMatch, MatchSlot } from "@/types/bracket";

export function findMatchById(
  bracketData: BracketData | null,
  matchId: number
): BracketMatch | null {
  if (!bracketData) return null;
  
  for (const round of bracketData.rounds) {
    for (const match of round.matches) {
      if (match.id === matchId) return match;
    }
  }
  return null;
}

export function getMatchTeamBySlot(match: BracketMatch | null, slot: MatchSlot) {
  if (!match) return null;
  return slot === "a" ? match.team_a : match.team_b;
}

export function buildTeamSwapPayload(
  targetSlot: MatchSlot,
  sourceTeamId: number | null
) {
  return {
    ...(targetSlot === "a" ? { registration_a_id: sourceTeamId } : {}),
    ...(targetSlot === "b" ? { registration_b_id: sourceTeamId } : {}),
  };
}
