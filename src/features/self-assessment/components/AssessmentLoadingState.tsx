import { Loader2 } from "lucide-react";

export const AssessmentLoadingState = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f4f7f6]">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 animate-spin text-[#b71c1c]" size={40} />
        <p className="text-sm font-medium text-gray-500">Memuat formulir...</p>
      </div>
    </div>
  );
};
