import { Loader2 } from "lucide-react";

interface AssessmentFormActionsProps {
  onReset: () => void;
  isSubmitting: boolean;
  isLoadingPosters: boolean;
}

export const AssessmentFormActions = ({
  onReset,
  isSubmitting,
  isLoadingPosters,
}: AssessmentFormActionsProps) => {
  const isButtonDisabled = isSubmitting || isLoadingPosters;

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row pb-12">
      <p className="text-xs text-gray-500 font-medium">
        <span className="mr-1 text-green-500 text-sm">●</span>
        Sistem akan memvalidasi jawaban Anda secara otomatis
      </p>

      <div className="flex gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 sm:flex-none rounded-lg border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors shadow-sm"
        >
          Reset Form
        </button>
        <button
          type="submit"
          disabled={isButtonDisabled}
          className="flex-1 sm:flex-none rounded-lg bg-[#B41F2A] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#981A24] hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isButtonDisabled ? (
            <span className="flex items-center gap-2">
              <Loader2 size={15} className="animate-spin" /> Memproses...
            </span>
          ) : (
            "Kirim Assessment →"
          )}
        </button>
      </div>
    </div>
  );
};
