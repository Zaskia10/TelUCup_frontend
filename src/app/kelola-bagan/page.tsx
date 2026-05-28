"use client";

import { useState, useCallback, useEffect } from "react";
import AdminBracketFilter from "@/components/bracket/AdminBracketFilter";
import AdminMatchCard from "@/components/bracket/AdminMatchCard";
import MatchEditModal from "@/components/bracket/MatchEditPanel";
import type { MatchUpdates } from "@/components/bracket/MatchEditPanel";
import {
  getSports,
  getBracket,
  generateBracket,
  resetBracket,
  updateMatchScore,
  updateMatchSchedule,
  setMatchTeams,
  swapMatchTeams,
  setMatchStatus,
  getRegistrations
} from "@/services/bracketService";
import type {
  Sport,
  SportCategory,
  Registration,
  BracketData,
  BracketMatch,
} from "@/types/bracket";
import "@/components/bracket/bracket.css";

export default function KelolaBaganPage() {
  // ── Selection state ──
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<SportCategory | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  // ── Bracket state ──
  const [bracketData, setBracketData] = useState<BracketData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ── Modal state ──
  const [editingMatch, setEditingMatch] = useState<BracketMatch | null>(null);

  // ── Toast state ──
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const res = await getSports();
      setSports(res.data);
    } catch (error) {
      showToast("Gagal memuat cabang olahraga", "error");
    }
  };

  const fetchRegistrations = async (sportId: number, categoryId?: number | null) => {
    try {
      const res = await getRegistrations(sportId, categoryId);
      setRegistrations(res.data.data || res.data); // Adjust based on actual API pagination
    } catch (error) {
      console.error("Gagal memuat tim terdaftar", error);
      setRegistrations([]);
    }
  };

  const loadBracket = async () => {
    if (!selectedSport) return;
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
      if (error?.status !== 404) {
        showToast("Gagal memuat data bagan", "error");
      }
      setBracketData(null);
    }
  };

  // ── Handlers ──

  const handleSportChange = (sport: Sport) => {
    setSelectedSport(sport);
    setSelectedCategory(null);
    setBracketData(null);
    setEditingMatch(null);

    if (sport.categories.length === 0) {
      fetchRegistrations(sport.id, null);
    } else {
      setRegistrations([]);
    }
  };

  const handleCategoryChange = (category: SportCategory | null) => {
    setSelectedCategory(category);
    setBracketData(null);
    setEditingMatch(null);

    if (selectedSport && category) {
      fetchRegistrations(selectedSport.id, category.id);
    } else if (selectedSport && selectedSport.categories.length === 0) {
      fetchRegistrations(selectedSport.id, null);
    } else {
      setRegistrations([]);
    }
  };

  useEffect(() => {
    if (selectedSport && (!selectedSport.categories.length || selectedCategory)) {
      loadBracket();
    }
  }, [selectedSport, selectedCategory]);

  const handleGenerate = async () => {
    if (!selectedSport || registrations.length < 2) return;

    setIsGenerating(true);
    setEditingMatch(null);

    try {
      await generateBracket({
        sport_id: selectedSport.id,
        sport_category_id: selectedCategory?.id
      });
      await loadBracket();
      showToast(
        `Bagan berhasil digenerate untuk ${registrations.length} tim!`,
        "success"
      );
    } catch (error: any) {
      showToast(error.message || "Gagal generate bagan", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRandomize = async () => {
    if (!selectedSport || registrations.length < 2) return;
    setEditingMatch(null);

    if (!confirm("Ini akan menghapus seluruh jadwal dan skor saat ini. Anda yakin ingin mengacak ulang?")) return;

    setIsGenerating(true);
    try {
      await resetBracket(selectedSport.id, selectedCategory?.id);
      await generateBracket({
        sport_id: selectedSport.id,
        sport_category_id: selectedCategory?.id
      });
      await loadBracket();
      showToast("Posisi tim berhasil diacak ulang!", "info");
    } catch (error: any) {
      showToast("Gagal mengacak ulang bagan", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = async () => {
    if (!selectedSport) return;
    if (!confirm("Bagan akan dihapus permanen. Anda yakin?")) return;

    try {
      await resetBracket(selectedSport.id, selectedCategory?.id);
      setBracketData(null);
      setEditingMatch(null);
      showToast("Bagan berhasil dihapus.", "info");
    } catch (error) {
      showToast("Gagal reset bagan", "error");
    }
  };

  const handleMatchSelect = (match: BracketMatch) => {
    // Cannot edit the dummy 3rd place match via API yet
    if (match.id === 999999) {
      showToast("Pertandingan Perebutan Juara 3 tidak dapat diedit sebelum Semifinal selesai", "info");
      return;
    }
    setEditingMatch(match);
  };

  const handleSwap = async (matchId: number) => {
    try {
      await swapMatchTeams(matchId);
      await loadBracket();
      showToast("Posisi tim A dan B berhasil ditukar.", "success");
    } catch (error) {
      showToast("Gagal menukar posisi tim", "error");
    }
  };

  const handleSaveMatch = async (matchId: number, updates: MatchUpdates) => {
    try {
      // 1. Update Schedule & Info
      await updateMatchSchedule(matchId, {
        match_date: updates.matchDate,
        match_time: updates.matchTime,
        location: updates.location,
        referee_name: updates.refereeName,
        notes: updates.notes
      });

      // 2. Update Teams
      await setMatchTeams(matchId, {
        registration_a_id: updates.registrationAId,
        registration_b_id: updates.registrationBId
      });

      // 3. Update Status
      await setMatchStatus(matchId, { status: updates.status });

      // 4. Update Score
      await updateMatchScore(matchId, {
        score_a: updates.scoreA,
        score_b: updates.scoreB,
        winner_registration_id: updates.winnerId
      });

      await loadBracket();
      setEditingMatch(null);
      showToast("Pertandingan berhasil diperbarui!", "success");
    } catch (error: any) {
      showToast(error.message || "Gagal memperbarui pertandingan", "error");
    }
  };

  // ── Drag & Drop handler ──
  const handleDropTeam = async (
    targetMatchId: number,
    targetSlot: "a" | "b",
    sourceMatchId: number,
    sourceSlot: "a" | "b"
  ) => {
    if (!bracketData) return;

    // Reject drop to/from the dummy 3rd place match
    if (targetMatchId === 999999 || sourceMatchId === 999999) {
      showToast("Tidak bisa memindahkan tim pada perebutan juara 3 secara manual", "error");
      return;
    }

    try {
      // Very naive implementation of drag & drop. Ideally backend should have a /swap-slots endpoint.
      // For now, we update the teams of target and source match via API.
      // We will need to re-fetch the bracket.
      
      const findMatch = (data: BracketData, matchId: number): BracketMatch | null => {
        for (const round of data.rounds) {
          for (const m of round.matches) {
            if (m.id === matchId) return m;
          }
        }
        return null;
      };

      const srcMatch = findMatch(bracketData, sourceMatchId);
      const tgtMatch = findMatch(bracketData, targetMatchId);
      if (!srcMatch || !tgtMatch) return;

      const srcTeam = sourceSlot === "a" ? srcMatch.team_a : srcMatch.team_b;
      const tgtTeam = targetSlot === "a" ? tgtMatch.team_a : tgtMatch.team_b;

      // Swap teams
      await setMatchTeams(targetMatchId, {
        registration_a_id: targetSlot === "a" ? srcTeam?.registration_id : tgtMatch.team_a?.registration_id,
        registration_b_id: targetSlot === "b" ? srcTeam?.registration_id : tgtMatch.team_b?.registration_id
      });

      await setMatchTeams(sourceMatchId, {
        registration_a_id: sourceSlot === "a" ? tgtTeam?.registration_id : srcMatch.team_a?.registration_id,
        registration_b_id: sourceSlot === "b" ? tgtTeam?.registration_id : srcMatch.team_b?.registration_id
      });

      await loadBracket();
      showToast("Tim berhasil dipindahkan!", "success");
    } catch (error) {
      showToast("Gagal memindahkan tim", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#fffafa]">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b6252a] text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Panitia Only
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              🏆 Sistem Gugur
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Kelola <span className="text-[#b6252a]">Bagan Pertandingan</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-2 max-w-2xl">
            Generate, acak posisi, dan kelola bagan pertandingan sistem gugur.
            Pilih cabang olahraga, generate bagan, lalu klik pertandingan untuk
            mengedit detail. Drag & drop tim untuk memindahkan posisi antar
            pertandingan.
          </p>
        </div>

        {/* Filter / Config Panel */}
        <AdminBracketFilter
          sports={sports}
          selectedSport={selectedSport}
          onSportChange={handleSportChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          registrations={registrations}
          hasBracket={bracketData !== null}
          onGenerate={handleGenerate}
          onRandomize={handleRandomize}
          onReset={handleReset}
          isGenerating={isGenerating}
        />

        {/* Instruction steps if no bracket yet */}
        {!bracketData && selectedSport && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="max-w-lg mx-auto">
              <h3 className="text-sm font-bold text-gray-900 mb-4 text-center">
                Alur Pembuatan Bagan
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    text: "Pilih cabang olahraga & sub-kategori",
                    done:
                      selectedSport !== null &&
                      (selectedSport.categories.length === 0 ||
                        selectedCategory !== null),
                  },
                  {
                    step: 2,
                    text: `Pastikan minimal 2 tim terverifikasi (saat ini: ${registrations.length} tim)`,
                    done: registrations.length >= 2,
                  },
                  {
                    step: 3,
                    text: 'Klik tombol "Generate Bagan" untuk membuat struktur bagan',
                    done: false,
                  },
                  {
                    step: 4,
                    text: "Gunakan Randomize untuk mengacak posisi tim jika diperlukan",
                    done: false,
                  },
                  {
                    step: 5,
                    text: "Klik pada pertandingan untuk mengedit atau drag & drop tim antar card",
                    done: false,
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        item.done
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {item.done ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        item.step
                      )}
                    </div>
                    <p
                      className={`text-sm font-medium pt-1 ${
                        item.done ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!bracketData && !selectedSport && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Belum Ada Bagan
            </h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Pilih cabang olahraga di atas untuk mulai membuat bagan
              pertandingan.
            </p>
          </div>
        )}

        {/* Bracket View */}
        {bracketData && (
          <div>
            {/* Legend + drag hint */}
            <div className="flex flex-wrap justify-start items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" /> LIVE
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-300" />{" "}
                SCHEDULED
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
                FINISHED
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> BYE
              </div>
              <div className="w-px h-4 bg-gray-200 mx-1" />
              <div className="flex items-center gap-1.5 text-[#b6252a] bg-red-50 px-3 py-1 rounded-full border border-red-100">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                KLIK UNTUK EDIT
              </div>
              <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9" cy="6" r="1.5" />
                  <circle cx="15" cy="6" r="1.5" />
                  <circle cx="9" cy="12" r="1.5" />
                  <circle cx="15" cy="12" r="1.5" />
                </svg>
                DRAG & DROP TIM
              </div>
            </div>

            {/* Bracket Container */}
            <div className="w-full overflow-x-auto pb-[20rem] pt-24">
              <div className="flex flex-nowrap items-stretch gap-12 min-w-max px-4">
                {bracketData.rounds.map((round, roundIndex) => (
                  <div
                    key={round.round}
                    className="bracket-column flex flex-col relative"
                    style={{ minHeight: "600px" }}
                  >
                    {/* Round Header */}
                    <div className="absolute -top-16 left-0 w-full flex flex-col items-center justify-center">
                      <div
                        className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border ${
                          roundIndex === bracketData.rounds.length - 1
                            ? "bg-[#b6252a] text-white border-[#b6252a]"
                            : "bg-white text-gray-800 border-gray-200"
                        }`}
                      >
                        {roundIndex === bracketData.rounds.length - 1 && (
                          <span className="mr-1">🏆</span>
                        )}
                        {round.name}
                      </div>
                      <div className="text-[10px] text-gray-500 font-bold mt-1 tracking-wider">
                        {round.matches.filter(m => !m.isThirdPlace).length} MATCH
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
                                Championship Arena
                              </div>
                              <div className="flex items-end gap-4 opacity-30 mt-auto">
                                <svg className="w-6 h-6 text-[#b6252a]" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l-1 4h-4l3 3-1 4 3-2 3 2-1-4 3-3h-4z" />
                                </svg>
                                <svg className="w-10 h-10 text-[#b6252a]" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l-1 4h-4l3 3-1 4 3-2 3 2-1-4 3-3h-4z" />
                                </svg>
                                <svg className="w-6 h-6 text-[#b6252a]" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l-1 4h-4l3 3-1 4 3-2 3 2-1-4 3-3h-4z" />
                                </svg>
                              </div>
                            </div>
                            
                            {/* The Grand Final Match */}
                            {(() => {
                              const gfMatch = round.matches.find((m) => !m.isThirdPlace);
                              if (!gfMatch) return null;
                              return (
                                <div className="match-wrapper relative z-10 w-full flex justify-center mt-[-40px]">
                                  <AdminMatchCard
                                    match={gfMatch}
                                    isSelected={editingMatch?.id === gfMatch.id}
                                    onSelect={handleMatchSelect}
                                    onDropTeam={handleDropTeam}
                                  />
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
                                     <AdminMatchCard
                                       match={tpMatch}
                                       isSelected={editingMatch?.id === tpMatch.id}
                                       onSelect={handleMatchSelect}
                                       onDropTeam={handleDropTeam}
                                     />
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
                              <AdminMatchCard
                                match={match}
                                isSelected={editingMatch?.id === match.id}
                                onSelect={handleMatchSelect}
                                onDropTeam={handleDropTeam}
                              />
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
      </main>

      {/* ── Edit Modal ── */}
      {editingMatch && (
        <MatchEditModal
          key={editingMatch.id}
          match={editingMatch}
          registrations={registrations}
          onClose={() => setEditingMatch(null)}
          onSave={handleSaveMatch}
          onSwap={handleSwap}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl shadow-lg border text-sm font-bold flex items-center gap-3 animate-[slideUp_0.3s_ease-out] ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : toast.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          {toast.type === "success" ? (
            <svg
              className="w-5 h-5 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : toast.type === "info" ? (
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
