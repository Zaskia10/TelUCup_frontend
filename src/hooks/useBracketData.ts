import { useState, useEffect, useCallback } from "react";
import { getSports, getBracket } from "@/services/bracketService";
import type { BracketData, Sport, SportCategory } from "@/types/bracket";
import { normalizeBracketData } from "@/utils/bracketUtils";

export function useBracketData() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SportCategory | null>(null);
  const [bracketData, setBracketData] = useState<BracketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    getSports()
      .then(res => {
        if (isMounted) {
          setSports(res.data);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Gagal memuat daftar olahraga.");
        }
      });
      
    return () => { isMounted = false; };
  }, []);

  const loadBracket = useCallback(async () => {
    if (!selectedSport) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await getBracket(selectedSport.id, selectedCategory?.id);
      const bracket = res.data;
      
      const normalizedData = normalizeBracketData(bracket);
      setBracketData(normalizedData);
    } catch (err: unknown) {
      setBracketData(null);
      setError(err instanceof Error ? err.message : "Gagal memuat data bagan.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedSport, selectedCategory]);

  return {
    sports,
    selectedSport,
    setSelectedSport,
    selectedCategory,
    setSelectedCategory,
    bracketData,
    isLoading,
    error,
    loadBracket
  };
}
