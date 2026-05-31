"use client";

import type { BracketData } from "@/types/bracket";

export default function ChampionsBanner({ bracketData }: { bracketData: BracketData }) {
  if (!bracketData?.rounds?.length) return null;

  const lastRound = bracketData.rounds[bracketData.rounds.length - 1];
  const grandFinal = lastRound?.matches?.find((m) => !m.isThirdPlace);
  const thirdPlace = lastRound?.matches?.find((m) => m.isThirdPlace)
    ?? bracketData.third_place_match;


  if (!grandFinal || grandFinal.status !== "finished" || !grandFinal.winner) {
    return null;
  }

  const juara1 = grandFinal.winner;
  const juara2 =
    grandFinal.winner.registration_id === grandFinal.team_a?.registration_id
      ? grandFinal.team_b
      : grandFinal.team_a;
  const juara3 =
    thirdPlace?.status === "finished" && thirdPlace.winner
      ? thirdPlace.winner
      : null;

  const podium = [
    {
      rank: 1,
      label: "🥇 Juara 1",
      team: juara1,
      bg: "from-yellow-400 to-amber-500",
      border: "border-yellow-300",
      text: "text-yellow-900",
      size: "text-lg",
      shadow: "shadow-yellow-200",
    },
    {
      rank: 2,
      label: "🥈 Juara 2",
      team: juara2,
      bg: "from-gray-300 to-gray-400",
      border: "border-gray-300",
      text: "text-gray-800",
      size: "text-base",
      shadow: "shadow-gray-200",
    },
    {
      rank: 3,
      label: "🥉 Juara 3",
      team: juara3,
      bg: "from-orange-300 to-amber-400",
      border: "border-orange-200",
      text: "text-orange-900",
      size: "text-base",
      shadow: "shadow-orange-100",
    },
  ];

  return (
    <div className="mb-8 bg-gradient-to-r from-[#b6252a]/5 via-amber-50 to-[#b6252a]/5 border border-amber-100 rounded-2xl p-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="text-center mb-5">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">
          🏆 Hasil Akhir Turnamen
        </h2>
        <p className="text-xs text-gray-400 font-medium mt-1">
          {bracketData.sport?.name ?? ""}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {podium.map(({ rank, label, team, bg, border, text, size, shadow }) => (
          <div
            key={rank}
            className={`flex flex-col items-center gap-2 bg-gradient-to-b ${bg} border ${border} rounded-2xl px-6 py-4 shadow-lg ${shadow} min-w-[140px]`}
          >
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${text} opacity-70`}>
              {label}
            </span>
            {team ? (
              <>
                <div className={`w-14 h-14 rounded-full bg-white/60 flex items-center justify-center text-2xl font-black ${text}`}>
                  {(team.contingent.abbreviation ?? team.contingent.name).charAt(0)}
                </div>
                <div className="text-center">
                  <p className={`font-extrabold ${text} ${size} leading-tight`}>
                    {team.contingent.abbreviation ?? team.contingent.name}
                  </p>
                  <p className={`text-[10px] ${text} opacity-70 font-medium max-w-[120px] truncate`}>
                    {team.contingent.name}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className={`w-14 h-14 rounded-full bg-white/40 flex items-center justify-center text-2xl font-black ${text} opacity-40`}>
                  —
                </div>
                <p className={`text-sm font-bold ${text} opacity-40`}>Menunggu</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
