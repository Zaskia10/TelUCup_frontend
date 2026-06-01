import { Shield } from "lucide-react";
import { DOMAIN_CONFIG } from "../constants/assessmentResult.constants";
import { getDomainBarColor } from "../utils/getDomainBarColor";

interface DomainScoreCardProps {
  domainScores: Record<string, number>;
}

export const DomainScoreCard = ({ domainScores }: DomainScoreCardProps) => {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 text-base font-extrabold text-gray-900">
        <Shield size={17} className="text-[#B41F2A]" />
        Skor Per Domain
      </h2>
      <div className="space-y-5">
        {DOMAIN_CONFIG.map(({ key, label, weight, Icon }) => {
          const score = domainScores?.[key] ?? 0;
          return (
            <div key={key}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                  <span className="text-xs text-gray-400">({weight})</span>
                </div>
                <span className="text-sm font-bold text-gray-600">{score.toFixed(1)}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getDomainBarColor(
                    score
                  )}`}
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-gray-400">
        Interpretasi skor: 0–25 Rendah · 26–50 Sedang · 51–100 Tinggi
      </p>
    </section>
  );
};
