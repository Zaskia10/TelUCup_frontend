import { apiClient } from "@/lib/apiClient";

export const getMyContingent = async () => {
  return apiClient.get<{ data: unknown }>("/contingents/my");
};

export const getMyContingentPlayers = async () => {
  return apiClient.get<{ data: unknown[] }>("/contingents/my/players");
};

export const removeContingentPlayer = async (playerId: number) => {
  return apiClient.del(`/contingents/my/players/${playerId}`);
};

export const addContingentPlayer = async (data: {
  name: string;
  nim_nip: string;
  email: string;
  employee_status: string;
}) => {
  const createPlayerRes = await apiClient.post<{ player?: { id: number } }>("/players", {
    name: data.name,
    email: data.email,
    password: "rahasia123",
    nim_nip: data.nim_nip,
    employee_status: data.employee_status,
  });

  const newPlayerId = createPlayerRes.player?.id;
  if (!newPlayerId) {
    throw new Error("Gagal mendapatkan ID pemain yang baru dibuat");
  }

  return apiClient.post("/contingents/my/players", { player_id: newPlayerId });
};
