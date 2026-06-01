export interface Flag {
  code: string;
  text: string;
  reason: string;
}

export interface AssessmentResult {
  id: number;
  player_id: number;
  player_name: string | null;
  sport_branch: string | null;
  contingent: string | null;
  snapshot: { age: number; bmi: number; is_kacamata: boolean };
  risk_label: "low" | "medium" | "high";
  total_score: number;
  confidence_score: number;
  requires_clearance: boolean;
  domain_scores: {
    cardiovascular: number;
    musculoskeletal: number;
    acute_readiness: number;
    psychosocial: number;
  };
  red_flags: Flag[];
  yellow_flags: Flag[];
  recommendation: string | null;
  questionnaire_version: string;
  algorithm_version: string;
  valid_until: string | null;
  is_valid: boolean;
  medical_review: {
    medical_notes: string | null;
    is_allowed_to_play: boolean | null;
    pic_confirmed: boolean;
    reviewed_at: string | null;
  };
  created_at: string;
}
