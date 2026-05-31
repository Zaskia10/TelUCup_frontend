import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getSports,
  getBracket,
  generateBracket,
  resetBracket,
  updateMatchScore,
  updateMatchSchedule,
  setMatchTeams,
  setMatchStatus,
  getRegistrations,
} from "@/services/bracketService";
import type {
  Sport,
  SportCategory,
  Registration,
  BracketData,
  BracketMatch,
  MatchSlot,
} from "@/types/bracket";
import { useToast } from "./useToast";
import { normalizeBracketData } from "@/components/bracket/utils/bracketData";
import {
  findMatchById,
  getMatchTeamBySlot,
  buildTeamSwapPayload,
} from "@/components/bracket/utils/bracketDnd";
import { buildBracketQueryParams } from "@/components/bracket/utils/bracketQuery";
import { getErrorMessage, getErrorStatus } from "@/components/bracket/utils/error";
import type { MatchUpdates } from "@/components/bracket/MatchEditPanel";

const BRACKET_REFRESH_INTERVAL_MS = 5000;

export function useManageBracket() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  // ── Toast ──
  const { toast, showToast, hideToast } = useToast();

  // ── Selection state ──
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SportCategory | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  // ── Bracket state ──
  const [bracketData, setBracketData] = useState<BracketData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ── Modal state ──
  const [editingMatch, setEditingMatch] = useState<BracketMatch | null>(null);
  const [openInFinishMode, setOpenInFinishMode] = useState(false);

  // ── Fetchers ──
  const fetchRegistrations = async (sportId: number, categoryId?: number | null) => {
    try {
      const res = await getRegistrations(sportId, categoryId);
      const data = res.data;
      setRegistrations(Array.isArray(data) ? data : []);
    } catch {
      setRegistrations([]);
    }
  };

  const loadBracket = useCallback(async (sportId: number, categoryId?: number | null) => {
    try {
      const res = await getBracket(sportId, categoryId);
      const rawBracket = res.data as BracketData;
      setBracketData(normalizeBracketData(rawBracket));
    } catch (error: unknown) {
      const status = getErrorStatus(error);
      if (status !== 404) {
        showToast(getErrorMessage(error, "Gagal memuat data bagan"), "error");
      }
      setBracketData(null);
    }
  }, [showToast]);

  const fetchSports = useCallback(async () => {
    try {
      const res = await getSports();
      const loadedSports = res.data;
      setSports(loadedSports);

      if (!initialized.current) {
        initialized.current = true;
        const sportId = searchParams?.get("sport");
        const catId = searchParams?.get("category");

        if (sportId) {
          const s = loadedSports.find((sp) => sp.id === Number(sportId));
          if (s) {
            setSelectedSport(s);
            if (catId) {
              const c = s.categories.find((cat) => cat.id === Number(catId));
              if (c) {
                setSelectedCategory(c);
                fetchRegistrations(s.id, c.id);
              }
            } else if (s.categories.length === 0) {
              fetchRegistrations(s.id, null);
            }
          }
        }
      }
    } catch (error) {
      showToast(getErrorMessage(error, "Gagal memuat cabang olahraga"), "error");
    }
  }, [searchParams, showToast]);

  useEffect(() => {
    const init = async () => {
      await fetchSports();
    };
    init();
  }, [fetchSports]);

  // ── Auto Refresh ──
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (selectedSport && (!selectedSport.categories.length || selectedCategory)) {
      const sid = selectedSport.id;
      const cid = selectedCategory?.id;
      
      const fetchInitial = async () => {
        await loadBracket(sid, cid);
      };
      fetchInitial();

      interval = setInterval(() => {
        loadBracket(sid, cid);
      }, BRACKET_REFRESH_INTERVAL_MS);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedSport, selectedCategory, loadBracket]);

  // ── UI Handlers ──
  const updateUrlParams = (sportId?: number, categoryId?: number) => {
    const qs = buildBracketQueryParams(sportId, categoryId);
    router.replace(`${qs}`, { scroll: false });
  };

  const handleSportChange = (sport: Sport) => {
    setSelectedSport(sport);
    setSelectedCategory(null);
    setBracketData(null);
    setEditingMatch(null);

    updateUrlParams(sport.id);

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
      updateUrlParams(selectedSport.id, category.id);
      fetchRegistrations(selectedSport.id, category.id);
    } else if (selectedSport && selectedSport.categories.length === 0) {
      updateUrlParams(selectedSport.id);
      fetchRegistrations(selectedSport.id, null);
    } else {
      if (selectedSport) updateUrlParams(selectedSport.id);
      setRegistrations([]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedSport || registrations.length < 2) return;

    setIsGenerating(true);
    setEditingMatch(null);

    try {
      await generateBracket({
        sport_id: selectedSport.id,
        sport_category_id: selectedCategory?.id,
      });
      await loadBracket(selectedSport.id, selectedCategory?.id);
      showToast(
        `Bagan berhasil digenerate untuk ${registrations.length} tim!`,
        "success"
      );
    } catch (error) {
      showToast(getErrorMessage(error, "Gagal generate bagan"), "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRandomize = async () => {
    if (!selectedSport || registrations.length < 2) return;
    setEditingMatch(null);

    if (
      !confirm(
        "Ini akan menghapus seluruh jadwal dan skor saat ini. Anda yakin ingin mengacak ulang?"
      )
    )
      return;

    setIsGenerating(true);
    try {
      await resetBracket(selectedSport.id, selectedCategory?.id);
      await generateBracket({
        sport_id: selectedSport.id,
        sport_category_id: selectedCategory?.id,
      });
      await loadBracket(selectedSport.id, selectedCategory?.id);
      showToast("Posisi tim berhasil diacak ulang!", "info");
    } catch (error) {
      showToast(getErrorMessage(error, "Gagal mengacak ulang bagan"), "error");
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
      showToast(getErrorMessage(error, "Gagal reset bagan"), "error");
    }
  };

  const handleMatchSelect = (match: BracketMatch, isFinishMode = false) => {
    if (match.id === 999999) {
      showToast(
        "Pertandingan Perebutan Juara 3 tidak dapat diedit sebelum Semifinal selesai",
        "info"
      );
      return;
    }
    setOpenInFinishMode(isFinishMode);
    setEditingMatch(match);
  };

  const handleStartMatch = async (matchId: number) => {
    try {
      await setMatchStatus(matchId, { status: "live" });
      if (selectedSport) {
        await loadBracket(selectedSport.id, selectedCategory?.id);
      }
      showToast("Pertandingan dimulai!", "success");
    } catch (error) {
      showToast(getErrorMessage(error, "Gagal memulai pertandingan"), "error");
    }
  };

  const handleSaveMatch = async (matchId: number, updates: MatchUpdates) => {
    try {
      // 1. Update Schedule
      if (
        updates.matchDate !== (editingMatch?.match_date ?? "") ||
        updates.matchTime !== (editingMatch?.match_time ?? "") ||
        updates.location !== (editingMatch?.location ?? "") ||
        updates.refereeName !== (editingMatch?.referee_name ?? "") ||
        updates.notes !== (editingMatch?.notes ?? "")
      ) {
        await updateMatchSchedule(matchId, {
          match_date: updates.matchDate,
          match_time: updates.matchTime,
          location: updates.location,
          referee_name: updates.refereeName,
          notes: updates.notes,
        });
      }

      // 2. Update Teams
      const originalTeamAId = editingMatch?.team_a?.registration_id ?? null;
      const originalTeamBId = editingMatch?.team_b?.registration_id ?? null;

      if (
        updates.registrationAId !== originalTeamAId ||
        updates.registrationBId !== originalTeamBId
      ) {
        await setMatchTeams(matchId, {
          registration_a_id: updates.registrationAId,
          registration_b_id: updates.registrationBId,
        });
      }

      // 3. Update Score and Status
      if (updates.status === "finished") {
        await updateMatchScore(matchId, {
          score_a: updates.scoreA,
          score_b: updates.scoreB,
          winner_registration_id: updates.winnerId,
        });
      } else if (updates.status !== editingMatch?.status) {
        await setMatchStatus(matchId, { status: updates.status });
      }

      if (selectedSport) {
        await loadBracket(selectedSport.id, selectedCategory?.id);
      }
      setEditingMatch(null);
      showToast("Pertandingan berhasil diperbarui!", "success");
    } catch (error) {
      showToast(getErrorMessage(error, "Gagal memperbarui pertandingan"), "error");
    }
  };

  const handleDropTeam = async (
    targetMatchId: number,
    targetSlot: MatchSlot,
    sourceMatchId: number,
    sourceSlot: MatchSlot
  ) => {
    if (!bracketData) return;

    try {
      showToast("Sedang memindahkan tim...", "info");

      const srcMatch = findMatchById(bracketData, sourceMatchId);
      const tgtMatch = findMatchById(bracketData, targetMatchId);
      if (!srcMatch || !tgtMatch) return;

      const srcTeam = getMatchTeamBySlot(srcMatch, sourceSlot);
      const tgtTeam = getMatchTeamBySlot(tgtMatch, targetSlot);

      const targetPayload = buildTeamSwapPayload(targetSlot, srcTeam?.registration_id ?? null);
      const sourcePayload = buildTeamSwapPayload(sourceSlot, tgtTeam?.registration_id ?? null);

      await Promise.all([
        setMatchTeams(targetMatchId, targetPayload),
        setMatchTeams(sourceMatchId, sourcePayload),
      ]);

      if (selectedSport) {
        await loadBracket(selectedSport.id, selectedCategory?.id);
      }
      showToast("Tim berhasil dipindahkan!", "success");
    } catch (error) {
      showToast(getErrorMessage(error, "Gagal memindahkan tim"), "error");
    }
  };

  return {
    sports,
    selectedSport,
    selectedCategory,
    registrations,
    bracketData,
    isGenerating,
    editingMatch,
    openInFinishMode,
    toast,
    handleSportChange,
    handleCategoryChange,
    handleGenerate,
    handleRandomize,
    handleReset,
    handleMatchSelect,
    handleStartMatch,
    handleSaveMatch,
    handleDropTeam,
    setEditingMatch,
    hideToast,
  };
}
