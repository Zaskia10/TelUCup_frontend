import type { BracketData } from "@/types/bracket";

export function normalizeBracketData(bracket: BracketData): BracketData {
  if (!bracket || !bracket.rounds || bracket.rounds.length === 0) {
    return bracket;
  }

  // Pure function: create a deep clone of the bracket data to avoid mutating state directly
  const normalized = JSON.parse(JSON.stringify(bracket)) as BracketData;

  if (normalized.third_place_match) {
    const lastRound = normalized.rounds[normalized.rounds.length - 1];
    
    // Check if the third place match is already in the last round to prevent duplicates
    const alreadyExists = lastRound.matches.some(
      (m) => m.id === normalized.third_place_match?.id
    );

    if (!alreadyExists) {
      normalized.third_place_match.isThirdPlace = true;
      lastRound.matches.push(normalized.third_place_match);
    }
  }

  return normalized;
}
