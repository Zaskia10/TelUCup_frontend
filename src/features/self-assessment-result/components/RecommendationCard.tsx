import { ClipboardList } from "lucide-react";

interface RecommendationCardProps {
  recommendation: string | null;
}

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  if (!recommendation) return null;

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-gray-900">
        <ClipboardList size={17} className="text-[#B41F2A]" />
        Rekomendasi
      </h2>
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
        <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
          {recommendation}
        </p>
      </div>
    </section>
  );
};
