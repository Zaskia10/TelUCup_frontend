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
      {
        id: "match-101",
        matchNumber: "MATCH#101",
        status: "SELESAI",
        date: "23 Okt",
        teamA: { id: "t1", name: "FIT Warrior", logo: "/img/fit.png", score: 78 },
        teamB: { id: "t2", name: "FRI Titans", logo: "/img/fri.png", score: 62 },
      },
      {
        id: "match-102",
        matchNumber: "MATCH#102",
        status: "SELESAI",
        date: "23 Okt",
        teamA: { id: "t3", name: "FEB Eagles", logo: "/img/feb.png", score: 82 },
        teamB: { id: "t4", name: "Bidang II", logo: "/img/bidang2.png", score: 80 },
      },
      {
        id: "match-103",
        matchNumber: "MATCH#103",
        status: "LIVE",
        date: "24 Okt",
        teamA: { id: "t5", name: "FIF Informatics", logo: "/img/fif.png", score: 24 },
        teamB: { id: "t6", name: "FIK Arts", logo: "/img/fik.png", score: 20 },
      },
      {
        id: "match-104",
        matchNumber: "MATCH#104",
        status: "SCHEDULED",
        time: "15:30",
        date: "24 Okt",
        teamA: { id: "t7", name: "FKB Comm", logo: "/img/fkb.png", score: null },
        teamB: { id: "t8", name: "REKTORAT", logo: "/img/rektorat.png", score: null },
      },
    ],
  },
  {
    id: "quarter-finals",
    name: "QUARTER FINALS",
    subtitle: "8 TEAMS",
    matches: [
      {
        id: "match-201",
        matchNumber: "MATCH#201",
        status: "SCHEDULED",
        time: "10:00",
        date: "25 Okt",
        teamA: { id: "t1", name: "FIT Warrior", logo: "/img/fit.png", score: null },
        teamB: { id: "t3", name: "FEB Eagles", logo: "/img/feb.png", score: null },
      },
      {
        id: "match-202",
        matchNumber: "MATCH#202",
        status: "SCHEDULED",
        time: "16:00",
        date: "25 Okt",
        teamA: { id: "tbd1", name: "TBD", logo: "/img/tbd.png", score: null },
        teamB: { id: "tbd2", name: "TBD", logo: "/img/tbd.png", score: null },
      },
    ],
  },
  {
    id: "semi-finals",
    name: "SEMI FINALS",
    subtitle: "4 TEAMS",
    matches: [
      {
        id: "match-301",
        matchNumber: "MATCH#301",
        status: "SCHEDULED",
        time: "09:00",
        date: "27 Okt",
        teamA: { id: "tbd3", name: "TBD", logo: "/img/tbd.png", score: null },
        teamB: { id: "tbd4", name: "TBD", logo: "/img/tbd.png", score: null },
      },
    ],
  },
  {
    id: "grand-finals",
    name: "GRAND FINALS",
    subtitle: "CHAMPIONSHIP ARENA",
    matches: [
      {
        id: "match-401",
        matchNumber: "MATCH#401",
        status: "SCHEDULED",
        time: "10:00",
        date: "30 Okt",
        teamA: { id: "tbd5", name: "TBD", logo: "/img/tbd.png", score: null },
        teamB: { id: "tbd6", name: "TBD", logo: "/img/tbd.png", score: null },
      },
    ],
  },
];
