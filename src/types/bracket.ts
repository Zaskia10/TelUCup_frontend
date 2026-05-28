// ─────────────────────────────────────────────────────────────
//  Types — mirror backend API shapes
// ─────────────────────────────────────────────────────────────

export interface SportCategory {
  id: number;
  name: string;
}

export interface Sport {
  id: number;
  name: string;
  icon: string | null;
  categories: SportCategory[];
}

export interface Contingent {
  id: number;
  name: string;
  abbreviation: string;
}

export interface Player {
  id: number;
  name: string;
  nim_nip: string;
  photo_path: string | null;
  checked_in?: boolean;
  checked_in_at?: string | null;
}

export interface Registration {
  id: number;
  contingent: Contingent;
  players?: Player[];
}

export interface MatchTeam {
  registration_id: number;
  contingent: Contingent;
  players?: Player[];
}

export interface BracketMatch {
  id: number;
  round: number;
  round_name: string;
  match_number: number;
  status: "scheduled" | "live" | "finished" | "bye";
  match_date: string | null;
  match_time: string | null;
  location: string | null;
  referee_name: string | null;
  notes: string | null;
  score_a: number;
  score_b: number;
  team_a: MatchTeam | null;
  team_b: MatchTeam | null;
  winner: MatchTeam | null;
  next_match_id: number | null;
  next_match_slot: "a" | "b" | null;
  isThirdPlace?: boolean; // Frontend flag
}

export interface BracketRound {
  round: number;
  name: string;
  matches: BracketMatch[];
}

export interface BracketData {
  sport: Sport;
  sport_category: SportCategory | null;
  total_rounds: number;
  rounds: BracketRound[];
}
