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
  email: string;
  password?: string;
}) => {
  return apiClient.post("/contingents/my/players/register", {
    name: data.name,
    email: data.email,
    password: data.password || "1301234567",
  });
};
