import { apiClient } from "@/lib/apiClient";

export const getMyRegistrations = async () => {
  return apiClient.get<{ data: unknown[] }>("/registrations/my");
};

export const getRegistrationDetail = async (id: number) => {
  return apiClient.get(`/registrations/${id}`);
};

export const createRegistration = async (data: {
  sport_id: number;
  sport_category_id?: number | null;
  player_ids?: number[];
}) => {
  return apiClient.post("/registrations", data);
};

export const addPlayersToRegistration = async (id: number, playerIds: number[]) => {
  return apiClient.post(`/registrations/${id}/players`, { player_ids: playerIds });
};

export const removePlayerFromRegistration = async (id: number, playerId: number) => {
  return apiClient.del(`/registrations/${id}/players/${playerId}`);
};

export const submitRegistration = async (id: number) => {
  return apiClient.post(`/registrations/${id}/submit`);
};
