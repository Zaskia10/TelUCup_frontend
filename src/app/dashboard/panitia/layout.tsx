"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Trophy, 
  Stethoscope, 
  Camera, 
  Users, 
  Menu,
  MoreVertical,
  User,
  LogOut
} from "lucide-react";

export default function PanitiaDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/panitia" },
    { name: "Verifikasi Pendaftaran Tim", icon: FileText, href: "/dashboard/panitia/verifikasi-tim" },
    { name: "Bagan, Pertandingan & Verifikasi Lapangan", icon: Trophy, href: "/dashboard/panitia/pertandingan" },
    { name: "Tinjauan Medis (Self-Assessment)", icon: Stethoscope, href: "/dashboard/panitia/medis" },
    { name: "Kelola Galeri Event", icon: Camera, href: "/dashboard/panitia/galeri" },
    { name: "Kelola Kontingen & Pengguna", icon: Users, href: "/dashboard/panitia/kontingen" },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-[#f4f7f6]">
      {/* Top Navbar (Full Width) */}
      <header className="h-[60px] bg-[#a81d22] text-white flex items-center justify-between px-4 lg:px-6 shadow-md shrink-0 z-50 relative">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-1 rounded hover:bg-white/10 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          {/* 3 dots & Brand */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="p-1 hover:bg-white/10 rounded transition-colors text-white/90">
              <MoreVertical size={20} />
            </button>
            <span className="font-bold text-[16px] tracking-wide">TEL-U CUP</span>
          </div>
          {/* Mobile Brand */}
          <span className="font-bold text-[16px] tracking-wide lg:hidden">TEL-U CUP</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[13px] font-semibold tracking-wider">ARIEF KURNIAWAN</div>
            <div className="text-[11px] text-red-200">Super Admin</div>
          </div>
          <div className="w-8 h-8 rounded-[4px] bg-[#89a2cc] flex items-center justify-center overflow-hidden border border-white/20">
            {/* Fallback avatar icon matching the square bluish one */}
            <User size={20} className="text-white" />
          </div>
        </div>
      </header>

      {/* Bottom Section: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay (Mobile) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`absolute lg:static inset-y-0 left-0 z-40 w-[260px] bg-white shadow-[2px_0_15px_rgba(0,0,0,0.03)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-5">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive 
                          ? "bg-red-50 text-[#b71c1c] font-medium" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon size={20} className={isActive ? "text-[#b71c1c]" : "text-gray-500"} />
                      <span className="text-[14px] leading-tight">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg transition-colors text-red-600 hover:bg-red-50 font-medium"
            >
              <LogOut size={20} />
              <span className="text-[14px] leading-tight">Keluar</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
