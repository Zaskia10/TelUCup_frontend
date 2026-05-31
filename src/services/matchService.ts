import { apiClient } from "@/lib/apiClient";

export const getTodayMatches = async () => {
  return apiClient.get<{ data: unknown[] }>("/my-matches/today");
};

export const getMatchCheckin = async (matchId: number) => {
  return apiClient.get<{ data: unknown }>(`/matches/${matchId}/checkin`);
};

export const checkinPlayer = async (matchId: number, playerId: number) => {
  return apiClient.post(`/matches/${matchId}/checkin/${playerId}`);
};

export const undoCheckinPlayer = async (matchId: number, playerId: number) => {
  return apiClient.del(`/matches/${matchId}/checkin/${playerId}`);
};

export const getMatchDetail = async (matchId: number) => {
  return apiClient.get<{ status: string; data: unknown; message?: string }>(`/matches/${matchId}`);
};

export const getMyMatches = async (params?: Record<string, string | number>) => {
  return apiClient.get<{ data: unknown[] }>("/my-matches", params);
};
