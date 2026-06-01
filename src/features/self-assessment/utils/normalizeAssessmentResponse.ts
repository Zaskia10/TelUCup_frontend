export const normalizeAssessmentResponse = <T>(response: unknown): T | null => {
  if (!response) return null;
  
  const res = response as Record<string, unknown>;
  
  // TelUCup API format: { status, data: { id, valid_until, ... } }
  // or { data: { id, ... } }
  // or just the object itself.
  if (res.data && (res.data as Record<string, unknown>).data) {
    return (res.data as Record<string, unknown>).data as T;
  }
  if (res.data) {
    return res.data as T;
  }
  return res as T;
};
