import { XCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Flag } from "../types/assessmentResult.types";

interface FlagSectionProps {
  redFlags: Flag[];
  yellowFlags: Flag[];
}

export const FlagSection = ({ redFlags, yellowFlags }: FlagSectionProps) => {
  return (
    <>
      {redFlags.length > 0 && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-7 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#B41F2A]">
            <XCircle size={18} />
            Red Flag Terdeteksi ({redFlags.length})
          </h2>
          <div className="space-y-3">
            {redFlags.map((flag, i) => (
              <div key={i} className="rounded-lg border border-red-100 bg-white p-4">
                <p className="text-sm font-bold text-gray-800">{flag.text}</p>
                {flag.reason && (
                  <p className="mt-1 text-xs leading-relaxed text-[#B41F2A]">{flag.reason}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {yellowFlags.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-7 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-amber-700">
            <AlertTriangle size={18} />
            Perhatian — {yellowFlags.length} Yellow Flag
          </h2>
          <div className="space-y-3">
            {yellowFlags.map((flag, i) => (
              <div key={i} className="rounded-lg border border-amber-100 bg-white p-4">
                <p className="text-sm font-bold text-gray-800">{flag.text}</p>
                {flag.reason && (
                  <p className="mt-1 text-xs leading-relaxed text-amber-700">{flag.reason}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {redFlags.length === 0 && yellowFlags.length === 0 && (
        <section className="rounded-2xl border border-green-100 bg-green-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={22} className="shrink-0 text-green-600" />
            <div>
              <p className="text-sm font-bold text-green-800">
                Tidak Ada Red Flag atau Yellow Flag
              </p>
              <p className="mt-0.5 text-xs text-green-700">
                Tidak ditemukan indikator risiko signifikan pada screening ini.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
