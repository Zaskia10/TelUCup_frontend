interface AssessmentErrorStateProps {
  error: string;
}

export const AssessmentErrorState = ({ error }: AssessmentErrorStateProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f4f7f6]">
      <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
        <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center rounded-full mx-auto mb-4">
          <span className="text-2xl font-bold">!</span>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Gagal Memuat</h2>
        <p className="text-gray-500 mb-6">{error || "Data kuesioner tidak ditemukan"}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#b71c1c] text-white rounded-lg font-medium hover:bg-[#9b1818] transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
};
