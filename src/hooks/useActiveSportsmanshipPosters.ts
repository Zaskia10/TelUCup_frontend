import { useState, useCallback } from "react";
import { sportsmanshipPosterService } from "@/services/sportsmanshipPosterService";
import type { ActiveSportsmanshipPoster } from "@/types/sportsmanshipPoster";

export function useActiveSportsmanshipPosters() {
  const [posters, setPosters] = useState<ActiveSportsmanshipPoster[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchActivePosters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sportsmanshipPosterService.getActivePosters();
      const data = Array.isArray(res.data) ? res.data : [];
      setPosters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat poster");
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  }, []);

  return {
    posters,
    isLoading,
    error,
    hasFetched,
    fetchActivePosters,
  };
}
