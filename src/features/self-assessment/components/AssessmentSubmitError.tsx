interface AssessmentSubmitErrorProps {
  error: string;
}

export const AssessmentSubmitError = ({ error }: AssessmentSubmitErrorProps) => {
  if (!error) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">
      <span className="shrink-0 text-lg text-[#B41F2A] font-bold mt-0.5">!</span>
      <div>
        <p className="text-sm font-bold text-[#B41F2A]">Gagal Mengirim</p>
        <p className="text-xs text-red-700 mt-0.5">{error}</p>
      </div>
    </div>
  );
};
