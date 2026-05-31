"use client";

import { UserCircle, ClipboardList, Camera } from "lucide-react";
import DashboardShell, { type MenuItem } from "@/components/layout/DashboardShell";

const menuItems: MenuItem[] = [
  { name: "Profil Saya", icon: UserCircle, href: "/dashboard/player/profil-saya" },
  { name: "Self Assessment", icon: ClipboardList, href: "/self-assessment" },
  { name: "Galeri Saya", icon: Camera, href: "/dashboard/player/galeri" },
];

export default function PlayerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      menuItems={menuItems}
      roleLabel="Player"
      defaultName="PLAYER"
    >
      {children}
    </DashboardShell>
  );
}
