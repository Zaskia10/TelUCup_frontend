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
  icon: string;
  categories: SportCategory[];
}

export interface Contingent {
  id: number;
  name: string;
  abbreviation: string;
}

export interface Registration {
  id: number;
  contingent: Contingent;
}

export interface AdminMatch {
  id: string;
  round: number;
  roundName: string;
  matchNumber: number;
  status: "scheduled" | "live" | "finished" | "bye";
  matchDate: string | null;
  matchTime: string | null;
  location: string | null;
  refereeName: string | null;
  notes: string | null;
  scoreA: number;
  scoreB: number;
  teamA: { registrationId: number; contingent: Contingent } | null;
  teamB: { registrationId: number; contingent: Contingent } | null;
  winner: { registrationId: number; contingent: Contingent } | null;
  nextMatchId: string | null;
  nextMatchSlot: "a" | "b" | null;
  isThirdPlace?: boolean;
}

export interface AdminRound {
  round: number;
  name: string;
  matches: AdminMatch[];
}

export interface BracketData {
  sport: Sport;
  sportCategory: SportCategory | null;
  totalRounds: number;
  rounds: AdminRound[];
}

// ─────────────────────────────────────────────────────────────
//  Mock Sports
// ─────────────────────────────────────────────────────────────

export const mockSports: Sport[] = [
  {
    id: 1,
    name: "Bola Basket",
    icon: "🏀",
    categories: [
      { id: 1, name: "Putra" },
      { id: 2, name: "Putri" },
    ],
  },
  {
    id: 2,
    name: "Futsal",
    icon: "⚽",
    categories: [
      { id: 3, name: "Putra" },
      { id: 4, name: "Putri" },
    ],
  },
  {
    id: 3,
    name: "Bulu Tangkis",
    icon: "🏸",
    categories: [
      { id: 5, name: "Tunggal Putra" },
      { id: 6, name: "Tunggal Putri" },
      { id: 7, name: "Ganda Putra" },
      { id: 8, name: "Ganda Putri" },
      { id: 9, name: "Ganda Campuran" },
    ],
  },
  {
    id: 4,
    name: "Voli",
    icon: "🏐",
    categories: [
      { id: 10, name: "Putra" },
      { id: 11, name: "Putri" },
    ],
  },
  {
    id: 5,
    name: "Tenis Meja",
    icon: "🏓",
    categories: [
      { id: 12, name: "Tunggal Putra" },
      { id: 13, name: "Tunggal Putri" },
    ],
  },
  {
    id: 6,
    name: "E-Sport Mobile Legends",
    icon: "🎮",
    categories: [],
  },
];

// ─────────────────────────────────────────────────────────────
//  Mock Contingents (Fakultas / Unit)
// ─────────────────────────────────────────────────────────────

export const mockContingents: Contingent[] = [
  { id: 1, name: "Fakultas Informatika", abbreviation: "FIF" },
  { id: 2, name: "Fakultas Teknik Elektro", abbreviation: "FTE" },
  { id: 3, name: "Fakultas Rekayasa Industri", abbreviation: "FRI" },
  { id: 4, name: "Fakultas Ekonomi & Bisnis", abbreviation: "FEB" },
  { id: 5, name: "Fakultas Industri Kreatif", abbreviation: "FIK" },
  { id: 6, name: "Fakultas Komunikasi & Bisnis", abbreviation: "FKB" },
  { id: 7, name: "Fakultas Ilmu Terapan", abbreviation: "FIT" },
  { id: 8, name: "Bidang II Kemahasiswaan", abbreviation: "BID-II" },
  { id: 9, name: "Rektorat", abbreviation: "REKT" },
  { id: 10, name: "Fakultas Sains & Farmasi", abbreviation: "FSF" },
];

// ─────────────────────────────────────────────────────────────
//  Mock Registrations (verified teams per sport/category)
// ─────────────────────────────────────────────────────────────

export function getMockRegistrations(
  sportId: number,
  categoryId: number | null
): Registration[] {
  // Simulate: different sports have different numbers of verified teams
  const teamCounts: Record<string, number> = {
    "1-1": 8, // Basket Putra
    "1-2": 6, // Basket Putri
    "2-3": 10, // Futsal Putra
    "2-4": 6, // Futsal Putri
    "3-5": 8, // Bulutangkis Tunggal Putra
    "3-6": 4, // Bulutangkis Tunggal Putri
    "3-7": 6, // Bulutangkis Ganda Putra
    "3-8": 4, // Bulutangkis Ganda Putri
    "3-9": 4, // Bulutangkis Ganda Campuran
    "4-10": 8, // Voli Putra
    "4-11": 6, // Voli Putri
    "5-12": 8, // Tenis Meja Tunggal Putra
    "5-13": 6, // Tenis Meja Tunggal Putri
    "6-null": 8, // E-Sport ML
  };

  const key = `${sportId}-${categoryId ?? "null"}`;
  const count = teamCounts[key] || 8;

  return mockContingents.slice(0, count).map((c, i) => ({
    id: i + 1 + sportId * 100,
    contingent: c,
  }));
}

// ─────────────────────────────────────────────────────────────
//  Bracket Builder (Single Elimination) — client-side mock
// ─────────────────────────────────────────────────────────────

function roundLabels(totalRounds: number): Record<number, string> {
  const labels: Record<number, string> = {};
  for (let r = 1; r <= totalRounds; r++) {
    const fromEnd = totalRounds - r;
    if (fromEnd === 0) {
      labels[r] = "Final";
    } else if (fromEnd === 1) {
      labels[r] = "Semifinal";
    } else {
      labels[r] = `Round ${r}`;
    }
  }
  return labels;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

let matchIdCounter = 1000;

export function generateMockBracket(
  sport: Sport,
  category: SportCategory | null,
  registrations: Registration[]
): BracketData {
  const shuffled = shuffleArray(registrations);
  const n = shuffled.length;
  const totalRounds = Math.ceil(Math.log2(n));
  const bracketSize = Math.pow(2, totalRounds);
  const byeCount = bracketSize - n;
  const labels = roundLabels(totalRounds);

  // Build slots for round 1
  const slots: (Registration | null)[] = [];
  let teamIdx = 0;
  let byeGiven = 0;

  for (let m = 0; m < bracketSize / 2; m++) {
    slots.push(shuffled[teamIdx++]); // slot A
    if (byeGiven < byeCount) {
      slots.push(null); // slot B = bye
      byeGiven++;
    } else {
      slots.push(shuffled[teamIdx++]); // slot B
    }
  }

  const rounds: AdminRound[] = [];
  let prevRoundMatches: AdminMatch[] = [];

  for (let round = 1; round <= totalRounds; round++) {
    const matchesInRound = bracketSize / Math.pow(2, round);
    const currentMatches: AdminMatch[] = [];

    for (let mi = 0; mi < matchesInRound; mi++) {
      const matchId = `mock-${++matchIdCounter}`;

      if (round === 1) {
        const regA = slots[mi * 2];
        const regB = slots[mi * 2 + 1];
        const isBye = !regA || !regB;
        let winner = null;

        if (isBye && (regA || regB)) {
          const w = regA ?? regB!;
          winner = { registrationId: w.id, contingent: w.contingent };
        }

        currentMatches.push({
          id: matchId,
          round,
          roundName: labels[round],
          matchNumber: mi + 1,
          status: isBye ? "bye" : "scheduled",
          matchDate: null,
          matchTime: null,
          location: null,
          refereeName: null,
          notes: null,
          scoreA: 0,
          scoreB: 0,
          teamA: regA
            ? { registrationId: regA.id, contingent: regA.contingent }
            : null,
          teamB: regB
            ? { registrationId: regB.id, contingent: regB.contingent }
            : null,
          winner,
          nextMatchId: null,
          nextMatchSlot: null,
        });
      } else {
        // Later rounds: empty slots, linked from prev round
        const prevA = prevRoundMatches[mi * 2] ?? null;
        const prevB = prevRoundMatches[mi * 2 + 1] ?? null;

        let teamA = null;
        let teamB = null;

        // Auto-advance bye winners
        if (prevA?.winner) {
          teamA = prevA.winner;
        }
        if (prevB?.winner) {
          teamB = prevB.winner;
        }

        // Check if this also becomes a bye
        const isChainedBye =
          (teamA && !teamB) || (!teamA && teamB);
        let winner = null;
        if (isChainedBye) {
          const w = teamA ?? teamB!;
          winner = { registrationId: w.registrationId, contingent: w.contingent };
        }

        const match: AdminMatch = {
          id: matchId,
          round,
          roundName: labels[round],
          matchNumber: mi + 1,
          status: isChainedBye ? "bye" : "scheduled",
          matchDate: null,
          matchTime: null,
          location: null,
          refereeName: null,
          notes: null,
          scoreA: 0,
          scoreB: 0,
          teamA: teamA
            ? { registrationId: teamA.registrationId, contingent: teamA.contingent }
            : null,
          teamB: teamB
            ? { registrationId: teamB.registrationId, contingent: teamB.contingent }
            : null,
          winner,
          nextMatchId: null,
          nextMatchSlot: null,
        };

        currentMatches.push(match);

        // Link prev matches
        if (prevA) prevA.nextMatchId = matchId;
        if (prevA) prevA.nextMatchSlot = "a";
        if (prevB) prevB.nextMatchId = matchId;
        if (prevB) prevB.nextMatchSlot = "b";
      }
    }

    rounds.push({
      round,
      name: labels[round],
      matches: currentMatches,
    });

    prevRoundMatches = currentMatches;
  }

  // ── 3rd Place Match (Perebutan Juara 3) ──
  if (totalRounds > 1) {
    const finalRound = rounds[rounds.length - 1];
    const sfMatches = rounds[rounds.length - 2].matches;
    const thirdPlaceMatchId = `mock-${++matchIdCounter}`;

    const thirdPlaceMatch: AdminMatch = {
      id: thirdPlaceMatchId,
      round: totalRounds,
      roundName: "Perebutan Juara 3",
      matchNumber: finalRound.matches.length + 1,
      status: "scheduled",
      matchDate: null,
      matchTime: null,
      location: null,
      refereeName: null,
      notes: null,
      scoreA: 0,
      scoreB: 0,
      teamA: null,
      teamB: null,
      winner: null,
      nextMatchId: null,
      nextMatchSlot: null,
      isThirdPlace: true,
    };

    finalRound.matches.push(thirdPlaceMatch);
  }

  return {
    sport,
    sportCategory: category,
    totalRounds,
    rounds,
  };
}
