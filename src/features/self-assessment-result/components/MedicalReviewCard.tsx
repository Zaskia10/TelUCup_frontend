import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { formatDate } from "../utils/formatAssessmentDate";

interface MedicalReviewCardProps {
  medicalReview: {
    medical_notes: string | null;
    is_allowed_to_play: boolean | null;
    pic_confirmed: boolean;
    reviewed_at: string | null;
  };
}

export const MedicalReviewCard = ({ medicalReview }: MedicalReviewCardProps) => {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xs font-extrabold uppercase tracking-wide text-gray-500">
        Peninjauan Medis
      </h2>

      {medicalReview?.reviewed_at ? (
        <div className="space-y-3">
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-3 ${
              medicalReview.is_allowed_to_play
                ? "border border-green-100 bg-green-50"
                : "border border-red-100 bg-red-50"
            }`}
          >
            {medicalReview.is_allowed_to_play ? (
              <CheckCircle2 size={16} className="shrink-0 text-green-600" />
            ) : (
              <XCircle size={16} className="shrink-0 text-[#B41F2A]" />
            )}
            <p
              className={`text-sm font-bold ${
                medicalReview.is_allowed_to_play
                  ? "text-green-700"
                  : "text-[#B41F2A]"
              }`}
            >
              {medicalReview.is_allowed_to_play
                ? "Diizinkan Bermain"
                : "Tidak Diizinkan / Perlu Istirahat"}
            </p>
          </div>

          {medicalReview.medical_notes && (
            <div>
              <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-gray-400">
                Catatan Medis
              </p>
              <p className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
                {medicalReview.medical_notes}
              </p>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={11} />
            Direview: {formatDate(medicalReview.reviewed_at)}
          </div>

          {medicalReview.pic_confirmed && (
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <CheckCircle2 size={12} />
              Dikonfirmasi oleh PIC Kontingen
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-600">
          Review medis belum dilakukan oleh panitia medis.
        </div>
      )}
    </section>
  );
};
