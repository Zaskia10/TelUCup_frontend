import { HeartPulse, Bone, Zap, Brain } from "lucide-react";

export const RISK_CONFIG = {
  high: {
    label: "Risiko Tinggi",
    description: "Pemain tidak direkomendasikan untuk mengikuti aktivitas intensitas tinggi.",
    badge: "bg-[#B41F2A] text-white",
    border: "border-[#B41F2A]",
    bg: "bg-red-50",
    text: "text-[#B41F2A]",
    bar: "bg-[#B41F2A]",
    headerBar: "bg-[#B41F2A]",
  },
  medium: {
    label: "Risiko Sedang",
    description: "Pemain perlu pengawasan tambahan sebelum bertanding.",
    badge: "bg-amber-500 text-white",
    border: "border-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
    bar: "bg-amber-500",
    headerBar: "bg-amber-500",
  },
  low: {
    label: "Risiko Rendah",
    description: "Pemain dalam kondisi baik dan siap untuk bertanding.",
    badge: "bg-green-600 text-white",
    border: "border-green-600",
    bg: "bg-green-50",
    text: "text-green-700",
    bar: "bg-green-600",
    headerBar: "bg-green-600",
  },
} as const;

export const DOMAIN_CONFIG = [
  { key: "cardiovascular" as const, label: "Kardiovaskular", weight: "35%", Icon: HeartPulse },
  { key: "musculoskeletal" as const, label: "Muskuloskeletal", weight: "30%", Icon: Bone },
  { key: "acute_readiness" as const, label: "Kesiapan Akut", weight: "20%", Icon: Zap },
  { key: "psychosocial" as const, label: "Psikososial", weight: "15%", Icon: Brain },
];
