export function buildBracketQueryParams(
  sportId?: number,
  categoryId?: number | null
): string {
  const params = new URLSearchParams();
  if (sportId) params.set("sport", sportId.toString());
  if (categoryId) params.set("category", categoryId.toString());
  return `?${params.toString()}`;
}
