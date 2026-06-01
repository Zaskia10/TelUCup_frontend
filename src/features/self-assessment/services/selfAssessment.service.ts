import { apiClient } from "@/lib/apiClient";
import { QuestionnaireData, SubmitAssessmentPayload } from "../types/selfAssessment.types";

export const getQuestionnaire = async () => {
  return apiClient.get<{ data: unknown }>("/self-assessment/questionnaire");
};

export const submitSelfAssessment = async (data: SubmitAssessmentPayload) => {
  return apiClient.post("/self-assessment", data);
};
