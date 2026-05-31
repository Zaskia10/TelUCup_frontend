"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyUser } from "@/services/playerProfileService";
import { getMyLatestAssessment } from "@/services/selfAssessmentService";

export default function PlayerDashboardIndex() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const user = await getMyUser();
        const player = user.player;

        const needsOnboarding =
          !player?.photo_path ||
          !player?.employee_status ||
          !player?.work_location;

        if (needsOnboarding) {
          router.replace("/onboarding");
          return;
        }

        // Check self-assessment
        try {
          const saRes = await getMyLatestAssessment() as { data?: { is_valid?: boolean } | null };
          if (!saRes?.data || !(saRes.data as { is_valid?: boolean })?.is_valid) {
            router.replace("/onboarding");
            return;
          }
        } catch {
          router.replace("/onboarding");
          return;
        }

        // All good — go to profil-saya
        router.replace("/dashboard/player/profil-saya");
      } catch {
        // If user fetch fails, redirect to profil-saya anyway (layout handles auth)
        router.replace("/dashboard/player/profil-saya");
      } finally {
        setChecking(false);
      }
    };

    checkOnboarding();
  }, [router]);

  if (!checking) return null;

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b71c1c]" />
    </div>
  );
}
