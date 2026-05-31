import { apiClient } from "@/lib/apiClient";

export const getPlayerDetail = async (id: number | string) => {
  return apiClient.get<{ data: unknown }>(`/players/${id}`);
};
