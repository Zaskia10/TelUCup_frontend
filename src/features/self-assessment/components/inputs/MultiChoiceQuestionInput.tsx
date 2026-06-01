import { QuestionDefinition } from "../../types/selfAssessment.types";

interface MultiChoiceQuestionInputProps {
  question: QuestionDefinition;
  value: string[] | undefined;
  onChange: (optionValue: string, checked: boolean) => void;
}

export const MultiChoiceQuestionInput = ({ question, value, onChange }: MultiChoiceQuestionInputProps) => {
  if (!question.options) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {question.options.map((opt) => {
        const isChecked = Array.isArray(value) && value.includes(opt.value);
        return (
          <label
            key={opt.value}
            className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer p-3.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all has-[:checked]:border-[#B41F2A] has-[:checked]:bg-red-50"
          >
            <input
              type="checkbox"
              name={question.code}
              value={opt.value}
              checked={isChecked}
              onChange={(e) => onChange(opt.value, e.target.checked)}
              className="h-4 w-4 mt-0.5 accent-[#B41F2A] rounded"
            />
            <span className={isChecked ? "font-medium" : ""}>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
};
