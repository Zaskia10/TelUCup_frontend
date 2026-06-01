import { QuestionDefinition } from "../../types/selfAssessment.types";

interface SingleChoiceQuestionInputProps {
  question: QuestionDefinition;
  value: string | undefined;
  onChange: (value: string) => void;
  isRequired: boolean;
}

export const SingleChoiceQuestionInput = ({ question, value, onChange, isRequired }: SingleChoiceQuestionInputProps) => {
  if (!question.options) return null;

  return (
    <div className="flex flex-col gap-2.5">
      {question.options.map((opt) => (
        <label
          key={opt.value}
          className="flex cursor-pointer items-center gap-3 text-sm text-gray-700 p-3.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all has-[:checked]:border-[#B41F2A] has-[:checked]:bg-red-50 has-[:checked]:font-medium"
        >
          <input
            type="radio"
            name={question.code}
            value={opt.value}
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
