import { QuestionDefinition, AssessmentAnswerValue } from "../types/selfAssessment.types";
import { BooleanQuestionInput } from "./inputs/BooleanQuestionInput";
import { SingleChoiceQuestionInput } from "./inputs/SingleChoiceQuestionInput";
import { MultiChoiceQuestionInput } from "./inputs/MultiChoiceQuestionInput";
import { NumberQuestionInput } from "./inputs/NumberQuestionInput";
import { OpenTextQuestionInput } from "./inputs/OpenTextQuestionInput";
import { ScaleQuestionInput } from "./inputs/ScaleQuestionInput";

interface QuestionInputProps {
  question: QuestionDefinition;
  value: AssessmentAnswerValue;
  onChange: (value: AssessmentAnswerValue) => void;
  onMultiChoiceChange: (optionValue: string, checked: boolean) => void;
  isRequired: boolean;
}

export const QuestionInput = ({ question, value, onChange, onMultiChoiceChange, isRequired }: QuestionInputProps) => {
  switch (question.type) {
    case "boolean":
      return (
        <BooleanQuestionInput
          question={question}
          value={value as boolean | undefined}
          onChange={onChange}
          isRequired={isRequired}
        />
      );
    case "single_choice":
      return (
        <SingleChoiceQuestionInput
          question={question}
          value={value as string | undefined}
          onChange={onChange}
          isRequired={isRequired}
        />
      );
    case "multi_choice":
      return (
        <MultiChoiceQuestionInput
          question={question}
          value={value as string[] | undefined}
          onChange={onMultiChoiceChange}
        />
      );
    case "number":
      return (
        <NumberQuestionInput
          question={question}
          value={value as number | string | undefined}
          onChange={onChange}
          isRequired={isRequired}
        />
      );
    case "open_text":
      return (
        <OpenTextQuestionInput
          question={question}
          value={value as string | undefined}
          onChange={onChange}
          isRequired={isRequired}
        />
      );
    case "scale":
      return (
        <ScaleQuestionInput
          question={question}
          value={value as number | undefined}
          onChange={onChange}
          isRequired={isRequired}
        />
      );
    default:
      return null;
  }
};
