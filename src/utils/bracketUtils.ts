import { BracketData } from "@/types/bracket";

export function normalizeBracketData(data: BracketData): BracketData {
  if (!data || !data.rounds || data.rounds.length === 0) {
    return data;
  }

  const newData = { ...data };
  newData.rounds = data.rounds.map(round => ({
    ...round,
    matches: round.matches.map(match => ({ ...match }))
  }));

  if (newData.third_place_match) {
    const thirdPlaceMatch = { 
      ...newData.third_place_match, 
      isThirdPlace: true 
    };
    newData.third_place_match = thirdPlaceMatch;

    const lastRoundIndex = newData.rounds.length - 1;
    newData.rounds[lastRoundIndex].matches.push(thirdPlaceMatch);
  }

  return newData;
}
