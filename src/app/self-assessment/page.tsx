"use client";

import { SelfAssessmentForm } from "@/features/self-assessment/components/SelfAssessmentForm";

export default function SelfAssessmentPage() {
  return (
    <main className="min-h-screen bg-[#f4f7f6]">
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8 lg:py-10">
        <SelfAssessmentForm />
      </div>
    </main>
  );
}