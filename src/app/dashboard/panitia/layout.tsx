"use client";

import {
  LayoutDashboard,
  FileText,
  Trophy,
  Stethoscope,
  Camera,
  Users,
  Medal,
  ShieldCheck,
} from "lucide-react";
import DashboardShell, { type MenuItem } from "@/components/layout/DashboardShell";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/panitia" },
  { name: "Verifikasi Pendaftaran Tim", icon: FileText, href: "/dashboard/panitia/verifikasi-tim" },
  { name: "Bagan, Pertandingan & Verifikasi Lapangan", icon: Trophy, href: "/dashboard/panitia/kelola-bagan" },
  { name: "Tinjauan Medis (Self-Assessment)", icon: Stethoscope, href: "/dashboard/panitia/medis" },
  { name: "Poster Sportifitas", icon: ShieldCheck, href: "/dashboard/panitia/poster-sportifitas" },
  { name: "Kelola Galeri Event", icon: Camera, href: "/dashboard/panitia/galeri" },
  { name: "Kelola Kontingen & Pengguna", icon: Users, href: "/dashboard/panitia/kontingen" },
  { name: "Pengaturan Cabang Olahraga", icon: Medal, href: "/dashboard/panitia/sports" },
];

export default function PanitiaDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== "panitia") {
        router.push("/login"); // or redirect to their own dashboard
      }
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  return (
    <DashboardShell
      menuItems={menuItems}
      roleLabel="Super Admin"
      defaultName="Admin"
    >
      {children}
    </DashboardShell>
  );
}
