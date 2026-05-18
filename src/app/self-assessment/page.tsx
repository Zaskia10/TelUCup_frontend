"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AnnouncementModal from "@/components/modal/AnnouncementModal";

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
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-sm font-bold text-[#B41F2A]">
          ◉
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>

      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Question({
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
    <div className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
      <div className="mb-3 flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-gray-900">
          {number && <span className="mr-1">{number}.</span>}
          {text}
          {required && <span className="ml-1 text-[#B41F2A]">*</span>}
        </p>

        {required && (
          <span className="shrink-0 rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-[#B41F2A]">
            WAJIB DIISI
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

function RadioGroup({
  name,
  options,
}: {
  name: string;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap gap-5">
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
        >
          <input
            type="radio"
            name={name}
            value={option}
            className="h-4 w-4 accent-[#B41F2A]"
          />
          {option}
        </label>
      ))}
    </div>
  );
}

function TextInput({
  placeholder = "Tulis jawaban Anda",
  disabled = false,
}: {
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      disabled={disabled}
      className="mt-3 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#B41F2A] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
    />
  );
}

function ConditionalCheckboxQuestion({
  radioName,
  checkboxName,
  options,
  helperText,
  otherPlaceholder = "Jika lainnya, sebutkan singkat",
}: {
  radioName: string;
  checkboxName: string;
  options: string[];
  helperText?: string;
  otherPlaceholder?: string;
}) {
  const [answer, setAnswer] = useState("");
  const [isOtherChecked, setIsOtherChecked] = useState(false);

  const isDisabled = answer !== "Ya";

  return (
    <>
      <div className="flex flex-wrap gap-5">
        {["Ya", "Tidak"].map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
          >
            <input
              type="radio"
              name={radioName}
              value={option}
              checked={answer === option}
              onChange={(event) => {
                setAnswer(event.target.value);

                if (event.target.value !== "Ya") {
                  setIsOtherChecked(false);
                }
              }}
              className="h-4 w-4 accent-[#B41F2A]"
            />
            {option}
          </label>
        ))}
      </div>

      {helperText && (
        <p className="mt-4 text-xs font-semibold uppercase text-gray-500">
          {helperText}
        </p>
      )}

      <div
        className={`mt-3 grid gap-3 rounded-lg p-4 sm:grid-cols-2 md:grid-cols-3 ${
          isDisabled ? "bg-gray-100 opacity-60" : "bg-gray-50"
        }`}
      >
        {options.map((option) => {
          const isOther = option.toLowerCase() === "lainnya";

          return (
            <label
              key={option}
              className={`flex items-center gap-2 text-sm text-gray-700 ${
                isDisabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                name={checkboxName}
                value={option}
                disabled={isDisabled}
                checked={isOther ? isOtherChecked : undefined}
                onChange={(event) => {
                  if (isOther) {
                    setIsOtherChecked(event.target.checked);
                  }
                }}
                className="h-4 w-4 accent-[#B41F2A] disabled:cursor-not-allowed"
              />
              {option}
            </label>
          );
        })}
      </div>

      <TextInput
        disabled={isDisabled || !isOtherChecked}
        placeholder={otherPlaceholder}
      />
    </>
  );
}

function PainLevelQuestion() {
  const [hasPain, setHasPain] = useState("");
  const [painLevel, setPainLevel] = useState(0);

  const isDisabled = hasPain !== "Ya";

  const painStatus =
    painLevel <= 3
      ? "NYERI RINGAN"
      : painLevel <= 6
      ? "NYERI SEDANG"
      : "NYERI BERAT";

  return (
    <>
      <div className="flex flex-wrap gap-5">
        {["Ya", "Tidak"].map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
          >
            <input
              type="radio"
              name="nyeri-saat-ini"
              value={option}
              checked={hasPain === option}
              onChange={(event) => {
                setHasPain(event.target.value);

                if (event.target.value !== "Ya") {
                  setPainLevel(0);
                }
              }}
              className="h-4 w-4 accent-[#B41F2A]"
            />
            {option}
          </label>
        ))}
      </div>

      <div
        className={`mt-5 rounded-lg border border-gray-100 p-5 ${
          isDisabled ? "bg-gray-100 opacity-60" : "bg-gray-50"
        }`}
      >
        <p className="text-xs font-semibold uppercase text-gray-500">
          Status nyeri
        </p>

        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <p className="text-lg font-extrabold text-[#B41F2A]">
              {painStatus}
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-800">
              Jika ya, seberapa parah nyeri Anda saat ini?
            </p>
          </div>

          <div className="text-4xl font-extrabold text-[#B41F2A]">
            {painLevel}
            <span className="text-base text-gray-400">/10</span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="10"
          value={painLevel}
          disabled={isDisabled}
          onChange={(event) => setPainLevel(Number(event.target.value))}
          className="mt-5 w-full accent-[#B41F2A] disabled:cursor-not-allowed"
        />

        <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase text-gray-400">
          <span>Tidak nyeri</span>
          <span>Nyeri berat</span>
        </div>
      </div>
    </>
  );
}

export default function SelfAssessmentPage() {
  const router = useRouter();
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowAnnouncementModal(true);
  };

  const handleResetForm = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-5 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Self Assessment Kesehatan Pemain
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Isi kondisi kesehatan Anda dengan jujur untuk memastikan keselamatan
            selama sesi latihan dan pertandingan.
          </p>

          <div className="mt-5 flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 shadow-sm">
              <span className="text-[#B41F2A]">◷</span>
              Perkiraan: 3-6 menit
            </span>

            <span className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 shadow-sm">
              <span className="text-[#B41F2A]">♙</span>
              Data Rahasia & Terenkripsi
            </span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <SectionCard
            title="Bagian A — Kondisi Dasar"
            subtitle="Kondisi kesehatan umum dan nyeri anggota badan."
          >
            <Question text="Pernah didiagnosis masalah jantung atau kondisi yang membatasi aktivitas fisik?">
              <RadioGroup
                name="diagnosis-jantung"
                options={["Ya", "Tidak"]}
              />
            </Question>

            <Question text="Pernah merasa nyeri dada saat beraktivitas fisik?">
              <RadioGroup name="nyeri-dada" options={["Ya", "Tidak"]} />
            </Question>

            <Question text="Dalam 1 bulan terakhir, pernah pusing/nyaris pingsan/turun kesadaran saat beraktivitas?">
              <RadioGroup name="pusing-pingsan" options={["Ya", "Tidak"]} />
            </Question>

            <Question text="Apakah Anda memiliki kondisi kesehatan lain yang menghambat aktivitas fisik?">
              <ConditionalCheckboxQuestion
                radioName="kondisi-kesehatan-lain"
                checkboxName="jenis-kondisi-kesehatan"
                helperText="Pilih kondisi yang paling sesuai"
                options={[
                  "Pernapasan",
                  "Jantung",
                  "Sendi/tulang",
                  "Neurologis",
                  "Lainnya",
                ]}
              />
            </Question>
          </SectionCard>

          <SectionCard
            title="Bagian B — Riwayat Cedera"
            subtitle="Informasi mengenai cedera fisik dalam 12 bulan terakhir."
          >
            <Question
              number={1}
              text="Pernah mengalami cedera otot, sendi, ligamen, atau tulang dalam 12 bulan terakhir?"
            >
              <ConditionalCheckboxQuestion
                radioName="pernah-cedera-12-bulan"
                checkboxName="bagian-tubuh-cedera"
                helperText="Bagian tubuh yang pernah cedera"
                options={[
                  "Lutut",
                  "Pergelangan kaki",
                  "Paha",
                  "Punggung",
                  "Bahu",
                  "Siku",
                  "Pergelangan tangan",
                  "Lainnya",
                ]}
              />
            </Question>

            <Question
              number={2}
              text="Jika ya, apakah cedera tersebut pernah kambuh lebih dari satu kali?"
            >
              <RadioGroup name="cedera-kambuh" options={["Ya", "Tidak"]} />
            </Question>

            <Question
              number={3}
              text="Apakah cedera tersebut masih terasa sampai sekarang?"
            >
              <RadioGroup
                name="cedera-masih-terasa"
                options={["Ya", "Tidak"]}
              />
            </Question>

            <Question
              number={4}
              text="Apakah Anda pernah mengalami cedera ACL pada salah satu lutut?"
            >
              <RadioGroup name="cedera-acl" options={["Ya", "Tidak"]} />
            </Question>

            <Question
              number={5}
              text="Jika ya, apakah saat ini lutut tersebut masih sering nyeri, bengkak, terasa tidak stabil, atau membatasi gerakan?"
            >
              <ConditionalCheckboxQuestion
                radioName="gejala-lutut-acl"
                checkboxName="gejala-yang-dirasakan"
                helperText="Gejala yang dirasakan"
                options={[
                  "Nyeri",
                  "Bengkak",
                  "Tidak stabil",
                  "Membatasi gerakan",
                  "Lainnya",
                ]}
              />
            </Question>

            <Question
              number={6}
              text="Apakah Anda menggunakan brace/alat saat beraktivitas olahraga?"
            >
              <ConditionalCheckboxQuestion
                radioName="menggunakan-brace"
                checkboxName="jenis-brace"
                helperText="Jenis alat yang digunakan"
                options={[
                  "Kacamata biasa",
                  "Sports eyewear",
                  "Brace lutut",
                  "Ankle support",
                  "Lainnya",
                ]}
              />
            </Question>
          </SectionCard>

          <SectionCard
            title="Bagian C — Kondisi Fisik Saat Ini"
            subtitle="Kondisi fisik saat ini sebelum bertanding."
          >
            <Question text="Apakah saat ini Anda merasakan nyeri pada bagian tubuh tertentu saat bergerak atau berolahraga?">
              <PainLevelQuestion />
            </Question>

            <Question text="Apakah Anda mengalami keterbatasan gerak pada bagian tubuh tertentu?">
              <ConditionalCheckboxQuestion
                radioName="keterbatasan-gerak"
                checkboxName="bagian-keterbatasan-gerak"
                helperText="Bagian tubuh yang terasa terbatas"
                options={[
                  "Leher",
                  "Pergelangan kaki",
                  "Paha",
                  "Punggung",
                  "Bahu",
                  "Siku",
                  "Pergelangan tangan",
                  "Lainnya",
                ]}
              />
            </Question>

            <Question text="Apakah Anda sedang dalam masa pemulihan dari cedera, terapi, atau tindakan medis tertentu?">
              <ConditionalCheckboxQuestion
                radioName="masa-pemulihan"
                checkboxName="jenis-pemulihan"
                helperText="Pilih kondisi pemulihan"
                options={[
                  "Terapi cedera",
                  "Pemulihan pasca operasi",
                  "Konsumsi obat tertentu",
                  "Lainnya",
                ]}
              />
            </Question>
          </SectionCard>

          <SectionCard
            title="Bagian D — Aktivitas Umum"
            subtitle="Jawablah sesuai kondisi Anda dalam 7 hari terakhir."
          >
            <Question
              number={1}
              text="Dalam 7 hari terakhir, apakah Anda merasa kelelahan berlebihan atau kurang bugar?"
            >
              <RadioGroup
                name="kelelahan-berlebihan"
                options={["Ya", "Tidak", "Tidak yakin"]}
              />
            </Question>

            <Question
              number={2}
              text="Dalam 7 hari terakhir, apakah kualitas tidur Anda kurang baik atau tidak cukup?"
            >
              <RadioGroup
                name="kualitas-tidur"
                options={["Ya", "Tidak", "Tidak yakin"]}
              />
            </Question>

            <Question
              number={3}
              text="Dalam 7 hari terakhir, apakah Anda mengalami peningkatan aktivitas fisik yang cukup drastis dibanding biasanya?"
            >
              <RadioGroup
                name="peningkatan-aktivitas-fisik"
                options={["Ya", "Tidak", "Tidak yakin"]}
              />
            </Question>

            <Question
              number={4}
              text="Dalam 7 hari terakhir, apakah Anda merasa tubuh belum siap untuk mengikuti pertandingan?"
            >
              <RadioGroup
                name="belum-siap-bertanding"
                options={["Ya", "Tidak", "Tidak yakin"]}
              />
            </Question>

            <Question
              number={5}
              text="Menurut kondisi, seberapa besar risiko Anda mengalami masalah fisik saat mengikuti lomba ini?"
            >
              <div className="flex flex-wrap gap-3">
                {["Rendah", "Sedang", "Tinggi"].map((item) => (
                  <label
                    key={item}
                    className="cursor-pointer rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 has-[:checked]:border-[#B41F2A] has-[:checked]:bg-[#B41F2A] has-[:checked]:text-white"
                  >
                    <input
                      type="radio"
                      name="tingkat-risiko"
                      value={item}
                      className="hidden"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </Question>
          </SectionCard>

          <SectionCard title="Bagian E — Pernyataan & Persetujuan">
            <div className="space-y-4">
              {[
                "Saya menyatakan bahwa seluruh data yang saya isi adalah benar, jujur, dan sesuai dengan kondisi fisik saya saat ini.",
                "Saya memahami bahwa data ini digunakan untuk kebutuhan monitoring kesehatan dalam kegiatan Telkom University Cup.",
                "Saya memahami bahwa data ini digunakan untuk keputusan terkait risiko dan dapat ditindaklanjuti oleh pihak terkait sesuai kegunaannya.",
              ].map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-gray-700"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[#B41F2A]"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </SectionCard>

          <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
            <p className="text-xs text-gray-500">
              <span className="mr-1 text-green-600">●</span>
              Data akan dikirim setelah formulir disubmit
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="rounded-md border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Kosongkan Formulir
              </button>

              <button
                type="submit"
                className="rounded-md bg-[#B41F2A] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#981A24]"
              >
                Kirim Formulir Sekarang →
              </button>
            </div>
          </div>
        </form>
      </div>

      <AnnouncementModal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        onPrimaryClick={() => router.push("/self-assessment/hasil")}
        primaryButtonText="Lanjut ke Hasil"
        secondaryButtonText="Saya Mengerti"
      />
    </main>
  );
}