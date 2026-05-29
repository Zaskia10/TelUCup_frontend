import { Registration } from "@/types/bracket";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getMyRegistrations = async () => {
  const response = await fetch(`${API_URL}/registrations/my`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil data pendaftaran");
  return response.json();
};

export const getRegistrationDetail = async (id: number) => {
  const response = await fetch(`${API_URL}/registrations/${id}`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil detail pendaftaran");
  return response.json();
};

export const createRegistration = async (data: {
  sport_id: number;
  sport_category_id?: number | null;
  player_ids?: number[];
}) => {
  const response = await fetch(`${API_URL}/registrations`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Gagal membuat draf pendaftaran");
  return resData;
};

export const addPlayersToRegistration = async (id: number, playerIds: number[]) => {
  const response = await fetch(`${API_URL}/registrations/${id}/players`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ player_ids: playerIds }),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Gagal menambahkan pemain");
  return resData;
};

export const removePlayerFromRegistration = async (id: number, playerId: number) => {
  const response = await fetch(`${API_URL}/registrations/${id}/players/${playerId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Gagal menghapus pemain");
  return resData;
};

export const submitRegistration = async (id: number) => {
  const response = await fetch(`${API_URL}/registrations/${id}/submit`, {
    method: "POST",
    headers: getHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Gagal mengajukan pendaftaran");
  return resData;
};

// Assuming there's an endpoint to get contingent members to add to the team
export const getMyContingentPlayers = async () => {
  const response = await fetch(`${API_URL}/contingents/my/players`, { // Assuming this is the endpoint
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil daftar pemain kontingen");
  return response.json();
};
