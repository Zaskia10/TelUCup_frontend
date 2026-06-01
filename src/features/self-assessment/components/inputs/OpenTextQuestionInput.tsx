import { QuestionDefinition } from "../../types/selfAssessment.types";

interface OpenTextQuestionInputProps {
  question: QuestionDefinition;
  value: string | undefined;
  onChange: (value: string) => void;
  isRequired: boolean;
}

export const OpenTextQuestionInput = ({ question, value, onChange, isRequired }: OpenTextQuestionInputProps) => {
  return (
    <textarea
      name={question.code}
      required={isRequired}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#B41F2A] focus:ring-1 focus:ring-[#B41F2A] resize-y"
      placeholder="Tulis jawaban Anda di sini secara singkat..."
      rows={2}
    />
  );
};
