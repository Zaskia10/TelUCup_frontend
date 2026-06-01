export function getDomainBarColor(score: number): string {
  if (score >= 51) return "bg-[#B41F2A]";
  if (score >= 26) return "bg-amber-500";
  return "bg-green-600";
}
