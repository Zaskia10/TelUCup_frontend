import { QuestionDefinition } from "../../types/selfAssessment.types";

interface ScaleQuestionInputProps {
  question: QuestionDefinition;
  value: number | undefined;
  onChange: (value: number) => void;
  isRequired: boolean;
}

export const ScaleQuestionInput = ({ question, value, onChange, isRequired }: ScaleQuestionInputProps) => {
  const min = question.min || 0;
  const max = question.max || 10;
  const displayValue = value !== undefined ? value : min;

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200 mt-2 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-gray-600">Nilai Pilihan Anda:</span>
        <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center">
          <span className="text-xl text-[#B41F2A] font-extrabold">{value !== undefined ? value : "-"}</span>
        </div>
      </div>

      <input
        type="range"
        name={question.code}
        min={min}
        max={max}
        required={isRequired}
        value={displayValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#B41F2A]"
      />

      <div className="mt-3 flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400">
        <span>{min} (Rendah)</span>
        <span>{max} (Tinggi)</span>
      </div>
    </div>
  );
};
