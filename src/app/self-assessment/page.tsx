"use client";

import { useState, useEffect, FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import AnnouncementModal from "@/components/modal/AnnouncementModal";
import { getQuestionnaire } from "@/services/selfAssessmentService";
import { Loader2 } from "lucide-react";

// Types
type QuestionType = "number" | "single_choice" | "boolean" | "open_text" | "scale" | "multi_choice";

interface Option {
  value: string;
  label: string;
}

interface QuestionDef {
  code: string;
  type: QuestionType;
  text: string;
  min?: number;
  max?: number;
  required?: boolean;
  options?: Option[];
  notes?: string;
}

interface Section {
  domain: string;
  title: string;
  description: string;
  questions: QuestionDef[];
}

interface QuestionnaireData {
  version: string;
  disclaimer: string;
  sections: Section[];
  estimated_duration_minutes: number;
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6 transition-all hover:shadow-md">
      <div className="mb-5 flex items-start gap-3">
        <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-sm font-bold text-[#B41F2A]">
          ◉
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function QuestionBox({
  number,
  text,
  children,
  required = true,
}: {
  number?: number;
  text: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
      <div className="mb-4 flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-gray-900 leading-relaxed">
          {number && <span className="mr-2 text-gray-500">{number}.</span>}
          {text}
          {required && <span className="ml-1 text-[#B41F2A]">*</span>}
        </p>
        {required && (
          <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-[#B41F2A] tracking-wider uppercase">
            Wajib
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function SelfAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<QuestionnaireData | null>(null);
  
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  useEffect(() => {
    const fetchQ = async () => {
      try {
        setLoading(true);
        const res = await getQuestionnaire();
        setData(res.data || res);
      } catch (err: any) {
        setError(err.message || "Gagal memuat pertanyaan self-assessment");
      } finally {
        setLoading(false);
      }
    };
    fetchQ();
  }, []);

  const handleChange = (code: string, value: any) => {
    setAnswers(prev => ({ ...prev, [code]: value }));
  };

  const handleMultiChoiceChange = (code: string, optionValue: string, checked: boolean) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[code]) ? prev[code] : [];
      if (checked) {
        return { ...prev, [code]: [...current, optionValue] };
      } else {
        return { ...prev, [code]: current.filter((v: string) => v !== optionValue) };
      }
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Answers Payload:", answers);
    // TODO: Connect to submit API when available
    setShowAnnouncementModal(true);
  };

  const handleResetForm = () => {
    if (confirm("Apakah Anda yakin ingin mereset semua jawaban?")) {
      setAnswers({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f4f7f6]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-[#b71c1c]" size={40} />
          <p className="text-sm font-medium text-gray-500">Memuat formulir...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f4f7f6]">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
          <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center rounded-full mx-auto mb-4">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Gagal Memuat</h2>
          <p className="text-gray-500 mb-6">{error || "Data kuesioner tidak ditemukan"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#b71c1c] text-white rounded-lg font-medium hover:bg-[#9b1818] transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  let questionCounter = 1;

  return (
    <main className="min-h-screen bg-[#f4f7f6]">
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8 lg:py-10">
        <header className="mb-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Self Assessment <span className="text-[#B41F2A]">Kesehatan</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 max-w-2xl bg-gray-50 p-4 rounded-lg border border-gray-100">
              {data.disclaimer}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm">
                <span className="text-[#B41F2A] font-bold">◷</span>
                Durasi: {data.estimated_duration_minutes} menit
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm">
                <span className="text-[#B41F2A] font-bold">🔒</span>
                Data Rahasia & Terenkripsi
              </span>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {data.sections.map((section) => (
            <SectionCard
              key={section.domain}
              title={`Bagian ${section.domain} — ${section.title}`}
              subtitle={section.description}
            >
              {section.questions.map((q) => {
                const currentNumber = questionCounter++;
                const isRequired = q.required !== false;
                
                return (
                  <QuestionBox
                    key={q.code}
                    number={currentNumber}
                    text={q.text}
                    required={isRequired}
                  >
                    <div className="mt-2 pl-6">
                      {/* Tipe Boolean */}
                      {q.type === "boolean" && (
                        <div className="flex flex-wrap gap-4">
                          {[
                            { label: "Ya", value: true },
                            { label: "Tidak", value: false }
                          ].map((opt) => (
                            <label key={opt.label} className="flex cursor-pointer items-center gap-3 text-sm text-gray-800 bg-gray-50 hover:bg-red-50/50 px-5 py-3 rounded-lg border border-gray-200 transition-all has-[:checked]:border-[#B41F2A] has-[:checked]:bg-red-50 has-[:checked]:font-medium min-w-[120px]">
                              <input
                                type="radio"
                                name={q.code}
                                required={isRequired}
                                checked={answers[q.code] === opt.value}
                                onChange={() => handleChange(q.code, opt.value)}
                                className="h-4 w-4 accent-[#B41F2A]"
                              />
                              {opt.label}
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Tipe Single Choice */}
                      {q.type === "single_choice" && q.options && (
                        <div className="flex flex-col gap-2.5">
                          {q.options.map((opt) => (
                            <label key={opt.value} className="flex cursor-pointer items-center gap-3 text-sm text-gray-700 p-3.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all has-[:checked]:border-[#B41F2A] has-[:checked]:bg-red-50 has-[:checked]:font-medium">
                              <input
                                type="radio"
                                name={q.code}
                                value={opt.value}
                                required={isRequired}
                                checked={answers[q.code] === opt.value}
                                onChange={() => handleChange(q.code, opt.value)}
                                className="h-4 w-4 accent-[#B41F2A]"
                              />
                              {opt.label}
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Tipe Multi Choice */}
                      {q.type === "multi_choice" && q.options && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {q.options.map((opt) => {
                            const isChecked = Array.isArray(answers[q.code]) && answers[q.code].includes(opt.value);
                            return (
                              <label key={opt.value} className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer p-3.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all has-[:checked]:border-[#B41F2A] has-[:checked]:bg-red-50">
                                <input
                                  type="checkbox"
                                  name={q.code}
                                  value={opt.value}
                                  checked={isChecked}
                                  onChange={(e) => handleMultiChoiceChange(q.code, opt.value, e.target.checked)}
                                  className="h-4 w-4 mt-0.5 accent-[#B41F2A] rounded"
                                />
                                <span className={isChecked ? "font-medium" : ""}>{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Tipe Number */}
                      {q.type === "number" && (
                        <input
                          type="number"
                          name={q.code}
                          min={q.min}
                          max={q.max}
                          required={isRequired}
                          value={answers[q.code] || ""}
                          onChange={(e) => handleChange(q.code, e.target.value ? Number(e.target.value) : "")}
                          className="w-full max-w-[200px] rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#B41F2A] focus:ring-1 focus:ring-[#B41F2A]"
                          placeholder={`Misal: ${q.min || 0}`}
                        />
                      )}

                      {/* Tipe Open Text */}
                      {q.type === "open_text" && (
                        <textarea
                          name={q.code}
                          required={isRequired}
                          value={answers[q.code] || ""}
                          onChange={(e) => handleChange(q.code, e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#B41F2A] focus:ring-1 focus:ring-[#B41F2A] resize-y"
                          placeholder="Tulis jawaban Anda di sini secara singkat..."
                          rows={2}
                        />
                      )}

                      {/* Tipe Scale */}
                      {q.type === "scale" && (
                        <div className="bg-white rounded-lg p-5 border border-gray-200 mt-2 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-semibold text-gray-600">
                              Nilai Pilihan Anda:
                            </span>
                            <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center">
                               <span className="text-xl text-[#B41F2A] font-extrabold">{answers[q.code] !== undefined ? answers[q.code] : "-"}</span>
                            </div>
                          </div>
                          
                          <input
                            type="range"
                            name={q.code}
                            min={q.min}
                            max={q.max}
                            required={isRequired}
                            value={answers[q.code] !== undefined ? answers[q.code] : (q.min || 0)}
                            onChange={(e) => handleChange(q.code, Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#B41F2A]"
                          />
                          
                          <div className="mt-3 flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            <span>{q.min} (Rendah)</span>
                            <span>{q.max} (Tinggi)</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Notes / Tips */}
                      {q.notes && (
                         <div className="mt-3 bg-blue-50/50 border border-blue-100 p-3 rounded-md">
                           <p className="text-xs text-blue-700"><span className="font-bold mr-1">ℹ</span> {q.notes}</p>
                         </div>
                      )}
                    </div>
                  </QuestionBox>
                );
              })}
            </SectionCard>
          ))}
          
          {/* Section Persetujuan Akhir */}
          <SectionCard title="Bagian E — Pernyataan & Persetujuan Khusus">
            <div className="space-y-4">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-gray-700 bg-red-50/30 p-5 rounded-xl border border-red-100 hover:bg-red-50/50 transition-colors has-[:checked]:border-[#B41F2A] has-[:checked]:bg-red-50">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-5 w-5 accent-[#B41F2A] rounded shrink-0"
                />
                <span>Saya menyatakan dengan sebenar-benarnya bahwa seluruh data kesehatan yang saya isi adalah <strong>benar, jujur, dan merepresentasikan kondisi fisik saya saat ini</strong>. Saya sepenuhnya memahami bahwa data ini diperlukan untuk keperluan medis dan keselamatan selama kompetisi berlangsung.</span>
              </label>
            </div>
          </SectionCard>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row pb-12">
            <p className="text-xs text-gray-500 font-medium">
              <span className="mr-1 text-green-500 text-sm">●</span>
              Sistem akan memvalidasi jawaban Anda secara otomatis
            </p>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 sm:flex-none rounded-lg border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors shadow-sm"
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none rounded-lg bg-[#B41F2A] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#981A24] hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Kirim Assessment →
              </button>
            </div>
          </div>
        </form>
      </div>

      <AnnouncementModal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        onPrimaryClick={() => {
           setShowAnnouncementModal(false);
           router.push("/self-assessment/hasil");
        }}
        primaryButtonText="Lihat Hasil Evaluasi"
        secondaryButtonText="Tutup"
      />
    </main>
  );
}