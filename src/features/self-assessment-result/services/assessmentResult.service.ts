import { apiClient } from "@/lib/apiClient";

export const getMyLatestAssessment = async () => {
  return apiClient.get<{ data: unknown }>("/self-assessment/me");
};

export const getAssessmentById = async (id: number) => {
  return apiClient.get(`/self-assessment/${id}`);
};
