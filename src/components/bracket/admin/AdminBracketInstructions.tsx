import type { Sport, SportCategory, Registration } from "@/types/bracket";

interface AdminBracketInstructionsProps {
  selectedSport: Sport | null;
  selectedCategory: SportCategory | null;
  registrations: Registration[];
}

export default function AdminBracketInstructions({
  selectedSport,
  selectedCategory,
  registrations,
}: AdminBracketInstructionsProps) {
  if (!selectedSport) return null;

  const steps = [
    {
      step: 1,
      text: "Pilih cabang olahraga & sub-kategori",
      done:
        selectedSport !== null &&
        (selectedSport.categories.length === 0 || selectedCategory !== null),
    },
    {
      step: 2,
      text: `Pastikan minimal 2 tim terverifikasi (saat ini: ${registrations.length} tim)`,
      done: registrations.length >= 2,
    },
    {
      step: 3,
      text: 'Klik tombol "Generate Bagan" untuk membuat struktur bagan',
      done: false,
    },
    {
      step: 4,
      text: "Gunakan Randomize untuk mengacak posisi tim jika diperlukan",
      done: false,
    },
    {
      step: 5,
      text: "Klik pada pertandingan untuk mengedit atau drag & drop tim antar card",
      done: false,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
      <div className="max-w-lg mx-auto">
        <h3 className="text-sm font-bold text-gray-900 mb-4 text-center">
          Alur Pembuatan Bagan
        </h3>
        <div className="space-y-4">
          {steps.map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  item.done
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {item.done ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  item.step
                )}
              </div>
              <p
                className={`text-sm font-medium pt-1 ${
                  item.done ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
