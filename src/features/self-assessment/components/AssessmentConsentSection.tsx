import { SelfAssessmentSection } from "./SelfAssessmentSection";

export const AssessmentConsentSection = () => {
  return (
    <SelfAssessmentSection title="Bagian E — Pernyataan & Persetujuan Khusus">
      <div className="space-y-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-gray-700 bg-red-50/30 p-5 rounded-xl border border-red-100 hover:bg-red-50/50 transition-colors has-[:checked]:border-[#B41F2A] has-[:checked]:bg-red-50">
          <input
            type="checkbox"
            required
            className="mt-1 h-5 w-5 accent-[#B41F2A] rounded shrink-0"
          />
          <span>
            Saya menyatakan dengan sebenar-benarnya bahwa seluruh data kesehatan yang saya isi adalah <strong>benar, jujur, dan merepresentasikan kondisi fisik saya saat ini</strong>. Saya sepenuhnya memahami bahwa data ini diperlukan untuk keperluan medis dan keselamatan selama kompetisi berlangsung.
          </span>
        </label>
      </div>
    </SelfAssessmentSection>
  );
};
