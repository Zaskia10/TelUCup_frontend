import { apiClient } from "@/lib/apiClient";

export const getQuestionnaire = async () => {
  return apiClient.get<{ data: unknown }>("/self-assessment/questionnaire");
};

export const submitSelfAssessment = async (data: {
  player_id: number | null;
  answers: Record<string, string | number | boolean>;
}) => {
  return apiClient.post("/self-assessment", data);
};

export const getMyLatestAssessment = async () => {
  return apiClient.get<{ data: unknown }>("/self-assessment/me");
};

export const getAssessmentById = async (id: number) => {
  return apiClient.get(`/self-assessment/${id}`);
};
