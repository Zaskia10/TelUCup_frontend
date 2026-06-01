import { User } from "lucide-react";
import { getBMICategory } from "../utils/getBmiCategory";

interface InfoItemProps {
  label: string;
  value: string;
  alignRight?: boolean;
}

function InfoItem({ label, value, alignRight = false }: InfoItemProps) {
  return (
    <div className={alignRight ? "text-right" : ""}>
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-gray-800">{value}</p>
    </div>
  );
}

interface PlayerInfoCardProps {
  playerName: string | null;
  contingent: string | null;
  sportBranch: string | null;
  snapshot: { age: number; bmi: number; is_kacamata: boolean };
  assessmentId: number;
}

export const PlayerInfoCard = ({
  playerName,
  contingent,
  sportBranch,
  snapshot,
  assessmentId,
}: PlayerInfoCardProps) => {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
          <User size={26} />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-extrabold text-gray-900 leading-tight">
            {playerName || "—"}
          </h2>
          <p className="text-sm text-gray-500 truncate">
            {contingent || "Kontingen tidak diketahui"}
          </p>
          <p className="mt-0.5 text-xs font-bold text-[#B41F2A]">
            {sportBranch || "Cabang olahraga tidak diketahui"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <InfoItem label="Usia" value={`${snapshot?.age ?? "—"} tahun`} />
        <InfoItem
          label="BMI"
          value={
            snapshot?.bmi
              ? `${snapshot.bmi.toFixed(1)} (${getBMICategory(snapshot.bmi)})`
              : "—"
          }
          alignRight
        />
        <InfoItem label="Kacamata" value={snapshot?.is_kacamata ? "Ya" : "Tidak"} />
        <InfoItem
          label="ID Assessment"
          value={`#${String(assessmentId).padStart(5, "0")}`}
          alignRight
        />
      </div>
    </section>
  );
};
