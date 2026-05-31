import { apiClient } from "@/lib/apiClient";

export const getSports = async () => {
  return apiClient.get<{ data: import("@/types/bracket").Sport[] }>("/sports");
};

export const getBracket = async (sportId: number, categoryId?: number | null) => {
  return apiClient.get<{ data: unknown }>("/bracket", {
    sport_id: sportId,
    ...(categoryId ? { sport_category_id: categoryId } : {}),
  });
};

export const generateBracket = async (payload: { sport_id: number; sport_category_id?: number | null }) => {
  return apiClient.post<{ data: unknown }>("/bracket/generate", payload);
};

export const resetBracket = async (sportId: number, categoryId?: number | null) => {
  return apiClient.del("/bracket/reset", {
    sport_id: sportId,
    ...(categoryId ? { sport_category_id: categoryId } : {}),
  });
};

export const updateMatchScore = async (
  id: number | string,
  payload: { score_a: number; score_b: number; winner_registration_id?: number | null; notes?: string },
) => {
  return apiClient.patch(`/matches/${id}/score`, payload);
};

export const updateMatchSchedule = async (
  id: number | string,
  payload: {
    match_date?: string | null;
    match_time?: string | null;
    location?: string | null;
    referee_name?: string | null;
    notes?: string | null;
  },
) => {
  return apiClient.patch(`/matches/${id}/schedule`, payload);
};

export const setMatchTeams = async (
  id: number | string,
  payload: { registration_a_id?: number | null; registration_b_id?: number | null },
) => {
  return apiClient.patch(`/matches/${id}/teams`, payload);
};

export const swapMatchTeams = async (id: number | string) => {
  return apiClient.patch(`/matches/${id}/swap`);
};

export const setMatchStatus = async (
  id: number | string,
  payload: { status: "scheduled" | "live" | "finished" },
) => {
  return apiClient.patch(`/matches/${id}/status`, payload);
};

export const getRegistrations = async (sportId: number, categoryId?: number | null) => {
  return apiClient.get<{ data: import("@/types/bracket").Registration[] }>("/registrations", {
    sport_id: sportId,
    status: "verified",
    ...(categoryId ? { sport_category_id: categoryId } : {}),
  });
};
