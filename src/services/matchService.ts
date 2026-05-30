const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error("Sesi telah berakhir. Silakan login kembali.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Terjadi kesalahan server.");
  return data;
};

export const getTodayMatches = async () => {
  const response = await fetch(`${API_URL}/my-matches/today`, {
    headers: getHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Gagal mengambil jadwal pertandingan hari ini");
  return resData;
};

export const getMatchCheckin = async (matchId: number) => {
  const res = await fetch(`${API_URL}/matches/${matchId}/checkin`, {
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const checkinPlayer = async (matchId: number, playerId: number) => {
  const res = await fetch(`${API_URL}/matches/${matchId}/checkin/${playerId}`, {
    method: "POST",
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const undoCheckinPlayer = async (matchId: number, playerId: number) => {
  const res = await fetch(`${API_URL}/matches/${matchId}/checkin/${playerId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const getMatchDetail = async (matchId: number) => {
  const res = await fetch(`${API_URL}/matches/${matchId}`, {
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const getMyMatches = async (params?: Record<string, string | number>) => {
  let url = `${API_URL}/my-matches`;
  if (params) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => qs.append(key, String(val)));
    url += `?${qs.toString()}`;
  }
  const res = await fetch(url, {
    headers: getHeaders(),
  });
  return handleResponse(res);
};
