"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMyLatestAssessment, getAssessmentById } from "@/services/selfAssessmentService";
import { AssessmentResult } from "@/features/self-assessment-result/types/assessmentResult.types";
import { RISK_CONFIG } from "@/features/self-assessment-result/constants/assessmentResult.constants";
import { EmptyAssessmentState } from "@/features/self-assessment-result/components/EmptyAssessmentState";
import { AssessmentResultLoadingState } from "@/features/self-assessment-result/components/AssessmentResultLoadingState";
import { AssessmentResultErrorState } from "@/features/self-assessment-result/components/AssessmentResultErrorState";
import { AssessmentResultHeader } from "@/features/self-assessment-result/components/AssessmentResultHeader";
import { RiskSummaryCard } from "@/features/self-assessment-result/components/RiskSummaryCard";
import { DomainScoreCard } from "@/features/self-assessment-result/components/DomainScoreCard";
import { FlagSection } from "@/features/self-assessment-result/components/FlagSection";
import { RecommendationCard } from "@/features/self-assessment-result/components/RecommendationCard";
import { PlayerInfoCard } from "@/features/self-assessment-result/components/PlayerInfoCard";
import { AssessmentStatusCard } from "@/features/self-assessment-result/components/AssessmentStatusCard";
import { MedicalReviewCard } from "@/features/self-assessment-result/components/MedicalReviewCard";

export default function HasilAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<AssessmentResult | null>(null);
  const [hasNoAssessment, setHasNoAssessment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(window.location.search);
        const idParam = params.get("id");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any;
        if (idParam && !isNaN(Number(idParam))) {
          result = await getAssessmentById(Number(idParam));
        } else {
          result = await getMyLatestAssessment();
        }

        if (result.data === null || result.data === undefined) {
          setHasNoAssessment(true);
        } else {
          // Sometimes it's wrapped in data.data
          const resultData = result.data.data ? result.data.data : result.data;
          setData(resultData);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Gagal memuat hasil assessment";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <AssessmentResultLoadingState />;
  if (error) return <AssessmentResultErrorState error={error} />;
  if (hasNoAssessment) return <EmptyAssessmentState onStart={() => router.push("/self-assessment")} />;
  if (!data) return null;

  const risk = RISK_CONFIG[data.risk_label] ?? RISK_CONFIG.low;
  const redFlags = data.red_flags ?? [];
  const yellowFlags = data.yellow_flags ?? [];

  return (
    <main className="min-h-screen bg-[#f4f7f6] font-sans">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
        <AssessmentResultHeader
          playerName={data.player_name}
          contingent={data.contingent}
          sportBranch={data.sport_branch}
          createdAt={data.created_at}
          riskConfig={risk}
        />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <RiskSummaryCard
              riskConfig={risk}
              totalScore={data.total_score}
              requiresClearance={data.requires_clearance}
            />

            <DomainScoreCard domainScores={data.domain_scores} />

            <FlagSection redFlags={redFlags} yellowFlags={yellowFlags} />

            <RecommendationCard recommendation={data.recommendation} />
          </div>

          <div className="space-y-6">
            <PlayerInfoCard
              playerName={data.player_name}
              contingent={data.contingent}
              sportBranch={data.sport_branch}
              snapshot={data.snapshot}
              assessmentId={data.id}
            />

            <AssessmentStatusCard
              isValid={data.is_valid}
              validUntil={data.valid_until}
              questionnaireVersion={data.questionnaire_version}
              algorithmVersion={data.algorithm_version}
            />

            <MedicalReviewCard medicalReview={data.medical_review} />
          </div>
        </div>
      </div>
    </main>
  );
}
