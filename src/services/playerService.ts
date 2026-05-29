const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getPlayerDetail = async (id: number | string) => {
  const response = await fetch(`${API_URL}/players/${id}`, {
    headers: getHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Gagal mengambil detail pemain");
  return resData;
};
