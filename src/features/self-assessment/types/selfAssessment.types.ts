export type QuestionType =
  | "number"
  | "single_choice"
  | "boolean"
  | "open_text"
  | "scale"
  | "multi_choice";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface QuestionDefinition {
  code: string;
  type: QuestionType;
  text: string;
  min?: number;
  max?: number;
  required?: boolean;
  options?: QuestionOption[];
  notes?: string;
}

export interface QuestionnaireSection {
  domain: string;
  title: string;
  description: string;
  questions: QuestionDefinition[];
}

export interface QuestionnaireData {
  version: string;
  disclaimer: string;
  sections: QuestionnaireSection[];
  estimated_duration_minutes: number;
}

export type AssessmentAnswerValue = string | number | boolean | string[] | undefined;

export type AssessmentAnswers = Record<string, AssessmentAnswerValue>;

export interface SubmitAssessmentPayload {
  player_id: number | null;
  // Endpoint still expects string | number | boolean mostly, but we support string[] for multi_choice
  // We'll normalize it before submit if needed or backend supports array. 
  // We use `any` here just to keep payload definition simple if backend needs it, 
  // but strictly we'll type it correctly.
  answers: Record<string, string | number | boolean | string[]>;
}

export interface LatestAssessmentResponse {
  id: number;
  valid_until?: string | null;
  // Other fields...
}
