"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

export interface DashboardStats {
  totalKontingen: number;
  timMenunggu: number;
  pertandinganHariIni: number;
  redFlags: number;
}

export interface ContingentSummary {
  id: number;
  name: string;
  pic: string;
  players: number;
}

export interface DashboardMatch {
  id: number;
  sport: string;
  round: string;
  status: string;
  date: string | null;
  time: string | null;
  location: string | null;
  teamA: {
    name: string;
    score: number | null;
    logoUrl: string | null;
    cloudinaryId: string | null;
  };
  teamB: {
    name: string;
    score: number | null;
    logoUrl: string | null;
    cloudinaryId: string | null;
  };
}

interface RiskSummaryItem {
  high_risk_count?: number;
}

interface ContingentApiItem {
  id: number;
  name: string;
  pic?: { name: string };
  players_count?: number;
}

interface RegistrationApiItem {
  status: string;
}

interface MatchApiItem {
  id: number;
  sport?: { name: string };
  round_name?: string;
  status: string;
  match_date: string | null;
  match_time: string | null;
  location: string | null;
  score_a: number | null;
  score_b: number | null;
  team_a?: {
    contingent_name: string;
    image_url: string | null;
    cloudinary_public_id: string | null;
  };
  team_b?: {
    contingent_name: string;
    image_url: string | null;
    cloudinary_public_id: string | null;
  };
}

export function usePanitiaDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalKontingen: 0,
    timMenunggu: 0,
    pertandinganHariIni: 0,
    redFlags: 0,
  });
  const [matches, setMatches] = useState<DashboardMatch[]>([]);
  const [contingents, setContingents] = useState<ContingentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        let totalRedFlags = 0;
        let contingentsList: ContingentSummary[] = [];
        let waitingVerification = 0;
        let mappedMatches: DashboardMatch[] = [];

        // 1. Fetch Summary Risk
        try {
          const riskData = await apiClient.get<RiskSummaryItem[]>("/self-assessment/summary/contingent");
          if (Array.isArray(riskData)) {
            totalRedFlags = riskData.reduce((acc, curr) => acc + (curr.high_risk_count || 0), 0);
          }
        } catch {
          // Risk summary may not be available — non-critical
        }

        // 2. Fetch Contingents
        try {
          const contDataJson = await apiClient.get<{ data: ContingentApiItem[] }>("/contingents");
          const contingentsData = contDataJson.data || [];
          contingentsList = contingentsData.map((c) => ({
            id: c.id,
            name: c.name,
            pic: c.pic?.name || "Tidak ada PIC",
            players: c.players_count || 0,
          }));
        } catch {
          // Non-critical
        }

        // 3. Fetch Registrations (for waiting count)
        try {
          const regDataJson = await apiClient.get<{ data: { data: RegistrationApiItem[] } }>("/registrations");
          const regs = regDataJson.data?.data || [];
          waitingVerification = regs.filter((r) => r.status === "draft").length;
        } catch {
          // Non-critical
        }

        // 4. Fetch Today's Matches
        try {
          const today = new Date().toISOString().split("T")[0];
          const resJson = await apiClient.get<{ data: MatchApiItem[] }>("/matches", { date: today });
          const schedules = resJson.data || [];
          mappedMatches = schedules.map((sch) => ({
            id: sch.id,
            sport: sch.sport?.name || "Cabang Olahraga",
            round: sch.round_name || "Round",
            status: sch.status,
            date: sch.match_date,
            time: sch.match_time,
            location: sch.location,
            teamA: {
              name: sch.team_a?.contingent_name || "TBD",
              score: sch.score_a,
              logoUrl: sch.team_a?.image_url || null,
              cloudinaryId: sch.team_a?.cloudinary_public_id || null,
            },
            teamB: {
              name: sch.team_b?.contingent_name || "TBD",
              score: sch.score_b,
              logoUrl: sch.team_b?.image_url || null,
              cloudinaryId: sch.team_b?.cloudinary_public_id || null,
            },
          }));
        } catch {
          // Non-critical
        }

        setStats({
          totalKontingen: contingentsList.length,
          timMenunggu: waitingVerification,
          pertandinganHariIni: mappedMatches.length,
          redFlags: totalRedFlags,
        });
        setContingents(contingentsList);
        setMatches(mappedMatches);
      } catch {
        // Outer catch — should never reach here since inner calls are guarded
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { stats, matches, contingents, isLoading };
}
