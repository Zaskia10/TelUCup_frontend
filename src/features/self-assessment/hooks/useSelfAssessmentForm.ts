import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { QuestionnaireData, AssessmentAnswerValue } from "../types/selfAssessment.types";
import { useAssessmentDraft } from "./useAssessmentDraft";
import { getQuestionnaire, submitSelfAssessment } from "../services/selfAssessment.service";
import { getMyLatestAssessment } from "@/services/selfAssessmentService";
import { normalizeAssessmentResponse } from "../utils/normalizeAssessmentResponse";
import { validateAssessmentAnswers } from "../utils/validateAssessmentAnswers";
import { useActiveSportsmanshipPosters } from "@/hooks/useActiveSportsmanshipPosters";

export const useSelfAssessmentForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<QuestionnaireData | null>(null);

  const { answers, setAnswers, removeAnswers, isLoaded: isDraftLoaded } = useAssessmentDraft();
  const [unansweredCodes, setUnansweredCodes] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [assessmentId, setAssessmentId] = useState<number | null>(null);

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const { posters: activePosters, fetchActivePosters, isLoading: isLoadingPosters } = useActiveSportsmanshipPosters();

  useEffect(() => {
    const fetchQ = async () => {
      try {
        setLoading(true);

        try {
          const myAssessment = await getMyLatestAssessment();
          const assessmentData = normalizeAssessmentResponse(myAssessment);

          if (assessmentData && assessmentData.valid_until) {
            const validUntilDate = new Date(assessmentData.valid_until);
            if (validUntilDate > new Date()) {
              router.replace(`/self-assessment/hasil?id=${assessmentData.id}`);
              return;
            }
          }
        } catch (e) {
          // Ignore if user has no data
        }

        const res = await getQuestionnaire();
        const questionnaireData = normalizeAssessmentResponse(res) as QuestionnaireData;
        setData(questionnaireData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Gagal memuat pertanyaan self-assessment";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchQ();
  }, [router]);

  const handleChange = (code: string, value: AssessmentAnswerValue) => {
    setAnswers((prev) => ({ ...prev, [code]: value }));
  };

  const handleMultiChoiceChange = (code: string, optionValue: string, checked: boolean) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[code]) ? (prev[code] as string[]) : [];
      if (checked) {
        return { ...prev, [code]: [...current, optionValue] };
      } else {
        return { ...prev, [code]: current.filter((v: string) => v !== optionValue) };
      }
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setUnansweredCodes([]);

    if (!data) return;

    const missing = validateAssessmentAnswers(data, answers);

    if (missing.length > 0) {
      setUnansweredCodes(missing);
      setSubmitError(`Terdapat ${missing.length} pertanyaan wajib yang belum Anda jawab. Silakan lengkapi pertanyaan yang ditandai merah.`);
      
      setTimeout(() => {
        const firstFailedCode = missing[0];
        const element = document.getElementById(`question-${firstFailedCode}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    try {
      setIsSubmitting(true);
      // Strictly we expect answers to be formatted string | number | boolean | string[]
      const payload = { player_id: null, answers: answers as any };
      const result = await submitSelfAssessment(payload);
      const resData = normalizeAssessmentResponse(result);
      setAssessmentId(resData?.id ?? null);
      
      removeAnswers();

      try {
        await fetchActivePosters();
      } catch (e) {
        // Silently handle if poster fetch fails
      }
      
    } catch (err: any) {
      let message = "Terjadi kesalahan saat mengirim self-assessment";
      if (err instanceof Error) {
        message = err.message;
      } else if (err && typeof err === "object") {
        if (typeof err.message === "string") {
          message = err.message;
        }
        if (err.errors && typeof err.errors === "object") {
          const detailMsgs = Object.values(err.errors).flat().join(", ");
          if (detailMsgs) {
            message = `${message}: ${detailMsgs}`;
          }
        }
      }
      setSubmitError(message);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (assessmentId !== null && !isLoadingPosters) {
      if (activePosters && activePosters.length > 0) {
        setShowReminderModal(true);
      } else {
        setShowAnnouncementModal(true);
      }
      setIsSubmitting(false);
    }
  }, [assessmentId, isLoadingPosters, activePosters]);

  const handleResetForm = () => {
    if (confirm("Apakah Anda yakin ingin mereset semua jawaban?")) {
      removeAnswers();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const proceedToResult = () => {
    setShowAnnouncementModal(false);
    setShowReminderModal(false);
    router.replace(assessmentId ? `/self-assessment/hasil?id=${assessmentId}` : "/self-assessment/hasil");
  };

  return {
    loading,
    error,
    data,
    answers,
    handleChange,
    handleMultiChoiceChange,
    handleSubmit,
    handleResetForm,
    unansweredCodes,
    isSubmitting,
    submitError,
    assessmentId,
    showAnnouncementModal,
    setShowAnnouncementModal,
    showReminderModal,
    setShowReminderModal,
    proceedToResult,
    activePosters,
    isLoadingPosters,
  };
};
