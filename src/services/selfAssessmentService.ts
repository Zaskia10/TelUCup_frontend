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

export const submitSelfAssessment = async (data: {
  player_id: number | null;
  answers: Record<string, any>;
}) => {
  const response = await fetch(`${API_URL}/self-assessment`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Gagal mengirim self-assessment");
  return resData;
};

export const getMyLatestAssessment = async () => {
  const response = await fetch(`${API_URL}/self-assessment/me`, {
    headers: getHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Gagal mengambil data assessment");
  return resData;
};

export const getAssessmentById = async (id: number) => {
  const response = await fetch(`${API_URL}/self-assessment/${id}`, {
    headers: getHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Gagal mengambil data assessment");
  return resData;
};
