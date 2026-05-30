"use client";

import { useState, useCallback, useEffect } from "react";
import BracketFilter from "@/components/bracket/BracketFilter";
import MatchCard from "@/components/bracket/MatchCard";
import ReusableMatchCard from "@/components/match/MatchCard";
import Link from "next/link";
import {
  getSports,
  getBracket,
} from "@/services/bracketService";
import { getMyMatches } from "@/services/matchService";
import type {
  Sport,
  SportCategory,
  BracketData,
  BracketMatch,
} from "@/types/bracket";
import "@/components/bracket/bracket.css";
import { Trophy, CalendarDays, ExternalLink, ListFilter } from "lucide-react";

export default function PICKontingenJadwalPage() {
  // ── Selection state ──
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<SportCategory | null>(null);

  // ── Bracket state ──
  const [bracketData, setBracketData] = useState<BracketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ── All Matches state ──
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  useEffect(() => {
    fetchSports();
    fetchAllMatches();
  }, []);

  const fetchSports = async () => {
    try {
      const res = await getSports();
      setSports(res.data);
    } catch (error) {
      console.error("Gagal memuat cabang olahraga", error);
    }
  };

  const fetchAllMatches = async () => {
    setIsLoadingMatches(true);
    try {
      const res = await getMyMatches();
      const matchesData = res.data || [];
      setAllMatches(matchesData.map((m: any) => ({
        id: m.id,
        sport: "Cabang Olahraga", // Placeholder, since sport_id is numeric. Could map from sports array if available.
        round: m.round_name || "Round",
        status: m.status,
        date: m.match_date,
        time: m.match_time,
        location: m.location,
        teamA: {
          name: m.team_a?.contingent?.name || "TBD",
          score: m.score_a,
          logoUrl: m.team_a?.contingent?.image_url,
          cloudinaryId: m.team_a?.contingent?.cloudinary_public_id,
        },
        teamB: {
          name: m.team_b?.contingent?.name || "TBD",
          score: m.score_b,
          logoUrl: m.team_b?.contingent?.image_url,
          cloudinaryId: m.team_b?.contingent?.cloudinary_public_id,
        }
      })));
    } catch (error) {
      console.error("Gagal memuat pertandingan", error);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  const loadBracket = async () => {
    if (!selectedSport) return;
    setIsLoading(true);
    try {
      const res = await getBracket(selectedSport.id, selectedCategory?.id);
      
      // Inject dummy "Perebutan Juara 3" match to the frontend if not returned by backend
      const bracket: BracketData = res.data;
      if (bracket && bracket.rounds && bracket.rounds.length > 0) {
        const lastRound = bracket.rounds[bracket.rounds.length - 1];
        if (!lastRound.matches.some((m) => m.isThirdPlace)) {
          // Find grand final match to get its info
          const gfMatch = lastRound.matches[0];
          // Determine 3rd place teams from semifinals (round before last)
          const semiFinals = bracket.rounds.length >= 2 ? bracket.rounds[bracket.rounds.length - 2] : null;
          let team3A = null;
          let team3B = null;

          if (semiFinals && semiFinals.matches.length >= 2) {
            const sf1 = semiFinals.matches[0];
            const sf2 = semiFinals.matches[1];
            
            if (sf1.status === 'finished' && sf1.winner && sf1.team_a && sf1.team_b) {
              team3A = sf1.winner.registration_id === sf1.team_a.registration_id ? sf1.team_b : sf1.team_a;
            }
            if (sf2.status === 'finished' && sf2.winner && sf2.team_a && sf2.team_b) {
              team3B = sf2.winner.registration_id === sf2.team_a.registration_id ? sf2.team_b : sf2.team_a;
            }
          }

          lastRound.matches.push({
            id: 999999, // Fake ID for 3rd place match
            round: lastRound.round,
            round_name: "Juara 3",
            match_number: lastRound.matches.length + 1,
            status: "scheduled",
            match_date: null,
            match_time: null,
            location: null,
            referee_name: null,
            notes: null,
            score_a: 0,
            score_b: 0,
            team_a: team3A,
            team_b: team3B,
            winner: null,
            next_match_id: null,
            next_match_slot: null,
            isThirdPlace: true,
          } as BracketMatch);
        }
      }
      
      setBracketData(bracket);
    } catch (error: any) {
      setBracketData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Handlers ──
  const handleSportChange = (sport: Sport | null) => {
    setSelectedSport(sport);
    setSelectedCategory(null);
    setBracketData(null);
  };

  const handleCategoryChange = (category: SportCategory | null) => {
    setSelectedCategory(category);
    setBracketData(null);
  };

  const handleSearch = () => {
    if (selectedSport && (!selectedSport.categories.length || selectedCategory)) {
      loadBracket();
    }
  };

  // To allow clicking on a match to see details (not edit)
  const renderMatchCard = (match: BracketMatch) => {
    return (
      <Link href={`/match/${match.id}`} className="block transition-transform hover:scale-[1.02]">
         <MatchCard match={match} />
      </Link>
    );
  };

  return (
    <div className="space-y-8 pb-10 max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarDays className="text-[#b71c1c]" size={24} />
          Jadwal & Pertandingan
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pantau jadwal pertandingan, skor, dan bagan turnamen dari cabang olahraga yang diikuti.
        </p>
      </div>

      {/* Daftar Semua Pertandingan */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
          <ListFilter className="text-[#b71c1c]" size={20} />
          Semua Pertandingan Kontingen
        </h2>
        
        {isLoadingMatches ? (
          <div className="flex justify-center p-8 bg-white border border-gray-100 rounded-xl shadow-sm">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b71c1c]"></div>
          </div>
        ) : allMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMatches.map((match) => (
              <ReusableMatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
            Tidak ada jadwal pertandingan untuk kontingen ini.
          </div>
        )}
      </div>

      <div className="h-px bg-gray-200 w-full my-4"></div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
          <Trophy className="text-[#b71c1c]" size={20} />
          Bagan Turnamen
        </h2>

        {/* Filter / Config Panel */}
        <BracketFilter
          sports={sports}
          selectedSport={selectedSport}
          onSportChange={handleSportChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
        />

        {/* Empty state */}
        {!bracketData && !isLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
              <Trophy className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Belum Ada Data Bagan
            </h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Silakan pilih cabang olahraga dan klik cari untuk melihat jadwal pertandingan dan bagan turnamen.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#b71c1c] mb-4"></div>
            <p className="text-gray-500">Memuat bagan pertandingan...</p>
          </div>
        )}

        {/* Bracket View */}
        {bracketData && !isLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
            {/* Legend */}
            <div className="flex flex-wrap justify-start items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-300" /> SCHEDULED
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> FINISHED
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> BYE
              </div>
              <div className="w-px h-4 bg-gray-200 mx-1" />
              <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <ExternalLink size={12} />
                KLIK CARD UNTUK DETAIL TIM
              </div>
            </div>

            {/* Bracket Container */}
            <div className="w-full overflow-x-auto pb-[10rem] pt-12 no-scrollbar">
              <div className="flex flex-nowrap items-stretch gap-12 min-w-max px-4">
                {bracketData.rounds.map((round, roundIndex) => (
                  <div
                    key={round.round}
                    className="bracket-column flex flex-col relative"
                    style={{ minHeight: "500px" }}
                  >
                    {/* Round Header */}
                    <div className="absolute -top-10 left-0 w-full flex flex-col items-center justify-center">
                      <div
                        className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border ${
                          roundIndex === bracketData.rounds.length - 1
                            ? "bg-[#b6252a] text-white border-[#b6252a]"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                      >
                        {roundIndex === bracketData.rounds.length - 1 && (
                          <span className="mr-1">🏆</span>
                        )}
                        {round.name}
                      </div>
                    </div>

                    {/* Render Match Cards based on Round */}
                    {roundIndex === bracketData.rounds.length - 1 ? (
                      <div className="flex flex-col flex-grow relative w-full pt-8 min-w-[320px]">
                        {/* Grand Final Container */}
                        <div className="flex-1 flex flex-col justify-center items-center relative">
                          {/* The Grand Final Match Wrapper - Centered */}
                          <div className="relative z-10 w-full flex flex-col items-center">
                            {/* Championship Arena Box */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[320px] bg-red-50/40 border-2 border-red-100/60 rounded-[2.5rem] -z-10 flex flex-col items-center justify-between pt-6 pb-6 mt-[-20px]">
                              <div className="bg-white border border-red-200 text-[#b6252a] text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-wider shadow-sm">
                                Grand Final
                              </div>
                            </div>
                            
                            {/* The Grand Final Match */}
                            {(() => {
                              const gfMatch = round.matches.find((m) => !m.isThirdPlace);
                              if (!gfMatch) return null;
                              return (
                                <div className="match-wrapper relative z-10 w-full flex justify-center mt-[-40px]">
                                  {renderMatchCard(gfMatch)}
                                </div>
                              );
                            })()}

                            {/* Third Place Container - Hung absolutely below GF Match */}
                            {(() => {
                              const tpMatch = round.matches.find((m) => m.isThirdPlace);
                              if (!tpMatch) return null;
                              return (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-[60px] flex flex-col items-center">
                                  <div className="bg-[#b6252a] text-white text-[11px] font-bold px-12 py-2.5 rounded-full uppercase shadow-md mb-6 relative z-10 tracking-widest">
                                    Juara 3
                                  </div>
                                  <div className="relative">
                                    {renderMatchCard(tpMatch)}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col flex-grow py-4">
                        {round.matches.map((match, matchIndex) => {
                          const connectorClass =
                            matchIndex % 2 === 0
                              ? "connect-down"
                              : "connect-up";

                          return (
                            <div
                              key={match.id}
                              className={`match-wrapper relative flex-1 py-4 px-2 ${connectorClass}`}
                            >
                              {renderMatchCard(match)}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
