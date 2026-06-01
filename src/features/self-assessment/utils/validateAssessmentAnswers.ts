import { QuestionnaireData, AssessmentAnswers } from "../types/selfAssessment.types";

export const validateAssessmentAnswers = (
  data: QuestionnaireData | null,
  answers: AssessmentAnswers
): string[] => {
  if (!data) return [];

  const missingCodes: string[] = [];
  data.sections.forEach((section) => {
    section.questions.forEach((q) => {
      const isRequired = q.required !== false;
      if (isRequired) {
        const val = answers[q.code];
        if (
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0)
        ) {
          missingCodes.push(q.code);
        }
      }
    });
  });

  return missingCodes;
};
