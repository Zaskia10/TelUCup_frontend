export interface Team {
  id: string;
  name: string;
  logo: string;
  score?: number | null;
}

export interface Match {
  id: string;
  matchNumber: string;
  status: "SELESAI" | "LIVE" | "SCHEDULED";
  time?: string;
  date?: string;
  teamA: Team | null;
  teamB: Team | null;
  isThirdPlace?: boolean;
}

export interface Round {
  id: string;
  name: string;
  subtitle: string;
  matches: Match[];
}

export const mockTournamentData: Round[] = [
  {
    id: "round-1",
    name: "ROUND 1",
    subtitle: "16 TEAMS",
    matches: [
      { id: "match-101", matchNumber: "MATCH#101", status: "SELESAI", date: "23 Okt", teamA: { id: "t1", name: "FIT Warrior", logo: "/img/fit.png", score: 78 }, teamB: { id: "t2", name: "FRI Titans", logo: "/img/fri.png", score: 62 } },
      { id: "match-102", matchNumber: "MATCH#102", status: "SELESAI", date: "23 Okt", teamA: { id: "t3", name: "FEB Eagles", logo: "/img/feb.png", score: 82 }, teamB: { id: "t4", name: "FKB Comm", logo: "/img/fkb.png", score: 80 } },
      { id: "match-103", matchNumber: "MATCH#103", status: "SELESAI", date: "23 Okt", teamA: { id: "t5", name: "FIF Informatics", logo: "/img/fif.png", score: 90 }, teamB: { id: "t6", name: "FIK Arts", logo: "/img/fik.png", score: 85 } },
      { id: "match-104", matchNumber: "MATCH#104", status: "SELESAI", date: "23 Okt", teamA: { id: "t7", name: "FTE Electro", logo: "/img/fte.png", score: 70 }, teamB: { id: "t8", name: "REKTORAT", logo: "/img/rektorat.png", score: 68 } },
      { id: "match-105", matchNumber: "MATCH#105", status: "SELESAI", date: "24 Okt", teamA: { id: "t9", name: "Tel-U Knights", logo: "", score: 60 }, teamB: { id: "t10", name: "Bidang II", logo: "/img/bidang2.png", score: 72 } },
      { id: "match-106", matchNumber: "MATCH#106", status: "SELESAI", date: "24 Okt", teamA: { id: "t11", name: "Vokasi", logo: "", score: 80 }, teamB: { id: "t12", name: "D3 Tech", logo: "", score: 75 } },
      { id: "match-107", matchNumber: "MATCH#107", status: "SELESAI", date: "24 Okt", teamA: { id: "t13", name: "Himatika", logo: "", score: 88 }, teamB: { id: "t14", name: "HMTI", logo: "", score: 92 } },
      { id: "match-108", matchNumber: "MATCH#108", status: "SELESAI", date: "24 Okt", teamA: { id: "t15", name: "HMS", logo: "", score: 100 }, teamB: { id: "t16", name: "HMBTI", logo: "", score: 98 } },
    ],
  },
  {
    id: "quarter-finals",
    name: "QUARTER FINALS",
    subtitle: "8 TEAMS",
    matches: [
      { id: "match-201", matchNumber: "MATCH#201", status: "LIVE", time: "10:00", date: "25 Okt", teamA: { id: "t1", name: "FIT Warrior", logo: "/img/fit.png", score: 45 }, teamB: { id: "t3", name: "FEB Eagles", logo: "/img/feb.png", score: 42 } },
      { id: "match-202", matchNumber: "MATCH#202", status: "SCHEDULED", time: "13:00", date: "25 Okt", teamA: { id: "t5", name: "FIF Informatics", logo: "/img/fif.png", score: null }, teamB: { id: "t7", name: "FTE Electro", logo: "/img/fte.png", score: null } },
      { id: "match-203", matchNumber: "MATCH#203", status: "SCHEDULED", time: "16:00", date: "25 Okt", teamA: { id: "t10", name: "Bidang II", logo: "/img/bidang2.png", score: null }, teamB: { id: "t14", name: "HMTI", logo: "", score: null } },
      { id: "match-204", matchNumber: "MATCH#204", status: "SCHEDULED", time: "19:00", date: "25 Okt", teamA: { id: "t12", name: "D3 Tech", logo: "", score: null }, teamB: { id: "t15", name: "HMS", logo: "", score: null } },
    ],
  },
  {
    id: "semi-finals",
    name: "SEMI FINALS",
    subtitle: "4 TEAMS",
    matches: [
      { id: "match-301", matchNumber: "MATCH#301", status: "SCHEDULED", time: "09:00", date: "27 Okt", teamA: { id: "tbd1", name: "TBD", logo: "/img/tbd.png", score: null }, teamB: { id: "tbd2", name: "TBD", logo: "/img/tbd.png", score: null } },
      { id: "match-302", matchNumber: "MATCH#302", status: "SCHEDULED", time: "13:00", date: "27 Okt", teamA: { id: "tbd3", name: "TBD", logo: "/img/tbd.png", score: null }, teamB: { id: "tbd4", name: "TBD", logo: "/img/tbd.png", score: null } },
    ],
  },
  {
    id: "grand-finals",
    name: "GRAND FINALS",
    subtitle: "CHAMPIONSHIP ARENA",
    matches: [
      { id: "match-401", matchNumber: "MATCH#401", status: "SCHEDULED", time: "10:00", date: "30 Okt", teamA: { id: "tbd5", name: "TBD", logo: "/img/tbd.png", score: null }, teamB: { id: "tbd6", name: "TBD", logo: "/img/tbd.png", score: null } },
      { id: "match-402", matchNumber: "JUARA 3", status: "SCHEDULED", time: "08:00", date: "30 Okt", teamA: { id: "tbd7", name: "TBD", logo: "/img/tbd.png", score: null }, teamB: { id: "tbd8", name: "TBD", logo: "/img/tbd.png", score: null }, isThirdPlace: true },
    ],
  },
];
