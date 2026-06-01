import { useSelfAssessmentForm } from "../hooks/useSelfAssessmentForm";
import { AssessmentLoadingState } from "./AssessmentLoadingState";
import { AssessmentErrorState } from "./AssessmentErrorState";
import { SelfAssessmentSection } from "./SelfAssessmentSection";
import { QuestionCard } from "./QuestionCard";
import { QuestionInput } from "./QuestionInput";
import { AssessmentConsentSection } from "./AssessmentConsentSection";
import { AssessmentSubmitError } from "./AssessmentSubmitError";
import { AssessmentFormActions } from "./AssessmentFormActions";
import { useRouter } from "next/navigation";
import AnnouncementModal from "@/components/modal/AnnouncementModal";
import SportsmanshipReminderModal from "@/components/modal/SportsmanshipReminderModal";

export const SelfAssessmentForm = () => {
  const router = useRouter();
  const {
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
    showAnnouncementModal,
    setShowAnnouncementModal,
    showReminderModal,
    setShowReminderModal,
    proceedToResult,
    activePosters,
    isLoadingPosters,
  } = useSelfAssessmentForm();

  if (loading) return <AssessmentLoadingState />;
  if (error || !data) return <AssessmentErrorState error={error} />;

  let questionCounter = 1;

  return (
    <>
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#B41F2A] transition-colors"
      >
        <span className="text-lg leading-none">←</span> Kembali
      </button>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {data.sections.map((section) => (
          <SelfAssessmentSection
            key={section.domain}
            title={`Bagian ${section.domain} — ${section.title}`}
            subtitle={section.description}
          >
            {section.questions.map((q) => {
              const currentNumber = questionCounter++;
              const isRequired = q.required !== false;
              const hasError = unansweredCodes.includes(q.code);

              return (
                <QuestionCard
                  key={q.code}
                  id={`question-${q.code}`}
                  number={currentNumber}
                  text={q.text}
                  required={isRequired}
                  hasError={hasError}
                >
                  <QuestionInput
                    question={q}
                    value={answers[q.code]}
                    onChange={(val) => handleChange(q.code, val)}
                    onMultiChoiceChange={(opt, checked) => handleMultiChoiceChange(q.code, opt, checked)}
                    isRequired={isRequired}
                  />
                </QuestionCard>
              );
            })}
          </SelfAssessmentSection>
        ))}

        <AssessmentConsentSection />

        <AssessmentSubmitError error={submitError} />

        <AssessmentFormActions
          onReset={handleResetForm}
          isSubmitting={isSubmitting}
          isLoadingPosters={isLoadingPosters}
        />
      </form>

      <AnnouncementModal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        onPrimaryClick={proceedToResult}
        title="Assessment Berhasil Disimpan!"
        category="Self Assessment Selesai"
        description="Hasil analisis risiko kesehatan Anda telah diproses. Klik tombol di bawah untuk melihat hasil evaluasi lengkap."
        primaryButtonText="Lihat Hasil Assessment →"
        secondaryButtonText="Tutup"
      />

      <SportsmanshipReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onContinue={proceedToResult}
        posters={activePosters || []}
      />
    </>
  );
};
