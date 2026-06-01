import { AlertTriangle } from "lucide-react";

interface RiskSummaryCardProps {
  riskConfig: {
    headerBar: string;
    badge: string;
    label: string;
    text: string;
    description: string;
  };
  totalScore: number;
  requiresClearance: boolean;
}

export const RiskSummaryCard = ({ riskConfig, totalScore, requiresClearance }: RiskSummaryCardProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className={`h-1.5 ${riskConfig.headerBar}`} />
      <div className="p-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-6 py-2 text-sm font-extrabold ${riskConfig.badge}`}>
                {riskConfig.label}
              </span>
              <span className={`text-sm font-bold ${riskConfig.text}`}>
                Skor Total: {totalScore.toFixed(1)} / 100
              </span>
            </div>
            <p className="max-w-lg text-base font-bold leading-snug text-gray-800">
              {riskConfig.description}
            </p>

            {requiresClearance && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
                <AlertTriangle size={15} className="shrink-0 text-[#B41F2A]" />
                <p className="text-xs font-bold text-[#B41F2A]">
                  Memerlukan clearance medis sebelum diizinkan bertanding
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
