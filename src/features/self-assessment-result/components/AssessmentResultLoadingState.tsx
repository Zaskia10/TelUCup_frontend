import { Loader2 } from "lucide-react";

export const AssessmentResultLoadingState = () => {
  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 animate-spin text-[#b71c1c]" size={40} />
        <p className="text-sm text-gray-500 font-medium">Memuat hasil assessment...</p>
      </div>
    </div>
  );
};
