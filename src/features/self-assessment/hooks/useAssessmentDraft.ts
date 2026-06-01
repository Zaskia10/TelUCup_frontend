import { useState, useEffect } from "react";
import { AssessmentAnswers } from "../types/selfAssessment.types";
import { getDraftKey } from "../utils/selfAssessmentStorage";

export const useAssessmentDraft = () => {
  const [answers, setAnswersState] = useState<AssessmentAnswers>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const draftKey = getDraftKey();

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(draftKey);
      if (item) {
        setAnswersState(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error reading localStorage", error);
    }
    setIsLoaded(true);
  }, [draftKey]);

  const setAnswers = (newAnswers: AssessmentAnswers | ((prev: AssessmentAnswers) => AssessmentAnswers)) => {
    try {
      const valueToStore = newAnswers instanceof Function ? newAnswers(answers) : newAnswers;
      setAnswersState(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(draftKey, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error setting localStorage", error);
    }
  };

  const removeAnswers = () => {
    try {
      setAnswersState({});
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(draftKey);
      }
    } catch (error) {
      console.error("Error removing localStorage", error);
    }
  };

  return { answers, setAnswers, removeAnswers, isLoaded };
};
