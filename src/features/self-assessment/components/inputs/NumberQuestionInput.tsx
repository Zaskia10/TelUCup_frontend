import { QuestionDefinition } from "../../types/selfAssessment.types";

interface NumberQuestionInputProps {
  question: QuestionDefinition;
  value: number | string | undefined;
  onChange: (value: number | string) => void;
  isRequired: boolean;
}

export const NumberQuestionInput = ({ question, value, onChange, isRequired }: NumberQuestionInputProps) => {
  return (
    <input
      type="number"
      name={question.code}
      min={question.min}
      max={question.max}
      required={isRequired}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
      className="w-full max-w-[200px] rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#B41F2A] focus:ring-1 focus:ring-[#B41F2A]"
      placeholder={`Misal: ${question.min || 0}`}
    />
  );
};
