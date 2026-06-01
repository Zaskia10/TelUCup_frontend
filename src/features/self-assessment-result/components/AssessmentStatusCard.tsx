import { useRouter } from "next/navigation";
import { formatDateShort } from "../utils/formatAssessmentDate";

interface StatusRowProps {
  label: string;
  value: string;
  positive?: boolean;
  neutral?: boolean;
}

function StatusRow({ label, value, positive, neutral }: StatusRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`text-xs font-bold ${
          neutral ? "text-gray-700" : positive ? "text-green-600" : "text-[#B41F2A]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

interface AssessmentStatusCardProps {
  isValid: boolean;
  validUntil: string | null;
  questionnaireVersion: string;
  algorithmVersion: string;
}

export const AssessmentStatusCard = ({
  isValid,
  validUntil,
  questionnaireVersion,
  algorithmVersion,
}: AssessmentStatusCardProps) => {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xs font-extrabold uppercase tracking-wide text-gray-500">
        Status Assessment
      </h2>
      <div className="divide-y divide-gray-50">
        <StatusRow
          label="Status"
          value={isValid ? "Masih Berlaku" : "Sudah Kadaluarsa"}
          positive={isValid}
        />
        {validUntil && (
          <StatusRow
            label="Berlaku Hingga"
            value={formatDateShort(validUntil)}
            neutral
          />
        )}
        <StatusRow
          label="Versi Kuesioner"
          value={`v${questionnaireVersion}`}
          neutral
        />
        <StatusRow
          label="Versi Algoritma"
          value={`v${algorithmVersion}`}
          neutral
        />
      </div>

      {!isValid && (
        <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3">
          <p className="text-xs text-amber-700">
            Assessment ini sudah kadaluarsa. Silakan isi ulang untuk mendapatkan evaluasi
            terbaru.
          </p>
          <button
            onClick={() => router.push("/self-assessment")}
            className="mt-2 text-xs font-bold text-amber-700 underline"
          >
            Isi Ulang Sekarang →
          </button>
        </div>
      )}
    </section>
  );
};
