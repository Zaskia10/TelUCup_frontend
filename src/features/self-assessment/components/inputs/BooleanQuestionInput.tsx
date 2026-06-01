import { QuestionDefinition } from "../../types/selfAssessment.types";

interface BooleanQuestionInputProps {
  question: QuestionDefinition;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  isRequired: boolean;
}

export const BooleanQuestionInput = ({ question, value, onChange, isRequired }: BooleanQuestionInputProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {[
        { label: "Ya", value: true },
        { label: "Tidak", value: false },
      ].map((opt) => (
        <label
          key={opt.label}
          className="flex cursor-pointer items-center gap-3 text-sm text-gray-800 bg-gray-50 hover:bg-red-50/50 px-5 py-3 rounded-lg border border-gray-200 transition-all has-[:checked]:border-[#B41F2A] has-[:checked]:bg-red-50 has-[:checked]:font-medium min-w-[120px]"
        >
          <input
            type="radio"
            name={question.code}
            required={isRequired}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="h-4 w-4 accent-[#B41F2A]"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
};
