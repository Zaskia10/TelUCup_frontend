import { ClipboardList } from "lucide-react";

interface EmptyAssessmentStateProps {
  onStart: () => void;
}

export const EmptyAssessmentState = ({ onStart }: EmptyAssessmentStateProps) => {
  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ClipboardList className="text-[#B41F2A]" size={36} />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Belum Ada Assessment</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Anda belum pernah mengisi self-assessment kesehatan. Isi sekarang untuk mengetahui
          status risiko Anda sebelum bertanding.
        </p>
        <button
          onClick={onStart}
          className="w-full bg-[#B41F2A] text-white rounded-lg py-3 font-bold text-sm hover:bg-[#981A24] transition-colors shadow-sm"
        >
          Mulai Self Assessment →
        </button>
      </div>
    </div>
  );
};
