"use client";

import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Trophy,
  Camera,
  UserCircle,
  ClipboardList,
} from "lucide-react";
import DashboardShell, { type MenuItem } from "@/components/layout/DashboardShell";

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/pic_kontingen" },
  { name: "Anggota Kontingen", icon: Users, href: "/dashboard/pic_kontingen/anggota" },
  { name: "Registrasi Tim", icon: FileText, href: "/dashboard/pic_kontingen/registrasi" },
  { name: "Jadwal & Pertandingan", icon: Trophy, href: "/dashboard/pic_kontingen/jadwal" },
  { name: "Galeri Saya", icon: Camera, href: "/dashboard/pic_kontingen/galeri" },
  { name: "Self Assessment", icon: ClipboardList, href: "/self-assessment" },
  { name: "Profil Saya", icon: UserCircle, href: "/dashboard/pic_kontingen/profil-saya" },
  { name: "Profil Kontingen", icon: Building2, href: "/dashboard/pic_kontingen/profil-kontingen" },
];

export default function PICKontingenDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      menuItems={menuItems}
      roleLabel="PIC Kontingen"
      defaultName="PIC KONTINGEN"
    >
      {children}
    </DashboardShell>
  );
}
