const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getQuestionnaire = async () => {
  const response = await fetch(`${API_URL}/self-assessment/questionnaire`, {
    headers: getHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Gagal mengambil data kuesioner");
  return resData;
};
