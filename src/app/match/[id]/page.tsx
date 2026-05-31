"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  User,
  ShieldAlert,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { getMatchDetail } from "@/services/matchService";

interface MatchPlayer {
  id: number;
  name: string;
  nim_nip: string | null;
  photo_path: string | null;
  risk_lvl: string | null;
}

interface MatchTeamData {
  registration_id: number;
  contingent: {
    id: number;
    name: string;
    image_url: string | null;
    cloudinary_public_id: string | null;
  };
  players: MatchPlayer[];
}

interface MatchDetailData {
  id: number;
  round_name: string;
  match_number: number;
  status: string;
  match_date: string | null;
  match_time: string | null;
  location: string | null;
  referee_name: string | null;
  score_a: number | null;
  score_b: number | null;
  team_a: MatchTeamData | null;
  team_b: MatchTeamData | null;
}

function getRiskBadge(level: string): string {
  const lowerLevel = level.toLowerCase();
  if (["high", "merah", "tinggi"].includes(lowerLevel)) return "bg-red-100 text-red-700 border-red-200";
  if (["medium", "kuning", "sedang"].includes(lowerLevel)) return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (["low", "hijau", "rendah"].includes(lowerLevel)) return "bg-green-100 text-green-700 border-green-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

function getStatusBadge(status: string): string {
  switch (status) {
    case "scheduled": return "bg-gray-100 text-gray-600 border-gray-200";
    case "live": return "bg-red-100 text-red-600 border-red-200 animate-pulse";
    case "finished": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default: return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

function isLowRisk(riskLvl: string): boolean {
  return ["hijau", "rendah", "low", "not_yet"].includes(riskLvl.toLowerCase());
}

function TeamLogo({ imageUrl, cloudinaryId, name }: { imageUrl?: string | null; cloudinaryId?: string | null; name: string }) {
  if (imageUrl || cloudinaryId) {
    return (
      <img
        src={imageUrl || `https://res.cloudinary.com/demo/image/upload/${cloudinaryId}`}
        alt={name}
        className="w-full h-full object-cover"
      />
    );
  }
  return <span>{name?.charAt(0) || "?"}</span>;
}

function PlayerList({ players, teamName, accentColor }: { players: MatchPlayer[]; teamName: string; accentColor: "blue" | "red" }) {
  const bgClass = accentColor === "blue" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-red-50 text-red-600 border-red-100";
  const barClass = accentColor === "blue" ? "bg-blue-500" : "bg-red-500";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 overflow-hidden">
          <div className={`w-2 h-6 ${barClass} rounded-full shrink-0`} />
          <span className="truncate" title={`Daftar Pemain ${teamName}`}>
            Daftar Pemain {teamName}
          </span>
        </h3>
        <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full shrink-0">
          {players.length} Pemain
        </span>
      </div>
      <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {players.map((player) => (
          <li key={player.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center font-bold text-sm overflow-hidden border`}>
                {player.photo_path ? (
                  <img src={player.photo_path} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  player.name?.charAt(0) || "?"
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800 flex items-center gap-2">
                  {player.name}
                </p>
                <p className="text-xs text-gray-500">{player.nim_nip}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {player.risk_lvl && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${getRiskBadge(player.risk_lvl)}`}>
                  {isLowRisk(player.risk_lvl) ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                  Risiko: {player.risk_lvl}
                </span>
              )}
            </div>
          </li>
        ))}
        {players.length === 0 && (
          <li className="p-8 text-center text-gray-500 text-sm">Tidak ada pemain terdaftar.</li>
        )}
      </ul>
    </div>
  );
}

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = Number(params.id);

  const [match, setMatch] = useState<MatchDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setIsLoading(true);
        const json = await getMatchDetail(matchId) as { status: string; data: MatchDetailData; message?: string };
        if (json.status === "success") {
          setMatch(json.data);
        } else {
          throw new Error(json.message || "Pertandingan tidak ditemukan");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Gagal mengambil data pertandingan");
      } finally {
        setIsLoading(false);
      }
    };

    if (matchId) {
      fetchMatch();
    }
  }, [matchId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <p className="text-gray-500 font-medium">Memuat detail pertandingan...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center rounded-full mx-auto mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-500 mb-6">{error || "Data tidak ditemukan"}</p>
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const teamA = match.team_a;
  const teamB = match.team_b;
  const scoreA = match.score_a ?? 0;
  const scoreB = match.score_b ?? 0;

  const formattedDate = match.match_date
    ? new Date(match.match_date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <div className="min-h-screen bg-[#f4f7f6]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-bold text-gray-800 text-lg leading-tight">Detail Pertandingan</h1>
              <p className="text-xs text-gray-500">Cabang Olahraga • {match.round_name || "Round"}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadge(match.status)}`}>
            {match.status === "live" ? "LIVE NOW" : (match.status || "TBD")}
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Match Info & Scoreboard Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 border-b border-gray-100">
            {/* Team A */}
            <div className="flex flex-col items-center flex-1 w-full max-w-[200px]">
              <div className="w-24 h-24 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-3xl font-black text-gray-400 mb-4 overflow-hidden">
                <TeamLogo
                  imageUrl={teamA?.contingent?.image_url}
                  cloudinaryId={teamA?.contingent?.cloudinary_public_id}
                  name={teamA?.contingent?.name || "?"}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800 text-center">{teamA?.contingent?.name || "TBD"}</h2>
            </div>

            {/* Score & Versus */}
            <div className="flex flex-col items-center justify-center px-4">
              <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-2 uppercase">Score</div>
              <div className="flex items-center gap-6">
                <span className={`text-5xl md:text-6xl font-black ${match.status === "scheduled" ? "text-gray-300" : "text-gray-900"}`}>
                  {match.status === "scheduled" ? "-" : scoreA}
                </span>
                <span className="text-2xl font-bold text-gray-300">VS</span>
                <span className={`text-5xl md:text-6xl font-black ${match.status === "scheduled" ? "text-gray-300" : "text-gray-900"}`}>
                  {match.status === "scheduled" ? "-" : scoreB}
                </span>
              </div>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center flex-1 w-full max-w-[200px]">
              <div className="w-24 h-24 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-3xl font-black text-gray-400 mb-4 overflow-hidden">
                <TeamLogo
                  imageUrl={teamB?.contingent?.image_url}
                  cloudinaryId={teamB?.contingent?.cloudinary_public_id}
                  name={teamB?.contingent?.name || "?"}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800 text-center">{teamB?.contingent?.name || "TBD"}</h2>
            </div>
          </div>

          {/* Match Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-white">
            <div className="p-4 flex flex-col items-center justify-center text-center">
              <Calendar className="text-gray-400 mb-2" size={20} />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tanggal</p>
              <p className="font-medium text-gray-800 mt-1">{formattedDate}</p>
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center">
              <Clock className="text-gray-400 mb-2" size={20} />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Waktu</p>
              <p className="font-medium text-gray-800 mt-1">{match.match_time || "-"}</p>
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center">
              <MapPin className="text-gray-400 mb-2" size={20} />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Lokasi</p>
              <p className="font-medium text-gray-800 mt-1 truncate w-full px-2" title={match.location || undefined}>{match.location || "-"}</p>
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center">
              <User className="text-gray-400 mb-2" size={20} />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Wasit</p>
              <p className="font-medium text-gray-800 mt-1">{match.referee_name || "TBD"}</p>
            </div>
          </div>
        </div>

        {/* Players Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PlayerList
            players={teamA?.players ?? []}
            teamName={teamA?.contingent?.name || "Tim A"}
            accentColor="blue"
          />
          <PlayerList
            players={teamB?.players ?? []}
            teamName={teamB?.contingent?.name || "Tim B"}
            accentColor="red"
          />
        </div>
      </main>
    </div>
  );
}
