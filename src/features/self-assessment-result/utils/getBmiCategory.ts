export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Kurus";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Gemuk";
  return "Obesitas";
}
