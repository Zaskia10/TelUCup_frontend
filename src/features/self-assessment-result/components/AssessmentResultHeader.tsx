import { Calendar, RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "../utils/formatAssessmentDate";

interface AssessmentResultHeaderProps {
  playerName: string | null;
  contingent: string | null;
  sportBranch: string | null;
  createdAt: string;
  riskConfig: {
    bg: string;
    text: string;
    border: string;
  };
}

export const AssessmentResultHeader = ({
  playerName,
  contingent,
  sportBranch,
  createdAt,
  riskConfig,
}: AssessmentResultHeaderProps) => {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#B41F2A] transition-colors"
      >
        <ArrowLeft size={16} /> Kembali
      </button>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span
              className={`rounded-full border px-3 py-1 ${riskConfig.bg} ${riskConfig.text} ${riskConfig.border}`}
            >
              Dianalisis oleh Algoritma • Hasil Instan
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Calendar size={12} />
              {formatDate(createdAt)}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 lg:text-3xl">
            Hasil Self-Assessment —{" "}
            <span className="text-[#B41F2A]">{playerName || "Peserta"}</span>
          </h1>
          {(contingent || sportBranch) && (
            <p className="mt-1 text-sm text-gray-500">
              {contingent}
              {contingent && sportBranch && " • "}
              {sportBranch}
            </p>
          )}
        </div>

        <button
          onClick={() => router.push("/self-assessment")}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <RefreshCw size={14} /> Isi Ulang Assessment
        </button>
      </div>
    </>
  );
};
