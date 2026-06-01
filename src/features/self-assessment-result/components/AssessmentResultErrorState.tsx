import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface AssessmentResultErrorStateProps {
  error: string;
}

export const AssessmentResultErrorState = ({ error }: AssessmentResultErrorStateProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="text-[#B41F2A]" size={28} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-[#B41F2A] text-white rounded-lg font-medium text-sm hover:bg-[#981A24] transition-colors"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => router.push("/self-assessment")}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Ke Form
          </button>
        </div>
      </div>
    </div>
  );
};
