import { useState, useCallback, useEffect } from "react";
import { sportsmanshipPosterService } from "@/services/sportsmanshipPosterService";
import type {
  SportsmanshipPoster,
  SportsmanshipPosterFormPayload,
  SportsmanshipPosterReorderItem,
} from "@/types/sportsmanshipPoster";

export function useSportsmanshipPosters() {
  const [posters, setPosters] = useState<SportsmanshipPoster[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter !== "all") {
        params.is_active = statusFilter === "active" ? "1" : "0";
      }
      
      const res = await sportsmanshipPosterService.getPosters(params);
      
      // Data format handles { status, message, data } implicitly by apiClient / getPosters
      const data = Array.isArray(res.data) ? res.data : [];
      
      // Sort in frontend just to be sure (sort_order ASC, created_at DESC)
      const sorted = [...data].sort((a, b) => {
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setPosters(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat poster");
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    // Debounce fetching if there's a search term
    const timer = setTimeout(() => {
      fetchPosters();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPosters]);

  const createPoster = async (payload: SportsmanshipPosterFormPayload) => {
    setIsSaving(true);
    try {
      await sportsmanshipPosterService.createPoster(payload);
      await fetchPosters();
      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Gagal menyimpan poster");
    } finally {
      setIsSaving(false);
    }
  };

  const updatePoster = async (id: number, payload: Partial<SportsmanshipPosterFormPayload>) => {
    setIsSaving(true);
    try {
      await sportsmanshipPosterService.updatePoster(id, payload);
      await fetchPosters();
      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Gagal memperbarui poster");
    } finally {
      setIsSaving(false);
    }
  };

  const deletePoster = async (id: number) => {
    setIsSaving(true);
    try {
      await sportsmanshipPosterService.deletePoster(id);
      await fetchPosters();
      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Gagal menghapus poster");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePoster = async (id: number, isActive: boolean) => {
    // Optimistic UI
    setPosters((prev) => 
      prev.map((p) => (p.id === id ? { ...p, is_active: isActive } : p))
    );
    try {
      await sportsmanshipPosterService.togglePoster(id, isActive);
    } catch (err) {
      // Revert on error
      setPosters((prev) => 
        prev.map((p) => (p.id === id ? { ...p, is_active: !isActive } : p))
      );
      throw new Error(err instanceof Error ? err.message : "Gagal mengubah status poster");
    }
  };

  const reorderPosters = async (items: SportsmanshipPosterReorderItem[]) => {
    setIsSaving(true);
    try {
      await sportsmanshipPosterService.reorderPosters(items);
      await fetchPosters();
      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Gagal mengubah urutan poster");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    posters,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isLoading,
    isSaving,
    error,
    refresh: fetchPosters,
    createPoster,
    updatePoster,
    deletePoster,
    togglePoster,
    reorderPosters,
  };
}
