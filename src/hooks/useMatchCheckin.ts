"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getMatchCheckin,
  checkinPlayer as apiCheckinPlayer,
  undoCheckinPlayer as apiUndoCheckinPlayer,
} from "@/services/matchService";
import { setMatchStatus } from "@/services/bracketService";

export interface CheckinPlayer {
  id: number;
  name: string;
  nim_nip: string | null;
  photo_path: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
  risk_color?: "high" | "medium" | "low" | "grey";
  risk_lvl?: string;
}

export interface CheckinTeam {
  registration_id: number;
  slot: "a" | "b";
  contingent: { id: number; name: string };
  players: CheckinPlayer[];
}

export interface CheckinMatchData {
  match_id: number;
  round_name: string;
  match_number: number;
  status: string;
  team_a: CheckinTeam | null;
  team_b: CheckinTeam | null;
}

export interface ActivityLog {
  time: string;
  actor: string;
  text: string;
  isNew?: boolean;
  isPending?: boolean;
}

function nowTime(): string {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function useMatchCheckin(matchId: number | null) {
  const [matchData, setMatchData] = useState<CheckinMatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingPlayers, setLoadingPlayers] = useState<Set<number>>(new Set());
  const [isStarting, setIsStarting] = useState(false);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // ── Fetch ──
  const fetchData = useCallback(
    async (silent = false) => {
      if (!matchId) {
        setError("Tidak ada Match ID. Buka halaman ini dari panel edit pertandingan.");
        setLoading(false);
        return;
      }
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const res = await getMatchCheckin(matchId);
        setMatchData((res as { data: CheckinMatchData }).data);
        setError(null);
      } catch (e: unknown) {
        setError((e as Error).message || "Gagal memuat data pertandingan.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [matchId]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  // ── Computed ──
  const allPlayers: CheckinPlayer[] = useMemo(() => {
    if (!matchData) return [];
    return [
      ...(matchData.team_a?.players ?? []),
      ...(matchData.team_b?.players ?? []),
    ];
  }, [matchData]);

  const totalPlayers = allPlayers.length;
  const checkedInCount = allPlayers.filter((p) => p.checked_in).length;
  const notCheckedInCount = totalPlayers - checkedInCount;
  const highRiskCount = allPlayers.filter((p) => p.risk_lvl?.toLowerCase() === "high").length;
  const allCheckedIn = totalPlayers > 0 && checkedInCount === totalPlayers;

  // ── Log helper ──
  const addLog = useCallback((text: string, isPending = false) => {
    setLogs((prev) => [
      { time: nowTime(), actor: "Admin Lapangan", text, isNew: true, isPending },
      ...prev.map((l) => ({ ...l, isNew: false })),
    ]);
  }, []);

  // ── Handlers ──
  const handleCheckin = useCallback(async (player: CheckinPlayer) => {
    if (!matchId || loadingPlayers.has(player.id)) return;
    setLoadingPlayers((s) => new Set(s).add(player.id));

    const isNowCheckedIn = !player.checked_in;
    setMatchData((prev) => {
      if (!prev) return prev;
      const updateTeam = (team: CheckinTeam | null): CheckinTeam | null => {
        if (!team) return null;
        return {
          ...team,
          players: team.players.map((p) =>
            p.id === player.id
              ? { ...p, checked_in: isNowCheckedIn, checked_in_at: new Date().toISOString() }
              : p
          ),
        };
      };
      return { ...prev, team_a: updateTeam(prev.team_a), team_b: updateTeam(prev.team_b) };
    });

    try {
      if (player.checked_in) {
        await apiUndoCheckinPlayer(matchId, player.id);
        addLog(`Check-in dibatalkan: ${player.name}`);
      } else {
        await apiCheckinPlayer(matchId, player.id);
        addLog(`Check-in lapangan: ${player.name}`);
      }
    } catch (e: unknown) {
      addLog(`Gagal: ${(e as Error).message}`, true);
      setMatchData((prev) => {
        if (!prev) return prev;
        const updateTeam = (team: CheckinTeam | null): CheckinTeam | null => {
          if (!team) return null;
          return {
            ...team,
            players: team.players.map((p) =>
              p.id === player.id
                ? { ...p, checked_in: player.checked_in, checked_in_at: player.checked_in_at }
                : p
            ),
          };
        };
        return { ...prev, team_a: updateTeam(prev.team_a), team_b: updateTeam(prev.team_b) };
      });
    } finally {
      setLoadingPlayers((s) => {
        const next = new Set(s);
        next.delete(player.id);
        return next;
      });
    }
  }, [matchId, loadingPlayers, addLog]);

  const handleCheckinAll = useCallback(async (team: CheckinTeam) => {
    if (!matchId) return;
    const notIn = team.players.filter((p) => !p.checked_in);
    if (!notIn.length) return;

    setLoadingPlayers(new Set(notIn.map((p) => p.id)));
    addLog(`Memproses check-in semua pemain ${team.contingent.name}...`);

    setMatchData((prev) => {
      if (!prev) return prev;
      const isTeamA = prev.team_a?.registration_id === team.registration_id;
      const updateTeam = (t: CheckinTeam | null): CheckinTeam | null => {
        if (!t) return null;
        return {
          ...t,
          players: t.players.map((p) => ({
            ...p,
            checked_in: true,
            checked_in_at: p.checked_in_at || new Date().toISOString(),
          })),
        };
      };
      return {
        ...prev,
        team_a: isTeamA ? updateTeam(prev.team_a) : prev.team_a,
        team_b: !isTeamA ? updateTeam(prev.team_b) : prev.team_b,
      };
    });

    const results = await Promise.allSettled(
      notIn.map((p) => apiCheckinPlayer(matchId, p.id))
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    addLog(`${successCount}/${notIn.length} pemain berhasil check-in (${team.contingent.name})`);

    setLoadingPlayers(new Set());

    if (successCount !== notIn.length) {
      await fetchData(true);
    }
  }, [matchId, addLog, fetchData]);

  const handleStartMatch = useCallback(async (onSuccess?: () => void) => {
    if (!matchId || !allCheckedIn || isStarting) return;
    setIsStarting(true);
    addLog("Memulai pertandingan...", true);
    try {
      await setMatchStatus(matchId, { status: "live" });
      addLog("Pertandingan dimulai!");
      setMatchData((prev) => (prev ? { ...prev, status: "live" } : prev));
      onSuccess?.();
    } catch (e: unknown) {
      addLog(`Gagal memulai: ${(e as Error).message}`, true);
    } finally {
      setIsStarting(false);
    }
  }, [matchId, allCheckedIn, isStarting, addLog]);

  return {
    matchData,
    loading,
    refreshing,
    error,
    loadingPlayers,
    isStarting,
    logs,
    allPlayers,
    totalPlayers,
    checkedInCount,
    notCheckedInCount,
    highRiskCount,
    allCheckedIn,
    fetchData,
    handleCheckin,
    handleCheckinAll,
    handleStartMatch,
  };
}
